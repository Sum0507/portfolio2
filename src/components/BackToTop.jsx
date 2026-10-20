import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import "./BackToTop.css";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 400;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      setVisible(scrolled && !nearBottom);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button className={`back-to-top ${visible ? "show" : ""}`} onClick={scrollUp} aria-label="Back to top">
      <FiArrowUp />
    </button>
  );
}