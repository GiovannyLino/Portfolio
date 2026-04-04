import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container max-w-2xl text-center">
        <p className="font-mono text-primary text-sm mb-4">04. What's Next?</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Get In Touch
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-10">
          I'm currently open to new opportunities and always looking to connect with
          fellow developers. Whether you have a question, a project idea, or just want
          to say hi — my inbox is always open!
        </p>

        <Button variant="hero" size="lg" asChild>
          <a href="mailto:giovannylino9@gmail.com">
            <Mail size={18} />
            Say Hello
          </a>
        </Button>
      </div>
    </section>
  );
};

export default ContactSection;
