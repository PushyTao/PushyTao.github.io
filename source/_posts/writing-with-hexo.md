---
title: 从 Markdown 到发布：这份博客的写作流程
date: 2026-10-01 08:00:00
updated: 2026-10-01 08:00:00
description: 建立草稿、补充文章信息、在本地预览，再让 GitHub Actions 完成静态发布。
categories:
  - 写作工作流
tags:
  - Markdown
  - Hexo
  - GitHub Pages
cover: /images/cover-writing.svg
---

这个博客使用 Markdown 保存文章，Hexo 生成页面，GitHub Pages 提供访问入口。文章内容和页面样式分开放置，因此日常写作通常只需要修改一个 Markdown 文件。

<!-- more -->

## 先准备本地环境

项目要求 Node.js 22 或更新版本。下载仓库后，在项目目录安装锁定的依赖，并启动本地预览：

```bash
npm ci
npm run server
```

浏览器打开终端显示的本地地址，默认是 `http://127.0.0.1:4000`。修改文章后，等待终端完成重新生成，再刷新页面。这个服务只用于本地预览；正式站点由构建后的静态文件组成。

## 从草稿开始写

草稿保存在 `source/_drafts/`，不会出现在正常构建的文章列表、搜索和订阅中。可以通过 Hexo 创建一份带有基本信息的草稿：

```bash
npx hexo new draft "my-first-note"
npm run server -- --draft
```

用简短的英文文件名作为地址标识，再把文件开头的 `title` 修改成实际的中文标题。这样更换显示标题时，不必同时更换文章地址。

每篇文章开头的 YAML 信息描述标题、日期、分类、标签与封面。例如：

```yaml
---
title: 一次问题排查记录
date: 2026-10-01 10:00:00
description: 记录问题背景、排查过程与最终验证。
categories:
  - 技术笔记
tags:
  - 实践
cover: /images/cover-writing.svg
---
```

日期按 `Asia/Shanghai` 时区解释。日期晚于构建时间的文章暂不生成。`categories` 用于组织主题，`tags` 则可以描述语言、工具或问题类型。封面可以使用主题自带的 SVG，也可以把自己的图片放进 `source/images/`，再引用 `/images/文件名`。

## 让文章容易回看

开头用一小段文字说明问题和结果，再添加 `<!-- more -->` 作为摘要分界。正文使用二级、三级标题组织，文章目录会根据标题生成。

代码块应标明语言，并保留必要的上下文。例如，说明运行环境、输入数据和预期结果，比只粘贴一段代码更容易复现。引用资料时附上原始链接，区分文档给出的行为和自己验证过的结论。

发布前可以用三个问题检查文章：读者是否知道问题是什么，能否按步骤复现，结论是否有可核对的依据。

## 预览、检查与发布

完成草稿后，把它转为文章，再生成并检查站点：

```bash
npx hexo publish "my-first-note"
npm run build
npm run check
```

除了命令检查，也应在浏览器中查看标题层级、图片、链接和手机布局。确认内容后，提交源文件并推送到 `main`。仓库中的 GitHub Actions 工作流会安装依赖、生成并检查页面，然后将 `public/` 发布到 GitHub Pages。

如果发布失败，可以在仓库的 Actions 页面打开对应运行记录，从失败的步骤查看原因。`public/` 是生成产物，不需要手动提交；源码和锁定文件才是之后重新生成站点的依据。

## 继续阅读

- [Hexo 写作指南](https://hexo.io/docs/writing)
- [Hexo 文章信息说明](https://hexo.io/docs/front-matter)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
