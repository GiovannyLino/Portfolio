// The hero's artwork: a dotted sphere with traffic flowing between a few nodes, drawn on a
// 2D canvas. It only animates while it can be seen, follows the pointer slightly, and
// under prefers-reduced-motion is a single still frame.
import { useEffect, useRef } from "react";
import { clamp, damp, prefersReducedMotion } from "@/motion/env";

interface HeroGlobeProps {
  className?: string;
  /** Starts the entrance (the sphere assembles itself). */
  play: boolean;
  /** Stops drawing, e.g. while the next section covers the hero. */
  paused?: boolean;
}

type Vec3 = readonly [number, number, number];

interface Arc {
  /** Flattened xyz of the lifted great-circle path, SEGMENTS + 1 points. */
  path: Float32Array;
  to: number;
  /** Revolutions per millisecond of the packet travelling along it. */
  speed: number;
  phase: number;
  lastT: number;
}

interface Pulse {
  node: number;
  start: number;
}

const SEGMENTS = 44;
/** Floats per link once projected: x, y, depth for each point of its path. */
const STRIDE = (SEGMENTS + 1) * 3;
const INTRO_MS = 2400;
const PULSE_MS = 1100;
const PERSPECTIVE = 0.22;
const SPIN = 0.00011; // rad per ms: one turn in about a minute
const ALPHA_BUCKETS = 7;
// Links by depth: behind the sphere, then three steps towards the viewer.
const LINK_ALPHA = [0.045, 0.16, 0.25, 0.34];
const TRAIL = 6;
// A frame that takes longer than this to draw (averaged) switches to the light version.
const SLOW_FRAME_MS = 7;
const TAU = Math.PI * 2;

const toVec = (latitude: number, longitude: number): Vec3 => {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
};

// The first node is "home" (São Paulo); the others are only there to exchange traffic with.
const NODES: Vec3[] = [
  toVec(-23.5, -46.6),
  toVec(40.7, -74),
  toVec(51.5, -0.1),
  toVec(35.7, 139.7),
  toVec(1.3, 103.8),
  toVec(-33.9, 151.2),
  toVec(19.4, -99.1),
  toVec(25.2, 55.3),
  toVec(-1.3, 36.8),
  toVec(37.8, -122.4),
  toVec(28.6, 77.2),
  toVec(-34.6, -58.4),
];

const LINKS: readonly (readonly [number, number])[] = [
  [0, 1], [0, 2], [0, 6], [0, 8], [0, 11], [0, 9],
  [1, 2], [2, 7], [7, 10], [10, 4], [4, 3], [4, 5], [3, 9], [8, 7],
];

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const smoothstep = (t: number): number => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Dots on latitude rings, each ring offset by half a step from the previous one. */
function buildDots(stepDegrees: number, perEquator: number): { positions: Float32Array; ring: Float32Array } {
  const points: number[] = [];
  const rings: number[] = [];
  const count = Math.floor(168 / stepDegrees) + 1;
  for (let i = 0; i < count; i++) {
    const lat = ((-84 + i * stepDegrees) * Math.PI) / 180;
    const around = Math.max(6, Math.round(perEquator * Math.cos(lat)));
    for (let j = 0; j < around; j++) {
      const lon = ((j + (i % 2) * 0.5) / around) * Math.PI * 2;
      points.push(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
      rings.push(i / (count - 1));
    }
  }
  return { positions: new Float32Array(points), ring: new Float32Array(rings) };
}

/** Great-circle path between two nodes, lifted off the surface in the middle. */
function buildArc(from: Vec3, to: Vec3): Float32Array {
  const path = new Float32Array((SEGMENTS + 1) * 3);
  const dot = clamp(from[0] * to[0] + from[1] * to[1] + from[2] * to[2], -1, 1);
  const omega = Math.acos(dot);
  const sin = Math.sin(omega) || 1;
  const height = 0.1 + 0.3 * (omega / Math.PI);
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const a = Math.sin((1 - t) * omega) / sin;
    const b = Math.sin(t * omega) / sin;
    const lift = 1 + height * Math.sin(Math.PI * t);
    path[i * 3] = (a * from[0] + b * to[0]) * lift;
    path[i * 3 + 1] = (a * from[1] + b * to[1]) * lift;
    path[i * 3 + 2] = (a * from[2] + b * to[2]) * lift;
  }
  return path;
}

