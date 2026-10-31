import { useState } from "react";
import { motion } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Art.css";

const INITIAL_SHOW = 6;

const fadeUp = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

export default function Art({ artworks = [] }) {
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const visible = showAll ? artworks : artworks.slice(0, INITIAL_SHOW);

  return (
    <section className="section art-section" id="art">
      <div className="section-inner">
        <motion.div className="section-header"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <p className="section-label">— artbook</p>
          <h2 className="section-heading display">from the pages</h2>
        </motion.div>

        <motion.div className="art-grid"
          variants={stagger} initial="animate" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {visible.map((a) => (
            <motion.div
              key={a._id}
              className="polaroid art-card"
              variants={fadeUp}
              onClick={() => a.image && setLightbox(a)}
            >
              <div className={`tape ${a.tape || "tape-r"}`} />
              <div className="polaroid-img art-img">
                {a.image
                  ? <img
                      src={urlFor(a.image).width(400).auto("format").quality(75).url()}
                      alt={a.caption}
                      loading="lazy"
                      className="art-photo"
                    />
                  : (
                    <div className="polaroid-placeholder art-placeholder">
                      <div className="sketch-lines">
                        {[70, 50, 82, 45, 68].map((w, i) => (
                          <div key={i} className="sketch-line" style={{ width: `${w}%` }} />
                        ))}
                      </div>
                      <span>[ art ]</span>
                    </div>
                  )
                }
              </div>
              <p className="polaroid-caption">{a.caption}</p>
              <div className="corner-fold" />
            </motion.div>
          ))}
        </motion.div>

        {!showAll && artworks.length > INITIAL_SHOW && (
          <div className="view-more-wrap">
            <button className="view-more-btn" onClick={() => setShowAll(true)}>
              view more artworks ({artworks.length - INITIAL_SHOW} more) →
            </button>
          </div>
        )}
        {showAll && (
          <div className="view-more-wrap">
            <button className="view-more-btn" onClick={() => setShowAll(false)}>
              ← show less
            </button>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img
              src={urlFor(lightbox.image).width(1200).auto("format").quality(85).url()}
              alt={lightbox.caption}
            />
            {lightbox.caption && <p className="lightbox-caption">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </section>
  );
}