// ============================================================
// SUMAIYA'S PORTFOLIO CONTENT
// Edit this file to update your portfolio without touching code
// ============================================================

export const siteConfig = {
  name: "Sumaiya",
  fullName: "Jannatun Nur Sumaiya",
  tagline: "To love and be loved.",
  bio: "Final-year CSE student at UAP. I build things on the web, photograph streets, make art when deadlines allow, and obsess over things that are both technical and beautiful.",
  email: "jsumaiya290@gmail.com",           // ← change this
  github: "https://github.com/yourusername",    // ← change this
  linkedin: "https://linkedin.com/in/yourusername", // ← change this
  instagram: "https://instagram.com/yourusername",  // ← change this
  cvUrl: "/cv.pdf",
  roles: [
    "cse student",
    "street photographer",
    "artist",
    "researcher",
    "full-stack engineer",
    "dreamer",
  ],
};

export const photos = [
  { id: 1, src: "", caption: "old dhaka, 2024",     rotation: -2,   tape: "tape-r" },
  { id: 2, src: "", caption: "street scene, 2025",  rotation: 1.5,  tape: "tape-t" },
  { id: 3, src: "", caption: "untitled, 2025",       rotation: -1,   tape: "tape-p" },
  { id: 4, src: "", caption: "rickshaw light, 2024", rotation: 2,    tape: "tape-r" },
  { id: 5, src: "", caption: "rain, 2025",           rotation: -1.5, tape: "tape-t" },
  { id: 6, src: "", caption: "faces, 2024",          rotation: 1,    tape: "tape-p" },
];

export const artworks = [
  { id: 1, src: "", caption: "mixed media, 2024",    rotation: -1,   tape: "tape-r" },
  { id: 2, src: "", caption: "digital collage, 2025",rotation: 2,    tape: "tape-p" },
  { id: 3, src: "", caption: "sketchbook, 2024",     rotation: -0.5, tape: "tape-t" },
];

export const projects = [
  {
    id: 1, title: "Who's Free", year: "2024",
    stack: "Django · WebSocket · Django Channels",
    description: "Real-time social event platform for coordinating hangouts. Built with live updates so you actually know who's free.",
    github: "https://github.com/BivasNandan/Who-s-Free", live: "",
  },
  {
    id: 2, title: "Print Park", year: "2024",
    stack: "React · Node.js · MongoDB",
    description: "E-commerce and portfolio site built during a one-month internship. Full product catalog, cart, and admin flow.",
    github: "https://github.com/asif851/Print-Park-Website", live: "",
  },
  {
    id: 3, title: "Shot Stopper", year: "2025",
    stack: "React · Canvas API",
    description: "Endless goalkeeper browser game. Built as a portfolio piece — actually kind of addictive.",
    github: "", live: "",
  },
];

export const research = [
  {
    id: 1,
    title: "Sentiment Analysis Using Deep Learning",
    venue: "IEEE SPICSCON 2026",
    tags: ["NLP", "Deep Learning", "ML"],
    status: "under review",
    coauthors: "with Sejon Hossain",
    year: "2026",
  },
  {
    id: 2,
    title: "Bangla Idiom & Proverb Understanding Dataset",
    venue: "Ongoing",
    tags: ["NLP", "LLM Evaluation", "Bangla"],
    status: "in progress",
    coauthors: "",
    year: "2026",
  },
];

export const skills = [
  { label: "React.js",           group: "frontend" },
  { label: "Node.js",            group: "backend"  },
  { label: "Django",             group: "backend"  },
  { label: "MongoDB",            group: "backend"  },
  { label: "WebSocket",          group: "backend"  },
  { label: "Express.js",         group: "backend"  },
  { label: "Python",             group: "backend"  },
  { label: "Git",                group: "tools"    },
  { label: "Vercel",             group: "tools"    },
  { label: "LaTeX",              group: "tools"    },
  { label: "Street Photography", group: "art"      },
  { label: "Digital Art",        group: "art"      },
  { label: "Collage",            group: "art"      },
];
