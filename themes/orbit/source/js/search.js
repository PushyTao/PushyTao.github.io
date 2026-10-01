export function matchPosts(posts, query) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return posts.filter((post) => {
    const text = [post.title, post.category, ...(post.tags || []), post.content]
      .join(" ")
      .toLocaleLowerCase();
    return words.every((word) => text.includes(word));
  });
}

export function initializeSearch() {
  const dialog = document.querySelector("#search-dialog");
  if (!dialog) return;
  const input = dialog.querySelector("#search-input");
  const results = dialog.querySelector("#search-results");
  const status = dialog.querySelector("#search-status");
  let index;
  let request;
  let returnFocus;
  let renderVersion = 0;

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (!request) {
      const url =
        dialog.dataset.indexUrl ||
        new URL("../../search.json", import.meta.url);
      request = fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error("Search index unavailable");
          return response.json();
        })
        .then((data) => {
          if (
            !Array.isArray(data) ||
            data.some(
              (post) =>
                typeof post.title !== "string" ||
                typeof post.url !== "string" ||
                typeof post.content !== "string",
            )
          ) {
            throw new Error("Invalid search index");
          }
          index = data;
          return index;
        })
        .catch((error) => {
          request = undefined;
          throw error;
        });
    }
    return request;
  }

  async function render() {
    const version = ++renderVersion;
    const query = input.value.trim();
    results.replaceChildren();
    status.textContent = index
      ? "输入关键词，搜索文章、标签和正文。"
      : "正在加载搜索索引…";
    results.setAttribute("aria-busy", "true");
    try {
      const posts = await loadIndex();
      if (
        version !== renderVersion ||
        !dialog.open ||
        input.value.trim() !== query
      )
        return;
      results.setAttribute("aria-busy", "false");
      if (!query) {
        status.textContent = "输入关键词，搜索文章、标签和正文。";
        return;
      }
      const matches = matchPosts(posts, query);
      status.textContent = matches.length
        ? `找到 ${matches.length} 篇文章`
        : "没有找到相关文章，换个关键词试试。";
      const fragment = document.createDocumentFragment();
      for (const post of matches) {
        const url = new URL(post.url, window.location.href);
        if (!["http:", "https:"].includes(url.protocol)) continue;
        const item = document.createElement("li");
        item.className = "search-result";
        const link = document.createElement("a");
        link.href = url.href;
        const title = document.createElement("strong");
        title.textContent = post.title;
        const meta = document.createElement("span");
        meta.className = "search-result-meta";
        meta.textContent = [
          post.date?.slice(0, 10),
          post.category,
          ...(post.tags || []),
        ]
          .filter(Boolean)
          .join(" · ");
        const excerpt = document.createElement("p");
        excerpt.className = "search-result-excerpt";
        const firstWord = query.toLocaleLowerCase().split(/\s+/)[0];
        const position = post.content.toLocaleLowerCase().indexOf(firstWord);
        const start = Math.max(0, position - 35);
        excerpt.textContent = `${start ? "…" : ""}${post.content.slice(start, start + 145)}${post.content.length > start + 145 ? "…" : ""}`;
        link.append(title, meta, excerpt);
        item.append(link);
        fragment.append(item);
      }
      results.append(fragment);
    } catch {
      if (
        version !== renderVersion ||
        !dialog.open ||
        input.value.trim() !== query
      )
        return;
      results.setAttribute("aria-busy", "false");
      status.textContent = "搜索索引加载失败，请重试。";
      const item = document.createElement("li");
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "search-retry";
      retry.textContent = "重新加载";
      retry.addEventListener("click", render);
      item.append(retry);
      results.append(item);
    }
  }

  function open() {
    if (!dialog.open) {
      returnFocus = document.activeElement;
      dialog.showModal();
    }
    input.focus();
    render();
  }
  document
    .querySelectorAll("[data-search-open]")
    .forEach((button) => button.addEventListener("click", open));
  dialog
    .querySelectorAll("[data-search-close]")
    .forEach((button) =>
      button.addEventListener("click", () => dialog.close()),
    );
  dialog.addEventListener("close", () => returnFocus?.focus());
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    dialog.close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  input.addEventListener("input", render);
  document.addEventListener("keydown", (event) => {
    const editable = event.target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
    );
    if (
      (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) ||
      (event.key === "/" &&
        !editable &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey)
    ) {
      event.preventDefault();
      open();
    }
  });
}
