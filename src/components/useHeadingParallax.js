import { useRef } from "react";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Gentle parallax for a section's big heading.
 *
 * Put `ref` on the <section> and `style={{ y }}` on the heading wrapper.
 * As the section scrolls past, the heading drifts a little slower than the
 * page (about `distance` px up or down). Only transform is animated, so it
 * is cheap. It is switched off on phones and for visitors who asked their
 * device for reduced motion.
 */
export default function useHeadingParallax(distance = 28) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const isPhone =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;
  const off = reduceMotion || isPhone;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    off ? [0, 0] : [distance, -distance]
  );

  return { ref, y };
}