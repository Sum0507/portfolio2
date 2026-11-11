# Jannatun Nur Sumaiya — Portfolio

Personal portfolio of a final-year CSE student at UAP, Dhaka: engineer, artist and photographer.

**Live:** https://portfolio2-gamma-henna.vercel.app

## Built with

- **React 18** (Create React App)
- **Framer Motion** for scroll animations, including the hand-drawn line under the hero that turns from a laptop into a paintbrush into a camera
- **Sanity** as the content manager: photos, artworks, projects, research, skills and bio are all edited in Sanity Studio, no code changes needed
- **EmailJS** for the contact form
- Hosted on **Vercel**
- Fonts: Zolla (titles), Courier Prime (body), Playfair Display italic (accents)

## Sections

About · Skills · Projects · Research · Photography · Art · Contact

## Run it locally

```bash
npm install
npm start        # opens http://localhost:3000
npm run build    # production build into /build
```

## Updating content

Everything on the page comes from Sanity (project `lyb8bzsd`, dataset `production`).
Log in to Sanity Studio, edit or add items, and publish. The site picks the change up on the next page load.

Vercel rebuilds and redeploys automatically on every push to `main`, and makes a preview link for every other branch.

Version 1 is tagged `v1` on GitHub.
