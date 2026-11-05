import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Art.css";

const PREVIEW_COUNT = 5; // cards shown in filmstrip

// Full-size image URL used by the lightbox. The same URL is used for
// preloading, so the browser cache makes "click to expand" feel instant.
const bigUrl = (image) =>
  urlFor(image).width(1600).auto("format").quality(90).url();

const preloaded = new Set();
function preload(image) {
  if (!image) return;
  const url = bigUrl(image);
  if (preloaded.has(url)) return;
  preloaded.add(url);
  const img = new Image();
  img.src = url;
}

export default function Art({ artworks = [] }) {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLightbox, setGalleryLightbox] = useState(null);
  const [maxScroll, setMaxScroll] = useState(0);

  const previewArt = artworks.slice(0, PREVIEW_COUNT);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Measure the real width of the strip (cards have natural widths),
  // so the scroll always ends with the "view all" card fully visible.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () =>
      setMaxScroll(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [artworks.length]);

  const translateX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  // When a lightbox is open, preload the next and previous images too
  useEffect(() => {
    if (lightbox === null) return;
    [lightbox - 1, lightbox + 1].forEach((n) => {
      if (n >= 0 && n < PREVIEW_COUNT && artworks[n]) preload(artworks[n].image);
    });
  }, [lightbox, artworks]);

  useEffect(() => {
    if (galleryLightbox === null) return;
    [galleryLightbox - 1, galleryLightbox + 1].forEach((n) => {
      if (n >= 0 && artworks[n]) preload(artworks[n].image);
    });
  }, [galleryLightbox, artworks]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (lightbox !== null) setLightbox(null);
        else if (galleryLightbox !== null) setGalleryLightbox(null);
        else if (galleryOpen) setGalleryOpen(false);
      }
      if (e.key === "ArrowLeft") {
        if (lightbox !== null && lightbox > 0) setLightbox((l) => l - 1);
        if (galleryLightbox !== null && galleryLightbox > 0)
          setGalleryLightbox((l) => l - 1);
      }
      if (e.key === "ArrowRight") {
        if (lightbox !== null && lightbox < previewArt.length - 1)
          setLightbox((l) => l + 1);
        if (galleryLightbox !== null && galleryLightbox < artworks.length - 1)
          setGalleryLightbox((l) => l + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, galleryOpen, galleryLightbox, previewArt.length, artworks.length]);

  // Lock body scroll + hide back-to-top while gallery is open
  useEffect(() => {
    document.body.style.overflow = galleryOpen ? "hidden" : "";
    document.body.classList.toggle("gallery-open", galleryOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("gallery-open");
    };
  }, [galleryOpen]);

  if (!artworks.length) return null;

  return (
    <>
      {/* ── Filmstrip section ── */}
      <section
        className="art-filmstrip-section"
        id="art"
        ref={sectionRef}
        style={{ height: `${PREVIEW_COUNT * 80}vh` }}
      >
        <div className="art-filmstrip-sticky">
          {/* Bleed heading */}
          <motion.div
            className="art-bleed-heading"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="label art-eyebrow">— artbook</p>
            <h2 className="display art-title">from the pages.</h2>
          </motion.div>

          {/* Strip */}
          <div className="art-filmstrip-track">
            <motion.div
              className="art-filmstrip-inner"
              ref={innerRef}
              style={{ x: translateX }}
            >
              {previewArt.map((a, i) => (
                <div
                  key={a._id}
                  className="art-film-card"
                  onClick={() => setLightbox(i)}
                  onMouseEnter={() => preload(a.image)}
                  onFocus={() => preload(a.image)}
                  role="button"
                  tabIndex={0}
                  aria-label={a.caption || `Artwork ${i + 1}`}
                  onKeyDown={(e) => e.key === "Enter" && setLightbox(i)}
                >
                  {a.image && (
                    <img
                      src={urlFor(a.image).height(1000).auto("format").quality(80).url()}
                      alt={a.caption || ""}
                      draggable={false}
                    />
                  )}
                  {a.caption && <p className="art-film-caption">{a.caption}</p>}
                  <div className="art-expand-hint" aria-hidden="true">
                    <span>click to expand</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M7 1h4v4M5 7L11 1M1 5v6h6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              ))}

              {/* View all card */}
              {artworks.length > PREVIEW_COUNT && (
                <div
                  className="art-view-all-card"
                  onClick={() => setGalleryOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setGalleryOpen(true)}
                >
                  <span className="art-view-all-count">
                    +{artworks.length - PREVIEW_COUNT}
                  </span>
                  <span className="art-view-all-label">view all</span>
                  <span className="art-view-all-arrow">→</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Scroll hint */}
          <div className="art-scroll-hint">
            <span>scroll to explore</span>
            <div className="art-scroll-arrow">→</div>
          </div>
        </div>
      </section>

      {/* ── Filmstrip lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="art-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="art-lightbox-inner"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {previewArt[lightbox]?.image && (
                <img
                  src={bigUrl(previewArt[lightbox].image)}
                  alt={previewArt[lightbox].caption || ""}
                />
              )}
              {previewArt[lightbox]?.caption && (
                <p className="art-lightbox-caption">{previewArt[lightbox].caption}</p>
              )}
            </motion.div>
            <button className="art-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
            {lightbox > 0 && (
              <button
                className="art-lightbox-nav art-lightbox-prev"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                aria-label="Previous"
              >‹</button>
            )}
            {lightbox < previewArt.length - 1 && (
              <button
                className="art-lightbox-nav art-lightbox-next"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                aria-label="Next"
              >›</button>
            )}
            <div className="art-lightbox-counter">{lightbox + 1} / {previewArt.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full gallery overlay ── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            className="art-gallery-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="art-gallery-header">
              <div>
                <p className="label art-gallery-eyebrow">— all artworks</p>
                <h2 className="art-gallery-title">from the pages.</h2>
              </div>
              <button className="art-gallery-close" onClick={() => setGalleryOpen(false)} aria-label="Close gallery">
                <span>close</span> ×
              </button>
            </div>

            <div className="art-gallery-grid">
              {artworks.map((a, i) => {
                const tilt = ((i % 9) - 4) * 0.5;
                return (
                  <motion.div
                    key={a._id}
                    className="art-gallery-item"
                    style={{ transform: `rotate(${tilt}deg)` }}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.5) }}
                    onClick={() => setGalleryLightbox(i)}
                    onMouseEnter={() => preload(a.image)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setGalleryLightbox(i)}
                  >
                    {a.image && (
                      <img
                        src={urlFor(a.image).width(700).auto("format").quality(75).url()}
                        alt={a.caption || ""}
                        loading="lazy"
                        draggable={false}
                      />
                    )}
                    {a.caption && <p className="art-gallery-caption">{a.caption}</p>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gallery lightbox ── */}
      <AnimatePresence>
        {galleryLightbox !== null && (
          <motion.div
            className="art-lightbox"
            style={{ zIndex: 10001 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setGalleryLightbox(null)}
          >
            <motion.div
              className="art-lightbox-inner"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {artworks[galleryLightbox]?.image && (
                <img
                  src={bigUrl(artworks[galleryLightbox].image)}
                  alt={artworks[galleryLightbox].caption || ""}
                />
              )}
              {artworks[galleryLightbox]?.caption && (
                <p className="art-lightbox-caption">{artworks[galleryLightbox].caption}</p>
              )}
            </motion.div>
            <button className="art-lightbox-close" onClick={() => setGalleryLightbox(null)} aria-label="Close">×</button>
            {galleryLightbox > 0 && (
              <button
                className="art-lightbox-nav art-lightbox-prev"
                onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox - 1); }}
                aria-label="Previous"
              >‹</button>
            )}
            {galleryLightbox < artworks.length - 1 && (
              <button
                className="art-lightbox-nav art-lightbox-next"
                onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox + 1); }}
                aria-label="Next"
              >›</button>
            )}
            <div className="art-lightbox-counter">{galleryLightbox + 1} / {artworks.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}