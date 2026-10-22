import { motion } from "framer-motion";
import "./Research.css";

const fadeUp = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

export default function Research({ research = [] }) {
  return (
    <section className="section" id="research">
      <div className="section-inner">
        <motion.div className="section-header"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <p className="section-label">— academic work</p>
          <h2 className="section-heading display">research</h2>
        </motion.div>

        {(!research || research.length === 0) ? (
          <motion.div className="research-empty"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            <div className="research-empty-card">
              <p className="research-empty-text serif">
                nothing published yet — but the ideas are brewing.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div className="research-list"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
            {research.map(r => (
              <motion.div key={r._id} className="research-card" variants={fadeUp}>
                <div className="research-main">
                  <span className={`res-status status-${r.status?.replace(" ", "-")}`}>{r.status}</span>
                  <h3 className="res-title serif">{r.title}</h3>
                  <p className="res-venue">{r.venue}</p>
                  {r.coauthors && <p className="res-authors">{r.coauthors}</p>}
                </div>
                <div className="res-meta">
                  {r.tags?.map(t => <span key={t} className="res-tag">{t}</span>)}
                  <span className="label res-year">{r.year}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}