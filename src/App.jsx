import { useState, useEffect, lazy, Suspense } from "react";
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
import ThreadLine from "./components/ThreadLine";
import DoodleDivider from "./components/Doodledivider";

// These pages are only needed when someone visits them, so they are
// downloaded on demand instead of being part of the main bundle.
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Home({ siteData, photos, artworks, projects, research, loading, error, extrasReady }) {
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
      <ThreadLine ready={extrasReady} />
      <div className="page-content">
        <Navbar siteData={siteData} />
        <Hero siteData={siteData} />
        <DoodleDivider variant="wave" />
        <Skills siteData={siteData} />
        <DoodleDivider variant="loop" flip />

        {/* These sections appear as soon as their data arrives, so the
            hero and skills are not held up waiting for photos and art. */}
        {extrasReady ? (
          <>
            <Projects projects={projects} />
            <DoodleDivider variant="swoosh" />
            <Research research={research} />
            <DoodleDivider variant="spiral" flip />
            <Photography photos={photos} />
            <Art artworks={artworks} />
          </>
        ) : (
          <div aria-hidden="true" style={{ minHeight: "100vh" }} />
        )}

        <DoodleDivider variant="stars" />
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
  const [extrasReady, setExtrasReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 1) Site settings: the page can show as soon as this arrives
    client.fetch(`*[_type == "siteConfig"][0]{
      ...,
      heroImage{ asset->{ url } },
      photo{ asset->{ url } },
      "cvUrl": coalesce(cvFile.asset->url + "?dl=Sumaiya-CV.pdf", cvUrl)
    }`).then((site) => {
      if (cancelled) return;
      setSiteData(site);
      setError(false);
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setError(true);
      setLoading(false);
    });

    // 2) Everything else loads at the same time and fills in when ready
    Promise.all([
      client.fetch(`*[_type == "photo"] | order(order asc)`),
      client.fetch(`*[_type == "artwork"] | order(order asc)`),
      client.fetch(`*[_type == "project"] | order(order asc){ ..., previewImage{ asset->{ url } } }`),
      client.fetch(`*[_type == "research"] | order(order asc)`),
    ]).then(([photos, art, projects, research]) => {
      if (cancelled) return;
      setPhotos(photos);
      setArtworks(art);
      setProjects(projects);
      setResearch(research);
      setExtrasReady(true);
    }).catch(() => {
      if (cancelled) return;
      setExtrasReady(true); // show the page without these sections
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
              extrasReady={extrasReady}
            />
          } />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}