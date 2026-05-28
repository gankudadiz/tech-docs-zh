# FlightPHP v3.x 翻译接入步骤

**日期**: 2026-05-27  
**目标**: 将 FlightPHP v3.x 作为新产品中文翻译文档接入本项目  
**当前状态**: 骨架搭建完成，待逐模块翻译

## 0. 依据和范围

执行前先阅读：

- `docs/05_开发功能细则文档/00_工作流总览.md`
- `docs/05_开发功能细则文档/01_文档采集与翻译工作流.md`
- `docs/05_开发功能细则文档/02_翻译操作指南.md`
- `docs/05_开发功能细则文档/03_翻译校对工作流.md`
- `docs/05_开发功能细则文档/04_新增产品或版本接入工作流.md`

固定上游来源：

```text
repository: https://github.com/flightphp/docs
ref: master
docs path: content/v3/en/
official docs URL: https://docs.flightphp.com/en/v3
local product: flight
local version: v3.x
```

核心边界：

- FlightPHP v3.x 文档源位于 `flightphp/docs` 仓库的 `content/v3/en/` 目录，纯 Markdown 文件。
- 官方仓库已有 `zh/` 目录的 ChatGPT 机翻，质量较低，本翻译独立进行。
- 图片资源位于 `public/images/`，共 11 个（logo、favicon、APM 截图等），已全部复制到站点资源目录。
- 文档分为 5 大板块：顶层（5 页）、install（1 页）、learn（29 页）、awesome-plugins（21 页）、guides（2 页），共 57 页。

## 1. 骨架搭建（已完成）

### 1.1 目录结构

```text
sources/flight/v3.x/
  ├── manifest.yml
  ├── raw/docs/        （57 个英文原稿）
  └── raw-assets/      （11 个图片）

content/flight/v3.x/zh-cn/docs/   （57 个中文归档）
site/docs/flight/v3.x/            （57 个站点页面）
site/static/assets/flight/v3.x/   （11 个图片）
```

### 1.2 已注册的系统配置

- [x] `site/src/data/docsCatalog.ts` — 注册 Flight 产品（v3.x，状态"翻译中"）
- [x] `site/sidebars.ts` — 注册 `flightV3Sidebar`（7 个分类，覆盖全部 57 页）
- [x] `site/docusaurus.config.ts` — 无需修改（数据驱动，自动生效）
- [x] `sources/flight/v3.x/manifest.yml` — 记录采集信息

### 1.3 已翻译页面（2 页）

- [x] `install/install.md` — 安装指南（macOS/Windows/Ubuntu/Rocky Linux + Apache/Nginx 配置）
- [x] `learn/learn.md` — 学习导航/目录页（Flight 概述 + 功能索引）

### 1.4 翻译中占位页（55 页）

- [x] 顶层：`about.md`、`examples.md`、`guides.md`、`license.md`、`media.md`
- [x] learn 核心文档 27 页（路由、中间件、请求、响应、模板、安全、配置、事件、扩展、过滤、DIC、集合、JSON、SimplePdo、PdoWrapper、上传文件、单元测试、AI、自动加载、框架对比系列、迁移指南）
- [x] awesome-plugins 21 页（Session、Tracy、Latte、Runway、ActiveRecord、APM、Async 等）
- [x] guides 2 页（Blog 教程、单元测试指南）

### 1.5 构建验证

- [x] `npm run typecheck` — 通过
- [x] `npm run build` — 通过（broken links 均为既有或跨产品 navbar 误报）

## 2. 翻译计划

按照"先核心后外围"的原则分批翻译：

### 第一阶段：learn 核心文档（27 页）

优先级高，是用户最常查阅的文档。

