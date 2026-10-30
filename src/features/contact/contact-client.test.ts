import { describe, expect, it, vi } from "vitest";
import { buildMailto, emailJsConfig, sendContactMessage, validateContact, type ContactMessage } from "./contact-client";

const send = vi.fn(async () => ({ status: 200, text: "OK" }));
vi.mock("@emailjs/browser", () => ({ send }));

const message: ContactMessage = {
  name: "Ana Recruiter",
  email: "ana@empresa.com",
  subject: "Vaga SRE",
  message: "Olá Giovanny, temos uma vaga de SRE júnior.",
};

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(message)).toEqual([]);
  });

  it("flags each problem in form order", () => {
    expect(validateContact({ name: " ", email: "ana@", subject: "", message: "oi" })).toEqual(["name", "email", "message"]);
  });
});

describe("emailJsConfig", () => {
  it("needs all three variables", () => {
    expect(emailJsConfig({ VITE_EMAILJS_SERVICE_ID: "s", VITE_EMAILJS_TEMPLATE_ID: "t" })).toBeNull();
    expect(
      emailJsConfig({ VITE_EMAILJS_SERVICE_ID: "s", VITE_EMAILJS_TEMPLATE_ID: "t", VITE_EMAILJS_PUBLIC_KEY: "k" }),
    ).toEqual({ serviceId: "s", templateId: "t", publicKey: "k" });
  });
});

describe("buildMailto", () => {
  it("encodes subject and body with the sender's details", () => {
    const url = buildMailto(message, "gio@example.com");
    expect(url.startsWith("mailto:gio@example.com?subject=Vaga%20SRE&body=")).toBe(true);
    expect(decodeURIComponent(url.split("body=")[1])).toBe(`${message.message}\n\n— Ana Recruiter <ana@empresa.com>`);
  });
});

describe("sendContactMessage", () => {
  it("opens the email app when EmailJS is not configured", async () => {
    const openUrl = vi.fn();
    await expect(sendContactMessage(message, { config: null, openUrl })).resolves.toBe("mailto");
    expect(openUrl).toHaveBeenCalledWith(expect.stringMatching(/^mailto:giovannylino9@gmail\.com\?subject=Vaga%20SRE/));
  });

  it("sends through EmailJS with throttling when configured", async () => {
    const config = { serviceId: "svc", templateId: "tpl", publicKey: "pub" };
    await expect(sendContactMessage(message, { config })).resolves.toBe("emailjs");
    expect(send).toHaveBeenCalledWith(
      "svc",
      "tpl",
      { from_name: "Ana Recruiter", reply_to: "ana@empresa.com", subject: "Vaga SRE", message: message.message },
      { publicKey: "pub", limitRate: { id: "portfolio-contact", throttle: 20_000 } },
    );
  });
});
