"use strict";

const items = (collection) => (collection?.toArray ? collection.toArray() : []);
const date = (value) => {
  const parsed = new Date(value?.toISOString ? value.toISOString() : value);
  return Number.isNaN(parsed.getTime())
    ? "1970-01-01T00:00:00.000Z"
    : parsed.toISOString();
};
const xml = (value) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function plainText(html) {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    hellip: "…",
    copy: "©",
  };
  return String(html || "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(
      /<\/?(?:address|article|aside|blockquote|br|div|dl|dt|dd|figure|figcaption|h[1-6]|hr|li|ol|p|pre|section|table|tr|td|th|ul)\b[^>]*>/gi,
      " ",
    )
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name) => {
      if (name[0] !== "#") return entities[name.toLowerCase()] ?? entity;
      const point =
        name[1].toLowerCase() === "x"
          ? parseInt(name.slice(2), 16)
          : parseInt(name.slice(1), 10);
      return point > 0 &&
        point <= 0x10ffff &&
        !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point)
        : "";
    })
    .replace(/\s+/g, " ")
    .trim();
}

hexo.extend.generator.register("orbit-data", function (locals) {
  const config = hexo.config;
  const base = new URL(config.root || "/", `${config.url.replace(/\/$/, "")}/`);
  const absolute = (path) =>
    new URL(
      String(path || "")
        .replace(/^\//, "")
        .replace(/index\.html$/, ""),
      base,
    ).href;
  const posts = items(locals.posts)
    .filter(
      (post) =>
        post.published !== false &&
        !/(^|[\\/])_drafts[\\/]/.test(post.source || ""),
    )
    .sort((a, b) => date(b.date).localeCompare(date(a.date)));
  const search = posts.map((post) => ({
    title: post.title,
    url: new URL(absolute(post.path)).pathname,
    date: date(post.date),
    category: items(post.categories)
      .map((category) => category.name)
      .join(" / "),
    tags: items(post.tags).map((tag) => tag.name),
    content: plainText(post.content),
  }));
  const latest =
    posts
      .map((post) => date(post.updated || post.date))
      .sort()
      .at(-1) || date(config.updated || config.date);
  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>${xml(config.title)}</title><subtitle>${xml(config.description)}</subtitle>
<id>${xml(base.href)}</id><link href="${xml(base.href)}"/><link rel="self" href="${xml(absolute("atom.xml"))}"/>
<updated>${latest}</updated><author><name>${xml(config.author || config.title)}</name></author>
${posts.map((post, index) => `<entry><title>${xml(post.title)}</title><id>${xml(absolute(post.path))}</id><link href="${xml(absolute(post.path))}"/><published>${date(post.date)}</published><updated>${date(post.updated || post.date)}</updated><summary type="text">${xml(search[index].content.slice(0, 280))}</summary></entry>`).join("\n")}
</feed>`;
  const routes = new Map([
    [base.href, latest],
    [absolute("archives/"), latest],
  ]);
  for (const page of [
    ...posts,
    ...items(locals.pages),
    ...items(locals.categories),
    ...items(locals.tags),
  ]) {
    if (
      page.published === false ||
      /(^|\/)404(?:\.html|\/)/.test(page.path || "")
    )
      continue;
    routes.set(
      absolute(page.path),
      page.updated || page.date ? date(page.updated || page.date) : latest,
    );
  }
  const sitemap = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...routes].map(([url, updated]) => `<url><loc>${xml(url)}</loc><lastmod>${updated}</lastmod></url>`).join("\n")}
</urlset>`;
  return [
    { path: "search.json", data: JSON.stringify(search) },
    { path: "atom.xml", data: atom },
    { path: "sitemap.xml", data: sitemap },
  ];
});
