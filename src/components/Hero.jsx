import { useState, useEffect } from "react";
import { urlFor } from "../sanityClient";
import "./Hero.css";

export default function Hero({ siteData }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const roles = siteData?.roles || ["engineer", "artist", "photographer"];

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setRoleIndex(i => (i + 1) % roles.length);
        setFading(false);
      }, 380);
    }, 2400);
    return () => clearInterval(interval);
  }, [roles.length]);

  if (!siteData) return null;

  return (
    <section className="hero section" id="about">
      <div className="section-inner hero-inner">

        <div className="hero-text">
          <p className="label hero-eyebrow">est. 2001 · {siteData.location}</p>

          <h1 className="hero-name display">
            <span className="hero-name-first">{siteData.name}</span>
            <span className="hero-name-last">Nur<span className="hero-dot">.</span></span>
          </h1>

          <div className="hero-role-row">
            <span className={`hero-role ${fading ? "fade-out" : "fade-in"}`}>
              {roles[roleIndex]}
            </span>
          </div>

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

        <div className="hero-visual">
          <div className="hero-polaroid polaroid">
            <div className="tape tape-r" />
            <div className="polaroid-img">
              {siteData.photo
                ? <img src={urlFor(siteData.photo).width(400).url()} alt={siteData.name} />
                : (
                  <div className="polaroid-placeholder">
                    <span>your photo</span>
                    <small>add in Sanity Studio → Site Config</small>
                  </div>
                )
              }
            </div>
            <p className="polaroid-caption">that's me!</p>
          </div>

          <div className="hero-stamp">
            <p>UAP</p><p>CSE</p><p>2026</p>
          </div>
        </div>

      </div>

      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}