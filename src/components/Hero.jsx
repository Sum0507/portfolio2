import { useState, useEffect } from "react";
import { siteConfig } from "../data/content";
import "./Hero.css";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setRoleIndex(i => (i + 1) % siteConfig.roles.length);
        setFading(false);
      }, 380);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero section" id="about">
      <div className="section-inner hero-inner">

        {/* LEFT — text */}
        <div className="hero-text">
          <p className="label hero-eyebrow">est. 2001 · dhaka, bangladesh</p>

          <h1 className="hero-name display">
            <span className="hero-name-first">Jannatun</span>
            <span className="hero-name-last">Nur<span className="hero-dot">.</span></span>
          </h1>

          <div className="hero-role-row">
            <span className="hero-role-prefix">a </span>
            <span className={`hero-role ${fading ? "fade-out" : "fade-in"}`}>
              {siteConfig.roles[roleIndex]}
            </span>
          </div>

          <p className="hero-tagline serif">"{siteConfig.tagline}"</p>

          <p className="hero-bio">{siteConfig.bio}</p>

          <div className="hero-btns">
            <a href="#photography" className="btn btn-primary">see my work</a>
            <a href={siteConfig.cvUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
              download cv
            </a>
          </div>
        </div>

        {/* RIGHT — polaroid beside name */}
        <div className="hero-visual">
          <div className="hero-polaroid polaroid">
            <div className="tape tape-r" />
            <div className="polaroid-img">
              {/* Replace src below with "/images/me.jpg" once you add your photo */}
              <div className="polaroid-placeholder">
                <span>your photo</span>
                <small>add to /public/images/me.jpg<br/>then swap the div for an img tag</small>
              </div>
            </div>
            <p className="polaroid-caption">that's me!</p>
          </div>

          <div className="hero-stamp">
            <p>UAP</p><p>CSE</p><p>2026</p>
          </div>
        </div>

      </div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
