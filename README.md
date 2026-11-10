# Jannatun Nur Sumaiya — Portfolio

Personal portfolio of a final-year CSE student at UAP, Dhaka: engineer, artist and photographer.

**Live:** https://portfolio2-gamma-henna.vercel.app

## Built with

- **React 18** (Create React App) with **React Router**
- **Framer Motion** for scroll and page animations
- **Sanity** as the content manager: photos, artworks, projects, research, skills and bio are all edited in Sanity Studio, no code changes needed
- **EmailJS** for the contact form
- Hosted on **Vercel**

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

Vercel rebuilds and redeploys automatically on every push to `main`.
