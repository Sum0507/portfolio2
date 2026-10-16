import { useState, useEffect, useRef } from "react";
import { urlFor } from "../sanityClient";
import "./Hero.css";

export default function Hero({ siteData }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [grayscale, setGrayscale] = useState(1);
  const heroRef = useRef(null);

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
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!siteData) return null;

  const heroBg = siteData.heroImage
    ? urlFor(siteData.heroImage).width(1600).url()
    : null;

  return (
    <section className="hero-full" id="about" ref={heroRef}>
      {heroBg && (
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: `grayscale(${grayscale}) brightness(${0.45 + (1 - grayscale) * 0.15})`
          }}
        />
      )}
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-eyebrow label">est. 2001 · {siteData.location}</p>
        <h1 className="hero-typed display">
          {displayed}<span className="cursor">|</span>
        </h1>
        {siteData.tagline && (
          <p className="hero-tagline serif">"{siteData.tagline}"</p>
        )}
        <p className="hero-bio">{siteData.bio}</p>
        <div className="hero-btns">
          <a href="#projects" className="btn btn-primary">see my work</a>
          <a href={siteData.cvUrl || "#"} target="_blank" rel="noreferrer" className="btn btn-secondary">
            download cv
          </a>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}