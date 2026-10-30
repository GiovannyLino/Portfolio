import { expect, test, type Page } from "@playwright/test";

type ChatEvent = Record<string, unknown> & { type: string };

const sse = (events: ChatEvent[]) => events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("");

/** Answers /api/chat with a scripted stream instead of the LLM. */
const mockChat = (page: Page, events: ChatEvent[]) =>
  page.route("**/api/chat", (route) =>
    route.fulfill({ status: 200, headers: { "Content-Type": "text/event-stream" }, body: sse(events) }),
  );

const openChat = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open the Gio.AI assistant" }).click();
  const panel = page.getByRole("dialog", { name: /Gio\.AI/ });
  await expect(panel).toBeVisible();
  return panel;
};

test("open → ask → the answer shows a card and moves the page", async ({ page, isMobile }) => {
  await mockChat(page, [
    { type: "tool", name: "getProjectDetails", status: "start" },
    { type: "card", card: { kind: "project", id: "netbox-ansible-pipeline" } },
    { type: "ui", action: { type: "highlightProject", projectId: "netbox-ansible-pipeline" } },
    { type: "tool", name: "getProjectDetails", status: "end" },
    { type: "text", delta: "It's the **NetBox pipeline**: NetBox is the source of truth for Ansible." },
    { type: "suggestions", items: ["Is the code public?", "What else did he automate?"] },
    { type: "done" },
  ]);
  const panel = await openChat(page);

  const input = panel.getByRole("textbox");
  await input.fill("Tell me about the NetBox project");
  await input.press("Enter");

  await expect(panel.getByText("NetBox pipeline", { exact: true })).toBeVisible();
  await expect(panel.getByRole("article", { name: "Network Automation Pipeline with NetBox and Ansible" })).toBeVisible();
  await expect(panel.getByRole("button", { name: "Is the code public?" })).toBeVisible();

  // Phones: the sheet covers the page, so the page moves once it closes.
  if (isMobile) await panel.getByRole("button", { name: "Close the assistant" }).click();
  const card = page.locator("#project-netbox-ansible-pipeline");
  await expect(card).toHaveAttribute("data-gioai-highlight", "card");
  await expect(card).toBeInViewport();
});

test("the guided tour walks the page without calling the API", async ({ page }) => {
  let apiCalls = 0;
  await page.route("**/api/chat", (route) => {
    apiCalls++;
    return route.abort();
  });
  const panel = await openChat(page);

  await panel.getByRole("button", { name: "60-second guided tour" }).click();
  const tour = page.getByRole("dialog", { name: "Guided tour" });
  await expect(tour).toBeVisible();
  await expect(panel).toBeHidden();

  await tour.getByRole("button", { name: "Next" }).click();
  await expect(tour.getByText("2 of 6")).toBeVisible();
  await expect(page.locator("#experience-title")).toBeInViewport();

  await tour.getByRole("button", { name: "Exit tour" }).click();
  await expect(tour).toBeHidden();
  expect(apiCalls).toBe(0);
});

test("when the API is down the visitor still gets an answer from the FAQ", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { code: "upstream_unavailable" } }) }),
  );
  const panel = await openChat(page);

  await panel.getByRole("button", { name: "Which certifications does he have?" }).click();

  await expect(panel.getByText("I'm having trouble thinking right now.")).toBeVisible();
  await expect(panel.getByText(/He holds: Iquall NetOps Automation Specialist/)).toBeVisible();
  await expect(panel.getByRole("button", { name: "Try again" })).toBeVisible();
});
