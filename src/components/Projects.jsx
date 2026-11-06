import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { urlFor } from "../sanityClient";
import useHeadingParallax from "./useHeadingParallax";
import "./Projects.css";

const fadeUp = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

/**
 * Project thumbnail.
 * - Normal images: shown as before.
 * - Animated GIFs: a tiny still frame is shown first. The heavy animated GIF
 *   is only downloaded when someone hovers (mouse) or taps (touch).
 */
function ProjectThumb({ image, title }) {
  const [playing, setPlaying] = useState(false);
  const lastPointer = useRef("mouse");

  const assetUrl = image?.asset?.url || "";
  const isGif = /\.gif($|\?)/i.test(assetUrl);
  const animatedUrl = urlFor(image).width(800).auto("format").quality(75).url();

  // Not a GIF: behave exactly like before
  if (!isGif) {
    return (
      <div className="proj-thumbnail">
        <img
          src={animatedUrl}
          alt={`${title} preview`}
          className="proj-thumbnail-img"
          loading="lazy"
        />
      </div>
    );
  }

  // JPEG cannot animate, so Sanity returns just the first frame
  const stillUrl = urlFor(image).width(700).format("jpg").quality(75).url();

  return (
    <div
      className="proj-thumbnail"
      style={{ position: "relative", cursor: "pointer" }}
      onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setPlaying(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setPlaying(false); }}
      onClick={() => { if (lastPointer.current !== "mouse") setPlaying((p) => !p); }}
      onFocus={() => setPlaying(true)}
      onBlur={() => setPlaying(false)}
      role="button"
      tabIndex={0}
      aria-label={`${title} preview, ${playing ? "playing" : "press to play"}`}
    >
      <img
        src={stillUrl}
        alt={`${title} preview`}
        className="proj-thumbnail-img"
        loading="lazy"
        decoding="async"
      />
      {playing && (
        <img
          src={animatedUrl}
          alt=""
          aria-hidden="true"
          className="proj-thumbnail-img"
          decoding="async"
          style={{ position: "absolute", inset: 0 }}
        />
      )}
      {!playing && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            padding: "4px 9px",
            fontFamily: "var(--font-body, monospace)",
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
            background: "rgba(13,13,13,0.7)",
            border: "1px solid rgba(255,255,255,0.18)",
            pointerEvents: "none",
          }}
        >
          ▶ play
        </span>
      )}
    </div>
  );
}

export default function Projects({ projects = [] }) {
  const { ref, y } = useHeadingParallax();

  return (
    <section className="section projects-section" id="projects" ref={ref}>

      {/* Bleed heading — outside section-inner */}
      <motion.div
        className="proj-bleed-heading"
        style={{ y }}
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <p className="label proj-eyebrow">— cse stuff</p>
        <h2 className="display proj-title">things i built.</h2>
      </motion.div>

      <div className="section-inner">
        <motion.div className="projects-grid"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {projects.map(p => (
            <motion.div className="project-card" key={p._id} variants={fadeUp}>
              {p.previewImage?.asset && (
                <ProjectThumb image={p.previewImage} title={p.title} />
              )}
              <div className="proj-body">
                <span className="proj-year label">{p.year}</span>
                <h3 className="proj-name display">{p.title}</h3>
                <p className="proj-stack">{p.stack}</p>
                <div className="proj-divider" />
                <p className="proj-desc">{p.description}</p>
                <div className="proj-links">
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="proj-link">github →</a>}
                  {p.live   && <a href={p.live}   target="_blank" rel="noreferrer" className="proj-link">live →</a>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}