import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { client } from "./sanityClient";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Photography from "./components/Photography";
import Art from "./components/Art";
import Projects from "./components/Projects";
import Research from "./components/Research";
import Contact from "./components/Contact";
import Admin from "./pages/Admin";

function Home({ theme, toggleTheme, siteData, photos, artworks, projects, research }) {
  return (
    <>
      <div className="wc-canvas" aria-hidden="true">
        <div className="wc-blob wc-blob-1" />
        <div className="wc-blob wc-blob-2" />
        <div className="wc-blob wc-blob-3" />
        <div className="wc-blob wc-blob-4" />
        <div className="wc-blob wc-blob-5" />
      </div>
      <div className="page-content">
        <Navbar theme={theme} toggleTheme={toggleTheme} siteData={siteData} />
        <Hero siteData={siteData} />
        <Projects projects={projects} />
        <Research research={research} />
        <Photography photos={photos} />
        <Art artworks={artworks} />
        <Contact siteData={siteData} />
      </div>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [siteData, setSiteData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    Promise.all([
      client.fetch(`*[_type == "siteConfig"][0]`),
      client.fetch(`*[_type == "photo"] | order(order asc)`),
      client.fetch(`*[_type == "artwork"] | order(order asc)`),
      client.fetch(`*[_type == "project"] | order(order asc)`),
      client.fetch(`*[_type == "research"] | order(order asc)`),
    ]).then(([site, photos, art, projects, research]) => {
      setSiteData(site);
      setPhotos(photos);
      setArtworks(art);
      setProjects(projects);
      setResearch(research);
      setLoading(false);
    });
  }, []);

  function toggleTheme() {
    setTheme(t => t === "light" ? "dark" : "light");
  }

  if (loading) return (
    <div className="loading-screen">
      <p>loading...</p>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Home
            theme={theme}
            toggleTheme={toggleTheme}
            siteData={siteData}
            photos={photos}
            artworks={artworks}
            projects={projects}
            research={research}
          />
        } />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}