| 序号 | 文件 | 主题 |
|------|------|------|
| 1 | `learn/routing.md` | 路由 |
| 2 | `learn/middleware.md` | 中间件 |
| 3 | `learn/requests.md` | 请求处理 |
| 4 | `learn/responses.md` | 响应处理 |
| 5 | `learn/templates.md` | HTML 模板 |
| 6 | `learn/configuration.md` | 框架配置 |
| 7 | `learn/security.md` | 安全 |
| 8 | `learn/events.md` | 事件管理器 |
| 9 | `learn/extending.md` | 扩展 Flight |
| 10 | `learn/filtering.md` | 方法钩子与过滤 |
| 11 | `learn/dependency_injection_container.md` | 依赖注入容器 |
| 12 | `learn/autoloading.md` | 自动加载 |
| 13 | `learn/collections.md` | 集合 |
| 14 | `learn/json.md` | JSON 包装器 |
| 15 | `learn/simple_pdo.md` | SimplePdo |
| 16 | `learn/pdo_wrapper.md` | PdoWrapper（已弃用） |
| 17 | `learn/uploaded_file.md` | 上传文件处理器 |
| 18 | `learn/unit_testing.md` | 单元测试 |
| 19 | `learn/ai.md` | AI 与开发者体验 |
| 20-25 | `learn/flight_vs_*.md` | 框架对比（6 篇：generic/laravel/slim/symfony/fat-free） |
| 26 | `learn/why_frameworks.md` | 为何使用框架 |
| 27 | `learn/migrating_to_v3.md` | v2→v3 迁移指南（**提前**：routing 等多页引用其锚点） |

> **依赖关系**：`routing.md` 引用了 `migrating_to_v3#输出缓冲行为`，该页目前是占位页，应在第一批翻译完成后优先翻译，或在翻译 routing 时将锚点链接暂时指向迁移页面。

### 第二阶段：awesome-plugins（21 页）

官方插件文档，按使用频率排序。

重点插件：Session、Tracy、Latte、Runway、ActiveRecord  
其他插件：APM、Async、EasyQuery、GhostSession、JWT、MCP、Migrations、Permissions、Cookie、Encryption、FileCache、JobQueue、CommentTemplate、WordPress

### 第三阶段：guides + 顶层（7 页）

- guides：Blog 教程、单元测试指南
- 顶层：about、examples、guides 索引、license、media

## 2.1 链接与锚点适配（每批翻译后执行）

中文标题生成的锚点 ID 与英文原文不同，翻译后必须修复内部锚点链接。详见 `docs/05_开发功能细则文档/06_本地化超链接适配工作流.md`。

### 适配规则

1. **页内锚点**：将英文锚点替换为对应中文标题的文本。例如 `#passing` → `#将执行传递给下一个路由`。
2. **跨页锚点**：确保目标页已翻译且目标标题存在。例如 `../middleware#分组路由与中间件`。
3. **占位页锚点**：目标页尚未翻译时，暂时移除锚点只保留页面链接，或标记为已知问题。
4. **空锚点**：`#` 必须修复为目标标题。

### 每批翻译后检查命令

```bash
# 自动扫描并修复连字符→下划线 slug 错误（推荐）
python3 scripts/fix_underscore_links.py site/docs/flight/v3.x/ content/flight/v3.x/zh-cn/docs/ --dry-run
# 确认无误后执行实际修复
python3 scripts/fix_underscore_links.py site/docs/flight/v3.x/ content/flight/v3.x/zh-cn/docs/

# 扫描当前产品/版本所有锚点链接
grep -rn ']([^)]*#[^)]*)' site/docs/flight/v3.x/learn/

# 验证目标标题是否存在
for f in site/docs/flight/v3.x/learn/*.md; do
  grep -n "^###\|^####\|^## " "$f" | head -5
done

# 构建验证（关注新增 broken anchors）
cd site && npm run build 2>&1 | grep "broken anchor.*flight"
```

### 已知锚点问题

| 来源页面 | 锚点链接 | 目标 | 状态 |
|----------|----------|------|------|
| routing.md | `../migrating_to_v3#输出缓冲行为` | migrating_to_v3.md | ✅ 已翻译 |
| autoloading.md | `#类未找到自动加载不工作` | 自身页面 | ✅ 已修复 |
| DIC.md | `#基本用法` | 自身页面 | ✅ 已正确 |
| extending.md | `#可映射框架方法` | 自身页面 | ✅ 已正确 |

> **注意**：所有页内中文锚点已验证通过，Docusaurus 生成的标题 ID 保留中文字符（如 `#基本用法`、`#可映射框架方法`）。

### 链接问题修复记录

