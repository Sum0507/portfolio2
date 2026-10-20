import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import "./BackToTop.css";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      className={`back-to-top ${visible ? "show" : ""}`}
      onClick={scrollUp}
      aria-label="Back to top"
    >
      <FiArrowUp />
    </button>
  );
}