import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const registered = new Map();
const source = await readFile(
  new URL("../themes/orbit/scripts/generators.js", import.meta.url),
  "utf8",
);
const config = {
  url: "https://example.com",
  root: "/",
  title: "Orbit & notes",
  description: "Build <things>",
  author: "Tao & friends",
};
vm.runInNewContext(source, {
  URL,
  hexo: {
    config,
    extend: { generator: { register: (name, fn) => registered.set(name, fn) } },
  },
});
const collection = (values) => ({ toArray: () => values });
const locals = {
  posts: collection([
    {
      title: "C++ & <code>",
      path: "2026/10/01/cpp/",
      source: "_posts/cpp.md",
      date: new Date("2026-10-01T02:00:00Z"),
      updated: new Date("2026-10-02T02:00:00Z"),
      content:
        "<h2>Header &amp; title</h2><p>All &#x1F680; <strong>body</strong> &lt;text&gt;.</p><script>secret()</script><style>.hidden{}</style>",
      tags: collection([{ name: "C++" }]),
      categories: collection([{ name: "开发" }]),
    },
    {
      title: "Unpublished",
      path: "unpublished/",
      source: "_posts/unpublished.md",
      published: false,
      date: new Date("2026-09-01"),
      content: "<p>hidden</p>",
      tags: collection([]),
      categories: collection([]),
    },
    {
      title: "Original empty C++",
      path: "draft/",
      source: "_drafts/shi-c++-wei-yu-yan-lian-bang.md",
      date: new Date("2019-01-01"),
      content: "",
      tags: collection([]),
      categories: collection([]),
    },
  ]),
  pages: collection([
    {
      path: "about/index.html",
      date: new Date("2026-09-01"),
      updated: new Date("2026-10-01"),
    },
    { path: "404.html", date: new Date("2026-10-01") },
  ]),
  categories: collection([{ path: "categories/开发/" }]),
  tags: collection([{ path: "tags/C++/" }]),
};

function generated() {
  return [...registered.values()].flatMap((generate) => generate(locals));
}
function route(path) {
  const output = generated().find((item) => item.path === path);
  assert.ok(output, `missing ${path}`);
  return output.data;
}

test("search index excludes drafts and unpublished posts, retaining complete searchable plain text", () => {
  const posts = JSON.parse(route("search.json"));
  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, "C++ & <code>");
  assert.equal(posts[0].url, "/2026/10/01/cpp/");
  assert.equal(posts[0].date, "2026-10-01T02:00:00.000Z");
  assert.equal(posts[0].category, "开发");
  assert.deepEqual(posts[0].tags, ["C++"]);
  assert.equal(posts[0].content, "Header & title All 🚀 body <text>.");
  assert.doesNotMatch(posts[0].content, /secret|hidden|<strong>/);
});

test("Atom XML escapes content and uses stable absolute identifiers and valid dates", () => {
  const xml = route("atom.xml");
  assert.match(xml, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(xml, /<title>C\+\+ &amp; &lt;code&gt;<\/title>/);
  assert.match(xml, /<id>https:\/\/example\.com\/2026\/10\/01\/cpp\/<\/id>/);
  assert.match(xml, /<updated>2026-10-02T02:00:00\.000Z<\/updated>/);
  assert.match(xml, /<name>Tao &amp; friends<\/name>/);
  assert.doesNotMatch(xml, /Unpublished|Original empty/);
  assert.equal((xml.match(/<entry>/g) || []).length, 1);
});

test("searchable text preserves words and code split across inline highlighting elements", () => {
  const post = locals.posts.toArray()[0];
  const original = post.content;
  try {
    post.content =
      "<p>read<strong>able</strong> text</p><pre><code>console<span>.</span>log(&quot;hello&quot;)</code></pre>";
    assert.equal(
      JSON.parse(route("search.json"))[0].content,
      'readable text console.log("hello")',
    );
  } finally {
    post.content = original;
  }
});

test("sitemap contains discoverable site routes and excludes draft and error pages", () => {
  const xml = route("sitemap.xml");
  assert.match(
    xml,
    /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
  );
  for (const url of [
    "https://example.com/",
    "https://example.com/archives/",
    "https://example.com/about/",
    "https://example.com/2026/10/01/cpp/",
  ]) {
    assert.ok(xml.includes(`<loc>${url}</loc>`), url);
  }
  assert.doesNotMatch(xml, /unpublished|draft|404\.html/);
  assert.match(xml, /<lastmod>2026-10-02T02:00:00\.000Z<\/lastmod>/);
});
