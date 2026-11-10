import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Gallery.css";
import { lockScroll } from "../smoothScroll";

/**
 * One component for both the Photography and Art sections.
 * They used to be two ~95% identical files; the small differences
 * (texts, sizes, tilts) now live in VARIANTS below and in Gallery.css.
 */
const VARIANTS = {
  photo: {
    id: "photography",
    eyebrow: "— captured moments",
    title: "through the lens.",
    galleryEyebrow: "— all photographs",
    itemLabel: "Photo",
    stripHeight: 700,     // px height requested from Sanity for strip cards
    gridWidth: 600,       // px width requested for the full-gallery grid
    cardTilts: [-1.5, 1.2, -0.8, 1.8, -1.2, 0.9],
    gridTilt: (i) => ((i % 7) - 3) * 0.6,
  },
  art: {
    id: "art",
    eyebrow: "— artbook",
    title: "from the pages.",
    galleryEyebrow: "— all artworks",
    itemLabel: "Artwork",
    stripHeight: 760,
    gridWidth: 700,
    cardTilts: null,
    gridTilt: (i) => ((i % 9) - 4) * 0.5,
  },
};

const PREVIEW_COUNT = 4; // cards shown in the filmstrip

// How much page scrolling the filmstrip takes up. It used to be 320vh
// (more than 3 screens for 4 pictures); 220vh still feels unhurried.
const STRIP_SCROLL_VH = 220;

// Full-size image URL for the lightbox. The same URL is used for
// preloading, so the browser cache makes "click to expand" feel instant.
const bigUrl = (image) => urlFor(image).width(1600).auto("format").quality(90).url();

const preloaded = new Set();
function preload(image) {
  if (!image) return;
  const url = bigUrl(image);
  if (preloaded.has(url)) return;
  preloaded.add(url);
  const img = new Image();
  img.src = url;
}

