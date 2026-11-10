import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth (inertial) scrolling, the same technique OFF+BRAND and
 * landonorris.com use. A mouse-wheel flick glides to a stop instead of
 * jumping in steps.
 *
 * - Touch screens keep their normal native scrolling (already smooth).
 * - Visitors with "reduce motion" turned on get normal scrolling.
 * - Framer Motion's useScroll still works, because Lenis moves the real
 *   page scroll position; it only smooths how it gets there.
 */
let lenis = null;

export function startSmoothScroll() {
  if (lenis || typeof window === "undefined") return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  lenis = new Lenis({
    duration: 1.15,          // how long a scroll takes to settle
    smoothWheel: true,
    anchors: true,           // <a href="#projects"> links glide too
  });

  const raf = (time) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

/** Scroll to an element, a "#id", or a number (px). Falls back to native. */
export function scrollToTarget(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...opts });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

/** Freeze the page behind full-screen overlays (menu, gallery). */
export function lockScroll(locked) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
