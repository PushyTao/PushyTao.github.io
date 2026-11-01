---
title: "Using PLANS.md for multi-hour problem solving"
date: 2025-10-07 00:00:00
updated: 2026-11-01 00:00:00
description: OpenAI 的 Aaron Friel 介绍如何通过 AGENTS.md、PLANS.md 与 ExecPlan 引导 Codex 完成持续数小时的复杂任务，附完整中英对照与计划模板。
categories:
  - 技术笔记
tags:
  - OpenAI
  - Codex
  - Markdown
author: Aaron Friel (OpenAI)
source: https://github.com/openai/openai-cookbook/blob/main/articles/codex_exec_plans.md
---

**使用 PLANS.md 处理需要数小时的复杂任务**

By Aaron Friel (OpenAI)

作者：Aaron Friel（OpenAI）

> 本文来自 **OpenAI** 的 [OpenAI Cookbook](https://developers.openai.com/cookbook/articles/codex_exec_plans)，原文标题为 *Using PLANS.md for multi-hour problem solving*，发布日期为 **2025-10-07**。[GitHub 原文](https://github.com/openai/openai-cookbook/blob/main/articles/codex_exec_plans.md)采用 [MIT License](https://github.com/openai/openai-cookbook/blob/main/LICENSE)，版权归 OpenAI 所有，许可证原文保留在文末。
>
> 本站于 **2026-11-01** 整理为中英对照，中文为本站翻译，供个人学习阅读。英文在上、中文在下，保留术语、文件名与代码标识。为便于逐段阅读，原文包在大代码块中的 PLANS.md 已按章节展开，示例仍以代码块展示；需要直接使用英文模板时，请复制 GitHub 原文中的完整 PLANS.md。
>
> 原文在官方页面已标记为 archived，可能涉及过时的模型或 API。下文保留原文中的模型名称及推荐措辞。

Codex and the `gpt-5.2-codex` model (recommended) can be used to implement complex tasks that take significant time to research, design, and implement. The approach described here is one way to prompt the model to implement these tasks and to steer it towards successful completion of a project.

Codex 与 `gpt-5.2-codex` 模型（原文推荐）可以用于完成需要投入大量时间进行研究、设计和实现的复杂任务。本文介绍一种提示模型完成这些任务的方法，引导它顺利完成项目。

These plans are thorough design documents, and "living documents". As a user of Codex, you can use these documents to verify the approach that Codex will take before it begins a long implementation process. The particular `PLANS.md` included below is very similar to one that has enabled Codex to work for more than seven hours from a single prompt.

这些计划既是详尽的设计文档，也是持续更新的“living documents”。作为 Codex 用户，你可以在它开始漫长的实现过程之前，借助这些文档确认它将采用的方法。下文给出的 `PLANS.md` 与一份曾让 Codex 仅凭一次提示就持续工作超过七小时的文档非常相似。

<!-- more -->

We enable Codex to use these documents by first updating `AGENTS.md` to describe when to use `PLANS.md`, and then of course, to add the `PLANS.md` file to our repository.

要让 Codex 使用这些文档，我们首先更新 `AGENTS.md`，说明何时使用 `PLANS.md`，然后把 `PLANS.md` 文件加入仓库。

## `AGENTS.md`

[`AGENTS.md`](https://github.com/openai/agents.md) is a simple format for guiding coding agents such as Codex. We describe a term that users can use as a shorthand and a simple rule for when to use planning documents. Here, we call it an "ExecPlan". Note that this is an arbitrary term, Codex has not been trained on it. This shorthand can then be used when prompting Codex to direct it to a particular definition of a plan.

[`AGENTS.md`](https://github.com/openai/agents.md) 是一种用于指导 Codex 等 coding agents 的简单格式。我们会定义一个便于用户引用的简写术语，并给出一条关于何时使用计划文档的简单规则。这里，我们把它称为“ExecPlan”。需要注意，这个名称是自行选定的，Codex 并未针对这个术语接受训练。之后在提示 Codex 时，就可以使用这个简写，引导它遵循某个特定的计划定义。

Here's an `AGENTS.md` section instructing an agent about when to use a plan:

下面这段 `AGENTS.md` 内容告诉 agent 何时使用计划：

```md
# ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.
```

在开发复杂功能或进行重大重构时，从设计到实现的整个过程都应使用 ExecPlan（定义见 `.agent/PLANS.md`）。

## `PLANS.md`

Below is the entire document. The prompting in this document was carefully chosen to provide significant amounts of feedback to users and to guide the model to implement precisely what a plan specifies. Users may find that they benefit from customizing the file to meet their needs, or to add or remove required sections.

以下是完整文档。其中的提示措辞经过仔细选择，目的是向用户提供充分反馈，并引导模型准确实现计划规定的内容。用户可以根据自己的需要定制这个文件，或者增删必需的章节。

### Codex Execution Plans (ExecPlans):

This document describes the requirements for an execution plan ("ExecPlan"), a design document that a coding agent can follow to deliver a working feature or system change. Treat the reader as a complete beginner to this repository: they have only the current working tree and the single ExecPlan file you provide. There is no memory of prior plans and no external context.

本文档规定了 execution plan（“ExecPlan”）的要求。ExecPlan 是一份设计文档，coding agent 可以依照它交付可用的功能或系统变更。请把读者视为完全不了解这个仓库的新手：他们手中只有当前 working tree，以及你提供的这一个 ExecPlan 文件。他们不记得先前的计划，也没有外部上下文。

### How to use ExecPlans and PLANS.md

**如何使用 ExecPlans 与 PLANS.md**

When authoring an executable specification (ExecPlan), follow PLANS.md _to the letter_. If it is not in your context, refresh your memory by reading the entire PLANS.md file. Be thorough in reading (and re-reading) source material to produce an accurate specification. When creating a spec, start from the skeleton and flesh it out as you do your research.

编写可执行规格说明（ExecPlan）时，必须**严格遵循** PLANS.md。如果它不在当前上下文中，请完整阅读 PLANS.md 文件，重新了解其中的要求。应充分阅读（并反复阅读）源材料，以形成准确的规格说明。创建规格说明时，从 skeleton 开始，随着研究推进逐步补全。

When implementing an executable specification (ExecPlan), do not prompt the user for "next steps"; simply proceed to the next milestone. Keep all sections up to date, add or split entries in the list at every stopping point to affirmatively state the progress made and next steps. Resolve ambiguities autonomously, and commit frequently.

实施可执行规格说明（ExecPlan）时，不要询问用户“下一步做什么”，直接继续下一个 milestone。让所有章节保持最新；每次停下时，都要在列表中添加或拆分条目，明确说明已经取得的进展和接下来的步骤。自主解决歧义，并经常 commit。

When discussing an executable specification (ExecPlan), record decisions in a log in the spec for posterity; it should be unambiguously clear why any change to the specification was made. ExecPlans are living documents, and it should always be possible to restart from _only_ the ExecPlan and no other work.

讨论可执行规格说明（ExecPlan）时，应在规格说明中的日志里记录决策，供日后查阅；每次修改规格说明的原因都必须清晰、没有歧义。ExecPlans 是 living documents，任何时候都应能够**仅凭** ExecPlan 重新开始，而不依赖其他工作成果。

When researching a design with challenging requirements or significant unknowns, use milestones to implement proof of concepts, "toy implementations", etc., that allow validating whether the user's proposal is feasible. Read the source code of libraries by finding or acquiring them, research deeply, and include prototypes to guide a fuller implementation.

研究需求棘手或存在重大未知因素的设计时，应通过 milestones 实现 proof of concept、“toy implementations”等，以验证用户的提议是否可行。找到或获取相关库并阅读其源代码，深入研究，并纳入 prototypes，为更完整的实现提供指引。

### Requirements

**要求**

NON-NEGOTIABLE REQUIREMENTS:

**不可妥协的要求：**

* Every ExecPlan must be fully self-contained. Self-contained means that in its current form it contains all knowledge and instructions needed for a novice to succeed.

  每个 ExecPlan 都必须完全 self-contained。这意味着在它当前的形态下，已经包含让新手成功完成任务所需的全部知识与指令。

* Every ExecPlan is a living document. Contributors are required to revise it as progress is made, as discoveries occur, and as design decisions are finalized. Each revision must remain fully self-contained.

  每个 ExecPlan 都是 living document。随着工作推进、新发现出现，以及设计决策确定，贡献者必须不断修订它。每次修订后都必须保持完全 self-contained。

* Every ExecPlan must enable a complete novice to implement the feature end-to-end without prior knowledge of this repo.

  每个 ExecPlan 都必须让完全没有这个仓库背景知识的新手，也能端到端地实现该功能。

* Every ExecPlan must produce a demonstrably working behavior, not merely code changes to "meet a definition".

  每个 ExecPlan 都必须产生可以演示、确实有效的行为，而不只是为了“满足某个定义”而修改代码。

* Every ExecPlan must define every term of art in plain language or do not use it.

  每个 ExecPlan 都必须用通俗语言定义其中的所有专业术语，否则就不要使用这些术语。

Purpose and intent come first. Begin by explaining, in a few sentences, why the work matters from a user's perspective: what someone can do after this change that they could not do before, and how to see it working. Then guide the reader through the exact steps to achieve that outcome, including what to edit, what to run, and what they should observe.

目的和意图应放在最前面。先用几句话从用户的角度解释这项工作为什么重要：完成变更之后，用户能做哪些以前做不到的事，以及如何看到它实际运行。然后引导读者按照具体步骤实现这一结果，包括需要编辑什么、运行什么，以及应该观察到什么。

The agent executing your plan can list files, read files, search, run the project, and run tests. It does not know any prior context and cannot infer what you meant from earlier milestones. Repeat any assumption you rely on. Do not point to external blogs or docs; if knowledge is required, embed it in the plan itself in your own words. If an ExecPlan builds upon a prior ExecPlan and that file is checked in, incorporate it by reference. If it is not, you must include all relevant context from that plan.

执行计划的 agent 可以列出文件、读取文件、搜索、运行项目和执行测试。它不知道此前的任何上下文，也无法从早先的 milestones 推断你的意思。请重复说明你依赖的每项假设。不要让读者跳转到外部博客或文档；如果某项知识是必需的，就用自己的话把它直接写入计划。如果一个 ExecPlan 建立在先前的 ExecPlan 之上，且那个文件已经提交到仓库，就可以通过引用将其纳入；否则，必须把先前计划中的所有相关上下文写进当前计划。

### Formatting

**格式**

Format and envelope are simple and strict. Each ExecPlan must be one single fenced code block labeled as `md` that begins and ends with triple backticks. Do not nest additional triple-backtick code fences inside; when you need to show commands, transcripts, diffs, or code, present them as indented blocks within that single fence. Use indentation for clarity rather than code fences inside an ExecPlan to avoid prematurely closing the ExecPlan's code fence. Use two newlines after every heading, use # and ## and so on, and correct syntax for ordered and unordered lists.

格式和外层包裹方式既简单又严格。每个 ExecPlan 必须放在一个标记为 `md` 的 fenced code block 中，以三个反引号开头和结尾。内部不要再嵌套使用三个反引号的 code fences；需要展示命令、运行记录、diffs 或代码时，应在这个唯一的代码围栏内使用缩进块。为了避免提前关闭 ExecPlan 的 code fence，应通过缩进来保持清晰，而不是在内部再使用 code fences。每个标题后使用两个换行符，标题使用 `#`、`##` 等，并正确使用有序列表和无序列表的语法。

When writing an ExecPlan to a Markdown (.md) file where the content of the file *is only* the single ExecPlan, you should omit the triple backticks.

如果要把 ExecPlan 写入 Markdown（`.md`）文件，并且文件内容**只有**这一个 ExecPlan，就应省略外层的三个反引号。

Write in plain prose. Prefer sentences over lists. Avoid checklists, tables, and long enumerations unless brevity would obscure meaning. Checklists are permitted only in the `Progress` section, where they are mandatory. Narrative sections must remain prose-first.

使用通俗的叙述文字，优先使用完整句子而非列表。除非过于简略会使意思含糊，否则应避免 checklists、表格和冗长的枚举。只有 `Progress` 章节允许使用 checklists，而且该章节必须使用它们。叙述性章节始终应以连贯的文字为主。

### Guidelines

**指导原则**

Self-containment and plain language are paramount. If you introduce a phrase that is not ordinary English ("daemon", "middleware", "RPC gateway", "filter graph"), define it immediately and remind the reader how it manifests in this repository (for example, by naming the files or commands where it appears). Do not say "as defined previously" or "according to the architecture doc." Include the needed explanation here, even if you repeat yourself.

Self-containment 和通俗表达最为重要。如果引入不是日常英语的术语（如“daemon”“middleware”“RPC gateway”“filter graph”），就要立即给出定义，并告诉读者它在这个仓库中具体体现在哪里，例如指出它所在的文件或相关命令。不要写“如前文所定义”或“根据架构文档”。即使会重复，也要在这里写出所需的解释。

Avoid common failure modes. Do not rely on undefined jargon. Do not describe "the letter of a feature" so narrowly that the resulting code compiles but does nothing meaningful. Do not outsource key decisions to the reader. When ambiguity exists, resolve it in the plan itself and explain why you chose that path. Err on the side of over-explaining user-visible effects and under-specifying incidental implementation details.

避免常见的失败模式。不要依赖未定义的术语。不要把“功能的字面要求”限定得过于狭窄，以至于最终代码虽然能够编译，却没有任何实际作用。不要把关键决策留给读者。存在歧义时，要在计划中解决，并解释为什么选择这条路径。在详略取舍上，宁可多解释用户可见的效果，少规定无关紧要的实现细节。

Anchor the plan with observable outcomes. State what the user can do after implementation, the commands to run, and the outputs they should see. Acceptance should be phrased as behavior a human can verify ("after starting the server, navigating to [http://localhost:8080/health](http://localhost:8080/health) returns HTTP 200 with body OK") rather than internal attributes ("added a HealthCheck struct"). If a change is internal, explain how its impact can still be demonstrated (for example, by running tests that fail before and pass after, and by showing a scenario that uses the new behavior).

用可观察的结果作为计划的依据。说明实现完成后用户能够做什么、需要运行哪些命令，以及应该看到什么输出。验收要求应描述人能够验证的行为，例如“启动 server 后，访问 [http://localhost:8080/health](http://localhost:8080/health)，返回 HTTP 200，body 为 OK”，而不是内部属性，例如“增加了一个 HealthCheck struct”。如果变更只涉及内部，也要解释如何展示它的影响，例如运行在变更前失败、变更后通过的测试，并展示一个使用新行为的场景。

Specify repository context explicitly. Name files with full repository-relative paths, name functions and modules precisely, and describe where new files should be created. If touching multiple areas, include a short orientation paragraph that explains how those parts fit together so a novice can navigate confidently. When running commands, show the working directory and exact command line. When outcomes depend on environment, state the assumptions and provide alternatives when reasonable.

明确说明仓库上下文。使用相对于仓库根目录的完整路径标明文件，准确写出函数和模块的名称，并说明新文件应该创建在哪里。如果涉及多个区域，先用一小段文字解释它们如何配合，让新手能够顺利定位。运行命令时，给出工作目录和准确的命令行。如果结果依赖环境，就说明假设，并在合理的情况下提供替代方案。

Be idempotent and safe. Write the steps so they can be run multiple times without causing damage or drift. If a step can fail halfway, include how to retry or adapt. If a migration or destructive operation is necessary, spell out backups or safe fallbacks. Prefer additive, testable changes that can be validated as you go.

确保步骤具有 idempotence，并且安全。步骤应能够重复执行多次，而不会造成破坏或状态偏移。如果某一步可能中途失败，就说明如何重试或调整。如果必须执行 migration 或破坏性操作，就明确写出备份或安全的回退方案。优先采用增量添加、可测试的变更，以便在推进过程中持续验证。

Validation is not optional. Include instructions to run tests, to start the system if applicable, and to observe it doing something useful. Describe comprehensive testing for any new features or capabilities. Include expected outputs and error messages so a novice can tell success from failure. Where possible, show how to prove that the change is effective beyond compilation (for example, through a small end-to-end scenario, a CLI invocation, or an HTTP request/response transcript). State the exact test commands appropriate to the project’s toolchain and how to interpret their results.

验证不是可选项。必须写明如何运行测试、如何在适用时启动系统，以及如何观察系统确实完成了有用的工作。对于任何新增功能或能力，都要描述全面的测试方式。提供预期输出和错误信息，让新手能够区分成功与失败。在可能的情况下，说明如何通过编译之外的证据证明变更有效，例如一个小型端到端场景、一次 CLI 调用，或一段 HTTP request/response 记录。给出适用于项目 toolchain 的准确测试命令，并说明如何解读结果。

Capture evidence. When your steps produce terminal output, short diffs, or logs, include them inside the single fenced block as indented examples. Keep them concise and focused on what proves success. If you need to include a patch, prefer file-scoped diffs or small excerpts that a reader can recreate by following your instructions rather than pasting large blobs.

保存证据。当步骤产生终端输出、简短的 diffs 或日志时，应把它们作为缩进示例放入那个唯一的 fenced code block。内容应简洁，并聚焦于能够证明成功的部分。如果需要包含 patch，优先提供针对单个文件的 diffs，或读者按照说明就能重建的小段摘录，而不是粘贴大块内容。

### Milestones

**Milestones**

Milestones are narrative, not bureaucracy. If you break the work into milestones, introduce each with a brief paragraph that describes the scope, what will exist at the end of the milestone that did not exist before, the commands to run, and the acceptance you expect to observe. Keep it readable as a story: goal, work, result, proof. Progress and milestones are distinct: milestones tell the story, progress tracks granular work. Both must exist. Never abbreviate a milestone merely for the sake of brevity, do not leave out details that could be crucial to a future implementation.

Milestones 应讲清楚工作如何推进，而不是成为形式化手续。如果把工作拆分为多个 milestones，应为每个 milestone 写一小段介绍，说明范围、完成时会新增什么、需要运行哪些命令，以及预期看到哪些验收结果。让它像一个故事一样易读：目标、工作、结果、证据。Progress 与 milestones 不同：milestones 讲述整体推进过程，progress 跟踪具体工作，两者都必须存在。绝不能仅仅为了简短而压缩 milestone，也不要遗漏对后续实现可能至关重要的细节。

Each milestone must be independently verifiable and incrementally implement the overall goal of the execution plan.

每个 milestone 都必须能够独立验证，并逐步实现 execution plan 的总体目标。

### Living plans and design decisions

**持续更新的计划与设计决策**

* ExecPlans are living documents. As you make key design decisions, update the plan to record both the decision and the thinking behind it. Record all decisions in the `Decision Log` section.

  ExecPlans 是 living documents。做出关键设计决策时，要更新计划，同时记录决策及其背后的思考。所有决策都应写入 `Decision Log` 章节。

* ExecPlans must contain and maintain a `Progress` section, a `Surprises & Discoveries` section, a `Decision Log`, and an `Outcomes & Retrospective` section. These are not optional.

  ExecPlans 必须包含并持续维护 `Progress`、`Surprises & Discoveries`、`Decision Log` 和 `Outcomes & Retrospective` 章节。这些章节都不可省略。

* When you discover optimizer behavior, performance tradeoffs, unexpected bugs, or inverse/unapply semantics that shaped your approach, capture those observations in the `Surprises & Discoveries` section with short evidence snippets (test output is ideal).

  如果发现影响方案的 optimizer 行为、性能权衡、意料之外的 bugs，或 inverse/unapply semantics，就把观察结果记录到 `Surprises & Discoveries` 章节，并附上简短的证据片段，最好是测试输出。

* If you change course mid-implementation, document why in the `Decision Log` and reflect the implications in `Progress`. Plans are guides for the next contributor as much as checklists for you.

  如果在实现中途改变方向，应在 `Decision Log` 中记录原因，并在 `Progress` 中反映相应影响。计划既是你的 checklist，也是下一位贡献者的指南。

* At completion of a major task or the full plan, write an `Outcomes & Retrospective` entry summarizing what was achieved, what remains, and lessons learned.

  完成一项主要任务或整个计划时，应撰写一条 `Outcomes & Retrospective` 记录，总结已经完成什么、还有什么未完成，以及得到的经验。

### Prototyping milestones and parallel implementations

**Prototyping milestones 与 parallel implementations**

It is acceptable—-and often encouraged—-to include explicit prototyping milestones when they de-risk a larger change. Examples: adding a low-level operator to a dependency to validate feasibility, or exploring two composition orders while measuring optimizer effects. Keep prototypes additive and testable. Clearly label the scope as “prototyping”; describe how to run and observe results; and state the criteria for promoting or discarding the prototype.

如果明确设置 prototyping milestones 能够降低大型变更的风险，那么这样做是可以接受的，而且通常值得鼓励。例如：向某个依赖添加一个底层 operator，以验证可行性；或者探索两种组合顺序，同时测量 optimizer 的影响。Prototypes 应以增量添加的方式实现，并保持可测试。明确把范围标记为“prototyping”，描述如何运行和观察结果，并说明将 prototype 推进到正式实现或舍弃它的判定标准。

Prefer additive code changes followed by subtractions that keep tests passing. Parallel implementations (e.g., keeping an adapter alongside an older path during migration) are fine when they reduce risk or enable tests to continue passing during a large migration. Describe how to validate both paths and how to retire one safely with tests. When working with multiple new libraries or feature areas, consider creating spikes that evaluate the feasibility of these features _independently_ of one another, proving that the external library performs as expected and implements the features we need in isolation.

优先先添加代码，再在保持测试通过的前提下删减。只要能降低风险，或让测试在大型 migration 期间继续通过，就可以保留 parallel implementations，例如在 migration 期间，让一个 adapter 与旧路径并存。说明如何验证两条路径，以及如何在测试保障下安全移除其中一条。同时处理多个新库或功能领域时，可以考虑编写 spikes，彼此**独立地**评估这些功能的可行性，证明外部库的行为符合预期，并且能够独立提供我们需要的能力。

### Skeleton of a Good ExecPlan

**一个好的 ExecPlan 的 skeleton**

```md
# <Short, action-oriented description>
```

简短、以行动为导向的描述。

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

这个 ExecPlan 是一份 living document。随着工作推进，必须持续更新 `Progress`、`Surprises & Discoveries`、`Decision Log` 和 `Outcomes & Retrospective` 章节。

If PLANS.md file is checked into the repo, reference the path to that file here from the repository root and note that this document must be maintained in accordance with PLANS.md.

如果 PLANS.md 文件已经提交到仓库，请在这里引用它相对于仓库根目录的路径，并注明本文档必须按照 PLANS.md 的要求维护。

#### Purpose / Big Picture

**目的与整体图景**

Explain in a few sentences what someone gains after this change and how they can see it working. State the user-visible behavior you will enable.

用几句话说明这项变更会给用户带来什么，以及如何看到它实际运行。明确写出将要实现的用户可见行为。

#### Progress

**进展**

Use a list with checkboxes to summarize granular steps. Every stopping point must be documented here, even if it requires splitting a partially completed task into two (“done” vs. “remaining”). This section must always reflect the actual current state of the work.

使用带 checkboxes 的列表概括具体步骤。每次停下时都必须在这里记录，即使需要把部分完成的任务拆为“已完成”和“剩余”两项。这个章节必须始终反映工作的真实现状。

```md
- [x] (2025-10-01 13:00Z) Example completed step.
- [ ] Example incomplete step.
- [ ] Example partially completed step (completed: X; remaining: Y).
```

```md
- [x] (2025-10-01 13:00Z) 已完成步骤示例。
- [ ] 未完成步骤示例。
- [ ] 部分完成步骤示例（已完成：X；剩余：Y）。
```

Use timestamps to measure rates of progress.

使用 timestamps 衡量推进速度。

#### Surprises & Discoveries

**意外情况与发现**

Document unexpected behaviors, bugs, optimizations, or insights discovered during implementation. Provide concise evidence.

记录实现过程中发现的意外行为、bugs、优化或见解，并提供简洁的证据。

```md
- Observation: …
  Evidence: …
```

`Observation` 记录观察结果，`Evidence` 记录相应证据。

#### Decision Log

**决策日志**

Record every decision made while working on the plan in the format:

按照以下格式记录推进计划时做出的每一项决策：

```md
- Decision: …
  Rationale: …
  Date/Author: …
```

`Decision` 记录决策，`Rationale` 记录理由，`Date/Author` 记录日期与作者。

#### Outcomes & Retrospective

**成果与回顾**

Summarize outcomes, gaps, and lessons learned at major milestones or at completion. Compare the result against the original purpose.

在主要 milestones 结束或全部工作完成时，总结成果、差距和经验，并将结果与最初的目的进行比较。

#### Context and Orientation

**上下文与导览**

Describe the current state relevant to this task as if the reader knows nothing. Name the key files and modules by full path. Define any non-obvious term you will use. Do not refer to prior plans.

假设读者对项目一无所知，描述与当前任务相关的现状。使用完整路径标明关键文件和模块。定义接下来会使用的任何不容易理解的术语。不要引用先前的计划。

#### Plan of Work

**工作计划**

Describe, in prose, the sequence of edits and additions. For each edit, name the file and location (function, module) and what to insert or change. Keep it concrete and minimal.

用连贯的文字描述编辑和新增内容的顺序。对每一处编辑，写明文件、位置（函数、模块），以及需要插入或修改的内容。保持具体，并只包含必要内容。

#### Concrete Steps

**具体步骤**

State the exact commands to run and where to run them (working directory). When a command generates output, show a short expected transcript so the reader can compare. This section must be updated as work proceeds.

写明需要运行的准确命令，以及运行位置（工作目录）。当命令产生输出时，展示一小段预期输出记录，供读者对照。随着工作推进，必须持续更新这个章节。

#### Validation and Acceptance

**验证与验收**

Describe how to start or exercise the system and what to observe. Phrase acceptance as behavior, with specific inputs and outputs. If tests are involved, say "run `<project’s test command>` and expect `<N>` passed; the new test `<name>` fails before the change and passes after>".

说明如何启动或实际操作系统，以及应该观察什么。用行为来表述验收要求，给出具体的输入和输出。如果涉及测试，应明确说明：“运行 `<项目的测试命令>`，预期 `<N>` 项通过；新增测试 `<name>` 在变更前失败、变更后通过。”

#### Idempotence and Recovery

**Idempotence 与恢复**

If steps can be repeated safely, say so. If a step is risky, provide a safe retry or rollback path. Keep the environment clean after completion.

如果步骤可以安全地重复执行，就明确说明。如果某一步存在风险，应提供安全的重试或 rollback 路径。完成后保持环境整洁。

#### Artifacts and Notes

**Artifacts 与备注**

Include the most important transcripts, diffs, or snippets as indented examples. Keep them concise and focused on what proves success.

将最重要的运行记录、diffs 或代码片段作为缩进示例放在这里。保持简洁，并聚焦于能证明成功的内容。

#### Interfaces and Dependencies

**Interfaces 与依赖**

Be prescriptive. Name the libraries, modules, and services to use and why. Specify the types, traits/interfaces, and function signatures that must exist at the end of the milestone. Prefer stable names and paths such as `crate::module::function` or `package.submodule.Interface`. E.g.:

给出明确规定。说明要使用哪些库、模块和服务，以及选择它们的原因。指定 milestone 结束时必须具备的 types、traits/interfaces 和函数签名。优先使用稳定的名称和路径，例如 `crate::module::function` 或 `package.submodule.Interface`。例如：

In crates/foo/planner.rs, define:

在 `crates/foo/planner.rs` 中定义：

```rust
pub trait Planner {
    fn plan(&self, observed: &Observed) -> Vec<Action>;
}
```

If you follow the guidance above, a single, stateless agent -- or a human novice -- can read your ExecPlan from top to bottom and produce a working, observable result. That is the bar: SELF-CONTAINED, SELF-SUFFICIENT, NOVICE-GUIDING, OUTCOME-FOCUSED.

遵循上述指导后，一个没有历史状态的 agent，或一个人类新手，就应该能够从头到尾阅读 ExecPlan，并产出可运行、可观察的结果。这就是标准：SELF-CONTAINED、SELF-SUFFICIENT、NOVICE-GUIDING、OUTCOME-FOCUSED。

When you revise a plan, you must ensure your changes are comprehensively reflected across all sections, including the living document sections, and you must write a note at the bottom of the plan describing the change and the reason why. ExecPlans must describe not just the what but the why for almost everything.

修订计划时，必须确保变更完整地反映在所有章节中，包括需要持续更新的章节；同时必须在计划底部写一条说明，描述改了什么，以及为什么修改。对于几乎所有事项，ExecPlans 都应不仅说明做什么，还要说明为什么这样做。

## 来源与许可证

原作者：**Aaron Friel（OpenAI）**。英文正文及模板来自 [OpenAI Cookbook 的 codex_exec_plans.md](https://github.com/openai/openai-cookbook/blob/main/articles/codex_exec_plans.md)；作者与发布日期见 [OpenAI 官方文章页](https://developers.openai.com/cookbook/articles/codex_exec_plans)。中文翻译与中英对照排版由本站整理。

以下按上游仓库保留 MIT License 原文：

```text
MIT License

Copyright (c) 2025 OpenAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
