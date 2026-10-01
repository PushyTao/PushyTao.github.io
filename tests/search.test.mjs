import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../themes/orbit/source/js/search.js", import.meta.url),
  "utf8",
);
const { matchPosts } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const posts = [
  {
    title: "Orbit 入门",
    tags: ["Hexo", "静态网站"],
    category: "建站",
    content: "通过 GitHub Pages 发布自己的写作空间。",
    url: "/orbit/",
  },
  {
    title: "JavaScript notes",
    tags: ["代码"],
    category: "开发",
    content: "Clipboard API and progressive enhancement.",
    url: "/javascript/",
  },
  {
    title: "工作流",
    tags: [],
    content: "Hexo 使用 Markdown 编写文章。",
    url: "/writing/",
  },
];

test("empty or whitespace-only search never lists every post", () => {
  assert.deepEqual(matchPosts(posts, ""), []);
  assert.deepEqual(matchPosts(posts, "   "), []);
});

test("matches title, tags, category and the full body without case sensitivity", () => {
  for (const [query, expected] of [
    ["oRBit", ["/orbit/"]],
    ["静态网站", ["/orbit/"]],
    ["建站", ["/orbit/"]],
    ["clipboard api", ["/javascript/"]],
    ["MARKDOWN", ["/writing/"]],
    ["heXO", ["/orbit/", "/writing/"]],
  ])
    assert.deepEqual(
      matchPosts(posts, query).map((post) => post.url),
      expected,
      query,
    );
});

test("all whitespace-separated words must match, even across different fields", () => {
  assert.deepEqual(
    matchPosts(posts, "  orbit   github  ").map((post) => post.url),
    ["/orbit/"],
  );
  assert.deepEqual(matchPosts(posts, "orbit clipboard"), []);
});

test("literal punctuation does not become a regular expression and input order stays intact", () => {
  assert.deepEqual(matchPosts(posts, ".*"), []);
  assert.deepEqual(matchPosts(posts, "["), []);
  assert.deepEqual(
    matchPosts(posts, "hexo").map((post) => post.url),
    ["/orbit/", "/writing/"],
  );
  assert.equal(posts[0].title, "Orbit 入门");
});
