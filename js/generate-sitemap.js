const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const baseUrl = "https://codingcluboesiitg.vercel.app"; // Your domain
const rootDir = path.resolve(__dirname, "..");

function walkDir(dir, callback) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const filepath = path.join(dir, item);
    const stat = fs.statSync(filepath);

    const isHidden = filepath.includes("node_modules") || filepath.includes(".git") || filepath.includes(".github") || filepath.includes("js");
    if (isHidden) continue;

    if (stat.isDirectory()) {
      walkDir(filepath, callback);
    } else if (filepath.endsWith(".html")) {
      callback(filepath);
    }
  }
}

function getRoute(filepath) {
  let relative = path.relative(rootDir, filepath).replace(/\\/g, "/");
  relative = relative.replace(/index\.html$/, "").replace(/\/$/, "");
  return relative === "" ? "/" : "/" + relative;
}

function getGitLastModifiedDate(filepath) {
  try {
    const output = execSync(`git log -1 --format="%ad" --date=short -- "${filepath}"`, {
      cwd: rootDir
    }).toString().trim();
    return output || new Date().toISOString().split("T")[0]; // fallback to today
  } catch (err) {
    return new Date().toISOString().split("T")[0]; // fallback on error
  }
}

const urls = [];
walkDir(rootDir, (filePath) => {
  const route = getRoute(filePath);
  const lastmod = getGitLastModifiedDate(filePath);
  urls.push({ route, lastmod });
});

urls.sort((a, b) => a.route.split("/").length - b.route.split("/").length);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ route, lastmod }) => `  <url>
    <loc>${baseUrl}${route === "/" ? "/" : route + "/"}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemap);
console.log("✅ sitemap.xml generated using Git commit dates.");