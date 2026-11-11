import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import "./LineMorph.css";

/*
 * One hand-drawn line that turns from a laptop into a paintbrush into a
 * camera as you scroll past: engineer, artist, photographer.
 *
 * Each drawing is a single continuous line on a 1400 x 300 canvas (like the
 * doodle dividers): it comes in from the left edge, draws the object and
 * leaves to the right. To morph, each line is sampled into the same number
 * of points once, and the points slide from one drawing to the next.
 */
const SHAPES = [
  // laptop
  "M 7.0 257.0 C 175.0 261.0 364.0 251.0 521.5 255.0 L 563.5 255.0 L 836.5 255.0 L 815.5 235.0 L 584.5 235.0 L 563.5 255.0 L 584.5 235.0 L 605.5 230.0 L 605.5 77.0 Q 605.5 65.0 618.1 65.0 L 781.9 65.0 Q 794.5 65.0 794.5 77.0 L 794.5 230.0 L 605.5 230.0 L 620.2 217.0 L 620.2 79.0 L 779.8 79.0 L 779.8 217.0 L 620.2 217.0 L 605.5 230.0 L 794.5 230.0 L 815.5 235.0 L 836.5 255.0 L 889.0 256.0 C 1036.0 259.0 1225.0 251.0 1393.0 257.0",
  // paintbrush
  "M 7.0 257.0 C 175.0 261.0 364.0 251.0 521.5 255.0 C 553.0 257.0 589.8 249.0 618.1 239.0 Q 637.0 201.0 674.8 185.0 L 697.9 207.0 L 674.8 185.0 L 710.5 153.0 L 733.6 175.0 L 710.5 153.0 L 805.0 77.0 Q 817.6 67.0 826.0 79.0 Q 832.3 89.0 821.8 97.0 L 733.6 175.0 L 697.9 207.0 Q 658.0 225.0 618.1 239.0 C 689.5 261.0 784.0 247.0 889.0 256.0 C 1036.0 259.0 1225.0 251.0 1393.0 257.0",
  // camera
  "M 7.0 257.0 C 175.0 261.0 364.0 251.0 521.5 255.0 C 553.0 255.0 586.6 247.0 605.5 231.0 L 605.5 123.0 Q 605.5 111.0 618.1 111.0 L 647.5 111.0 L 660.1 91.0 L 704.2 91.0 L 716.8 111.0 L 742.0 111.0 L 742.0 101.0 L 765.1 101.0 L 765.1 111.0 L 781.9 111.0 Q 794.5 111.0 794.5 123.0 L 794.5 219.0 Q 794.5 231.0 781.9 231.0 L 618.1 231.0 Q 605.5 231.0 605.5 219.0 L 605.5 171.0 L 658.0 171.0 A 42.0 40.0 0 0 1 742.0 171.0 A 42.0 40.0 0 0 1 658.0 171.0 L 676.9 171.0 A 23.1 22.0 0 0 1 723.1 171.0 A 23.1 22.0 0 0 1 676.9 171.0 L 658.0 171.0 A 42.0 40.0 0 0 1 742.0 171.0 L 794.5 171.0 L 794.5 219.0 Q 796.6 235.0 821.8 245.0 C 847.0 253.0 868.0 255.0 889.0 256.0 C 1036.0 259.0 1225.0 251.0 1393.0 257.0",
];

const ROLES = ["engineer", "artist", "photographer"];

// Every drawing shares the same lead-in from the left edge and the same
// lead-out to the right edge. Those two stay pinned; only the object in
// between melts, so the in-between frames stay clean.
const LEAD_IN = "M 7.0 257.0 C 175.0 261.0 364.0 251.0 521.5 255.0";
const LEAD_OUT = " C 1036.0 259.0 1225.0 251.0 1393.0 257.0";
const OBJECT_POINTS = 300;

// Where each drawing holds still and where it melts into the next,
// as a share of the scroll from "enters the screen" (0) to "leaves" (1).
const LAPTOP_UNTIL = 0.3;
const BRUSH_FROM = 0.44;
const BRUSH_UNTIL = 0.52;
const CAMERA_FROM = 0.66;

// Sample a path into evenly spaced points (needs the browser, so it runs once)
function sample(d, count) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const total = path.getTotalLength();
  const pts = [];
  for (let i = 0; i < count; i++) {
    const p = path.getPointAtLength((total * i) / (count - 1));
    pts.push([p.x, p.y]);
  }
  document.body.removeChild(svg);
  return pts;
}

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

// Just the object part of a drawing: from the end of the lead-in to the
// start of the lead-out
const objectOf = (shape) => "M 521.5 255.0" + shape.slice(LEAD_IN.length, -LEAD_OUT.length);

// The lead-in, the blended object points, then the lead-out
function blend(a, b, t) {
  let d = LEAD_IN;
  for (let i = 1; i < OBJECT_POINTS; i++) {
    const x = a[i][0] + (b[i][0] - a[i][0]) * t;
    const y = a[i][1] + (b[i][1] - a[i][1]) * t;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + LEAD_OUT;
}

export default function LineMorph() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [points, setPoints] = useState(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setPoints(SHAPES.map((shape) => sample(objectOf(shape), OBJECT_POINTS)));
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const d = useTransform(scrollYProgress, (p) => {
    if (!points || reduceMotion) return SHAPES[0];
    if (p <= LAPTOP_UNTIL) return blend(points[0], points[0], 0);
    if (p < BRUSH_FROM) return blend(points[0], points[1], smooth((p - LAPTOP_UNTIL) / (BRUSH_FROM - LAPTOP_UNTIL)));
    if (p <= BRUSH_UNTIL) return blend(points[1], points[1], 0);
    if (p < CAMERA_FROM) return blend(points[1], points[2], smooth(clamp01((p - BRUSH_UNTIL) / (CAMERA_FROM - BRUSH_UNTIL))));
    return blend(points[2], points[2], 0);
  });

  // Only re-render when the highlighted word changes (3 times at most)
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduceMotion) return;
    const next = p < (LAPTOP_UNTIL + BRUSH_FROM) / 2 ? 0 : p < (BRUSH_UNTIL + CAMERA_FROM) / 2 ? 1 : 2;
    if (next !== stage) setStage(next);
  });

  return (
    <div className="line-morph" ref={ref}>
      <svg viewBox="0 0 1400 300" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
        <motion.path
          className="line-morph__line"
          d={d}
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <p className="line-morph__roles">
        {ROLES.map((r, i) => (
          <span key={r}>
            {i > 0 && <span className="line-morph__dot" aria-hidden="true"> · </span>}
            <span className={i === stage ? "is-active" : undefined}>{r}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
