import { useState, useEffect } from "react";
import "./Currently.css";

// Pulls a leading emoji (like 🎓) out of the text so the phone chip can show it
function leadingEmoji(text) {
  const match = text.match(/^\p{Extended_Pictographic}/u);
  return match ? match[0] : null;
}

/**
 * "Currently ..." status pill.
 * Desktop: the full pill, always visible.
 * Phones: a small chip (dot + emoji). Tap it to read the full text; it
 * closes again by itself after a few seconds or on the next tap.
 */
export default function Currently({ text }) {
  const [open, setOpen] = useState(false);

  // Auto-close after 5 seconds
  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => setOpen(false), 5000);
    return () => clearTimeout(t);
  }, [open]);

  if (!text) return null;

  const emoji = leadingEmoji(text);
  const body = emoji ? text.slice(emoji.length).trim() : text;

  return (
    <button
      type="button"
      className={`currently${open ? " currently--open" : ""}`}
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-label={`Currently: ${text}`}
    >
      <span className="currently__dot" aria-hidden="true" />
      <span className="currently__label">currently</span>
      {emoji && <span className="currently__emoji" aria-hidden="true">{emoji}</span>}
      <span className="currently__text">{body}</span>
    </button>
  );
}