import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiGithub, FiInstagram, FiLinkedin, FiMail } from "react-icons/fi";
import "./Contact.css";

const SERVICE_ID  = "service_r24rly3";
const TEMPLATE_ID = "template_a7swzko";
const PUBLIC_KEY  = "e3pn3AhmRJRhENZmR";

const fadeUp = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

export default function Contact({ siteData }) {
  const formRef = useRef();
  const [status, setStatus] = useState("idle");

  if (!siteData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(formRef.current);
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: formData.get("from_name"),
      from_email: formData.get("from_email"),
      message: formData.get("message"),
    }, PUBLIC_KEY)
      .then(() => { setStatus("sent"); formRef.current.reset(); })
      .catch(() => setStatus("error"));
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="section-inner">
        <motion.div className="contact-header"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
          <motion.p className="contact-label" variants={fadeUp}>— let's connect</motion.p>
          <motion.h2 className="contact-heading display" variants={fadeUp}>say hello.</motion.h2>
          <motion.p className="contact-sub serif" variants={fadeUp}>
            Whether it's a project, a collab, or just a chat ........... I'm down.
          </motion.p>

          <motion.form ref={formRef} onSubmit={handleSubmit} className="contact-form" variants={fadeUp}>
            <input type="text" name="from_name" placeholder="your name" required />
            <input type="email" name="from_email" placeholder="your email" required />
            <textarea name="message" placeholder="your message" rows={5} required />
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "sending..." : status === "sent" ? "sent ✓" : "send →"}
            </button>
            {status === "error" && <p className="form-error">something went wrong. try emailing directly.</p>}
          </motion.form>

          <motion.div className="contact-socials" variants={fadeUp}>
            {siteData.email && (
              <a href={`mailto:${siteData.email}`} target="_blank" rel="noreferrer" className="social-icon" title={siteData.email}>
                <FiMail />
              </a>
            )}
            {siteData.github && (
              <a href={siteData.github} target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
                <FiGithub />
              </a>
            )}
            {siteData.linkedin && (
              <a href={siteData.linkedin} target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn">
                <FiLinkedin />
              </a>
            )}
            {siteData.instagram && (
              <a href={siteData.instagram} target="_blank" rel="noreferrer" className="social-icon" title="Instagram">
                <FiInstagram />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="contact-ribbon">
        <span>
          ✦ Jannatun Nur · dhaka · 2026 ✦ engineer · artist · photographer ✦
          Jannatun Nur · dhaka · 2026 ✦ engineer · artist · photographer ✦&nbsp;
        </span>
      </div>

      <footer className="footer">
        {siteData.tagline && (
          <em className="serif footer-tagline">"{siteData.tagline}"</em>
        )}
        <p className="footer-credit">made with too much coffee · {siteData.name} © 2026</p>
      </footer>
    </section>
  );
}