import { ArrowDown, ArrowUpRight } from "lucide-react";
import ui from "./ui.module.css";

/** A label that rolls over on hover of the link or button around it. */
export const RollText = ({ children }: { children: string }) => (
  <span className={ui.roll}>
    <span className={ui.rollLine}>{children}</span>
    <span className={ui.rollLine} aria-hidden="true">
      {children}
    </span>
  </span>
);

/** Arrow that flies out and back in when its link or button is hovered. */
export const Arrow = ({ direction = "up-right" }: { direction?: "up-right" | "down" }) => {
  const Icon = direction === "down" ? ArrowDown : ArrowUpRight;
  return (
    <span className={ui.arrow} data-direction={direction} aria-hidden="true">
      <Icon strokeWidth={2} />
      <Icon strokeWidth={2} />
    </span>
  );
};
