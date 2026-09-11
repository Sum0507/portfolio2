import { useState } from "react";
import { urlFor } from "../sanityClient";
import "./Art.css";

const INITIAL_SHOW = 2;

export default function Art({ artworks = [] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? artworks : artworks.slice(0, INITIAL_SHOW);

  return (
    <section className="section art-section" id="art">
      <div className="section-inner">
        <div className="section-header">
          <p className="label">— artbook</p>
          <h2 className="section-title">from the pages</h2>
          <p className="section-sub">
            Sketches, collages, digital things. Artsy without too many skills — and that's exactly the point.
          </p>
        </div>

        <div className="art-grid">
          {visible.map((a) => (
            <div
              key={a._id}
              className="polaroid art-card"
              style={{ transform: `rotate(${a.rotation || 0}deg)` }}
            >
              <div className={`tape ${a.tape || "tape-r"}`} />
              <div className="polaroid-img art-img">
                {a.image
                  ? <img src={urlFor(a.image).width(400).url()} alt={a.caption} />
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
            </div>
          ))}
        </div>

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
    </section>
  );
}