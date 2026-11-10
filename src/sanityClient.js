import { createImageUrlBuilder } from "@sanity/image-url";

/**
 * Tiny Sanity reader.
 *
 * The site only ever READS published content, so instead of the full
 * @sanity/client library (built for editing, live updates, etc. and the
 * biggest part of the old JavaScript download) we call Sanity's public
 * query API directly with fetch. Same data, same CDN, much less to download.
 */
const PROJECT_ID = "lyb8bzsd";
const DATASET = "production";
const API_VERSION = "v2024-01-01";

// apicdn = Sanity's cached copy: faster for visitors and saves API quota
const API = `https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}`;

export const queryUrl = (query) => `${API}?query=${encodeURIComponent(query)}`;

/** Run a GROQ query. Retries a couple of times on flaky mobile data. */
export async function sanityFetch(query, { retries = 2 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(queryUrl(query));
      if (!res.ok) throw new Error(`Sanity ${res.status}`);
      const json = await res.json();
      return json.result;
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
}

/*
 * The site settings query.
 *
 * IMPORTANT: public/index.html asks the browser to start downloading this
 * exact URL straight away (a <link rel="preload">), in parallel with the
 * JavaScript, so the hero has its data sooner. If you change this query,
 * update that link too, or the preload is simply wasted (nothing breaks).
 * You can print the URL with: console.log(queryUrl(SITE_QUERY))
 */
export const SITE_QUERY =
  '*[_type == "siteConfig"][0]{...,heroImage{asset->{url}},photo{asset->{url}},"cvUrl":coalesce(cvFile.asset->url + "?dl=Sumaiya-CV.pdf", cvUrl)}';

// Everything else in ONE request instead of four (fewer round trips on phones)
export const EXTRAS_QUERY =
  '{"photos":*[_type == "photo"] | order(order asc),' +
  '"artworks":*[_type == "artwork"] | order(order asc),' +
  '"projects":*[_type == "project"] | order(order asc){...,previewImage{asset->{url}}},' +
  '"research":*[_type == "research"] | order(order asc)}';

const builder = createImageUrlBuilder({ projectId: PROJECT_ID, dataset: DATASET });

export function urlFor(source) {
  return builder.image(source);
}