const HeroGlobe = ({ className, play, paused = false }: HeroGlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ play, paused, wake: () => {} });
  state.current.play = play;
  state.current.paused = paused;

  // Props change the loop from outside without tearing the scene down.
  useEffect(() => state.current.wake(), [play, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const still = prefersReducedMotion();
    const styles = getComputedStyle(canvas);
    const ink = `hsl(${styles.getPropertyValue("--foreground").trim() || "45 14% 93%"})`;
    const accent = `hsl(${styles.getPropertyValue("--primary").trim() || "160 84% 39%"})`;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let dots = buildDots(6, 96);
    const projected = {
      x: new Float32Array(0),
      y: new Float32Array(0),
      z: new Float32Array(0),
      bucket: new Int8Array(0),
    };
    const point = new Float32Array(3);

    const arcs: Arc[] = LINKS.map(([from, to], index) => ({
      path: buildArc(NODES[from], NODES[to]),
      to,
      speed: 1 / (3200 + ((index * 977) % 2600)),
      phase: (index * 0.37) % 1,
      lastT: 0,
    }));
    const linkScreen = new Float32Array(arcs.length * STRIDE);
    const pulses: Pulse[] = [];

    let frame = 0;
    let last = 0;
    let visible = true;
    // Slow devices get fewer dots and every other frame (decided once, after measuring).
    let lite = false;
    let cost = 0;
    let measured = 0;
    let odd = false;
    let introStart = -1;
    // Chosen so the home node faces the visitor as the entrance settles.
    let yaw = 0.3;
    let pointerX = 0;
    let pointerY = 0;
    let leanX = 0;
    let leanY = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      ratio = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.round(rect.width * ratio));
      height = Math.max(1, Math.round(rect.height * ratio));
      canvas.width = width;
      canvas.height = height;
      // Fewer dots on small canvases: same density to the eye, less work for phones.
      dots = lite ? buildDots(9, 60) : rect.width < 520 ? buildDots(8, 70) : buildDots(6, 96);
      const count = dots.ring.length;
      projected.x = new Float32Array(count);
      projected.y = new Float32Array(count);
      projected.z = new Float32Array(count);
      projected.bucket = new Int8Array(count);
    };

    const draw = (now: number, elapsed: number) => {
      const intro = still ? 1 : introStart < 0 ? 0 : easeOutCubic(clamp((now - introStart) / INTRO_MS));
      const centerX = width / 2;
      const centerY = height * 0.5;
      const radius = Math.min(width, height) * 0.43 * (0.88 + 0.12 * intro);

      if (!still) {
        yaw += elapsed * SPIN;
        const ease = damp(elapsed, 420);
        leanX += (pointerX - leanX) * ease;
        leanY += (pointerY - leanY) * ease;
      }
      const turn = yaw + leanX * 0.45 + (1 - intro) * 1.5;
      const tilt = 0.36 + leanY * 0.22;
      const cosY = Math.cos(turn);
      const sinY = Math.sin(turn);
      const cosP = Math.cos(tilt);
      const sinP = Math.sin(tilt);

      const project = (x: number, y: number, z: number, out: Float32Array, at: number) => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosP - z1 * sinP;
        const z2 = y * sinP + z1 * cosP;
        const scale = radius / (1 - z2 * PERSPECTIVE);
        out[at] = centerX + x1 * scale;
        out[at + 1] = centerY - y1 * scale;
        out[at + 2] = z2;
      };

      context.clearRect(0, 0, width, height);
      if (intro <= 0) return;

      // ---- Dots, batched by brightness so each batch is a single fill ----------------
      const count = dots.ring.length;
      for (let i = 0; i < count; i++) {
        project(dots.positions[i * 3], dots.positions[i * 3 + 1], dots.positions[i * 3 + 2], point, 0);
        const z = point[2];
        // The far side stays faint, which is what makes it read as a sphere.
        const depth = z > 0 ? 0.22 + 0.68 * z : 0.05 + 0.17 * (1 + z);
        const alpha = depth * smoothstep(intro * 1.7 - dots.ring[i] * 0.7);
        projected.x[i] = point[0];
        projected.y[i] = point[1];
        projected.z[i] = z;
        projected.bucket[i] = alpha < 0.02 ? -1 : Math.min(ALPHA_BUCKETS - 1, Math.floor(alpha * ALPHA_BUCKETS));
      }
      context.fillStyle = ink;
      for (let bucket = 0; bucket < ALPHA_BUCKETS; bucket++) {
        context.beginPath();
        let any = false;
        for (let i = 0; i < count; i++) {
          if (projected.bucket[i] !== bucket) continue;
          const z = projected.z[i];
          const size = (z > 0 ? 1.05 + 0.75 * z : 0.85) * ratio;
          context.moveTo(projected.x[i] + size, projected.y[i]);
          context.arc(projected.x[i], projected.y[i], size, 0, TAU);
          any = true;
        }
        if (any) {
          context.globalAlpha = (bucket + 0.6) / ALPHA_BUCKETS;
          context.fill();
        }
      }

      // ---- Links: all of them in four strokes, one per depth step ---------------------
      const drawn = clamp((intro - 0.3) / 0.7);
      const reach = Math.floor(SEGMENTS * drawn);
      for (let a = 0; a < arcs.length; a++) {
        const path = arcs[a].path;
        for (let i = 0; i <= SEGMENTS; i++) project(path[i * 3], path[i * 3 + 1], path[i * 3 + 2], linkScreen, a * STRIDE + i * 3);
      }
      context.strokeStyle = ink;
      context.lineWidth = ratio;
      context.lineCap = "round";
      for (let bucket = 0; bucket < LINK_ALPHA.length; bucket++) {
        context.beginPath();
        let any = false;
        for (let a = 0; a < arcs.length; a++) {
          for (let i = 0; i < reach; i++) {
            const at = a * STRIDE + i * 3;
            const z = (linkScreen[at + 2] + linkScreen[at + 5]) / 2;
            if ((z <= 0 ? 0 : 1 + Math.min(2, Math.floor(z * 3))) !== bucket) continue;
            context.moveTo(linkScreen[at], linkScreen[at + 1]);
            context.lineTo(linkScreen[at + 3], linkScreen[at + 4]);
            any = true;
          }
        }
        if (any) {
          context.globalAlpha = LINK_ALPHA[bucket];
          context.stroke();
        }
      }

      // ---- Packets: a dot per link with a short fading tail --------------------------
      if (!still && drawn >= 1) {
        for (const arc of arcs) {
          const t = (now * arc.speed + arc.phase) % 1;
          if (t < arc.lastT) pulses.push({ node: arc.to, start: now });
          arc.lastT = t;
        }
        context.fillStyle = accent;
        // Tail first, so the head is painted on top; one fill per step of the tail.
        for (let trail = TRAIL - 1; trail >= 0; trail--) {
          const size = (trail === 0 ? 2.5 : 1.7 - trail * 0.14) * ratio;
          context.beginPath();
          let any = false;
          for (let a = 0; a < arcs.length; a++) {
            const at = arcs[a].lastT - trail * 0.012;
            if (at < 0) continue;
            const position = at * SEGMENTS;
            const i = Math.min(SEGMENTS - 1, Math.floor(position));
            const from = a * STRIDE + i * 3;
            if (linkScreen[from + 2] < -0.15) continue;
            const mix = position - i;
            const x = linkScreen[from] + (linkScreen[from + 3] - linkScreen[from]) * mix;
            const y = linkScreen[from + 1] + (linkScreen[from + 4] - linkScreen[from + 1]) * mix;
            context.moveTo(x + size, y);
            context.arc(x, y, size, 0, TAU);
            any = true;
          }
          if (any) {
            context.globalAlpha = trail === 0 ? 0.95 : 0.5 * (1 - trail / TRAIL);
            context.fill();
          }
        }
      }

      // ---- Nodes ----------------------------------------------------------------------
      for (let n = 0; n < NODES.length; n++) {
        project(NODES[n][0], NODES[n][1], NODES[n][2], point, 0);
        if (point[2] < -0.05) continue;
        const front = clamp(0.25 + point[2]) * drawn;
        const home = n === 0;
        context.globalAlpha = front;
        context.fillStyle = home ? accent : ink;
        context.beginPath();
        context.arc(point[0], point[1], (home ? 4 : 2.6) * ratio, 0, TAU);
        context.fill();
        context.strokeStyle = home ? accent : ink;
        context.globalAlpha = front * 0.5;
        context.beginPath();
        context.arc(point[0], point[1], (home ? 9 + (still ? 0 : Math.sin(now / 420) * 1.8) : 6) * ratio, 0, TAU);
        context.stroke();
      }

      // ---- Arrivals: a ring opens where a packet lands ---------------------------------
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const life = (now - pulse.start) / PULSE_MS;
        if (life >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const node = NODES[pulse.node];
        project(node[0], node[1], node[2], point, 0);
        if (point[2] < 0) continue;
        context.strokeStyle = accent;
        context.globalAlpha = (1 - life) * 0.8 * clamp(0.3 + point[2]);
        context.beginPath();
        context.arc(point[0], point[1], (5 + easeOutCubic(life) * 22) * ratio, 0, TAU);
        context.stroke();
      }

      context.globalAlpha = 1;
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      odd = !odd;
      if (lite && odd) return;

      const elapsed = Math.min(64, now - last);
      last = now;
      const began = performance.now();
      draw(now, elapsed);

      // After the entrance, check what a frame costs here; a slow device keeps the artwork
      // but with fewer dots, at half the frame rate.
      if (lite || introStart < 0 || now - introStart < INTRO_MS) return;
      cost += (performance.now() - began - cost) * 0.1;
      if (++measured > 60 && cost > SLOW_FRAME_MS) {
        lite = true;
        resize();
      }
    };

    const sync = () => {
      const { play, paused } = state.current;
      if (play && introStart < 0) introStart = performance.now();
      const shouldRun = !still && play && !paused && visible && !document.hidden;
      if (shouldRun && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else if (!shouldRun && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (still) draw(performance.now(), 0);
    };
    state.current.wake = sync;

    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      resize();
      if (!frame) draw(performance.now(), 0);
    };

    resize();
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
    resizeObserver?.observe(canvas);
    const visibility =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          });
    visibility?.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    if (!still) window.addEventListener("pointermove", onPointer, { passive: true });
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      visibility?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default HeroGlobe;
