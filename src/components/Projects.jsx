import { motion } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Projects.css";

const fadeUp = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

export default function Projects({ projects = [] }) {
  return (
    <section className="section projects-section" id="projects">
      <div className="section-inner">
        <motion.div className="proj-header"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <p className="proj-label">— cse stuff</p>
          <h2 className="proj-heading display">things i built</h2>
        </motion.div>

        <motion.div className="projects-grid"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {projects.map(p => {
            const gifUrl = p.previewImage?.asset
              ? urlFor(p.previewImage).width(800).auto("format").quality(75).url()
              : null;
            return (
              <motion.div className="project-card" key={p._id} variants={fadeUp}>
                {gifUrl && (
                  <div className="proj-thumbnail">
                    <img
                      src={gifUrl}
                      alt={`${p.title} preview`}
                      className="proj-thumbnail-img"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="proj-body">
                  <span className="proj-year label">{p.year}</span>
                  <h3 className="proj-title display">{p.title}</h3>
                  <p className="proj-stack">{p.stack}</p>
                  <div className="proj-divider" />
                  <p className="proj-desc">{p.description}</p>
                  <div className="proj-links">
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="proj-link">github →</a>}
                    {p.live   && <a href={p.live}   target="_blank" rel="noreferrer" className="proj-link">live →</a>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}