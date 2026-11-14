// Animated schematics for the featured projects: line drawings of what each project's
// summary describes, labelled only with technologies from its stack. They are decoration
// (hidden from assistive tech) and animate only while on screen.
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { cssVars } from "@/motion/env";
import { useInView } from "@/motion/hooks";
import styles from "./ProjectArt.module.css";

/** A connection: a line that draws itself, plus the traffic running along it. */
const Link = ({ d, delay = 0 }: { d: string; delay?: number }) => (
  <>
    <path d={d} pathLength={1} className={styles.wire} />
    <path d={d} className={styles.flow} style={cssVars({ "--k": delay })} />
  </>
);

const TOOLS = [
  { y: 30, label: "search", d: "M248 100C274 100 272 44 298 44" },
  { y: 100, label: "project", d: "M248 114H298" },
  { y: 170, label: "navigate", d: "M248 128C274 128 272 184 298 184" },
] as const;

/** A chat message reaches the LLM, which calls tools and streams the answer back. */
const AgentArt = () => (
  <svg viewBox="0 0 400 240">
    <rect x="20" y="92" width="80" height="44" rx="12" className={styles.node} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={46 + i * 14} cy="114" r="4" className={styles.pulse} style={cssVars({ "--k": i })} />
    ))}
    <text x="60" y="158" textAnchor="middle" className={styles.caption}>
      chat
    </text>

    <Link d="M100 114H150" />
    <rect x="152" y="80" width="96" height="68" rx="3" className={styles.hot} />
    <text x="200" y="112" textAnchor="middle" className={styles.label}>
      LLM
    </text>
    <text x="200" y="130" textAnchor="middle" className={styles.caption}>
      Gemini
    </text>

    {TOOLS.map((tool, i) => (
      <g key={tool.label}>
        <Link d={tool.d} delay={i + 1} />
        <rect x="300" y={tool.y} width="82" height="28" rx="3" className={styles.pulse} style={cssVars({ "--k": i + 1 })} />
        <text x="341" y={tool.y + 17.5} textAnchor="middle" className={styles.captionSmall}>
          {tool.label}
        </text>
      </g>
    ))}

    {/* The answer streams back to the chat. */}
    <Link d="M200 148V196H60V136" delay={2} />
    <text x="130" y="214" textAnchor="middle" className={styles.captionSmall}>
      stream · SSE
    </text>
  </svg>
);

/** Job queue → provisioning → a small lab topology. */
const PocArt = () => (
  <svg viewBox="0 0 400 240">
    {[0, 1, 2].map((i) => (
      <rect key={i} x="34" y={82 + i * 26} width="58" height="16" rx="2" className={styles.pulse} style={cssVars({ "--k": i })} />
    ))}
    <text x="63" y="184" textAnchor="middle" className={styles.caption}>
      BullMQ
    </text>

    <Link d="M94 116H148" />
    <rect x="150" y="88" width="88" height="56" rx="3" className={styles.hot} />
    <text x="194" y="113" textAnchor="middle" className={styles.label}>
      Ansible
    </text>
    <text x="194" y="129" textAnchor="middle" className={styles.caption}>
      Podman
    </text>
    <Link d="M240 116H276" delay={1} />

    <path d="M322 62L278 116L322 170L366 116ZM278 116H366M322 62V170" pathLength={1} className={styles.wire} />
    {[
      [322, 62],
      [278, 116],
      [366, 116],
      [322, 170],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="7.5" className={styles.pulse} style={cssVars({ "--k": i + 1 })} />
    ))}
    <text x="322" y="202" textAnchor="middle" className={styles.caption}>
      Containerlab
    </text>
  </svg>
);

/** Source of truth ⇄ automation → monitoring, and the devices it provisions. */
const PipelineArt = () => (
  <svg viewBox="0 0 400 240">
    <g className={styles.node}>
      <path d="M36 72v44c0 5.5 15.7 10 35 10s35-4.5 35-10V72" />
      <path d="M36 94c0 5.5 15.7 10 35 10s35-4.5 35-10" />
      <ellipse cx="71" cy="72" rx="35" ry="10" />
    </g>
    <text x="71" y="148" textAnchor="middle" className={styles.caption}>
      NetBox
    </text>

    <Link d="M110 88H158" />
    <Link d="M158 108H110" delay={2} />

    <rect x="160" y="68" width="84" height="60" rx="3" className={styles.hot} />
    <text x="202" y="102" textAnchor="middle" className={styles.label}>
      Ansible
    </text>

    <Link d="M246 98H294" delay={1} />
    <text x="270" y="88" textAnchor="middle" className={styles.captionSmall}>
      REST API
    </text>

    <rect x="296" y="68" width="72" height="60" rx="3" className={styles.node} />
    <path d="M306 104h10l6-15 8 26 7-17 5 6h16" pathLength={1} className={styles.trace} />

    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <path d={`M${178 + i * 16} 130V176`} pathLength={1} className={styles.wire} />
        <rect x={172 + i * 16} y="176" width="12" height="12" rx="2" className={styles.pulse} style={cssVars({ "--k": i })} />
      </g>
    ))}
  </svg>
);

