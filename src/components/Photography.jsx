import { useState } from "react";
import { photos } from "../data/content";
import "./Photography.css";

const INITIAL_SHOW = 3;

export default function Photography() {
  const [showAll, setShowAll] = useState(false);
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
              key={p.id}
              className="polaroid photo-card"
              style={{ transform: `rotate(${p.rotation}deg)` }}
            >
              <div className={`tape ${p.tape}`} />
              <div className="polaroid-img">
                {p.src
                  ? <img src={p.src} alt={p.caption} />
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
    </section>
  );
}