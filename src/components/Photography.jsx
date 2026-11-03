import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Photography.css";

// Static tilts per card index — consistent, never random
const TILTS = [-4, 2, -6, 3, -2, 5, -3, 4, -5, 2, -4, 3];

export default function Photography({ photos = [] }) {
  const sectionRef = useRef(null);
  const [lightbox, setLightbox] = useState(null); // index of open photo, or null

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cardWidth = 320 + 32;
  const totalWidth = photos.length * cardWidth;
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(totalWidth - (typeof window !== "undefined" ? window.innerWidth * 0.85 : 900))]
  );

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!photos.length) return null;

  const openPhoto = photos[lightbox];

  return (
    <>
      <section
        className="photo-filmstrip-section"
        id="photography"
        ref={sectionRef}
        style={{ height: `${Math.max(photos.length * 80, 300)}vh` }}
      >
        {/* Sticky viewport */}
        <div className="photo-filmstrip-sticky">
          {/* Section label + big title */}
          <motion.div
            className="photo-filmstrip-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="photo-eyebrow">— street photography</p>
            <h2 className="photo-title display">through the lens</h2>
          </motion.div>

          {/* Horizontal strip */}
          <div className="photo-filmstrip-track">
            <motion.div
              className="photo-filmstrip-inner"
              style={{ x: translateX }}
            >
              {photos.map((p, i) => (
                <div
                  key={p._id}
                  className="photo-film-card"
                  style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
                  onClick={() => setLightbox(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={p.caption || `Photo ${i + 1}`}
                  onKeyDown={(e) => e.key === "Enter" && setLightbox(i)}
                >
                  {p.image ? (
                    <img
                      src={urlFor(p.image).width(600).auto("format").quality(75).url()}
                      alt={p.caption || ""}
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <div className="photo-film-placeholder" />
                  )}
                  {p.caption && (
                    <p className="photo-film-caption">{p.caption}</p>
                  )}
                  {/* Expand hint — fades in on hover */}
                  <div className="photo-expand-hint" aria-hidden="true">
                    <span>click to expand</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M7 1h4v4M5 7L11 1M1 5v6h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll hint */}
          <div className="photo-scroll-hint">
            <span>scroll to explore</span>
            <div className="photo-scroll-arrow">→</div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && openPhoto && (
          <motion.div
            className="photo-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="photo-lightbox-inner"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {openPhoto.image && (
                <img
                  src={urlFor(openPhoto.image).width(1400).auto("format").quality(90).url()}
                  alt={openPhoto.caption || ""}
                />
              )}
              {openPhoto.caption && (
                <p className="photo-lightbox-caption">{openPhoto.caption}</p>
              )}
            </motion.div>

            {/* Close button */}
            <button
              className="photo-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              ×
            </button>

            {/* Prev / Next */}
            {lightbox > 0 && (
              <button
                className="photo-lightbox-nav photo-lightbox-prev"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                aria-label="Previous"
              >
                ‹
              </button>
            )}
            {lightbox < photos.length - 1 && (
              <button
                className="photo-lightbox-nav photo-lightbox-next"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                aria-label="Next"
              >
                ›
              </button>
            )}

            {/* Counter */}
            <div className="photo-lightbox-counter">
              {lightbox + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}