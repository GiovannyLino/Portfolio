import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Loader2, Mail, Send, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profile } from "@/data/knowledge";
import { onContactPrefill } from "@/features/chat/chat-bus";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { CONTACT_LIMITS, sendContactMessage, validateContact, type ContactField, type ContactMessage } from "./contact-client";

type Status = "idle" | "sending" | "sent" | "mailto" | "failed";

const EMPTY: ContactMessage = { name: "", email: "", subject: "", message: "" };
const HIGHLIGHT_MS = 2600;
const labelClass = "text-sm font-medium text-foreground";
const errorClass = "text-xs text-destructive";

const ContactForm = () => {
  const { t } = useLanguage();
  const copy = t.contact.form;

  const [values, setValues] = useState<ContactMessage>(EMPTY);
  const [invalid, setInvalid] = useState<ContactField[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [prefilled, setPrefilled] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  // Honeypot: hidden from people, filled in by naive bots.
  const [company, setCompany] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const fieldRefs = { name: nameRef, email: emailRef, message: messageRef };
  const valuesRef = useRef(values);
  valuesRef.current = values;

  // The assistant's openContact tool: fill subject/message, keep anything already typed.
  useEffect(
    () =>
      onContactPrefill(({ subject, message }) => {
        const current = valuesRef.current;
        setValues({
          ...current,
          subject: subject.slice(0, CONTACT_LIMITS.subject),
          message: current.message.trim() ? current.message : (message ?? "").slice(0, CONTACT_LIMITS.message),
        });
        setPrefilled(true);
        setHighlighted(true);
        setInvalid([]);
        setStatus("idle");
        // After the page finishes scrolling here, put the cursor where typing is still needed.
        window.setTimeout(() => (current.name.trim() ? messageRef : nameRef).current?.focus({ preventScroll: true }), 700);
      }),
    [],
  );

  useEffect(() => {
    if (!highlighted) return;
    const timer = window.setTimeout(() => setHighlighted(false), HIGHLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [highlighted]);

  const update = (field: keyof ContactMessage) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setInvalid((current) => current.filter((name) => name !== field));
    if (status !== "sending") setStatus("idle");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const message: ContactMessage = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim() || copy.defaultSubject,
      message: values.message.trim(),
    };
    const problems = validateContact(message);
    setInvalid(problems);
    if (problems.length > 0) {
      fieldRefs[problems[0]].current?.focus();
      return;
    }
    if (company) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const via = await sendContactMessage(message);
      setStatus(via === "emailjs" ? "sent" : "mailto");
      if (via === "emailjs") {
        setValues(EMPTY);
        setPrefilled(false);
      }
    } catch {
      setStatus("failed");
    }
  };

  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    "aria-invalid": invalid.includes(field) || undefined,
    "aria-describedby": invalid.includes(field) ? `contact-${field}-error` : undefined,
    className: cn(invalid.includes(field) && "border-destructive focus-visible:ring-destructive"),
  });

  const emailLink = (
    <a href={`mailto:${profile.links.email}`} className="font-mono text-primary underline-offset-4 hover:underline">
      {profile.links.email}
    </a>
  );

  return (
    <form
      id="contact-form"
      noValidate
      onSubmit={submit}
      data-gioai-highlight={highlighted ? "form" : undefined}
      className="glass-card rounded-xl border border-border/50 p-6 md:p-8 space-y-5 text-left"
    >
      {prefilled && (
        <p className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-sm text-primary">
          <Sparkles size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {copy.prefilled}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className={labelClass}>
            {copy.name}
          </label>
          <Input
            ref={nameRef}
            {...fieldProps("name")}
            name="name"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            placeholder={copy.namePlaceholder}
            value={values.name}
            onChange={update("name")}
          />
          {invalid.includes("name") && (
            <p id="contact-name-error" className={errorClass}>
              {copy.errors.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className={labelClass}>
            {copy.email}
          </label>
          <Input
            ref={emailRef}
            {...fieldProps("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email}
            placeholder={copy.emailPlaceholder}
            value={values.email}
            onChange={update("email")}
          />
          {invalid.includes("email") && (
            <p id="contact-email-error" className={errorClass}>
              {copy.errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className={labelClass}>
          {copy.subject}
        </label>
        <Input
          id="contact-subject"
          name="subject"
          maxLength={CONTACT_LIMITS.subject}
          placeholder={copy.subjectPlaceholder}
          value={values.subject}
          onChange={update("subject")}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className={labelClass}>
          {copy.message}
        </label>
        <Textarea
          ref={messageRef}
          {...fieldProps("message")}
          name="message"
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          placeholder={copy.messagePlaceholder}
          value={values.message}
          onChange={update("message")}
        />
        {invalid.includes("message") && (
          <p id="contact-message-error" className={errorClass}>
            {copy.errors.message}
          </p>
        )}
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="hero" size="lg" disabled={status === "sending"}>
          {status === "sending" ? (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <Send size={18} aria-hidden="true" />
          )}
          {status === "sending" ? copy.sending : copy.submit}
        </Button>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Mail size={16} aria-hidden="true" />
            {copy.orEmail}
          </span>
          {emailLink}
        </p>
      </div>

      <div aria-live="polite" className="text-sm">
        {status === "sent" && (
          <p className="flex items-center gap-2 text-primary">
            <CheckCircle2 size={16} aria-hidden="true" />
            {copy.sent}
          </p>
        )}
        {status === "mailto" && (
          <p className="text-muted-foreground">
            {copy.mailtoOpened} {emailLink}.
          </p>
        )}
        {status === "failed" && (
          <p className="flex items-center gap-2 text-destructive">
            <TriangleAlert size={16} aria-hidden="true" />
            <span>
              {copy.failed} {emailLink}.
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