/** Full-screen image viewer, shared by the filmstrip and the full gallery. */
function Lightbox({ items, index, onChange, onClose, zIndex }) {
  const closeRef = useRef(null);

  // Move keyboard focus into the viewer, and give it back when it closes
  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  // Preload the neighbours so next/previous feel instant
  useEffect(() => {
    [index - 1, index + 1].forEach((n) => items[n] && preload(items[n].image));
  }, [index, items]);

  const item = items[index];

  return (
    <motion.div
      className="gal-lightbox"
      data-lenis-prevent
      style={zIndex ? { zIndex } : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={item?.caption || "Image viewer"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="gal-lightbox-inner"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {item?.image && <img src={bigUrl(item.image)} alt={item.caption || ""} />}
        {item?.caption && <p className="gal-lightbox-caption">{item.caption}</p>}
      </motion.div>
      <button ref={closeRef} className="gal-lightbox-close" onClick={onClose} aria-label="Close">×</button>
      {index > 0 && (
        <button
          className="gal-lightbox-nav gal-lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onChange(index - 1); }}
          aria-label="Previous"
        >‹</button>
      )}
      {index < items.length - 1 && (
        <button
          className="gal-lightbox-nav gal-lightbox-next"
          onClick={(e) => { e.stopPropagation(); onChange(index + 1); }}
          aria-label="Next"
        >›</button>
      )}
      <div className="gal-lightbox-counter" aria-live="polite">{index + 1} / {items.length}</div>
    </motion.div>
  );
}

const ExpandIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7 1h4v4M5 7L11 1M1 5v6h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Gallery({ items = [], variant = "photo" }) {
  const v = VARIANTS[variant] || VARIANTS.photo;
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);           // index in preview strip
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLightbox, setGalleryLightbox] = useState(null); // index in full list
  const [maxScroll, setMaxScroll] = useState(0);

  const preview = items.slice(0, PREVIEW_COUNT);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Measure the real width of the strip (cards have natural widths),
  // so the scroll always ends with the "view all" card fully visible.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return undefined;
    const measure = () => setMaxScroll(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [items.length]);

  const translateX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

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
        if (galleryLightbox !== null && galleryLightbox > 0) setGalleryLightbox((l) => l - 1);
      }
      if (e.key === "ArrowRight") {
        if (lightbox !== null && lightbox < preview.length - 1) setLightbox((l) => l + 1);
        if (galleryLightbox !== null && galleryLightbox < items.length - 1) setGalleryLightbox((l) => l + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, galleryOpen, galleryLightbox, preview.length, items.length]);

  // Lock page scroll + hide back-to-top while the full gallery is open
  useEffect(() => {
    if (!galleryOpen) return undefined;
    document.body.style.overflow = "hidden";
    document.body.classList.add("gallery-open");
    lockScroll(true);
    return () => {
      lockScroll(false);
      document.body.style.overflow = "";
      document.body.classList.remove("gallery-open");
    };
  }, [galleryOpen]);

  if (!items.length) return null;

  const onEnterKey = (fn) => (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
  };

  return (
    <>
      {/* ── Filmstrip section ── */}
      <section
        className={`gal-filmstrip-section gal--${variant}`}
        id={v.id}
        ref={sectionRef}
        style={{ height: `${STRIP_SCROLL_VH}vh` }}
      >
        <div className="gal-filmstrip-sticky">
          <motion.div
            className="gal-bleed-heading"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="label gal-eyebrow">{v.eyebrow}</p>
            <h2 className="display gal-title">{v.title}</h2>
          </motion.div>

          <div className="gal-filmstrip-track">
            <motion.div className="gal-filmstrip-inner" ref={innerRef} style={{ x: translateX }}>
              {preview.map((it, i) => (
                <div
                  key={it._id}
                  className="gal-film-card"
                  style={v.cardTilts ? { transform: `rotate(${v.cardTilts[i % v.cardTilts.length]}deg)` } : undefined}
                  onClick={() => setLightbox(i)}
                  onMouseEnter={() => preload(it.image)}
                  onFocus={() => preload(it.image)}
                  role="button"
                  tabIndex={0}
                  aria-label={it.caption || `${v.itemLabel} ${i + 1}`}
                  onKeyDown={onEnterKey(() => setLightbox(i))}
                >
                  {it.image && (
                    <img
                      src={urlFor(it.image).height(v.stripHeight).auto("format").quality(80).url()}
                      alt={it.caption || ""}
                      draggable={false}
                    />
                  )}
                  {it.caption && <p className="gal-film-caption">{it.caption}</p>}
                  <div className="gal-expand-hint" aria-hidden="true">
                    <span>click to expand</span>
                    <ExpandIcon />
                  </div>
                </div>
              ))}

              {items.length > PREVIEW_COUNT && (
                <div
                  className="gal-view-all-card"
                  onClick={() => setGalleryOpen(true)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View all ${items.length}`}
                  onKeyDown={onEnterKey(() => setGalleryOpen(true))}
                >
                  <span className="gal-view-all-count">+{items.length - PREVIEW_COUNT}</span>
                  <span className="gal-view-all-label">view all</span>
                  <span className="gal-view-all-arrow">→</span>
                </div>
              )}
            </motion.div>
          </div>

          <div className="gal-scroll-hint" aria-hidden="true">
            <span className="hint-desktop">scroll to explore</span>
            <span className="hint-mobile">swipe to explore</span>
            <div className="gal-scroll-arrow">→</div>
          </div>
        </div>
      </section>

      {/* ── Filmstrip lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox items={preview} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      {/* ── Full gallery overlay ── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            className={`gal-gallery-overlay gal--${variant}`}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={v.galleryEyebrow.replace("— ", "")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="gal-gallery-header">
              <div>
                <p className="label gal-gallery-eyebrow">{v.galleryEyebrow}</p>
                <h2 className="gal-gallery-title">{v.title}</h2>
              </div>
              <button
                className="gal-gallery-close"
                onClick={() => setGalleryOpen(false)}
                aria-label="Close gallery"
                autoFocus
              >
                <span>close</span> ×
              </button>
            </div>

            <div className="gal-gallery-grid">
              {items.map((it, i) => (
                <motion.div
                  key={it._id}
                  className="gal-gallery-item"
                  style={{ transform: `rotate(${v.gridTilt(i)}deg)` }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.5) }}
                  onClick={() => setGalleryLightbox(i)}
                  onMouseEnter={() => preload(it.image)}
                  role="button"
                  tabIndex={0}
                  aria-label={it.caption || `${v.itemLabel} ${i + 1}`}
                  onKeyDown={onEnterKey(() => setGalleryLightbox(i))}
                >
                  {it.image && (
                    <img
                      src={urlFor(it.image).width(v.gridWidth).auto("format").quality(75).url()}
                      alt={it.caption || ""}
                      loading="lazy"
                      draggable={false}
                    />
                  )}
                  {it.caption && <p className="gal-gallery-caption">{it.caption}</p>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gallery lightbox ── */}
      <AnimatePresence>
        {galleryLightbox !== null && (
          <Lightbox
            items={items}
            index={galleryLightbox}
            onChange={setGalleryLightbox}
            onClose={() => setGalleryLightbox(null)}
            zIndex={10001}
          />
        )}
      </AnimatePresence>
    </>
  );
}
