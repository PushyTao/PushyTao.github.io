---
title: 从 Markdown 到发布：这份博客的写作流程
date: 2026-10-01 08:00:00
updated: 2026-10-01 18:29:00
description: 从新建草稿、修改已发布文章、插入图片，到本地预览、提交发布、撤下与恢复，一份可以照着操作的博客编辑指南。
categories:
  - 写作工作流
tags:
  - Markdown
  - Hexo
  - GitHub Pages
cover: /images/cover-writing.svg
---

这个博客使用 Markdown 保存文章，Hexo 生成网页，GitHub Actions 自动构建并发布到 GitHub Pages。日常维护的顺序是：**编辑并保存 Markdown → 本地预览与检查 → Git 提交和推送 → 等待部署成功 → 检查线上页面**。

本文以 Windows PowerShell 和本地仓库 `D:\PushyTao.github.io` 为例，介绍新建、修改、发布、撤下与恢复的完整流程。只想修改现有文章时，可以先看“修改已经发布的文章”，再按“提交与正式发布”操作。

<!-- more -->

## 一、先认识文件与发布流程

### 应该修改哪些文件

| 想做什么 | 对应源文件或目录 |
| --- | --- |
| 修改已发布文章 | `source/_posts/` 下对应的 `.md` 文件 |
| 写一篇暂不发布的文章 | `source/_drafts/` 下的 `.md` 文件 |
| 添加文章图片 | `source/images/`，建议按文章分子目录 |
| 修改“关于”页 | `source/about/index.md` |
| 修改站名、作者、简介等全站信息 | 根目录 `_config.yml` |
| 调整新文章的初始模板 | `scaffolds/post.md` 或 `scaffolds/draft.md` |
| 调整主题排版、配色和交互 | `themes/orbit/` |

`public/` 是生成的网页，下一次构建会重新生成；`node_modules/` 是依赖。日常写作只编辑源文件，不在这两个目录里改文章，也不用把它们提交到 Git。

归档、分类、标签、文章目录和搜索索引随构建自动生成。新增文章或修改分类后，无需逐个维护这些页面。

### 保存、发布草稿、提交、上线的区别

| 操作 | 实际发生的事 | 是否更新线上博客 |
| --- | --- | --- |
| 保存 `.md` 文件 | 修改本地源文件 | 否 |
| `npx hexo publish "文章文件名"` | 把本地草稿转为正式文章 | 否 |
| `npm run build` | 生成本地 `public/` | 否 |
| `git commit` | 将修改记入本地版本历史 | 否 |
| `git push origin main` | 上传提交，触发 GitHub Actions | 开始发布，尚需等待 |
| Actions 的 `deploy` 成功 | 新静态文件部署到 GitHub Pages | 是，随后检查访问结果 |

本站已经配置 GitHub Actions 发布，日常无需另配个人访问令牌，也不用执行 `hexo deploy` 或 `hexo g -d`。

## 二、准备环境并同步仓库

### 第一次在这台电脑上编辑

安装 Git 与 **Node.js 22 或更新版本**，重新打开 PowerShell 后检查版本：

```powershell
git --version
node --version
npm --version
```

如果 Node 仍是 `v14` 等旧版本，先切换到符合要求的版本再安装依赖。本站的 GitHub Actions 使用 Node.js 22，本地也可使用同一主版本。

已有仓库时，直接进入目录：

```powershell
Set-Location 'D:\PushyTao.github.io'
git status
```

只有在新电脑上、目标目录尚不存在时，才需要克隆一次：

```powershell
git clone https://github.com/PushyTao/PushyTao.github.io.git 'D:\PushyTao.github.io'
Set-Location 'D:\PushyTao.github.io'
```

### 每次编辑前先同步

先查看 `git status`。如果有上次未完成的修改，先保存并处理，再切换分支或拉取。工作区干净时执行：

```powershell
git switch main
git pull --ff-only origin main
```

第一次使用，或拉取后依赖文件发生变化时，安装锁定的依赖：

```powershell
npm ci
```

`npm ci` 按 `package-lock.json` 安装依赖。只改文章正文时，不必每次重新安装，也不需要全局安装 Hexo；`npx hexo` 会使用项目中的 Hexo。

