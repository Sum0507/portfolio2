import { useState, useEffect, lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { sanityFetch, SITE_QUERY, EXTRAS_QUERY } from "./sanityClient";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Gallery from "./components/Gallery";
import Projects from "./components/Projects";
import Research from "./components/Research";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import BackToTop from "./components/BackToTop";
import Currently from "./components/Currently";
import ThreadLine from "./components/ThreadLine";
import DoodleDivider from "./components/Doodledivider";

// (sanityFetch retries failed requests a couple of times by itself.)
// Used if Sanity can't be reached, so visitors still see who this is
// and how to get in touch instead of an empty error screen.
const FALLBACK_SITE = {
  name: "Sumaiya",
  roles: ["I'm Sumaiya."],
  bio: "Final-year CSE student at UAP. Engineer, artist, photographer.",
  github: "https://github.com/Sum0507",
  instagram: "https://www.instagram.com/sum_plus_equal_1/",
  email: "jsumaiya290@gmail.com",
};

// These pages are only needed when someone visits them, so they are
// downloaded on demand instead of being part of the main bundle.
const NotFound = lazy(() => import("./pages/NotFound"));

function Home({ siteData, photos, artworks, projects, research, loading, extrasReady }) {
  if (loading) return (
    <div className="loading-screen" role="status">
      <p>Have patience...</p>
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
            <Gallery items={photos} variant="photo" />
            <Gallery items={artworks} variant="art" />
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

// "/" (and "/index.html") is the portfolio; every other path shows the 404
const isHomePath =
  typeof window === "undefined" || ["/", "/index.html"].includes(window.location.pathname.replace(/\/+$/, "/"));

export default function App() {
  const [siteData, setSiteData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extrasReady, setExtrasReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 1) Site settings: the page can show as soon as this arrives
    // (index.html already started downloading this, so it is usually instant)
    sanityFetch(SITE_QUERY).then((site) => {
      if (cancelled) return;
      setSiteData(site || FALLBACK_SITE);
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setSiteData(FALLBACK_SITE);
      setLoading(false);
    });

    // 2) Everything else loads at the same time and fills in when ready
    //    (one request for all four instead of four separate ones)
    sanityFetch(EXTRAS_QUERY).then((extras) => {
      if (cancelled) return;
      setPhotos(extras?.photos || []);
      setArtworks(extras?.artworks || []);
      setProjects(extras?.projects || []);
      setResearch(extras?.research || []);
      setExtrasReady(true);
    }).catch(() => {
      if (cancelled) return;
      setExtrasReady(true); // show the page without these sections
    });

    return () => { cancelled = true; };
  }, []);

  return (
    // reducedMotion="user": every framer animation respects the visitor's
    // "reduce motion" device setting automatically
    <MotionConfig reducedMotion="user">
      <Suspense fallback={null}>
        {/* The site has just two pages, so a simple check replaces the
            router library: "/" is the portfolio, anything else is the 404. */}
        {isHomePath ? (
            <Home
              siteData={siteData}
              photos={photos}
              artworks={artworks}
              projects={projects}
              research={research}
              loading={loading}
              extrasReady={extrasReady}
            />
        ) : (
          <NotFound />
        )}
      </Suspense>
    </MotionConfig>
  );
}