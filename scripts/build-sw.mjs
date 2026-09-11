import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const buildId = (await readFile(".next/BUILD_ID", "utf8")).trim();
const assets = [
  ...(await files(".next/static")).filter(path => !path.endsWith(".map")).map(path => "/_next/" + path.replaceAll("\\", "/").slice(".next/".length)),
  ...(await files("public/icons")).map(path => "/" + path.replaceAll("\\", "/").slice("public/".length)),
  ...(await files("public/pdfjs")).map(path => "/" + path.replaceAll("\\", "/").slice("public/".length)),
  "/logo-mark.svg", "/manifest.webmanifest", "/offline.html",
];
const routes = ["/", "/login", "/signup", "/forgot-password", "/dashboard", "/materials", "/upload", "/review", "/flashcards", "/self-test", "/quiz", "/progress", "/settings", "/privacy", "/cookies", "/terms"];
const template = await readFile("scripts/service-worker.template.js", "utf8");
await writeFile("public/sw.js", template.replace("__CACHE_NAME__", JSON.stringify(`lernzi-pwa-${buildId}`)).replace("__PRECACHE__", JSON.stringify([...assets, ...routes])));
console.log(`Prepared offline app: ${assets.length} assets and ${routes.length} routes.`);
