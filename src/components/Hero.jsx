import { useState, useEffect, useRef } from "react";
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

function AgeCounter() {
  const BIRTH = new Date("2000-07-05T00:00:00");

  const calc = () => {
    const now = new Date();
    const diff = now - BIRTH;
    const totalSec = Math.floor(diff / 1000);
    const sec = totalSec % 60;
    const totalMin = Math.floor(totalSec / 60);
    const min = totalMin % 60;
    const totalHrs = Math.floor(totalMin / 60);
    const hrs = totalHrs % 24;

    const birthYear = BIRTH.getFullYear();
    const nowYear = now.getFullYear();
    let years = nowYear - birthYear;
    const anniv = new Date(nowYear, BIRTH.getMonth(), BIRTH.getDate());
    if (now < anniv) years--;
    const lastAnniv = new Date(nowYear - (now < anniv ? 1 : 0), BIRTH.getMonth(), BIRTH.getDate());
    const days = Math.floor((now - lastAnniv) / (1000 * 60 * 60 * 24));

    return { years, days, hrs, min, sec };
  };

  const [age, setAge] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setAge(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="age-counter">
      {age.years}y {age.days}d {String(age.hrs).padStart(2,"0")}h {String(age.min).padStart(2,"0")}m {String(age.sec).padStart(2,"0")}s
    </span>
  );
}

export default function Hero({ siteData }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [grayscale, setGrayscale] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!siteData) return;
    const TYPED_WORDS = siteData?.roles?.length ? siteData.roles : ["I'm Sumaiya."];
    const current = TYPED_WORDS[roleIndex];
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
  }, [displayed, deleting, roleIndex, siteData]);

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      setGrayscale(1 - progress);
      setOpacity(1 - progress);
      setOffsetY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!siteData) return null;

  const heroBg = siteData.heroImage
    ? urlFor(siteData.heroImage).width(1600).auto("format").quality(80).url()
    : null;

  return (
    <section className="hero-full" id="about" ref={heroRef}>
      {heroBg && (
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: `grayscale(${grayscale}) brightness(${0.45 + (1 - grayscale) * 0.15})`,
            opacity: opacity
          }}
        />
      )}
      <div className="hero-overlay" />
      <div
        className={`hero-content ${loaded ? "hero-content--visible" : ""}`}
        style={{ transform: `translateY(${offsetY * 0.15}px)` }}
      >
        <p className="hero-eyebrow label hero-anim" style={{ transitionDelay: "0.1s" }}>
          <AgeCounter /> · {siteData.location}
        </p>
        <h1 className="hero-typed display hero-anim" style={{ transitionDelay: "0.25s" }}>
          {displayed}<span className="cursor">|</span>
        </h1>
        {siteData.tagline && (
          <p className="hero-tagline serif hero-anim" style={{ transitionDelay: "0.4s" }}>
            "{siteData.tagline}"
          </p>
        )}
        <p className="hero-bio hero-anim" style={{ transitionDelay: "0.55s" }}>
          {siteData.bio}
        </p>
        <div className="hero-btns hero-anim" style={{ transitionDelay: "0.7s" }}>
          <MagneticBtn href="#projects" className="btn btn-primary">
            see my work
          </MagneticBtn>
          <MagneticBtn
            href={siteData.cvUrl || "#"}
            className="btn btn-secondary"
            target="_blank"
            rel="noreferrer"
          >
            download cv
          </MagneticBtn>
        </div>
      </div>
      <div
        className={`hero-scroll-hint hero-anim ${loaded ? "hero-content--visible" : ""}`}
        style={{ transitionDelay: "0.9s" }}
      >
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}