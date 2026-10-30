import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";

test("stylesheet URLs change only when CSS changes and retain the site's URL prefix", async (t) => {
  const themeDir = await mkdtemp(path.join(tmpdir(), "orbit-assets-"));
  t.after(() => {
    assert.ok(path.resolve(themeDir).startsWith(`${path.resolve(tmpdir())}${path.sep}orbit-assets-`));
    return rm(themeDir, { recursive: true, force: true });
  });
  await mkdir(path.join(themeDir, "source/css"), { recursive: true });
  const cssFile = path.join(themeDir, "source/css/orbit.css");
  await writeFile(cssFile, "body { color: red; }");
  const filters = new Map();
  const helpers = new Map();
  const source = await readFile(new URL("../themes/orbit/scripts/assets.js", import.meta.url), "utf8");
  runInNewContext(source, {
    require: createRequire(import.meta.url),
    hexo: {
      theme_dir: themeDir,
      extend: {
        filter: { register: (name, fn) => filters.set(name, fn) },
        helper: { register: (name, fn) => helpers.set(name, fn) },
      },
    },
  });
  const generate = filters.get("before_generate");
  const stylesheetUrl = () => helpers.get("orbit_stylesheet_url").call({
    url_for: (asset) => `/blog${asset}`,
  });
  generate();
  const first = stylesheetUrl();
  assert.equal(new URL(first, "https://example.test").pathname, "/blog/css/orbit.css");
  assert.ok(new URL(first, "https://example.test").searchParams.get("v"));
  generate();
  assert.equal(stylesheetUrl(), first, "Unchanged styles keep a cacheable URL");
  await writeFile(cssFile, "body { color: blue; }");
  generate();
  assert.notEqual(stylesheetUrl(), first, "Updated styles must not reuse the old cache key");
});
