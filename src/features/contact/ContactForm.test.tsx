import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prefillContact } from "@/features/chat/chat-bus";
import { LanguageProvider } from "@/i18n/LanguageContext";
import ContactForm from "./ContactForm";

const sendContactMessage = vi.fn();
vi.mock("./contact-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./contact-client")>()),
  sendContactMessage: (...args: unknown[]) => sendContactMessage(...args),
}));

const renderForm = () =>
  render(
    <LanguageProvider>
      <ContactForm />
    </LanguageProvider>,
  );

const fill = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

beforeEach(() => sendContactMessage.mockReset());

describe("ContactForm", () => {
  it("shows what to fix and focuses the first invalid field", () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/^Name/)).toHaveFocus();
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it("is pre-filled by the assistant without overwriting what the visitor typed", () => {
    renderForm();
    act(() => prefillContact({ subject: "SRE role", message: "From the chat" }));

    expect(screen.getByText(/Gio\.AI filled this in/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Subject/)).toHaveValue("SRE role");
    expect(screen.getByLabelText(/^Message/)).toHaveValue("From the chat");

    fill(/^Message/, "My own words");
    act(() => prefillContact({ subject: "Another subject", message: "Chat again" }));
    expect(screen.getByLabelText(/^Subject/)).toHaveValue("Another subject");
    expect(screen.getByLabelText(/^Message/)).toHaveValue("My own words");
  });

  it("sends a valid message and confirms it", async () => {
    sendContactMessage.mockResolvedValue("emailjs");
    renderForm();
    fill(/^Name/, "Ana");
    fill(/^Email/, "ana@empresa.com");
    fill(/^Message/, "We have an SRE opening.");
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Message sent! Thanks for reaching out.")).toBeInTheDocument();
    expect(sendContactMessage).toHaveBeenCalledWith({
      name: "Ana",
      email: "ana@empresa.com",
      subject: "Contact from the portfolio",
      message: "We have an SRE opening.",
    });
    expect(screen.getByLabelText(/^Name/)).toHaveValue("");
  });

  it("explains the email fallback and failures with the address", async () => {
    sendContactMessage.mockResolvedValueOnce("mailto").mockRejectedValueOnce(new Error("429"));
    renderForm();
    fill(/^Name/, "Ana");
    fill(/^Email/, "ana@empresa.com");
    fill(/^Message/, "We have an SRE opening.");

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText(/Your email app opened/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(screen.getByText(/couldn't be sent/)).toBeInTheDocument());
    expect(screen.getAllByRole("link", { name: "giovannylino9@gmail.com" }).length).toBeGreaterThan(0);
  });

  it("silently drops submissions that fill the honeypot", async () => {
    const { container } = renderForm();
    fill(/^Name/, "Bot");
    fill(/^Email/, "bot@spam.com");
    fill(/^Message/, "Buy cheap followers now");
    fireEvent.change(container.querySelector('input[tabindex="-1"]')!, { target: { value: "ACME" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Message sent! Thanks for reaching out.")).toBeInTheDocument();
    expect(sendContactMessage).not.toHaveBeenCalled();
  });
});
