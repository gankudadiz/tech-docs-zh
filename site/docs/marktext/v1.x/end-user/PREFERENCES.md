---
title: 偏好设置
description: MarkText 所有可配置选项参考
sidebar_position: 10
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/PREFERENCES.md
translation_status: translated
---

# 偏好设置

偏好设置可以在设置窗口中控制和修改，也可以通过[应用数据目录](APPLICATION_DATA_DIRECTORY.md)中的 `preferences.json` 文件修改。完整的键名、默认值和可选值列表位于 `src/main/preferences/schema.json`——下表反映了该 schema。

#### 通用

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| autoSave | Boolean | `false` | 自动保存正在编辑的内容。 |
| autoSaveDelay | Number | `5000` | 更改后自动保存的延迟（毫秒）。最小值 `1000`。 |
| titleBarStyle | String | `custom` | Linux 和 Windows 上的标题栏样式：`custom` 或 `native`。 |
| openFilesInNewWindow | Boolean | `false` | 在新窗口中打开文件。 |
| openFolderInNewWindow | Boolean | `false` | 通过菜单在新窗口中打开文件夹。 |
| zoom | Number | `1.0` | 缩放级别。范围 `0.5` 到 `2.0`。 |
| hideScrollbar | Boolean | `false` | 是否隐藏滚动条。 |
| wordWrapInToc | Boolean | `false` | 是否在目录中启用自动换行。 |
| fileSortBy | String | `modified` | 打开文件夹中的文件排序方式。可选值：`created`、`modified`、`title`。 |
| fileSortOrder | String | `asc` | 文件排序顺序：`asc`（升序）或 `desc`（降序）。 |
| startUpAction | String | `restoreAll` | MarkText 启动时的操作。可选值：`folder`、`openLastFolder`、`blank`、`restoreAll`。 |
| defaultDirectoryToOpen | String | `""` | 当 `startUpAction=folder` 时要打开的路径。 |
| language | String | `en` | MarkText 使用的显示语言。 |
| restoreLayoutState | Boolean | `true` | 启动时恢复上次的编辑器状态（打开的标签页、布局）。 |
| openedFilesInSidebar | Boolean | `true` | 是否在侧边栏文件树中显示*已打开文件*子节点。 |

#### 编辑器

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| editorFontFamily | String | `Open Sans` | 编辑器字体。 |
| fontSize | Number | `16` | 字体大小（像素）。范围 `12`–`32`。 |
| lineHeight | Number | `1.6` | 行高。范围 `1.2`–`2.0`。 |
| wrapCodeBlocks | Boolean | `true` | 代码块内自动换行。 |
| editorLineWidth | String | `""` | 编辑器区域最大宽度。空值或带 `ch`、`px`、`%` 后缀的值。 |
| codeFontSize | Number | `14` | 代码块内字体大小。范围 `12`–`28`。 |
| codeFontFamily | String | `DejaVu Sans Mono` | 代码块字体。 |
| codeBlockLineNumbers | Boolean | `true` | 代码块内显示行号。 |
| trimUnnecessaryCodeBlockEmptyLines | Boolean | `true` | 去除代码块首尾的空行。 |
| autoPairBracket | Boolean | `true` | 编辑时自动闭合括号。 |
| autoPairMarkdownSyntax | Boolean | `true` | 自动补全 Markdown 语法。 |
| autoPairQuote | Boolean | `true` | 自动闭合引号。 |
| endOfLine | String | `default` | 每行末尾的换行符：`default`（操作系统默认）、`lf` 或 `crlf`。 |
| defaultEncoding | String | `utf8` | 默认文件编码。完整枚举见 `src/main/preferences/schema.json`（35 种编码）。 |
| autoGuessEncoding | Boolean | `true` | 打开文件时尝试自动猜测编码。 |
| trimTrailingNewline | Number | `2` | 尾部换行处理：`0` 去除所有，`1` 确保单个换行，`2` 自动检测，`3` 禁用。 |
| textDirection | String | `ltr` | 书写方向：`ltr` 或 `rtl`。 |
| hideQuickInsertHint | Boolean | `false` | 隐藏快速插入覆盖层的提示。 |
| hideLinkPopup | Boolean | `false` | 隐藏光标悬停在链接上时的弹出窗口。 |
| autoCheck | Boolean | `false` | 切换一个任务项时是否自动检查相关任务项。 |
| autoNormalizeLineEndings | Boolean | `false` | 打开文件时自动规范化换行符。禁用时按原样打开文件。 |

