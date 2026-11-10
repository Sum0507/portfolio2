import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { urlFor } from "../sanityClient";
import "./Hero.css";

function MagneticBtn({ href, className, children, target, rel }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => { el.style.transition = "transform 0.1s ease"; };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      el.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      el.style.transform = "translate(0, 0)";
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className={className} target={target} rel={rel}>
      {children}
    </a>
  );
}

// The live counter (years, days, hours, minutes, seconds) lets anyone work
// out the exact date of birth. Off by default: only the age in years shows.
// Set to true to bring the ticking counter back.
const SHOW_LIVE_COUNTER = true;
const BIRTH = new Date("2000-07-05T00:00:00");

function calcAge() {
  const now = new Date();
  let years = now.getFullYear() - BIRTH.getFullYear();
  const anniv = new Date(now.getFullYear(), BIRTH.getMonth(), BIRTH.getDate());
  if (now < anniv) years--;
  const lastAnniv = new Date(now.getFullYear() - (now < anniv ? 1 : 0), BIRTH.getMonth(), BIRTH.getDate());
  const days = Math.floor((now - lastAnniv) / 86400000);
  const totalSec = Math.floor((now - BIRTH) / 1000);
  return {
    years,
    days,
    hrs: Math.floor(totalSec / 3600) % 24,
    min: Math.floor(totalSec / 60) % 60,
    sec: totalSec % 60,
  };
}

function AgeCounter() {
  const [age, setAge] = useState(calcAge);

  useEffect(() => {
    if (!SHOW_LIVE_COUNTER) return undefined;
    const id = setInterval(() => setAge(calcAge()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!SHOW_LIVE_COUNTER) {
    return <span className="age-counter">{age.years} years old</span>;
  }

  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span className="age-counter">
      {age.years}y {age.days}d {pad(age.hrs)}h {pad(age.min)}m {pad(age.sec)}s
    </span>
  );
}

export default function Hero({ siteData }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Scroll effects run on framer "motion values": they update the elements
  // directly every frame without re-rendering React. Only opacity and
  // transform change, which the browser can do cheaply.
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) =>
    Math.min(y / (typeof window !== "undefined" ? window.innerHeight * 0.8 : 800), 1)
  );
  const bgOpacity = useTransform(progress, (p) => 1 - p);   // whole image fades out
  const colourOpacity = progress;                            // colour fades in over the grey copy
  const contentY = useTransform(scrollY, (y) => (reduceMotion ? 0 : y * 0.15));

  // Entrance starts almost immediately (was 300ms) so the text appears sooner
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!siteData) return;
    const TYPED_WORDS = siteData?.roles?.length ? siteData.roles : ["I'm Sumaiya."];
    const current = TYPED_WORDS[roleIndex];
    // Visitors who asked for reduced motion get the first role, no typing loop
    if (reduceMotion) {
      if (displayed !== TYPED_WORDS[0]) setDisplayed(TYPED_WORDS[0]);
      return undefined;
    }
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex(i => (i + 1) % TYPED_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, siteData, reduceMotion]);

  if (!siteData) return null;

  const heroBg = siteData.heroImage
    ? urlFor(siteData.heroImage).width(1600).auto("format").quality(80).url()
    : null;

  return (
    <section className="hero-full" id="about" ref={heroRef}>
      {heroBg && (
        <motion.div className="hero-bg-wrap" style={{ opacity: bgOpacity }} aria-hidden="true">
          <div className="hero-bg hero-bg--grey" style={{ backgroundImage: `url(${heroBg})` }} />
          <motion.div
            className="hero-bg hero-bg--colour"
            style={{ backgroundImage: `url(${heroBg})`, opacity: colourOpacity }}
          />
        </motion.div>
      )}
      <div className="hero-overlay" />
      <motion.div
        className={`hero-content ${loaded ? "hero-content--visible" : ""}`}
        style={{ y: contentY }}
      >
        <p className="hero-eyebrow label hero-anim" style={{ transitionDelay: "0.05s" }}>
          <AgeCounter /> · {siteData.location}
        </p>
        <h1 className="hero-typed display hero-anim" style={{ transitionDelay: "0.12s" }} aria-live="off">
          {displayed}<span className="cursor">|</span>
        </h1>
        {siteData.tagline && (
          <p className="hero-tagline serif hero-anim" style={{ transitionDelay: "0.2s" }}>
            "{siteData.tagline}"
          </p>
        )}
        <p className="hero-bio hero-anim" style={{ transitionDelay: "0.28s" }}>
          {siteData.bio}
        </p>
        <div className="hero-btns hero-anim" style={{ transitionDelay: "0.36s" }}>
          <MagneticBtn href="#projects" className="btn btn-primary">
            see my work
          </MagneticBtn>
          {siteData.cvUrl && (
            <MagneticBtn
              href={siteData.cvUrl}
              className="btn btn-secondary"
              target="_blank"
              rel="noreferrer"
            >
              download cv
            </MagneticBtn>
          )}
        </div>
      </motion.div>
    </section>
  );
}