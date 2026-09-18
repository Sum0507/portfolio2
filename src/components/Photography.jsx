import { useState } from "react";
import { urlFor } from "../sanityClient";
import "./Photography.css";

const INITIAL_SHOW = 3;

export default function Photography({ photos = [] }) {
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const visible = showAll ? photos : photos.slice(0, INITIAL_SHOW);

  return (
    <section className="section photo-section" id="photography">
      <div className="section-inner">
        <div className="section-header">
          <p className="label">— street photography</p>
          <h2 className="section-title">through the lens</h2>
          <p className="section-sub">
            Mostly Dhaka. Mostly streets. Mostly what catches the eye before the moment disappears.
          </p>
        </div>

        <div className="photo-grid">
          {visible.map((p) => (
            <div
              key={p._id}
              className="polaroid photo-card"
              style={{ transform: `rotate(${p.rotation || 0}deg)` }}
              onClick={() => setLightbox(p)}
            >
              <div className={`tape ${p.tape || "tape-r"}`} />
              <div className="polaroid-img">
                {p.image
                  ? <img src={urlFor(p.image).width(600).url()} alt={p.caption} />
                  : <div className="polaroid-placeholder"><span>[ photo ]</span></div>
                }
              </div>
              <p className="polaroid-caption">{p.caption}</p>
            </div>
          ))}
        </div>

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

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={urlFor(lightbox.image).width(1200).url()} alt={lightbox.caption} />
            <p className="lightbox-caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}