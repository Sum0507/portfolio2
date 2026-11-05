import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Photography.css";

const PREVIEW_COUNT = 6; // cards shown in filmstrip

// Small static tilts for each preview card
const TILTS = [-1.5, 1.2, -0.8, 1.8, -1.2, 0.9];

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

export default function Photography({ photos = [] }) {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLightbox, setGalleryLightbox] = useState(null);
  const [maxScroll, setMaxScroll] = useState(0);

  const previewPhotos = photos.slice(0, PREVIEW_COUNT);

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
  }, [photos.length]);

  const translateX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  // When a lightbox is open, preload the next and previous images too
  useEffect(() => {
    if (lightbox === null) return;
    [lightbox - 1, lightbox + 1].forEach((n) => {
      if (n >= 0 && n < PREVIEW_COUNT && photos[n]) preload(photos[n].image);
    });
  }, [lightbox, photos]);

  useEffect(() => {
    if (galleryLightbox === null) return;
    [galleryLightbox - 1, galleryLightbox + 1].forEach((n) => {
      if (n >= 0 && photos[n]) preload(photos[n].image);
    });
  }, [galleryLightbox, photos]);

  // Keyboard: Escape closes, arrows navigate
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
        if (lightbox !== null && lightbox < previewPhotos.length - 1)
          setLightbox((l) => l + 1);
        if (galleryLightbox !== null && galleryLightbox < photos.length - 1)
          setGalleryLightbox((l) => l + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, galleryOpen, galleryLightbox, previewPhotos.length, photos.length]);

  // Lock body scroll + hide back-to-top while gallery is open
  useEffect(() => {
    document.body.style.overflow = galleryOpen ? "hidden" : "";
    document.body.classList.toggle("gallery-open", galleryOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("gallery-open");
    };
  }, [galleryOpen]);

  if (!photos.length) return null;

  return (
    <>
      {/* ── Filmstrip section ── */}
      <section
        className="photo-filmstrip-section"
        id="photography"
        ref={sectionRef}
        style={{ height: `${PREVIEW_COUNT * 80}vh` }}
      >
        <div className="photo-filmstrip-sticky">
          {/* Bleed heading */}
          <motion.div
            className="photo-bleed-heading"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="label photo-eyebrow">— captured moments</p>
            <h2 className="display photo-title">through the lens.</h2>
          </motion.div>

          {/* Strip */}
          <div className="photo-filmstrip-track">
            <motion.div
              className="photo-filmstrip-inner"
              ref={innerRef}
              style={{ x: translateX }}
            >
              {previewPhotos.map((p, i) => (
                <div
                  key={p._id}
                  className="photo-film-card"
                  style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
                  onClick={() => setLightbox(i)}
                  onMouseEnter={() => preload(p.image)}
                  onFocus={() => preload(p.image)}
                  role="button"
                  tabIndex={0}
                  aria-label={p.caption || `Photo ${i + 1}`}
                  onKeyDown={(e) => e.key === "Enter" && setLightbox(i)}
                >
                  {p.image && (
                    <img
                      src={urlFor(p.image).height(900).auto("format").quality(80).url()}
                      alt={p.caption || ""}
                      draggable={false}
                    />
                  )}
                  {p.caption && <p className="photo-film-caption">{p.caption}</p>}
                  <div className="photo-expand-hint" aria-hidden="true">
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
              {photos.length > PREVIEW_COUNT && (
                <div
                  className="photo-view-all-card"
                  onClick={() => setGalleryOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setGalleryOpen(true)}
                >
                  <span className="photo-view-all-count">
                    +{photos.length - PREVIEW_COUNT}
                  </span>
                  <span className="photo-view-all-label">view all</span>
                  <span className="photo-view-all-arrow">→</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Scroll hint */}
          <div className="photo-scroll-hint">
            <span>scroll to explore</span>
            <div className="photo-scroll-arrow">→</div>
          </div>
        </div>
      </section>

      {/* ── Filmstrip lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="photo-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="photo-lightbox-inner"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {previewPhotos[lightbox]?.image && (
                <img
                  src={bigUrl(previewPhotos[lightbox].image)}
                  alt={previewPhotos[lightbox].caption || ""}
                />
              )}
              {previewPhotos[lightbox]?.caption && (
                <p className="photo-lightbox-caption">{previewPhotos[lightbox].caption}</p>
              )}
            </motion.div>
            <button className="photo-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
            {lightbox > 0 && (
              <button
                className="photo-lightbox-nav photo-lightbox-prev"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                aria-label="Previous"
              >‹</button>
            )}
            {lightbox < previewPhotos.length - 1 && (
              <button
                className="photo-lightbox-nav photo-lightbox-next"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                aria-label="Next"
              >›</button>
            )}
            <div className="photo-lightbox-counter">{lightbox + 1} / {previewPhotos.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full gallery overlay ── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            className="photo-gallery-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="photo-gallery-header">
              <div>
                <p className="label photo-gallery-eyebrow">— all photographs</p>
                <h2 className="photo-gallery-title">through the lens.</h2>
              </div>
              <button className="photo-gallery-close" onClick={() => setGalleryOpen(false)} aria-label="Close gallery">
                <span>close</span> ×
              </button>
            </div>

            <div className="photo-gallery-grid">
              {photos.map((p, i) => {
                const tilt = ((i % 7) - 3) * 0.6;
                return (
                  <motion.div
                    key={p._id}
                    className="photo-gallery-item"
                    style={{ transform: `rotate(${tilt}deg)` }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.4) }}
                    onClick={() => setGalleryLightbox(i)}
                    onMouseEnter={() => preload(p.image)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setGalleryLightbox(i)}
                  >
                    {p.image && (
                      <img
                        src={urlFor(p.image).width(600).auto("format").quality(75).url()}
                        alt={p.caption || ""}
                        loading="lazy"
                        draggable={false}
                      />
                    )}
                    {p.caption && <p className="photo-gallery-caption">{p.caption}</p>}
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
            className="photo-lightbox"
            style={{ zIndex: 10001 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setGalleryLightbox(null)}
          >
            <motion.div
              className="photo-lightbox-inner"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {photos[galleryLightbox]?.image && (
                <img
                  src={bigUrl(photos[galleryLightbox].image)}
                  alt={photos[galleryLightbox].caption || ""}
                />
              )}
              {photos[galleryLightbox]?.caption && (
                <p className="photo-lightbox-caption">{photos[galleryLightbox].caption}</p>
              )}
            </motion.div>
            <button className="photo-lightbox-close" onClick={() => setGalleryLightbox(null)} aria-label="Close">×</button>
            {galleryLightbox > 0 && (
              <button
                className="photo-lightbox-nav photo-lightbox-prev"
                onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox - 1); }}
                aria-label="Previous"
              >‹</button>
            )}
            {galleryLightbox < photos.length - 1 && (
              <button
                className="photo-lightbox-nav photo-lightbox-next"
                onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox + 1); }}
                aria-label="Next"
              >›</button>
            )}
            <div className="photo-lightbox-counter">{galleryLightbox + 1} / {photos.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}