import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { client } from "./sanityClient";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Photography from "./components/Photography";
import Art from "./components/Art";
import Projects from "./components/Projects";
import Research from "./components/Research";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import BackToTop from "./components/BackToTop";
import Currently from "./components/Currently";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function Home({ siteData, photos, artworks, projects, research, loading, error }) {
  if (loading) return (
    <div className="loading-screen">
      <p>Have patience...</p>
    </div>
  );

  if (error) return (
    <div className="loading-screen">
      <p>Unable to load portfolio content.</p>
    </div>
  );

  return (
    <>
      <Cursor />
      <div className="wc-canvas" aria-hidden="true">
        <div className="wc-blob wc-blob-1" />
        <div className="wc-blob wc-blob-2" />
        <div className="wc-blob wc-blob-3" />
        <div className="wc-blob wc-blob-4" />
        <div className="wc-blob wc-blob-5" />
      </div>
      <div className="page-content">
        <Navbar siteData={siteData} />
        <Hero siteData={siteData} />
        <Skills siteData={siteData} />
        <Projects projects={projects} />
        <Research research={research} />
        <Photography photos={photos} />
        <Art artworks={artworks} />
        <Contact siteData={siteData} />
      </div>
      <BackToTop />
      <Currently text={siteData?.currently} />
    </>
  );
}

export default function App() {
  const [siteData, setSiteData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      client.fetch(`*[_type == "siteConfig"][0]{ ..., heroImage{ asset->{ url } }, photo{ asset->{ url } } }`),
      client.fetch(`*[_type == "photo"] | order(order asc)`),
      client.fetch(`*[_type == "artwork"] | order(order asc)`),
      client.fetch(`*[_type == "project"] | order(order asc){ ..., previewImage{ asset->{ url } } }`),
      client.fetch(`*[_type == "research"] | order(order asc)`),
    ]).then(([site, photos, art, projects, research]) => {
      if (cancelled) return;
      setSiteData(site);
      setPhotos(photos);
      setArtworks(art);
      setProjects(projects);
      setResearch(research);
      setError(false);
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setError(true);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Home
            siteData={siteData}
            photos={photos}
            artworks={artworks}
            projects={projects}
            research={research}
            loading={loading}
            error={error}
          />
        } />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}