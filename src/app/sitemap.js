export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes = ["/", "/akcijas", "/jaunumi", "/par-mums", "/kontakti"]; // add more as needed
  return routes.map((path) => ({ url: base + path, lastModified: new Date().toISOString() }));
}