const SPINES: readonly (readonly [number, number])[] = [
  [140, 82],
  [260, 82],
];
const LEAVES: readonly (readonly [number, number])[] = [
  [66, 172],
  [155, 172],
  [245, 172],
  [334, 172],
];

/** A playbook pushed to a virtual spine-and-leaf fabric. */
const LabArt = () => (
  <svg viewBox="0 0 400 240">
    <rect x="152" y="18" width="96" height="20" rx="10" className={styles.hot} />
    <text x="200" y="31.5" textAnchor="middle" className={styles.captionSmall}>
      playbook.yml
    </text>
    <Link d="M200 38V52H140V70" />
    <Link d="M200 38V52H260V70" delay={1} />

    {SPINES.flatMap(([sx, sy], s) =>
      LEAVES.map(([lx, ly], l) => <Link key={`${s}-${l}`} d={`M${sx} ${sy + 12}L${lx} ${ly - 12}`} delay={s + l} />),
    )}
    {SPINES.map(([x, y], i) => (
      <rect key={i} x={x - 17} y={y - 12} width="34" height="24" rx="3" className={styles.hot} />
    ))}
    {LEAVES.map(([x, y], i) => (
      <rect key={i} x={x - 17} y={y - 12} width="34" height="24" rx="3" className={styles.pulse} style={cssVars({ "--k": i })} />
    ))}
    <text x="200" y="214" textAnchor="middle" className={styles.caption}>
      PNETLab · Containerlab
    </text>
  </svg>
);

/** Spreadsheet → VPN tunnel → managed database → dashboard. */
const MigrationArt = () => (
  <svg viewBox="0 0 400 240">
    <g className={styles.faded}>
      <rect x="22" y="84" width="68" height="60" rx="2" />
      <path d="M22 99H90M22 114H90M22 129H90M45 84V144M68 84V144" />
    </g>
    <text x="56" y="166" textAnchor="middle" className={styles.caption}>
      Excel
    </text>

    <Link d="M92 114H208" />
    <rect x="112" y="102" width="76" height="24" rx="12" className={styles.tunnel} />
    <text x="150" y="92" textAnchor="middle" className={styles.captionSmall}>
      WireGuard
    </text>

    <g className={styles.hot}>
      <path d="M210 90v48c0 4.7 12.5 8.5 28 8.5s28-3.8 28-8.5V90" />
      <path d="M210 114c0 4.7 12.5 8.5 28 8.5s28-3.8 28-8.5" />
      <ellipse cx="238" cy="90" rx="28" ry="8.5" />
    </g>
    <text x="238" y="166" textAnchor="middle" className={styles.caption}>
      Aurora
    </text>

    <Link d="M268 114H296" delay={1} />
    <rect x="298" y="84" width="80" height="60" rx="3" className={styles.node} />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={308 + i * 16}
        y={134 - [18, 30, 22, 38][i]}
        width="10"
        height={[18, 30, 22, 38][i]}
        className={styles.bar}
        style={cssVars({ "--k": i })}
      />
    ))}
    <text x="338" y="166" textAnchor="middle" className={styles.caption}>
      Dashboard
    </text>
  </svg>
);

/** Any other project: a plain field of points with a sweep passing through. */
const FallbackArt = () => (
  <svg viewBox="0 0 400 240">
    {Array.from({ length: 40 }, (_, i) => (
      <circle
        key={i}
        cx={56 + (i % 8) * 41}
        cy={48 + Math.floor(i / 8) * 36}
        r="5"
        className={styles.pulse}
        style={cssVars({ "--k": (i % 8) + Math.floor(i / 8) })}
      />
    ))}
  </svg>
);

const ART: Record<string, ComponentType> = {
  "gio-ai-assistant": AgentArt,
  "poc-in-a-box": PocArt,
  "netbox-ansible-pipeline": PipelineArt,
  "network-automation-lab": LabArt,
  "aurora-dashboard-migration": MigrationArt,
};

const ProjectArt = ({ projectId, className }: { projectId: string; className?: string }) => {
  const [ref, active] = useInView<HTMLDivElement>({ repeat: true, margin: "0px" });
  const Art = ART[projectId] ?? FallbackArt;

  return (
    <div ref={ref} className={cn(styles.art, className)} data-active={active || undefined} aria-hidden="true">
      <Art />
    </div>
  );
};

export default ProjectArt;