可以用 VS Code、Typora 或其他支持 UTF-8 的编辑器打开仓库。若已安装 VS Code 并配置 `code` 命令，也可以执行 `code .`。

## 三、新建文章：先草稿，再发布

### 1. 建立草稿

在仓库根目录执行：

```powershell
npx hexo new draft "my-first-note"
```

生成的文件是 `source/_drafts/my-first-note.md`。打开它，填写文章信息和正文。建议文件名使用简短的英文小写与连字符，如 `git-troubleshooting`，中文显示标题写在 `title` 中。文件名通常决定文章地址，发布后尽量保持稳定。

草稿默认不生成正式博客页面。不过，本仓库是公开仓库：**如果把草稿提交并推送到 GitHub，其他人仍能从仓库源码看到它**；草稿状态不是访问权限。

### 2. 填写文章头部与正文

下面是完整结构示例。日期请改成自己的实际写作或发布时间，后续修改时再更新 `updated`。

````markdown
---
title: 一次问题排查记录
date: 2026-10-01 10:00:00
updated: 2026-10-01 10:00:00
description: 记录问题背景、排查过程与最终验证。
categories:
  - 技术笔记
tags:
  - 实践
  - Git
cover: /images/cover-writing.svg
---

先用一小段文字说明问题，以及最后得到了什么结果。

<!-- more -->

## 问题背景

说明环境、现象和预期结果。

## 排查过程

### 第一步：检查状态

```bash
git status
```

## 结论与参考

记录验证结果，并附上资料来源。
````

头部由上下两行 `---` 包围，使用 YAML 语法。缩进用空格；标题中有“冒号 + 空格”等特殊组合时，用引号包住整个值，例如 `title: "Git: 一次排查记录"`。

| 字段 | 如何填写 |
| --- | --- |
| `title` | 页面显示的文章标题，可以使用中文 |
| `date` | 首次发布时间，影响文章排序与归档 |
| `updated` | 最近一次实质修改时间，供订阅源和站点地图等使用 |
| `description` | 一两句话概括内容；本站首页卡片优先使用它，搜索引擎描述也会读取它 |
| `categories` | 所属分类；入门时每篇使用一个分类最清晰 |
| `tags` | 语言、工具、主题等标签，可以填写多个 |
| `cover` | 封面图片的站内 URL，例如 `/images/cover-writing.svg` |

本站时区是 `Asia/Shanghai`。`future: false` 表示未来日期文章暂不生成，包括草稿预览；时间到了以后仍需再次触发构建，本站没有自动定时发布任务。不要误写未来日期，否则推送成功后也可能看不到文章。

正文从二级标题 `##` 开始，三级标题用 `###`，主题自动生成目录。页面已经展示 `title`，正文一般无需再写同名一级标题。`<!-- more -->` 划分摘要与正文；如果文章主题变化，也记得同步更新 `description`。

### 3. 将草稿转为正式文章

写好并预览后执行：

```powershell
npx hexo publish "my-first-note"
```

这里填写草稿文件名，不加 `.md`。之后打开 `source/_posts/my-first-note.md`，检查文章信息与正文。

**本仓库的正式文章模板带有摘要占位和空章节。当前 Hexo 在发布草稿时会把正式模板正文放在草稿正文之前，因此要删掉新增的占位文字、空章节和多余的摘要分隔符，保留自己的完整内容。** 草稿已有的 `date` 会保留；如希望按实际发布日期归档，在首次上线前调整它。

此时文章仍只在本地，接着完成检查、提交与推送。如果文章已经准备好，也可以直接使用 `npx hexo new post "my-first-note"` 创建正式文章；这和新建同名草稿是两条可选路径，不要重复创建。

## 四、修改已经发布的文章

### 以修改本文为例

本文线上地址是 `/posts/writing-with-hexo/`，对应的源文件是：

```text
D:\PushyTao.github.io\source\_posts\writing-with-hexo.md
```

修改时按下面的顺序操作：

1. 同步仓库后，打开这个 `.md` 文件。
2. 修改标题、段落、示例、图片或链接，并保存为 UTF-8。
3. 有实质内容更新时，把 `updated` 改为这次修改时间；保留原来的 `date`。
4. 内容概括变化时同步修改 `description`；需要重新分类时修改 `categories` 和 `tags`。
5. 本地预览，执行构建检查，然后提交、推送。

