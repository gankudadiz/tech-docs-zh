---
title: Windows 快捷键
description: MarkText Windows 平台快捷键参考
sidebar_position: 13
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/KEYBINDINGS_WINDOWS.md
translation_status: translated
---

# Windows 快捷键

MarkText 的 Windows 平台快捷键。请参阅[通用快捷键](KEYBINDINGS.md)了解如何使用自定义快捷键。


## Available menu key bindings

#### File menu

| Id                     | Default                                       | Description                           |
| :--------------------- | --------------------------------------------- | ------------------------------------- |
| `file.new-window`      | <kbd>Ctrl</kbd>+<kbd>N</kbd>                  | 新建窗口                |
| `file.new-tab`         | <kbd>Ctrl</kbd>+<kbd>T</kbd>                  | 新建 tab                |
| `file.open-file`       | <kbd>Ctrl</kbd>+<kbd>O</kbd>                  | 打开 markdown 文件       |
| `file.open-folder`     | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd> | 打开文件夹              |
| `file.save`            | <kbd>Ctrl</kbd>+<kbd>S</kbd>                  | 保存                    |
| `file.save-as`         | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> | 另存为                  |
| `file.export-file.pdf` | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd>   | 导出为 PDF              |
| `file.move-file`       | -                                             | 移动当前文件到其他位置    |
| `file.rename-file`     | -                                             | 重命名当前文件           |
| `file.print`           | -                                             | 打印当前 tab            |
| `file.preferences`     | <kbd>Ctrl</kbd>+<kbd>,</kbd>                  | 打开设置窗口            |
| `file.close-tab`       | <kbd>Ctrl</kbd>+<kbd>W</kbd>                  | 关闭 tab                |
| `file.close-window`    | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd> | 关闭窗口                |
| `file.quit`            | <kbd>Ctrl</kbd>+<kbd>Q</kbd>                  | 退出 MarkText           |

#### Edit menu

| Id                        | Default                                       | Description                                     |
| :------------------------ | --------------------------------------------- | ----------------------------------------------- |
| `edit.undo`               | <kbd>Ctrl</kbd>+<kbd>Z</kbd>                  | 撤销上一步操作                    |
| `edit.redo`               | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | 重做上一步操作                    |
| `edit.cut`                | <kbd>Ctrl</kbd>+<kbd>X</kbd>                  | 剪切选中文本                      |
| `edit.copy`               | <kbd>Ctrl</kbd>+<kbd>C</kbd>                  | 复制选中文本                      |
| `edit.paste`              | <kbd>Ctrl</kbd>+<kbd>V</kbd>                  | 粘贴文本                          |
| `edit.copy-as-rich`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> | 复制选中文本为 markdown 格式       |
| `edit.copy-as-html`       | -                                             | 复制选中文本为 HTML 格式           |
| `edit.paste-as-plaintext` | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> | 粘贴为纯文本                      |
| `edit.select-all`         | <kbd>Ctrl</kbd>+<kbd>A</kbd>                  | 全选文档文本                      |
| `edit.duplicate`          | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>P</kbd>   | 复制当前段落                      |
| `edit.create-paragraph`   | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd> | 在当前段落后新建段落               |
| `edit.delete-paragraph`   | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> | 删除当前段落                      |
| `edit.find`               | <kbd>Ctrl</kbd>+<kbd>F</kbd>                  | 在文档中查找                      |
| `edit.find-next`          | <kbd>F3</kbd>                                 | 继续搜索，查找下一个匹配项         |
| `edit.find-previous`      | <kbd>Shift</kbd>+<kbd>F3</kbd>                | 继续搜索，查找上一个匹配项         |
| `edit.replace`            | <kbd>Ctrl</kbd>+<kbd>R</kbd>                  | 替换查找内容                      |
| `edit.find-in-folder`     | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> | 在已打开的文件夹中搜索包含关键词的文件 |

#### Paragraph menu

| Id                          | Default                                       | Description                              |
| --------------------------- | --------------------------------------------- | ---------------------------------------- |
| `paragraph.heading-1`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd> | 设置为 heading 1                  |
| `paragraph.heading-2`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>2</kbd> | 设置为 heading 2                  |
| `paragraph.heading-3`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>3</kbd> | 设置为 heading 3                  |
| `paragraph.heading-4`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>4</kbd> | 设置为 heading 4                  |
| `paragraph.heading-5`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>5</kbd> | 设置为 heading 5                  |
| `paragraph.heading-6`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>6</kbd> | 设置为 heading 6                  |
| `paragraph.upgrade-heading` | <kbd>Ctrl</kbd>+<kbd>Plus</kbd>               | 提升 heading 等级                 |
| `paragraph.degrade-heading` | <kbd>Ctrl</kbd>+<kbd>-</kbd>                  | 降低 heading 等级                 |
| `paragraph.table`           | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> | 插入表格                         |
| `paragraph.code-fence`      | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>K</kbd> | 插入代码块                       |
| `paragraph.quote-block`     | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd> | 插入引用块                       |
| `paragraph.math-formula`    | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>   | 插入数学公式块                    |
| `paragraph.html-block`      | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>H</kbd>   | 插入 HTML 块                     |
| `paragraph.order-list`      | <kbd>Ctrl</kbd>+<kbd>G</kbd>                  | 插入有序列表                      |
| `paragraph.bullet-list`     | <kbd>Ctrl</kbd>+<kbd>H</kbd>                  | 插入无序列表                      |
| `paragraph.task-list`       | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>X</kbd>   | 插入任务列表                      |
| `paragraph.loose-list-item` | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd>   | 将列表项转换为宽松列表项           |
| `paragraph.paragraph`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>0</kbd> | 将 heading 转换为普通段落           |
| `paragraph.horizontal-line` | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>U</kbd> | 插入水平线                        |
| `paragraph.front-matter`    | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Y</kbd>   | 插入 YAML frontmatter 块           |

