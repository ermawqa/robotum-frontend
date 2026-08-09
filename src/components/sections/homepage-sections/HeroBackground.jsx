import { useEffect, useRef } from "react";

// Brand hues (blue → violet → cyan) as RGB triplets so the canvas can fade them.
const PALETTE = [
  [96, 165, 250],
  [168, 85, 247],
  [34, 211, 238],
];

const LINK_DISTANCE = 150;
const POINTER_DISTANCE = 190;
const MAX_DPR = 2;

/**
 * Drifting node lattice drawn on canvas: nodes connect to their neighbours and
 * to the pointer, so the backdrop reacts subtly without competing with the copy.
 *
 * Cheap by construction — it idles whenever the hero scrolls out of view or the
 * tab is hidden, and renders a single static frame under `prefers-reduced-motion`.
 */
function NodeLattice() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0, active: false };

    let width = 0;
    let height = 0;
    let nodes = [];
    let frameId = 0;
    let visible = true;

    const prefersReducedMotion = () => motionQuery.matches;

    function seed() {
      const count = Math.max(
        26,
        Math.min(78, Math.round((width * height) / 21000)),
      );

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: Math.random() * 1.3 + 0.7,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Neighbour links — opacity falls off with distance.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq > LINK_DISTANCE * LINK_DISTANCE) continue;

          const distance = Math.sqrt(distanceSq);
          const alpha = (1 - distance / LINK_DISTANCE) * 0.26;

          ctx.strokeStyle = `rgba(125,170,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Pointer links — the interactive accent, brighter than neighbour links.
      if (pointer.active) {
        for (const node of nodes) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq > POINTER_DISTANCE * POINTER_DISTANCE) continue;

          const distance = Math.sqrt(distanceSq);
          const alpha = (1 - distance / POINTER_DISTANCE) * 0.5;

          ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      // Nodes: a soft halo plus a crisp core, cheaper than canvas shadowBlur.
      for (const node of nodes) {
        const [r, g, b] = node.color;

        ctx.fillStyle = `rgba(${r},${g},${b},0.12)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around the edges so the lattice never thins out.
        if (node.x < -24) node.x = width + 24;
        else if (node.x > width + 24) node.x = -24;
        if (node.y < -24) node.y = height + 24;
        else if (node.y > height + 24) node.y = -24;
      }

      draw();
      frameId = requestAnimationFrame(step);
    }

    function stop() {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function start() {
      if (frameId || !visible || document.hidden) return;
      if (prefersReducedMotion()) {
        draw();
        return;
      }
      frameId = requestAnimationFrame(step);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seed();
      draw();
    }

    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      pointer.active =
        x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    function handleVisibility() {
      if (document.hidden) stop();
      else start();
    }

    function handleMotionChange() {
      stop();
      start();
    }

    resize();
    start();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Idle while the hero is off-screen — this is a full-viewport canvas.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-bg__canvas" />;
}

/**
 * Layered backdrop for the homepage hero: aurora glows, a masked grid, slow
 * orbit rings with satellites, the node lattice, and a vignette that blends
 * into the section below.
 */
export default function HeroBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-bg__base" />

      <div className="hero-bg__aurora">
        <span className="hero-bg__blob hero-bg__blob--blue" />
        <span className="hero-bg__blob hero-bg__blob--violet" />
        <span className="hero-bg__blob hero-bg__blob--cyan" />
      </div>

      <div className="hero-bg__grid" />

      <div className="hero-bg__rings">
        <span className="hero-ring hero-ring--1" />
        <span className="hero-ring hero-ring--2" />
        <span className="hero-ring hero-ring--3" />
        <span className="hero-orbiter hero-orbiter--1" />
        <span className="hero-orbiter hero-orbiter--2" />
        <span className="hero-orbiter hero-orbiter--3" />
      </div>

      <NodeLattice />

      <div className="hero-bg__scan" />
      <div className="hero-bg__vignette" />
    </div>
  );
}
