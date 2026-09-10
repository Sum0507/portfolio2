import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Photography from "./components/Photography";
import Art from "./components/Art";
import Projects from "./components/Projects";
import Research from "./components/Research";
import Contact from "./components/Contact";
import Admin from "./pages/Admin";

function Home({ theme, toggleTheme }) {
  return (
    <>
      {/* Fixed watercolour blobs behind everything */}
      <div className="wc-canvas" aria-hidden="true">
        <div className="wc-blob wc-blob-1" />
        <div className="wc-blob wc-blob-2" />
        <div className="wc-blob wc-blob-3" />
        <div className="wc-blob wc-blob-4" />
        <div className="wc-blob wc-blob-5" />
      </div>

      <div className="page-content">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Hero />
        <Projects />
        <Research />
        <Photography />
        <Art />
        <Contact />
      </div>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === "light" ? "dark" : "light");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