#### Format menu

| Id                    | Default                                       | Description                                     |
| --------------------- | --------------------------------------------- | ----------------------------------------------- |
| `format.strong`       | <kbd>Ctrl</kbd>+<kbd>B</kbd>                  | 加粗选中文本                          |
| `format.emphasis`     | <kbd>Ctrl</kbd>+<kbd>I</kbd>                  | 斜体选中文本                          |
| `format.underline`    | <kbd>Ctrl</kbd>+<kbd>U</kbd>                  | 为选中文本添加下划线                   |
| `format.superscript`  | -                                             | 将选中文本设置为上标                   |
| `format.subscript`    | -                                             | 将选中文本设置为下标                   |
| `format.highlight`    | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd> | 高亮选中文本                          |
| `format.inline-code`  | <kbd>Ctrl</kbd>+<kbd>`</kbd>                  | 将选中文本转换为行内代码               |
| `format.inline-math`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> | 将选中文本转换为行内数学公式            |
| `format.strike`       | <kbd>Ctrl</kbd>+<kbd>D</kbd>                  | 为选中文本添加删除线                   |
| `format.hyperlink`    | <kbd>Ctrl</kbd>+<kbd>L</kbd>                  | 插入超链接                            |
| `format.image`        | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> | 插入图片                              |
| `format.clear-format` | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> | 清除选中文本的格式                     |

#### Window menu

| Id                            | Default                      | Description               |
| ----------------------------- | ---------------------------- | ------------------------- |
| `window.minimize`             | <kbd>Ctrl</kbd>+<kbd>M</kbd> | 最小化窗口                 |
| `window.toggle-always-on-top` | -                            | 切换窗口置顶模式            |
| `window.zoomIn`               | -                            | 放大                       |
| `window.zoomOut`              | -                            | 缩小                       |
| `window.toggle-full-screen`   | <kbd>F11</kbd>               | 切换 fullscreen 模式        |

#### View menu

| Id                      | Default                                       | Description                              |
| ----------------------- | --------------------------------------------- | ---------------------------------------- |
| `view.command-palette`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> | 切换命令面板                          |
| `view.source-code-mode` | <kbd>Ctrl</kbd>+<kbd>E</kbd>                  | 切换到源码模式                        |
| `view.typewriter-mode`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> | 启用 typewriter 模式                  |
| `view.focus-mode`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd> | 启用 focus 模式                       |
| `view.toggle-sidebar`   | <kbd>Ctrl</kbd>+<kbd>J</kbd>                  | 切换 sidebar 显示                     |
| `view.toggle-tabbar`    | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> | 切换 tabbar 显示                      |
| `view.toggle-toc` .     | <kbd>Ctrl</kbd>+<kbd>K</kbd>                  | 切换目录显示                          |
| `view.toggle-dev-tools` | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>   | 切换开发者工具（仅调试模式）           |
| `view.dev-reload`       | <kbd>Ctrl</kbd>+<kbd>F5</kbd>                 | 重新加载窗口（仅调试模式）             |
| `view.reload-images`    | <kbd>F5</kbd>                                 | 重新加载图片                          |

## Available key bindings

#### Tabs

| Id                     | Default                                         | Description                  |
| ---------------------- | ----------------------------------------------- | ---------------------------- |
| `tabs.cycle-forward`   | <kbd>Ctrl</kbd>+<kbd>Tab</kbd>                  | 向前切换 tab                   |
| `tabs.cycle-backward`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Tab</kbd> | 向后切换 tab                   |
| `tabs.switchToleft`    | <kbd>Ctrl</kbd>+<kbd>PageUp</kbd>               | 切换到左侧 tab                 |
| `tabs.switchToright`   | <kbd>Ctrl</kbd>+<kbd>PageDown</kbd>             | 切换到右侧 tab                 |
| `tabs.switchTofirst`   | <kbd>Ctrl</kbd>+<kbd>1</kbd>                    | 切换到第 1 个 tab              |
| `tabs.switchTosecond`  | <kbd>Ctrl</kbd>+<kbd>2</kbd>                    | 切换到第 2 个 tab              |
| `tabs.switchTothird`   | <kbd>Ctrl</kbd>+<kbd>3</kbd>                    | 切换到第 3 个 tab              |
| `tabs.switchTofourth`  | <kbd>Ctrl</kbd>+<kbd>4</kbd>                    | 切换到第 4 个 tab              |
| `tabs.switchTofifth`   | <kbd>Ctrl</kbd>+<kbd>5</kbd>                    | 切换到第 5 个 tab              |
| `tabs.switchTosixth`   | <kbd>Ctrl</kbd>+<kbd>6</kbd>                    | 切换到第 6 个 tab              |
| `tabs.switchToseventh` | <kbd>Ctrl</kbd>+<kbd>7</kbd>                    | 切换到第 7 个 tab              |
| `tabs.switchToeighth`  | <kbd>Ctrl</kbd>+<kbd>8</kbd>                    | 切换到第 8 个 tab              |
| `tabs.switchToninth`   | <kbd>Ctrl</kbd>+<kbd>9</kbd>                    | 切换到第 9 个 tab              |
| `tabs.switchTotenth`   | <kbd>Ctrl</kbd>+<kbd>0</kbd>                    | 切换到第 10 个 tab             |

#### Misc

| Id                | Default                      | Description            |
| ----------------- | ---------------------------- | ---------------------- |
| `file.quick-open` | <kbd>Ctrl</kbd>+<kbd>P</kbd> | 打开快速打开对话框 |