例如，文章上午发布、傍晚补充内容时，头部可以这样记录：

```yaml
date: 2026-10-01 08:00:00
updated: 2026-10-01 18:29:00
```

当前主题主要显示 `date`；填写 `updated` 不会自动改变页面上的发布日期。本站未填写 `updated` 时回退到 `date`，仅保存文件也不会自动更新它。旧文章通常不会因修改而跑到首页最前面，因为首页按 `date` 排序。

**已经在 `source/_posts/` 中的文章，不需要再执行 `hexo publish`，也不需要删除重建。** 修改原文件，再构建和推送即可。

### 改标题时保留原网址

本站使用 `posts/:title/` 链接。在没有额外设置 `permalink` 时，地址标识来自文件名，而不是中文显示标题。

因此，修改本文的 `title`、但保留 `writing-with-hexo.md` 文件名，可以维持 `/posts/writing-with-hexo/`。更改文件名或 `permalink` 可能改变 URL，让旧链接失效。

确需更换文件名时，可以先在文章头部显式固定原地址：

```yaml
permalink: posts/writing-with-hexo/
```

这个例子只适用于本文；其他文章填写各自的原地址，不能与另一篇文章重复。需要改地址时，先处理旧地址跳转或说明页并更新站内引用，再发布。

## 五、添加图片、链接与代码

### 管理图片与封面

本站未开启文章资源文件夹功能，统一使用 `source/images/`。例如，创建一个按文章命名的子目录，再放入图片：

```text
source/
  images/
    my-first-note/
      debug-flow.png
      cover.webp
```

正文引用的是部署后的 URL，不带 `source` 前缀：

```markdown
![问题排查流程图](/images/my-first-note/debug-flow.png)
```

文章头部设置封面：

```yaml
cover: /images/my-first-note/cover.webp
```

以上是路径示例，使用前需要放入真实图片。不要引用 `D:\...` 本地磁盘路径。文件名与大小写要完全一致；Windows 能访问的大小写混用路径，在 GitHub Pages 上可能变成 404。替换图片后仍看到旧图时，可以更换文件名并同步修改引用。

没有新封面时，继续使用内置的 `/images/cover-writing.svg` 或 `/images/cover-orbit.svg` 即可。

### 插入链接与代码块

站内文章优先使用站点根路径，外部资料使用完整 HTTPS 地址：

```markdown
[查看本站介绍](/posts/hello-orbit/)
[Hexo 官方文档](https://hexo.io/docs/)
```

代码块使用三条反引号包围，并标注语言，如 `bash`、`powershell`、`python`、`cpp` 或 `yaml`。主题会显示高亮和复制按钮。行内命令则用一对反引号包围，例如 `git status`。

## 六、本地预览与检查

### 查看正式文章

在仓库根目录启动预览：

```powershell
npm run server
```

打开终端显示的地址，默认是 `http://127.0.0.1:4000`。本文的本地地址是 `http://127.0.0.1:4000/posts/writing-with-hexo/`。

保持这个终端运行。修改并保存 Markdown 后，等待终端处理完成，再刷新浏览器。编辑器自带的 Markdown 预览只能帮助检查文字结构；最终主题、目录和链接以本地网站为准。

### 查看草稿

若已有预览服务，先按 `Ctrl+C` 停止，再启动草稿模式：

```powershell
npm run server -- --draft
```

草稿可在这个本地预览中查看；本站自定义搜索索引和 RSS 仍排除草稿，不要用搜索结果判断草稿是否成功生成。如果草稿日期晚于当前时间，请先将 `date` 改为当前或过去的时间，再查看预览。

4000 端口被占用时，可以换端口：

```powershell
npm run server -- --port 4001
```

修改 `_config.yml` 后停止服务并重新启动。准备发布时，先停止预览服务，特别是草稿模式，再执行正式构建：

```powershell
npm run build
npm run check
```

`build` 清理缓存和旧 `public/`，再按正式配置生成页面；`check` 检查搜索逻辑、索引、订阅源，以及生成页面的内部链接和锚点。先构建再检查，确保检查的是最新内容。

发布前还应在浏览器中确认：

