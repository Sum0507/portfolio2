import { projects, skills } from "../data/content";
import "./Projects.css";

const chipColor = { frontend: "accent-r", backend: "accent-t", tools: "accent-y", art: "accent-p" };

export default function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="section-inner">
        <div className="section-header">
          <p className="label">— cse stuff</p>
          <h2 className="section-title">things i built</h2>
        </div>

        <div className="projects-grid">
          {projects.map(p => (
            <div className="project-card" key={p.id}>
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
          ))}
        </div>

        <div className="skills-wrap" id="skills">
          <p className="label" style={{ marginBottom: 16 }}>— skills & tools</p>
          <div className="chips">
            {skills.map((s, i) => (
              <span key={i} className={`chip chip-${chipColor[s.group]}`}>{s.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
