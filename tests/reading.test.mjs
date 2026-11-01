import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const read = (file) => readFile(new URL(`../public/${file}`, import.meta.url), "utf8");

async function openArticle(t, { saved, blocked = false } = {}) {
  const dom = new JSDOM(await read("posts/writing-with-hexo/index.html"), {
    url: "https://example.test/posts/writing-with-hexo/",
    runScripts: "outside-only",
  });
  t.after(() => dom.window.close());
  const { document, localStorage } = dom.window;
  if (saved !== undefined) localStorage.setItem("orbit-article-font-size", saved);
  if (blocked) Object.defineProperty(dom.window, "localStorage", {
    get() { throw new Error("Storage disabled"); },
  });
  const controls = document.querySelector("[data-reading-controls]");
  assert.ok(controls, "Articles expose font size controls");
  assert.equal(controls.hidden, true, "Uninitialized controls stay hidden without JavaScript");
  // Run the actual head bootstrap, before the interactive module.
  for (const script of document.querySelectorAll("head script:not([src])")) {
    dom.window.eval(script.textContent);
  }
  const initialSize = document.documentElement.style.getPropertyValue("--article-font-size");
  const source = await read("js/reading.js");
  const { initializeReadingControls } = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
  let changes = 0;
  initializeReadingControls(document, () => changes++);
  return {
    document, localStorage, controls, initialSize,
    size: () => document.documentElement.style.getPropertyValue("--article-font-size"),
    decrease: controls.querySelector("[data-font-decrease]"),
    increase: controls.querySelector("[data-font-increase]"),
    reset: controls.querySelector("[data-font-reset]"),
    value: controls.querySelector("[data-font-value]"),
    changes: () => changes,
  };
}

test("article font controls adjust, persist, enforce limits and reset the reading size", async (t) => {
  const page = await openArticle(t);
  assert.equal(page.controls.hidden, false);
  assert.equal(page.size(), "15px");
  page.increase.click();
  assert.equal(page.size(), "16px");
  assert.equal(page.localStorage.getItem("orbit-article-font-size"), "16");
  assert.match(page.value.textContent, /16/);
  assert.equal(page.changes(), 1, "Changing text size recalculates reading progress");
  for (let i = 0; i < 20; i++) page.increase.click();
  assert.equal(page.size(), "22px");
  assert.equal(page.increase.disabled, true);
  for (let i = 0; i < 20; i++) page.decrease.click();
  assert.equal(page.size(), "14px");
  assert.equal(page.decrease.disabled, true);
  page.reset.click();
  assert.equal(page.size(), "15px");
  assert.equal(page.localStorage.getItem("orbit-article-font-size"), "15");
  assert.equal(page.increase.disabled, false);
  assert.equal(page.decrease.disabled, false);
});

test("saved font size is restored before painting and agrees with the controls", async (t) => {
  const page = await openArticle(t, { saved: "19" });
  assert.equal(page.initialSize, "19px");
  assert.equal(page.size(), "19px");
  assert.match(page.value.textContent, /19/);
});

test("invalid preferences fall back and unavailable storage never prevents adjustment", async (t) => {
  for (const saved of ["garbage", "0", "100", "17.5", "Infinity"]) {
    const page = await openArticle(t, { saved });
    assert.ok(["", "15px"].includes(page.initialSize));
    assert.equal(page.size(), "15px", saved);
  }
  const page = await openArticle(t, { blocked: true });
  page.increase.click();
  assert.equal(page.size(), "16px");
  page.reset.click();
  assert.equal(page.size(), "15px");
});

test("font controls appear only on article pages", async () => {
  for (const path of ["index.html", "about/index.html", "archives/index.html"]) {
    assert.doesNotMatch(await read(path), /data-reading-controls/);
  }
});
