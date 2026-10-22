import "./Projects.css";

export default function Projects({ projects = [] }) {
  return (
    <section className="section projects-section" id="projects">
      <div className="section-inner">
        <div className="proj-header">
          <p className="proj-label">— cse stuff</p>
          <h2 className="proj-heading display">things i built</h2>
        </div>

        <div className="projects-grid">
          {projects.map(p => {
            const gifUrl = p.previewImage?.asset?.url;
            return (
              <div className="project-card" key={p._id}>
                {gifUrl && (
                  <div className="proj-thumbnail">
                    <img src={gifUrl} alt={`${p.title} preview`} className="proj-thumbnail-img" />
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}