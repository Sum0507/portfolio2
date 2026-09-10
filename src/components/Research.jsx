import { research } from "../data/content";
import "./Research.css";

export default function Research() {
  return (
    <section className="section" id="research">
      <div className="section-inner">
        <div className="section-header">
          <p className="label">— academic work</p>
          <h2 className="section-title">research</h2>
        </div>
        <div className="research-list">
          {research.map(r => (
            <div key={r.id} className="research-card">
              <div className="research-main">
                <span className={`res-status status-${r.status.replace(" ", "-")}`}>{r.status}</span>
                <h3 className="res-title serif">{r.title}</h3>
                <p className="res-venue">{r.venue}</p>
                {r.coauthors && <p className="res-authors">{r.coauthors}</p>}
              </div>
              <div className="res-meta">
                {r.tags.map(t => <span key={t} className="res-tag">{t}</span>)}
                <span className="label res-year">{r.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
