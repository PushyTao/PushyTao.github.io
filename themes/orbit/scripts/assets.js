const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const path = require("node:path");

let stylesheetVersion;

hexo.extend.filter.register("before_generate", function () {
  stylesheetVersion = createHash("sha256")
    .update(readFileSync(path.join(hexo.theme_dir, "source/css/orbit.css")))
    .digest("hex")
    .slice(0, 12);
});

hexo.extend.helper.register("orbit_stylesheet_url", function () {
  return `${this.url_for("/css/orbit.css")}?v=${stylesheetVersion}`;
});