#### Markdown

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| preferLooseListItem | Boolean | `true` | 首选列表类型。 |
| bulletListMarker | String | `-` | 无序列表标记。可选值：`-`、`*`、`+`。 |
| orderListDelimiter | String | `.` | 有序列表分隔符。可选值：`.`、`)`。 |
| preferHeadingStyle | String | `atx` | 标题样式。可选值：`atx`、`setext`（[详情](https://spec.commonmark.org/0.31.2/#atx-headings)）。 |
| tabSize | Number | `4` | 制表符等于的空格数。 |
| listIndentation | Mixed | `1` | 列表缩进。可选值：`dfm`、`tab` 或数字 `1`–`4`。 |
| frontmatterType | String | `-` | Frontmatter 分隔符：`-`（YAML）、`+`（TOML）、`;`（JSON）或 `{`（JSON）。 |
| superSubScript | Boolean | `false` | 启用 Pandoc 的上标/下标 Markdown 扩展。 |
| footnote | Boolean | `false` | 启用 Pandoc 的脚注 Markdown 扩展。 |
| isHtmlEnabled | Boolean | `true` | 启用行内 HTML 渲染。 |
| isGitlabCompatibilityEnabled | Boolean | `false` | 启用 GitLab 兼容模式。 |
| sequenceTheme | String | `hand` | [js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/) 主题：`hand` 或 `simple`。 |

#### 主题

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| theme | String | `light` | 当前主题 ID。完整列表见[主题](THEMES.md)。 |
| followSystemTheme | Boolean | `false` | 跟随系统深色/浅色模式自动切换。 |
| lightModeTheme | String | `light` | 系统浅色模式时使用的主题 ID（仅当 `followSystemTheme` 为 `true` 时生效）。 |
| darkModeTheme | String | `dark` | 系统深色模式时使用的主题 ID（仅当 `followSystemTheme` 为 `true` 时生效）。 |

#### 拼写

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| spellcheckerEnabled | Boolean | `false` | 是否启用拼写检查。 |
| spellcheckerNoUnderline | Boolean | `false` | 不为拼写错误添加下划线。 |
| spellcheckerLanguage | String | `en-US` | 拼写检查器语言（BCP-47 格式，如 `en-US`、`de-DE`、`zh-CN`）。 |

#### 图片

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| imageInsertAction | String | `path` | 插入本地图片后的默认操作：`upload`、`folder` 或 `path`。 |
| imagePreferRelativeDirectory | Boolean | `false` | 复制图片时优先使用相对图片目录。 |
| imageRelativeDirectoryBase | String | `file` | 相对图片锚定位置：`file`（文档旁）或 `folder`（项目根目录）。 |
| imageRelativeDirectoryName | String | `assets` | 用于本地图片复制的文件夹名称（或相对路径）。支持 `${filename}` 变量。 |

#### 仅通过文件编辑

这些条目在 schema 中标记为 `--internal`。它们没有 UI 控件，必须直接在 `preferences.json` 中编辑。

##### 视图

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| sideBarVisibility | Boolean | `false` | 侧边栏的初始可见性。会被菜单/快捷键覆盖。 |
| tabBarVisibility | Boolean | `false` | 标签栏的初始可见性。会被菜单/快捷键覆盖。 |
| sourceCodeModeEnabled | Boolean | `false` | 源码模式的初始状态。会被菜单/快捷键覆盖。 |

##### 通用（内部）

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| lastOpenedFolder | String | `""` | MarkText 最后打开的文件夹（用于会话恢复）。 |

##### 自定义 CSS

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| customCss | String | `""` | 在活动主题样式表之后附加的额外 CSS。 |

##### 文件系统 / 搜索

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| searchExclusions | Array of Strings | `[]` | 文件夹搜索的文件名 glob 排除项。 |
| searchMaxFileSize | String | `""` | 搜索的最大文件大小（如 `50K`、`10M`、`2G`）。空表示无限制。 |
| searchIncludeHidden | Boolean | `false` | 搜索隐藏文件和目录。 |
| searchNoIgnore | Boolean | `false` | 不遵守 `.gitignore` 等忽略文件。 |
| searchFollowSymlinks | Boolean | `true` | 是否跟随符号链接。 |

##### 文件监视

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| watcherUsePolling | Boolean | `false` | 使用轮询接收文件更改。网络共享时需要；可能导致大型工作区 CPU 占用过高。 |