- 标题、段落、列表、代码块是否正常，手机宽度下有没有横向溢出。
- 图片、封面、目录和站内链接能否打开。
- 分类、标签、摘要、发布日期是否正确。
- 正式文章能否搜到，未完成草稿是否被排除。

## 七、提交与正式发布

### 1. 确认并提交本次修改

下面以“修改本文”为例。在仓库根目录执行，核对分支是 `main`，再查看差异：

```powershell
git branch --show-current
git status --short
git diff -- "source/_posts/writing-with-hexo.md"
```

确认构建、检查通过，只加入这次准备发布的文件：

```powershell
git add -- "source/_posts/writing-with-hexo.md"
git diff --cached
git commit -m "docs: expand blog editing and publishing guide"
git push origin main
```

发布新文章时，把 `git add` 路径换成它在 `source/_posts/` 中的实际路径。新增图片也要加入，例如图片目录确实存在时执行 `git add -- "source/images/my-first-note"`。

如果草稿此前已提交过，转为正式文章后，`git status` 会显示旧草稿路径被删除。除了加入新文章，也要用 `git add -u -- "source/_drafts/my-first-note.md"` 记录那次删除。草稿一直未被 Git 跟踪时，不用执行这条命令。

`git diff --cached` 展示即将提交的内容。确认没有混入其他未完成文章再提交。只改文章时，无需改依赖文件；`public/`、`node_modules/` 和 `db.json` 已被忽略。

### 2. 等待并核对线上部署

