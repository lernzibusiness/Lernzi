import { cp, mkdir, readFile } from "node:fs/promises";

// Serve the matching worker and fonts locally; PDF contents never leave the device.
const source = new URL("../node_modules/pdfjs-dist/", import.meta.url);
const { version } = JSON.parse(await readFile(new URL("package.json", source), "utf8"));
const target = new URL(`../public/pdfjs/${version}/`, import.meta.url);
await mkdir(target, { recursive: true });
await cp(new URL("legacy/build/pdf.worker.min.mjs", source), new URL("pdf.worker.min.mjs", target));
for (const directory of ["cmaps", "standard_fonts", "wasm"]) {
  await cp(new URL(directory, source), new URL(directory, target), { recursive: true });
}
