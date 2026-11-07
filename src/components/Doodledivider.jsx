import { motion } from "framer-motion";
import "./Doodledivider.css";

// All shapes are drawn on a 1400 x 160 canvas.
const PATHS = {
  wave:
    "M0 90 C 120 20, 240 20, 350 90 S 580 160, 700 90 S 930 20, 1050 90 S 1280 160, 1400 90",
  loop:
    "M0 100 C 200 100, 380 95, 520 88 C 640 82, 700 30, 640 28 C 580 26, 575 105, 690 100 C 820 94, 960 60, 1100 84 C 1220 104, 1320 100, 1400 92",
  swoosh:
    "M0 130 C 300 130, 350 30, 610 40 C 870 50, 820 140, 1050 120 C 1190 108, 1300 60, 1400 50",
  spiral:
    "M0 100 L 540 100 C 610 100, 630 48, 680 48 C 735 48, 752 112, 690 122 C 632 131, 606 74, 664 68 C 710 63, 726 102, 698 108 L 760 108 C 900 108, 1100 84, 1400 96",
  stars:
    "M0 96 C 200 70, 380 118, 560 92 S 900 70, 1100 96 S 1300 100, 1400 88",
};

// Little hand-drawn style stars: [x, y, radius]
const STARS = [
  [420, 44, 15],
  [770, 118, 11],
  [1090, 50, 13],
];

function starPath(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(1)} ${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

// Fast: the line draws in ~0.7s so it keeps up with quick scrolling and
// is finished even on slower phones.
const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// Stars pop in shortly after the line starts, one after another
const starVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.35 + i * 0.18, ease: "easeOut" },
  }),
};

/**
 * Hand-drawn line that draws itself when scrolled into view.
 * variant: "wave" | "loop" | "swoosh" | "spiral" | "stars"
 * flip: mirror the shape horizontally
 */
export default function DoodleDivider({ variant = "wave", flip = false }) {
  return (
    <motion.div
      className={`doodle-divider${flip ? " doodle-divider--flip" : ""}`}
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      // starts drawing well BEFORE the divider reaches the screen (40% of the
      // screen height early), so it is already complete when you see it
      viewport={{ once: true, amount: 0.1, margin: "0px 0px 40% 0px" }}
    >
      <svg
        viewBox="0 0 1400 160"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <motion.path
          className="doodle-line"
          d={PATHS[variant] || PATHS.wave}
          variants={lineVariants}
        />
        {variant === "stars" &&
          STARS.map(([x, y, r], i) => (
            <motion.path
              key={i}
              className="doodle-star"
              d={starPath(x, y, r)}
              variants={starVariants}
              custom={i}
            />
          ))}
      </svg>
    </motion.div>
  );
}