import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const clientDir = resolve(root, "dist/client");
const outputDir = resolve(root, "dist/static");
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "";
const basePath = repositoryName ? `/${repositoryName}` : "";
const publicHost = process.env.GITHUB_REPOSITORY_OWNER && repositoryName
  ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io`
  : "http://localhost:3000";
const publicOrigin = `${publicHost}${basePath}`;

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("static-export", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Static render failed with HTTP ${response.status}`);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true });

const withBasePath = (source) => source
  .replaceAll("http://localhost:3000/assets/", `${publicHost}/assets/`)
  .replaceAll("http://localhost:3000/og.png", `${publicHost}/og.png`)
  .replaceAll("http://localhost:3000", publicOrigin)
  .replaceAll("/assets/", `${basePath}/assets/`)
  .replaceAll("/og.png", `${basePath}/og.png`);

const html = withBasePath(await response.text());
await writeFile(resolve(outputDir, "index.html"), html);
await writeFile(resolve(outputDir, "404.html"), html);
await writeFile(resolve(outputDir, ".nojekyll"), "");

const assetDir = resolve(outputDir, "assets");
for (const entry of await readdir(assetDir, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.(?:css|js)$/.test(entry.name)) continue;
  const assetPath = resolve(entry.parentPath, entry.name);
  const source = await readFile(assetPath, "utf8");
  await writeFile(assetPath, withBasePath(source));
}

console.log(`Exported ${basename(root)} to ${outputDir} with base path ${basePath || "/"}.`);
