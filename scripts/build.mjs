import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as minifyJs } from "terser";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "dist");
const rootsToCopy = ["assets", "components", "css", "js"];
const rootFiles = [
  "index.html",
  "carta.html",
  "promociones.html",
  "pedido.html",
  "contacto.html",
  "locales.html",
  "nosotros.html",
  "offline.html",
  "site.webmanifest",
  "sw.js"
];

async function copyDirectory(from, to) {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(source, target);
    } else {
      await writeFile(target, await readFile(source));
    }
  }
}

async function listFiles(directory) {
  const result = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push(...(await listFiles(fullPath)));
    } else {
      result.push(fullPath);
    }
  }

  return result;
}

async function minifyFile(file) {
  const extension = path.extname(file).toLowerCase();
  const source = await readFile(file, "utf8");

  if (extension === ".html") {
    const output = await minifyHtml(source, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      removeRedundantAttributes: false
    });
    await writeFile(file, output, "utf8");
    return;
  }

  if (extension === ".css") {
    const output = new CleanCSS({ level: 2 }).minify(source);
    if (output.errors.length) {
      throw new Error(`CSS minification failed for ${file}: ${output.errors.join(", ")}`);
    }
    await writeFile(file, output.styles, "utf8");
    return;
  }

  if (extension === ".js") {
    const output = await minifyJs(source, {
      compress: true,
      mangle: false,
      format: { comments: false }
    });
    await writeFile(file, output.code || source, "utf8");
  }
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const directory of rootsToCopy) {
  await copyDirectory(path.join(rootDir, directory), path.join(outDir, directory));
}

for (const file of rootFiles) {
  const source = path.join(rootDir, file);
  if ((await stat(source).catch(() => null))?.isFile()) {
    await writeFile(path.join(outDir, file), await readFile(source));
  }
}

const files = await listFiles(outDir);
await Promise.all(files.filter((file) => /\.(html|css|js)$/i.test(file)).map(minifyFile));

console.log(`Build listo en ${path.relative(rootDir, outDir)}`);
