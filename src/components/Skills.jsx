import "./Skills.css";

export default function Skills({ siteData }) {
  if (!siteData?.skills?.length) return null;

  return (
    <section className="section skills-section" id="skills">
      <div className="section-inner">
        <div className="skills-header">
          <p className="label">— what i work with</p>
          <h2 className="display">skills.</h2>
        </div>
        <div className="skills-list">
          {siteData.skills.map((group, i) => (
            <div key={i} className="skills-row">
              <span className="skills-category">{group.category}</span>
              <span className="skills-items">{group.items?.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}