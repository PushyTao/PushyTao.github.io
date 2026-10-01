import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.resolve(
  fileURLToPath(new URL("../public/", import.meta.url)),
);
const read = (relative) => readFile(path.join(publicDir, relative), "utf8");
const unescape = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
function tags(html) {
  const parsed = [];
  const withoutScripts = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>");
  for (const match of withoutScripts.matchAll(/<([a-z][\w:-]*)\b([^>]*?)>/gi)) {
    const attrs = {};
    for (const attr of match[2].matchAll(
      /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+))/g,
    )) {
      attrs[attr[1].toLowerCase()] = unescape(attr[2] ?? attr[3] ?? attr[4]);
    }
    parsed.push({ name: match[1].toLowerCase(), attrs });
  }
  return parsed;
}
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : path.join(directory, entry.name),
    ),
  );
  return nested.flat();
}
async function outputFor(url) {
  const pathname = decodeURIComponent(url.pathname);
  const target = path.resolve(publicDir, `.${pathname}`);
  assert.ok(
    target === publicDir || target.startsWith(`${publicDir}${path.sep}`),
    `Path escapes output directory: ${url}`,
  );
  const info = await stat(target);
  return info.isDirectory() ? path.join(target, "index.html") : target;
}

test("published routes, search data and feeds are generated, with the original title-only note kept private", async () => {
  for (const file of [
    "index.html",
    "archives/index.html",
    "topics/index.html",
    "about/index.html",
    "404.html",
    "atom.xml",
    "sitemap.xml",
    "js/orbit.js",
    "js/search.js",
    "css/orbit.css",
  ]) {
    assert.ok((await stat(path.join(publicDir, file))).size > 0, file);
  }
  const posts = JSON.parse(await read("search.json"));
  assert.ok(posts.length >= 2, "Expected the two factual starter articles");
  for (const post of posts) {
    assert.ok(post.title && post.url && post.content.length > 30);
    assert.ok(!Number.isNaN(Date.parse(post.date)));
    assert.ok(Array.isArray(post.tags));
    assert.doesNotMatch(
      `${post.title} ${post.url}`,
      /视\s*C\+\+\s*为.*语言联邦|shi-c\+\+-wei-yu-yan-lian-bang/i,
    );
    assert.ok(
      (await stat(await outputFor(new URL(post.url, "https://example.test"))))
        .size > 0,
    );
  }
  const atom = await read("atom.xml");
  assert.equal((atom.match(/<entry>/g) || []).length, posts.length);
  assert.doesNotMatch(atom, /shi-c\+\+-wei-yu-yan-lian-bang/);
  for (const xml of [atom, await read("sitemap.xml")]) {
    assert.ok(xml.startsWith("<?xml"));
    assert.doesNotMatch(xml, /(?:href="|<loc>)(?!https:\/\/)/);
    assert.doesNotMatch(
      xml,
      /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i,
    );
  }
});

test("every generated HTML page has metadata and valid internal href/src destinations, including anchors", async () => {
  const files = (await walk(publicDir)).filter((file) =>
    file.endsWith(".html"),
  );
  assert.ok(
    files.length >= 7,
    "Expected posts, archives, topics, about and taxonomy routes",
  );
  const documents = new Map(
    await Promise.all(
      files.map(async (file) => [file, tags(await readFile(file, "utf8"))]),
    ),
  );
  const home = documents.get(path.join(publicDir, "index.html"));
  const canonical = home.find(
    (tag) => tag.name === "link" && tag.attrs.rel === "canonical",
  )?.attrs.href;
  assert.ok(canonical, "Homepage canonical URL");
  const origin = new URL(canonical).origin;
  const failures = [];
  for (const [file, elements] of documents) {
    const route = path
      .relative(publicDir, file)
      .split(path.sep)
      .join("/")
      .replace(/index\.html$/, "");
    const pageUrl = new URL(route, `${origin}/`);
    assert.ok(
      elements.some(
        (tag) =>
          tag.name === "meta" &&
          tag.attrs.name === "description" &&
          tag.attrs.content,
      ),
      `${route}: description`,
    );
    const canonicalUrl = elements.find(
      (tag) => tag.name === "link" && tag.attrs.rel === "canonical",
    )?.attrs.href;
    assert.ok(
      canonicalUrl?.startsWith(`${origin}/`),
      `${route}: absolute canonical`,
    );
    assert.ok(
      elements.some(
        (tag) => tag.attrs.property === "og:title" && tag.attrs.content,
      ),
      `${route}: Open Graph title`,
    );
    for (const element of elements) {
      for (const attribute of ["href", "src"]) {
        const reference = element.attrs[attribute];
        if (
          !reference ||
          /^(?:data:|mailto:|tel:|javascript:)/i.test(reference)
        )
          continue;
        const url = new URL(reference, pageUrl);
        if (url.origin !== origin) continue;
        try {
          const target = await outputFor(url);
          assert.ok((await stat(target)).isFile());
          if (url.hash && target.endsWith(".html")) {
            const id = decodeURIComponent(url.hash.slice(1));
            if (id && !id.startsWith(":~:text="))
              assert.ok(
                documents
                  .get(target)
                  ?.some((tag) => tag.attrs.id === id || tag.attrs.name === id),
                `missing anchor #${id}`,
              );
          }
        } catch (error) {
          failures.push(
            `${route || "/"}: ${attribute}="${reference}" (${error.message.split("\n")[0]})`,
          );
        }
      }
    }
  }
  const summary = failures.slice(0, 12).join("\n");
  const remaining =
    failures.length > 12
      ? `\n… and ${failures.length - 12} more broken references`
      : "";
  assert.equal(failures.length, 0, `${summary}${remaining}`);
});
