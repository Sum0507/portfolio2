import { motion } from "framer-motion";
import "./Skills.css";

const fadeUp = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

export default function Skills({ siteData }) {
  if (!siteData?.skills?.length) return null;

  return (
    <section className="section skills-section" id="skills">
      <div className="section-inner">
        <motion.div className="skills-header"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <p className="label">— what i work with</p>
          <h2 className="display">skills.</h2>
        </motion.div>
        <motion.div className="skills-list"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
          {siteData.skills.map((group, i) => (
            <motion.div key={i} className="skills-row" variants={fadeUp}>
              <span className="skills-category">{group.category}</span>
              <span className="skills-items">{group.items?.join(", ")}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}