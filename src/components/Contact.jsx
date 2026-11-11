import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiGithub, FiInstagram, FiLinkedin, FiMail } from "react-icons/fi";
import useHeadingParallax from "./useHeadingParallax";
import "./Contact.css";

const SERVICE_ID  = "service_r24rly3";
const TEMPLATE_ID = "template_a7swzko";
const PUBLIC_KEY  = "e3pn3AhmRJRhENZmR";

const YEAR = new Date().getFullYear();

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
  const { ref, y } = useHeadingParallax();

  if (!siteData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(formRef.current);
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name:  formData.get("from_name"),
      from_email: formData.get("from_email"),
      message:    formData.get("message"),
    }, PUBLIC_KEY)
      .then(() => { setStatus("sent"); formRef.current.reset(); })
      .catch(() => setStatus("error"));
  };

  return (
    <section className="section contact-section" id="contact" ref={ref}>

      {/* Bleed heading — outside section-inner */}
      <motion.div
        className="contact-bleed-heading"
        style={{ y }}
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <p className="label contact-eyebrow">— let's connect</p>
        <h2 className="display contact-title">say <span className="title-accent">hello</span>.</h2>
      </motion.div>

      <div className="section-inner">
        <motion.div
          className="contact-body"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
        >
          {/* Left: the form */}
          <motion.form ref={formRef} onSubmit={handleSubmit} className="contact-form" variants={fadeUp}>
            <input type="text"  name="from_name"  placeholder="your name"    aria-label="Your name"    autoComplete="name"  required />
            <input type="email" name="from_email" placeholder="your email"   aria-label="Your email"   autoComplete="email" required />
            <textarea           name="message"    placeholder="your message" aria-label="Your message" rows={5} required />
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "sending..." : status === "sent" ? "sent ✓" : "send →"}
            </button>
            {status === "error" && <p className="form-error" role="alert">something went wrong. try emailing directly.</p>}
          </motion.form>

          {/* Right: intro text + socials, sitting lower than the form */}
          <motion.div className="contact-aside" variants={fadeUp}>
            <p className="contact-sub serif">
              Whether it's a project, a collab, or just a chat ........... I'm down.
            </p>

            <div className="contact-socials">
              {siteData.email && (
                <a href={`mailto:${siteData.email}`} className="social-icon" title={siteData.email} aria-label="Email">
                  <FiMail />
                </a>
              )}
              {siteData.github && (
                <a href={siteData.github} target="_blank" rel="noreferrer" className="social-icon" title="GitHub" aria-label="GitHub">
                  <FiGithub />
                </a>
              )}
              {siteData.linkedin && (
                <a href={siteData.linkedin} target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
              )}
              {siteData.instagram && (
                <a href={siteData.instagram} target="_blank" rel="noreferrer" className="social-icon" title="Instagram" aria-label="Instagram">
                  <FiInstagram />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="contact-ribbon">
        <span>
          ✦ Jannatun Nur · dhaka · {YEAR} ✦ engineer · artist · photographer ✦
          Jannatun Nur · dhaka · {YEAR} ✦ engineer · artist · photographer ✦&nbsp;
        </span>
      </div>

      <footer className="footer">
        {siteData.tagline && (
          <em className="serif footer-tagline">"{siteData.tagline}"</em>
        )}
        <p className="footer-credit">made with too much coffee · {siteData.name} © {YEAR}</p>
      </footer>
    </section>
  );
}