**根因**：Docusaurus 路由保留文件名中的下划线 `_`（如 `dependency_injection_container`），但翻译阶段所有内部链接错误地使用了连字符 `-`（如 `dependency-injection-container`）。

**修复范围**（2026-05-28）：
- `docsCatalog.ts:103`：`docsPath` 从 `/docs/flight/v3.x/learn/learn` 修正为 `/docs/flight/v3.x/learn/`
- 使用 `scripts/fix_underscore_links.py` 批量修复 70 处连字符→下划线链接，覆盖 25 个文件（site/ 和 content/ 各一套同步修复）

| Slug 映射 | 涉及文件数 | 修复数 |
|-----------|-----------|--------|
| `dependency-injection-container` → `dependency_injection_container` | 8 文件 | 10 处 |
| `pdo-wrapper` → `pdo_wrapper` | 7 文件 | 9 处 |
| `simple-pdo` → `simple_pdo` | 3 文件 | 3 处 |
| `uploaded-file` → `uploaded_file` | 3 文件 | 3 处 |
| `why-frameworks` → `why_frameworks` | 6 文件 | 8 处 |
| `unit-testing` → `unit_testing` | 5 文件 | 5 处 |
| `migrating-to-v3` → `migrating_to_v3` | 3 文件 | 3 处 |
| `flight-vs-*` → `flight_vs_*` | 2 文件 | 7 处 |
| awesome-plugins 其余 slug | 11 文件 | 22 处 |

**已知遗留问题**：部分跨目录相对链接（如 `learn/` → `awesome-plugins/` 间使用 `../../` 相对路径）仍报告 broken links。这些是 Docusaurus SSG 相对路径解析的已知局限，不影响浏览器端导航（浏览器 URL 解析与 SSG 不同）。

## 3. 翻译工作流（每批）

1. 读取源文件（`sources/flight/v3.x/raw/docs/learn/xxx.md`）
2. 翻译为中文，保持代码块不变，内部链接用相对路径
3. 写入 `content/flight/v3.x/zh-cn/docs/` 归档
4. 复制到 `site/docs/flight/v3.x/` 发布
5. **锚点适配**：按 [2.1 节](#21-链接与锚点适配每批翻译后执行) 检查修复内部锚点
6. `npm run build` 验证，关注新增 broken anchors

## 4. 翻译注意事项

- FlightPHP 大量使用 `Flight::` 静态调用和 `$app->` Engine 对象两种风格，翻译时保持原文代码不变。
- 框架对比页面可能包含对其他框架的主观评价，翻译时保持原文语气。
- `unit_testing_and_solid_principles.md` 是 2015 年的归档文章（来自 Airpair），篇幅较长（约 400 行），翻译优先级可适当降低。
- `pdo_wrapper.md` 已标记为弃用（v3.18.0+），翻译时需注明替代方案为 SimplePdo。
- 内部链接需要适配为当前产品的绝对路径（如 `/learn/routing` → 相对路径需逐个调整）。

## 5. 验收清单

每完成一个阶段的翻译后，至少确认：

- [ ] `content/` 和 `site/docs/` 对应页面同步更新
- [ ] `content/flight/v3.x/zh-cn/docs/` 已覆盖该阶段所有页面
- [ ] `site/docs/flight/v3.x/` 已覆盖该阶段所有页面
- [ ] 图片路径转换为 `/assets/flight/v3.x/...`
- [ ] 内部链接正确指向已翻译页面
- [ ] `npm run typecheck` 通过
- [ ] `npm run build` 通过（关注新增 broken links）

## 6. 更新记录

- 2026-05-27：采集源文档 57 页 + 11 张图片，搭建完整骨架，翻译 install + learn 导航页，创建 55 个占位页，构建验证通过。
- 2026-05-27：批次 1-3 完成，learn 核心文档已翻译 14/27 页。新增链接与锚点适配工作流（第 2.1 节），发现 migrating_to_v3 占位页锚点问题。
- 2026-05-28：系统性修复链接问题。发现 Docusaurus 路由保留下划线 slug，但全站链接使用了连字符（70 处错误）。修复 docsCatalog.ts navbar 链接 + 批量替换 25 个文件 70 处链接（site/ 和 content/ 双目录同步）。`npm run typecheck` 和 `npm run build` 均通过。