打开仓库 [Actions 页面](https://github.com/PushyTao/PushyTao.github.io/actions)，查看最新的 **Deploy Hexo to GitHub Pages** 运行：

1. 核对运行对应你刚推送的提交。
2. 等待 `build` 完成安装依赖、构建、检查和上传。
3. 等待 `deploy` 也显示成功。
4. 打开 [博客首页](https://pushytao.github.io/) 和修改的文章，检查新文字、图片及搜索结果。

只有 `build` 成功，还不能说明线上更新。部署失败时通常仍显示上一版成功发布的站点。部署成功但内容未变时，先用 `Ctrl+F5` 强制刷新，再核对文章地址；必要时等待缓存更新后重试。

只需重新部署当前 `main` 时，可在该工作流页面选择 **Run workflow** 并确认分支为 `main`。这只会构建远端现有源码，不会上传电脑上尚未推送的修改。

### 3. 推送被拒绝时

如果远端已经有新提交，先保留好本地工作，在工作区干净、本地修改已提交的前提下执行：

```powershell
git pull --rebase origin main
```

没有冲突时，重新构建、检查，再次推送。有冲突时，打开提示的文件，保留正确内容并去掉冲突标记，执行 `git add -- "冲突文件的实际路径"` 后运行 `git rebase --continue`。暂时无法判断时，用 `git rebase --abort` 回到变基开始前的状态，先确认差异。不要用强制推送跳过冲突。

## 八、撤下、删除和恢复文章

### 暂时撤下，保留为草稿

先确认目标位置没有同名文件，再把正式文章移回草稿目录：

```powershell
Move-Item -LiteralPath 'source/_posts/my-first-note.md' -Destination 'source/_drafts/my-first-note.md'
git add -A -- 'source/_posts/my-first-note.md' 'source/_drafts/my-first-note.md'
npm run build
npm run check
```

检查通过后提交、推送，等待部署成功。文章会从正式博客、搜索和订阅源中移除，原 URL 通常变成 404。已有外部链接时应先安排旧地址说明或跳转；站内指向它的链接也要更新，否则链接检查可能失败。

这里提交了移动后的草稿，它仍存在于公开仓库源码中，旧版本也保留在 Git 历史里。博客撤下不等于彻底删除。重新发布时，使用 `npx hexo publish "my-first-note"`，检查模板占位内容后完成发布流程。

### 不再保留为文章

对已经由 Git 跟踪、确认不需要保留在当前源码中的文章，可以执行：

```powershell
git rm -- 'source/_posts/my-first-note.md'
```

随后修正引用它的链接，确认图片没有被其他文章使用，再决定是否清理图片。重新构建、检查、提交和推送；历史版本仍可从 Git 恢复。

当前检查要求保留至少两篇正式文章。准备撤下最初的入门文章时，先补充新内容；有意改变这个约定时，需要相应维护 `tests/site.test.mjs`，而不是跳过检查。

### 恢复误改或误删

先尝试编辑器撤销，或查看文章的历史：

```powershell
git log --oneline -- 'source/_posts/writing-with-hexo.md'
```

从某次提交找回本文时，先备份当前未完成内容，再执行下列命令；把 `GOOD_COMMIT` 换成确认过的历史提交编号：

```powershell
git restore --source=GOOD_COMMIT -- 'source/_posts/writing-with-hexo.md'
```

这会覆盖该文件当前的工作区内容，但不会自动上线。检查恢复结果后，再构建、提交和推送。

如果要撤销一个已推送的完整提交，可以在工作区干净时使用 `git revert BAD_COMMIT`，把 `BAD_COMMIT` 换成对应编号。它生成一条反向提交；确认涉及的所有文件都应回退后，完成构建检查再推送。恢复一篇文章通常不需要重写远端历史。

## 九、在 GitHub 网页上做简单修改

改错字、补一句说明，也可以在 [本文源文件页面](https://github.com/PushyTao/PushyTao.github.io/blob/main/source/_posts/writing-with-hexo.md) 点击编辑按钮，修改正文和 `updated`，预览差异后提交到 `main`，同样会触发 Actions。选择创建分支或 Pull Request 时，要等它合并到 `main` 才触发正式发布。

这种方式适合简单文字调整。大量图片、排版或配置修改仍建议本地预览和检查。网页端改过内容后，下次本地编辑前先拉取最新提交，避免两边不一致。

## 十、常见问题速查

| 现象 | 优先检查 |
| --- | --- |
| `npm ci` 提示 Node 版本不支持 | `node --version` 是否达到 22；换版本后是否重新打开终端 |
| npm 提示找不到 `package.json` | 是否进入 `D:\PushyTao.github.io` 仓库根目录 |
| PowerShell 不允许运行 `npm.ps1` | 可改用 `npm.cmd ci`、`npm.cmd run build` 等命令；`npx` 同理可用 `npx.cmd` |
| 保存后线上没变 | 是否提交、推送到 `main`，对应 `deploy` 是否成功 |
| 新文章构建成功却看不到 | 是否仍在 `_drafts/`、是否设置 `published: false`、`date` 是否晚于构建时间 |
| 草稿预览能看到，搜索却搜不到 | 搜索与 RSS 排除草稿；转为正式文章并重新构建后再查 |
| YAML 或 Markdown 构建失败 | 检查头部 `---`、空格缩进、特殊字符引号和代码块闭合 |
| 图片本地正常、线上 404 | 图片是否提交，路径是否为 `/images/...`，文件名大小写是否一致 |
| `npm run check` 报链接不存在 | 按报错页面与链接修正目标、文件名或标题锚点，不要跳过检查直接发布 |
| 改标题或文件名后旧链接失效 | 检查 `permalink`、文件名和站内引用，恢复或兼容原 URL |
| Actions 构建或部署失败 | 打开失败步骤日志，修复最早出现的具体错误，再提交推送 |
| Pages 设置异常 | 仓库 Settings → Pages → Source 应为 GitHub Actions |

## 十一、日常操作清单

1. `git status` 确认状态，在干净工作区同步 `main`。
2. 新文章从 `_drafts/` 开始；旧文章编辑 `_posts/` 中的原文件。
3. 更新正文、摘要、标签和必要的 `updated`，添加真实图片。
4. 本地预览；草稿准备好后执行 `hexo publish` 并检查生成内容。
5. 停止预览，依次执行 `npm run build` 和 `npm run check`。
6. 用明确路径暂存本次文件，查看 `git diff --cached`，再 commit、push。
7. 等待对应 Actions 部署成功，打开线上文章确认结果。

## 参考资料

本文路径、npm 脚本和发布方式以本仓库配置为准。Hexo 原生命令及字段可查阅以下官方资料：

- [Hexo 写作指南](https://hexo.io/docs/writing)
- [Hexo 命令：new、publish、server 与草稿预览](https://hexo.io/docs/commands)
- [Hexo Front-matter：标题、日期、分类与固定链接](https://hexo.io/docs/front-matter)
- [Hexo 资源文件夹与图片路径](https://hexo.io/docs/asset-folders)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
