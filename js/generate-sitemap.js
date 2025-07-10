const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const baseUrl = "https://codingcluboesiitg.vercel.app"; // Your domain
const rootDir = path.resolve(__dirname, "..");

function walkDir(dir, callback) {
  try {
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
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
}

function getRoute(filepath) {
  let relative = path.relative(rootDir, filepath).replace(/\\/g, "/");
  
  // Handle index.html files
  if (relative.endsWith("index.html")) {
    relative = relative.replace(/index\.html$/, "");
    return relative === "" ? "/" : "/" + relative;
  }
  
  // Handle other HTML files
  return "/" + relative;
}

function getPriority(route) {
  if (route === "/") return "1.0";
  if (route === "/404.html") return "0.1";
  return "0.8";
}

function getChangeFreq(route) {
  if (route === "/") return "weekly";
  if (route === "/404.html") return "yearly";
  return "monthly";
}

function getGitLastModifiedDate(filepath) {
  try {
    const output = execSync(`git log -1 --format="%ad" --date=short -- "${filepath}"`, {
      cwd: rootDir
    }).toString().trim();
    return output || new Date().toISOString().split("T")[0]; // fallback to today
  } catch (err) {
    console.warn(`Warning: Could not get Git date for ${filepath}, using current date`);
    return new Date().toISOString().split("T")[0]; // fallback on error
  }
}

const urls = [];
walkDir(rootDir, (filePath) => {
  const route = getRoute(filePath);
  const lastmod = getGitLastModifiedDate(filePath);
  const priority = getPriority(route);
  const changefreq = getChangeFreq(route);
  
  urls.push({ route, lastmod, priority, changefreq });
});

// Sort by priority (home page first, then other pages, 404 last)
urls.sort((a, b) => {
  if (a.route === "/") return -1;
  if (b.route === "/") return 1;
  if (a.route === "/404.html") return 1;
  if (b.route === "/404.html") return -1;
  return a.route.localeCompare(b.route);
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ route, lastmod, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>`;

try {
  fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemap);
  console.log("✅ sitemap.xml generated successfully!");
  console.log(`📄 Found ${urls.length} pages:`);
  urls.forEach(({ route }) => console.log(`   - ${route}`));
} catch (err) {
  console.error("❌ Error writing sitemap.xml:", err.message);
  process.exit(1);
}