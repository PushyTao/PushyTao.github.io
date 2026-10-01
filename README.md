# PushyTao · Orbit

使用 Hexo 与原创 Orbit 主题构建的个人技术博客。

网站：<https://pushytao.github.io/>

## 本地预览

需要 Node.js 22 或更新版本，以及 npm。

```bash
npm ci
npm run server
```

打开 <http://127.0.0.1:4000>。预览服务默认只监听本机；按 `Ctrl+C` 结束。

```bash
npm run build  # 清理旧产物，生成 public/
npm run check  # 运行搜索与生成站点检查
```

修改模板、脚本或配置后，重新运行构建与检查。请提交 `package-lock.json`，让本地与 CI 使用相同的依赖版本。不要提交生成的 `public/`、`node_modules/` 或 `db.json`。

## 写文章

```bash
npx hexo new draft "my-first-note"
npm run server -- --draft
```

编辑 `source/_drafts/my-first-note.md`。文件名用于稳定的文章地址，`title` 可以使用中文。草稿和未来日期文章默认不会公开。

```yaml
---
title: 一次问题排查记录
date: 2026-10-01 10:00:00
description: 用一两句话概括背景与结果。
categories:
  - 技术笔记
tags:
  - 实践
cover: /images/cover-writing.svg
---

这是文章摘要。

<!-- more -->

## 问题背景
```

日期时区为 `Asia/Shanghai`。使用 `<!-- more -->` 分隔摘要和正文，使用二级、三级标题生成目录。图片可放在 `source/images/`，文章中使用 `/images/example.webp` 引用。

准备发布时：

```bash
npx hexo publish "my-first-note"
npm run build
npm run check
```

检查文章、手机布局及链接后，提交源文件并推送到 `main`。

## 目录与设置

| 路径 | 用途 |
| --- | --- |
| `_config.yml` | 站点标题、作者、域名、时区和分页 |
| `source/_posts/` | 正式文章 |
| `source/_drafts/` | 未公开草稿 |
| `source/_data/poems.json` | 首页随机诗句、作者、篇名与原文链接 |
| `source/about/`、`source/topics/` | 关于与专题页面 |
| `scaffolds/` | 新建文章、草稿、页面的模板 |
| `themes/orbit/layout/` | EJS 页面模板 |
| `themes/orbit/source/` | CSS、浏览器脚本与本地 SVG 插图 |
| `themes/orbit/scripts/` | 搜索索引、Atom 与 sitemap 等生成逻辑 |
| `tests/` | 搜索与站点生成检查 |

首页、归档、分类、标签与正文由同一批 Markdown 内容生成。站点地址配置为 `https://pushytao.github.io/`；若之后启用自定义域名，请同时更新 `_config.yml` 中的 `url` 和 GitHub Pages 域名设置。

首页每次加载从 `source/_data/poems.json` 随机选一组诗句，并使用浏览器会话存储避免同一标签页连续重复。新增诗句时保留唯一的 `id`，填写两行 `lines`、朝代 `dynasty`、作者 `author`、篇名 `title` 和原文地址 `source`。诗句随站点构建，不调用外部接口；禁用 JavaScript 时显示列表中的第一组，浏览器禁止存储时仍可随机展示，但无法记住上一组。

## GitHub Pages 发布

`.github/workflows/pages.yml` 在 `main` 推送后自动运行：安装依赖 → 构建 → 检查 → 上传 `public/` → 部署到 GitHub Pages。工作流使用 Node.js 22 和官方 Pages Actions，无需配置个人访问令牌。

仓库 **Settings → Pages → Build and deployment → Source** 应设为 **GitHub Actions**。工作流也支持手动运行；发布进度和失败日志可在 **Actions → Deploy Hexo to GitHub Pages** 查看。只有构建与检查成功后，才会进入部署步骤。

## 原有内容

根目录的 `SUMMARY.md` 与 `shi-c++-wei-yu-yan-lian-bang.md` 保留原样。后者于 **2024-06-11 08:35:56 UTC** 加入仓库，内容只有标题；已按原始提交时间复制到 `source/_drafts/`，未补写正文，也不计为已发布文章。旧地址 `/shi-c++-wei-yu-yan-lian-bang.html` 仍提供简短说明，避免已有链接失效。原 README 只有 `# Page`，现替换为这份维护说明，原文仍可从 Git 历史查看。

当前正式文章介绍站点和写作流程，不包含虚构的个人经历或访问量。

## 参考

- [Qiwen 的博客](https://qiwenfly.github.io/)：参考全宽封面与简洁的阅读布局；本站插图、配色与主题代码独立制作。
- [用户提供的 Hexo 教程](https://blog.csdn.net/yaorongke/article/details/119089190)：建站流程参考。
- [Hexo 官方文档](https://hexo.io/docs/)：当前配置、写作与生成命令。
- [GitHub Pages 文档](https://docs.github.com/en/pages)：Actions 发布与站点设置。

