import { useState } from "react";
import "./Admin.css";

const ADMIN_PASSWORD = "sumaiya2025"; // ← change this

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("photos");
  const [notice, setNotice] = useState("");

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [projTitle, setProjTitle] = useState("");
  const [projStack, setProjStack] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projLive, setProjLive] = useState("");
  const [projYear, setProjYear] = useState("2025");

  function login() {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setErr(""); }
    else setErr("wrong password.");
  }

  function notify(msg) { setNotice(msg); setTimeout(() => setNotice(""), 5000); }

  if (!authed) return (
    <div className="a-login">
      <div className="a-login-card">
        <h1>admin</h1>
        <p>sumaiya's portfolio</p>
        <input type="password" placeholder="password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} />
        {err && <p className="a-err">{err}</p>}
        <button onClick={login}>enter →</button>
      </div>
    </div>
  );

  return (
    <div className="a-panel">
      <div className="a-header">
        <h1>admin</h1>
        <span className="a-sub">sumaiya's portfolio · content manager</span>
        <a href="/" className="a-back">← back to site</a>
      </div>

      {notice && <div className="a-notice"><pre>{notice}</pre></div>}

      <div className="a-tabs">
        {["photos","art","projects","help"].map(t => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="a-body">
        {(tab === "photos" || tab === "art") && (
          <div>
            <h2>add {tab === "photos" ? "a photo" : "an artwork"}</h2>
            <p className="a-note">Fill in details, hit submit, follow the instructions to add to your site.</p>
            <div className="a-form">
              <label>file<input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} /></label>
              <label>caption<input type="text" placeholder={tab === "photos" ? "old dhaka, 2025" : "mixed media, 2025"} value={caption} onChange={e => setCaption(e.target.value)} /></label>
              <label>rotation (e.g. -2 or 1.5)<input type="number" step="0.5" min="-5" max="5" value={rotation} onChange={e => setRotation(e.target.value)} /></label>
              <button onClick={() => {
                if (!file || !caption) return notify("please fill in all fields.");
                const folder = tab === "photos" ? "photos" : "art";
                const arr    = tab === "photos" ? "photos" : "artworks";
                notify(`✓ Done! Here's what to do:\n\n1. Copy your file to /public/${folder}/${file.name}\n2. Open src/data/content.js\n3. Add to the ${arr} array:\n\n{\n  id: ${Date.now()},\n  src: "/${folder}/${file.name}",\n  caption: "${caption}",\n  rotation: ${rotation},\n  tape: "tape-r",\n},\n\n4. Save and redeploy.`);
                setCaption(""); setFile(null); setRotation(0);
              }}>generate instructions →</button>
            </div>
          </div>
        )}

        {tab === "projects" && (
          <div>
            <h2>add a project</h2>
            <div className="a-form">
              <label>title<input type="text" value={projTitle} onChange={e => setProjTitle(e.target.value)} /></label>
              <label>stack<input type="text" placeholder="React · Node.js" value={projStack} onChange={e => setProjStack(e.target.value)} /></label>
              <label>description<textarea rows={3} value={projDesc} onChange={e => setProjDesc(e.target.value)} /></label>
              <label>github url<input type="url" value={projGithub} onChange={e => setProjGithub(e.target.value)} /></label>
              <label>live url<input type="url" value={projLive} onChange={e => setProjLive(e.target.value)} /></label>
              <label>year<input type="text" value={projYear} onChange={e => setProjYear(e.target.value)} /></label>
              <button onClick={() => {
                if (!projTitle || !projDesc) return notify("title and description required.");
                notify(`✓ Paste this into the projects array in src/data/content.js:\n\n{\n  id: ${Date.now()},\n  title: "${projTitle}",\n  year: "${projYear}",\n  stack: "${projStack}",\n  description: "${projDesc}",\n  github: "${projGithub}",\n  live: "${projLive}",\n},`);
              }}>generate snippet →</button>
            </div>
          </div>
        )}

        {tab === "help" && (
          <div className="a-help">
            <h2>how to update & deploy</h2>
            {[
              ["01","Fill in your info","Open src/data/content.js — change your email, GitHub, Instagram, tagline. Everything is there."],
              ["02","Add your photo","Put me.jpg in /public/images/. Then in Hero.jsx, swap the placeholder div for: <img src='/images/me.jpg' alt='Sumaiya' />"],
              ["03","Add photos & art","Put images in /public/photos/ and /public/art/. Update the src fields in content.js."],
              ["04","Deploy on Vercel","Push to GitHub → vercel.com → Import repo → Deploy. Free. Auto-deploys on every push."],
              ["05","Change the password","Open src/pages/Admin.jsx, change ADMIN_PASSWORD at the top."],
              ["06","Add Zolla font","Download Zolla from dafont.com. Put the .woff2 and .woff files in /public/fonts/. Done — it loads automatically."],
            ].map(([n, title, desc]) => (
              <div key={n} className="a-step">
                <span className="a-step-n">{n}</span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
