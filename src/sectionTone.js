import { useEffect } from "react";

/**
 * Colour journey (idea borrowed from landonorris.com): the page background
 * slowly changes as you move between sections, so sections melt into each
 * other instead of feeling like separate rooms.
 *
 * Which colour each section gets lives in index.css (html[data-tone=...]).
 * This hook only works out which section is in the middle of the screen
 * and writes its tone onto <html data-tone="...">.
 *
 * The hero ("about") keeps the original near-black, so its
 * grey-to-colour fade looks exactly as before.
 */
const SECTION_TONES = {
  about: "ink",          // hero: unchanged
  skills: "ink",
  projects: "warm",      // a hint of warm brown, like a desk lamp
  research: "warm",
  photography: "darkroom", // deeper black, like a darkroom
  art: "paper",          // the art section turns to sketchbook paper
  contact: "ink",
};

export function useSectionTone(ready) {
  useEffect(() => {
    if (!ready) return undefined;
    const root = document.documentElement;
    const targets = Object.keys(SECTION_TONES)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return undefined;

    // Only a thin band across the middle of the screen counts, so the
    // colour changes when a section is properly in view. Between sections
    // (over a doodle divider) the last colour simply stays.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            root.dataset.tone = SECTION_TONES[entry.target.id] || "ink";
          }
        });
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    targets.forEach((t) => observer.observe(t));

    // The navbar switches to paper colours only while the art section is
    // actually underneath it (a thin band at the top of the screen).
    const art = document.getElementById("art");
    const navObserver = new IntersectionObserver(
      ([entry]) => document.body.classList.toggle("nav-on-paper", entry.isIntersecting),
      { rootMargin: "0px 0px -92% 0px" }
    );
    if (art) navObserver.observe(art);

    return () => {
      observer.disconnect();
      navObserver.disconnect();
      document.body.classList.remove("nav-on-paper");
      delete root.dataset.tone;
    };
  }, [ready]);
}
