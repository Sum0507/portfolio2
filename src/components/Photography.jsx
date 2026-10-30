import { useState } from "react";
import { motion } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Photography.css";

const INITIAL_SHOW = 3;

const fadeUp = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

export default function Photography({ photos = [] }) {
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const visible = showAll ? photos : photos.slice(0, INITIAL_SHOW);

  return (
    <section className="section photo-section" id="photography">
      <div className="section-inner">
        <motion.div className="section-header"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <p className="section-label">— street photography</p>
          <h2 className="section-heading display">through the lens</h2>
        </motion.div>

        <motion.div className="photo-grid"
            variants={stagger} initial="animate" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {visible.map((p) => (
            <motion.div
              key={p._id}
              className="polaroid photo-card"
              style={{
                transform: `rotate(${p.rotation || 0}deg)`,
                '--rotation': `${p.rotation || 0}deg`
              }}
              variants={fadeUp}
              onClick={() => setLightbox(p)}
            >
              <div className={`tape ${p.tape || "tape-r"}`} />
              <div className="polaroid-img">
                {p.image
                  ? <img
                      src={urlFor(p.image).width(600).auto("format").quality(75).url()}
                      alt={p.caption}
                      loading="lazy"
                    />
                  : <div className="polaroid-placeholder"><span>[ photo ]</span></div>
                }
              </div>
              <p className="polaroid-caption">{p.caption}</p>
            </motion.div>
          ))}
        </motion.div>

        {!showAll && photos.length > INITIAL_SHOW && (
          <div className="view-more-wrap">
            <button className="view-more-btn" onClick={() => setShowAll(true)}>
              view more photos ({photos.length - INITIAL_SHOW} more) →
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
              src={urlFor(lightbox.image).width(1200).auto("format").quality(80).url()}
              alt={lightbox.caption}
            />
            <p className="lightbox-caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}