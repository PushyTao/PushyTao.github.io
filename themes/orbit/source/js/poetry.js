export function initializePoetry() {
  const container = document.querySelector("[data-poetry]");
  if (!container) return;

  const poems = JSON.parse(container.querySelector("#hero-poems").textContent);
  const storageKey = "orbit-last-poem";
  let lastId;
  try {
    lastId = sessionStorage.getItem(storageKey);
  } catch {
    // A private or storage-restricted browser can still choose a random poem.
  }

  const alternatives = poems.filter((poem) => poem.id !== lastId);
  const choices = alternatives.length ? alternatives : poems;
  const poem = choices[Math.floor(Math.random() * choices.length)];
  if (!poem) return;

  container.querySelectorAll("[data-poem-line]").forEach((line, index) => {
    line.textContent = poem.lines[index];
  });
  container.querySelector("[data-poem-author]").textContent =
    `${poem.dynasty} · ${poem.author}`;
  const source = container.querySelector("[data-poem-source]");
  source.textContent = `《${poem.title}》`;
  source.href = poem.source;

  try {
    sessionStorage.setItem(storageKey, poem.id);
  } catch {
    // Remembering the previous poem is optional; rendering is not.
  }
}
