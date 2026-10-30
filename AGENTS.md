# 仓库协作指南

本文件适用于整个仓库。这里是 PushyTao 的中文技术博客，使用 Hexo 和自定义 Orbit 主题，发布地址为 <https://pushytao.github.io/>。维护时以当前源码、配置和测试为准；旧设计记录用于理解背景。

## 命令与工作区

- 在仓库根目录运行项目命令。先用 `git status --short --branch` 检查分支和已有改动，保留用户未完成的工作。
- 默认用中文沟通，文件保持 UTF-8；Windows PowerShell 读取中文文件时显式指定 UTF-8。
- 搜索优先使用 `rg`、`rg --files`。扫描源码时排除 `node_modules/`、`public/` 和 `.git/`，它们分别是依赖、构建产物和版本元数据。

## 项目入口与目录

运行环境为 Node.js 22 或更新版本，CI 使用 Node.js 22；依赖版本以 [package.json](package.json) 和 [package-lock.json](package-lock.json) 为准。主题使用 EJS、普通 CSS 和浏览器 ES modules，没有前端打包流程。

| 位置 | 用途 |
| --- | --- |
| [README.md](README.md) | 环境、结构和发布方式的简明说明 |
| [_config.yml](_config.yml) | 站点域名、作者、时区、文章链接、分页和 Hexo 配置 |
| [source/_posts/](source/_posts/) | 正式文章 Markdown；新增博客文章放这里，不放仓库根目录 |
| [source/_drafts/](source/_drafts/) | 未完成草稿，默认不生成正式页面 |
| [source/images/](source/images/) | 文章配图、头像及站点图标 |
| [source/about/](source/about/)、[source/topics/](source/topics/)、[source/links/](source/links/)、[source/404.md](source/404.md) | 关于、专题、友链和错误页面的源文件 |
| [source/_data/poems.json](source/_data/poems.json) | 首页随机诗句数据 |
| [source/_data/links.json](source/_data/links.json) | 友链数据；字段与维护方式见 [README](README.md#维护友链) |
| [scaffolds/](scaffolds/) | 新文章、草稿和独立页面的模板 |
| [themes/orbit/layout/](themes/orbit/layout/) | 页面 EJS；公共组件在 `_partial/` |
| [themes/orbit/source/](themes/orbit/source/) | 主题 CSS、浏览器脚本及内置 SVG 插图 |
| [themes/orbit/scripts/generators.js](themes/orbit/scripts/generators.js) | 生成搜索索引、Atom 订阅和 sitemap |
| [tests/](tests/) | Node 内置测试，覆盖生成器、搜索和生成后的站点 |
| [.github/workflows/pages.yml](.github/workflows/pages.yml) | GitHub Pages 构建与部署 |
| [docs/superpowers/](docs/superpowers/) | 建站设计与实施记录，可能包含已过时的细节 |

## 命名与永久链接

- **文章文件名全部小写，单词之间用 `-` 连接**，统一使用 `.md` 扩展名。例如 `harness-engineering-openai.md`、`git-troubleshooting.md`；不要使用空格、下划线或混合大小写。
- 文件名应简短、能表达主题，使用英文字母和数字。发布日期写入 `date`，不必重复加到文件名中。草稿与正式文章遵循同一命名规则，草稿发布时保持文件名不变。
- 文件名与显示标题分开：文件名用于稳定地址，`title` 面向读者，可使用中文或保留原文标题；产品名称在标题和标签中保留官方写法，如 OpenAI、Codex、GitHub。
- 当前链接格式为 `posts/:title/`。未另设 `slug` 或 `permalink` 时，文件名决定文章地址；例如 `harness-engineering-openai.md` 对应 `/posts/harness-engineering-openai/`。修改显示标题通常不改变地址。
- 已发布文章需要重命名时，先核对线上原地址；通过显式 `permalink` 保留原 URL，或为旧地址提供跳转并更新站内引用。不要仅为统一命名而使已有链接失效，也不要让两篇文章使用相同的永久链接。
- 正式地址迁移时，将文章 `permalink` 改为新地址，确保文章列表、搜索、订阅和 sitemap 直接使用新地址。旧地址跳转页放在对应的 `source/posts/旧路径/index.html`，并将该文件加入 `_config.yml` 的 `skip_render`，作为静态文件复制，避免进入页面索引。参考 [Harness 旧地址跳转页](source/posts/HarnessEngineering_OpenAI/index.html)；保留查询参数和锚点，并提供禁用脚本时的自动跳转及可点击链接。
- 新增图片使用小写、以 `-` 分词的描述性名称，如 `architecture-layers.png`。按文章分目录时，目录名与文章文件名去掉 `.md` 后一致，如 `source/images/harness-engineering-openai/`；文中引用 `/images/harness-engineering-openai/architecture-layers.png`。这些是命名示例，引用前须放入真实图片。
- 分类和标签优先复用现有名称，避免仅大小写、空格或同义词不同的重复项；分类表示主题，标签表示涉及的技术、工具或产品。它们不受文件名的小写规则限制。

## 文章与图片

- 先参考 [写作与发布指南](source/_posts/writing-with-hexo.md) 和同目录现有文章。整理外部文档时保留正文、原作者及已有来源信息，不编造个人经历、数据或出处。
- 新文章填写 `title`、`date`、`description`、`categories`、`tags`。`updated` 用于实质修改时间；`cover` 可选，可使用已有 `/images/cover-writing.svg` 或 `/images/cover-orbit.svg`。
- 日期使用 `Asia/Shanghai`。保留原有发布日期，后续更新填写 `updated`；引用文章可使用已核实的原文发布日期。`future: false` 会排除未来日期文章，时间到达后仍需再次构建。
- 页面模板已输出一级标题，正文使用 `##`、`###` 组织章节；用一个 `<!-- more -->` 分隔摘要与正文。YAML 缩进用空格，含 `: ` 的标题用引号包围。
- 配图统一存入 `source/images/`，可按文章分子目录；文中引用 `/images/...`，不带 `source` 前缀。当前 `post_asset_folder: false`，不要在 `_posts/` 旁创建另一套文章资源目录。
- 导入本地文档时，**只复制实际引用的图片到仓库**，并更新所有引用；不要依赖原文档目录或磁盘绝对路径，也不要整包复制网页保存目录中的 JS、CSS。复制后核对数量、文件内容和路径大小写，不能静默覆盖同名图片。
- `npx hexo publish "文件名"` 只将草稿转为正式文章，不会部署；参数不带 `.md` 扩展名。转换后检查模板带入的占位段落、空章节和重复摘要分隔符。已在 `_posts/` 中的文章直接编辑原文件。

文章结构示例（日期和内容需按实际情况填写）：

```markdown
---
title: "文章标题"
date: 2026-10-30 10:00:00
description: 用一两句话说明文章内容。
categories:
  - 技术笔记
tags:
  - 实践
---

文章摘要。

<!-- more -->

## 正文
```

## 主题和数据维护

- 页面结构从 `themes/orbit/layout/layout.ejs`、对应页面模板及 `_partial/` 入手；样式集中在 `themes/orbit/source/css/orbit.css`。保留现有深浅色变量、本地字体栈、响应式布局、键盘操作和减少动画支持。
- `themes/orbit/source/js/orbit.js` 初始化搜索和诗句，并负责主题切换、手机导航、当前页分类筛选、代码复制、阅读进度和返回顶部。修改 DOM 的 ID 或 `data-*` 属性时同步检查对应脚本和样式。
- `themes/orbit/source/js/search.js` 导出 `matchPosts`。搜索覆盖标题、分类、标签和完整正文，忽略大小写，所有空白分隔的词都须匹配；空查询无结果，查询按字面文本匹配。结果用 `textContent` 渲染，保留加载失败重试与焦点恢复。
- `generators.js` 在 Hexo 环境中注册生成器，浏览器脚本使用 ES module，测试为 `.mjs`。保持各自的模块形式，不要仅为统一语法修改项目模块配置。
- 搜索数据、订阅源和 sitemap 从站点内容生成。保持草稿和未发布文章的排除规则、XML 转义、完整可搜索正文及有效的绝对订阅链接。
- 首页诗句数据必须是非空数组，每项包含唯一 `id`、恰好两行 `lines`、`dynasty`、`author`、`title`、`source`。模板提供首项回退，`poetry.js` 在浏览器随机选取，并通过会话存储避免连续重复；保留禁用脚本或存储时的可用性。
- 文章数、分类数和标签数从 Hexo 集合计算。主题资源保持本地可用，不引入未经任务要求的远程字体、运行时 CDN 或框架。
- 只修改源文件。`public/`、`db.json`、`node_modules/`、`.deploy_git/`、`.cache/` 和日志是忽略的本地文件，不纳入提交。只有依赖变化时才更新依赖清单和锁文件。

## 构建与验证

首次安装、依赖缺失或锁文件变化时运行 `npm ci`。仅改文章时无需重复安装；使用项目内 Hexo，无需全局安装。

涉及文章、图片、模板、脚本、样式、配置或依赖的改动，依次执行：

```powershell
npm run build
npm run check
```

`build` 执行 `hexo clean` 和 `hexo generate`。`check` 包含对 `public/` 的检查，必须在最新正式构建后运行，不能把旧产物的通过结果当成新修改的验证。

- [generators.test.mjs](tests/generators.test.mjs)：搜索索引、草稿过滤、正文提取、Atom 和 sitemap。
- [search.test.mjs](tests/search.test.mjs)：大小写、多关键词、空查询和字面匹配。
- [site.test.mjs](tests/site.test.mjs)：实际输出路由、元信息、订阅源、站内 `href/src` 和锚点；也保护原始 C++ 草稿不进入正式文章列表。
- `npm run server` 在 `http://127.0.0.1:4000/` 预览；追加 `-- --draft` 查看草稿，追加 `-- --port 4001` 换端口。改 `_config.yml` 后重启服务。
- 正式构建前停止本次任务启动的预览服务，尤其是草稿模式；不要干扰用户自行启动的其他服务。浏览器在构建后刷新再检查。
- 文章改动检查标题、日期、摘要、目录、分类标签和每张图片实际加载。主题或交互改动还应检查桌面和约 375px 手机宽度、深浅色、横向溢出，以及受影响的搜索、菜单、复制等交互。
- 自动检查不覆盖所有视觉和浏览器行为。报告实际执行的检查及结果；没有进行浏览器检查时不要声称视觉验证通过。
- 仅修改根目录说明文档时，核对链接、路径、命令与源码一致即可，无需为此新增测试或重建站点。

## 提交与发布

- 按当前用户授权执行提交、推送或发布；已明确授权的步骤直接完成。只暂存本次相关文件，用 `git diff --cached` 核对，不混入无关工作。
- 使用简洁、具体的提交说明，沿用 `docs:`、`fix:` 等现有风格。同步前检查本地状态；远端发生变化时先检查差异并妥善整合，不以强制推送覆盖远端工作。
- 推送 `main` 会触发 **Deploy Hexo to GitHub Pages**；该工作流也支持手动运行。流程为安装锁定依赖 → 构建 → 检查 → 上传 `public/` → 部署，无需执行 `hexo deploy` 或维护 `gh-pages` 分支。
- 发布完成的证据是：对应提交的 `build`、`deploy` 都成功，正式文章地址及图片可以访问。单独 commit、push 或本地构建成功均不等于上线。
- GitHub Pages 的发布源应为 GitHub Actions。变更域名时同步核对 `_config.yml` 的 `url`、Pages 设置和生成的 canonical、Atom、sitemap。

## 历史内容与指南更新

- 根目录 `SUMMARY.md` 与 `shi-c++-wei-yu-yan-lian-bang.md` 是历史原稿；保留它们，不能据此把新博客文章放到根目录。
- `source/_drafts/shi-c++-wei-yu-yan-lian-bang.md` 尚无完整正文，不应补造内容或擅自发布；`source/shi-c++-wei-yu-yan-lian-bang.md` 是旧地址说明页，需要保留兼容。
- 更改目录、命令、生成方式或发布流程时，同步更新本指南和相关维护说明。新增细节优先写到对应文档，并在这里保留入口，避免把本文件扩展成实现细节的副本。
