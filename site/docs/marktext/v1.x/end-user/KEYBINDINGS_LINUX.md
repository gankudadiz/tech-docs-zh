---
title: Linux 快捷键
description: MarkText Linux 平台快捷键参考
sidebar_position: 11
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/KEYBINDINGS_LINUX.md
translation_status: translated
---

# Linux 快捷键

MarkText 的 Linux 平台快捷键。请参阅[通用快捷键](KEYBINDINGS.md)了解如何使用自定义快捷键。


## Available menu key bindings

#### File menu

| Id                     | Default                                       | Description                           |
| :--------------------- | --------------------------------------------- | ------------------------------------- |
| `file.new-window`      | <kbd>Ctrl</kbd>+<kbd>N</kbd>                  | 新建窗口                              |
| `file.new-tab`         | <kbd>Ctrl</kbd>+<kbd>T</kbd>                  | 新建标签页                            |
| `file.open-file`       | <kbd>Ctrl</kbd>+<kbd>O</kbd>                  | 打开 markdown 文件                    |
| `file.open-folder`     | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd> | 打开文件夹                            |
| `file.save`            | <kbd>Ctrl</kbd>+<kbd>S</kbd>                  | 保存                                  |
| `file.save-as`         | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> | 另存为...                             |
| `file.export-file.pdf` | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd>   | 导出文件为 PDF                        |
| `file.move-file`       | -                                             | 移动当前文件到其他位置                |
| `file.rename-file`     | -                                             | 重命名当前文件                        |
| `file.print`           | -                                             | 打印当前标签页                        |
| `file.preferences`     | <kbd>Ctrl</kbd>+<kbd>,</kbd>                  | 打开设置窗口                          |
| `file.close-tab`       | <kbd>Ctrl</kbd>+<kbd>W</kbd>                  | 关闭标签页                            |
| `file.close-window`    | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd> | 关闭窗口                              |
| `file.quit`            | <kbd>Ctrl</kbd>+<kbd>Q</kbd>                  | 退出 MarkText                         |

#### Edit menu

| Id                        | Default                                       | Description                                     |
| :------------------------ | --------------------------------------------- | ----------------------------------------------- |
| `edit.undo`               | <kbd>Ctrl</kbd>+<kbd>Z</kbd>                  | 撤销上一步操作                                |
| `edit.redo`               | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | 重做上一步操作                                |
| `edit.cut`                | <kbd>Ctrl</kbd>+<kbd>X</kbd>                  | 剪切选中文本                                  |
| `edit.copy`               | <kbd>Ctrl</kbd>+<kbd>C</kbd>                  | 复制选中文本                                  |
| `edit.paste`              | <kbd>Ctrl</kbd>+<kbd>V</kbd>                  | 粘贴文本                                      |
| `edit.copy-as-rich`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> | 将选中文本复制为 markdown                     |
| `edit.copy-as-html`       | -                                             | 将选中文本复制为 HTML                         |
| `edit.paste-as-plaintext` | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> | 以纯文本形式粘贴                              |
| `edit.select-all`         | <kbd>Ctrl</kbd>+<kbd>A</kbd>                  | 选中文档全部文本                              |
| `edit.duplicate`          | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd> | 复制当前段落                                  |
| `edit.create-paragraph`   | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd> | 在当前段落后创建新段落                        |
| `edit.delete-paragraph`   | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> | 删除当前段落                                  |
| `edit.find`               | <kbd>Ctrl</kbd>+<kbd>F</kbd>                  | 在文档中查找内容                              |
| `edit.find-next`          | <kbd>F3</kbd>                                 | 继续搜索并查找下一个匹配项                    |
| `edit.find-previous`      | <kbd>Shift</kbd>+<kbd>F3</kbd>                | 继续搜索并查找上一个匹配项                    |
| `edit.replace`            | <kbd>Ctrl</kbd>+<kbd>R</kbd>                  | 替换查找到的内容                              |
| `edit.find-in-folder`     | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> | 在已打开的文件夹中查找包含关键词的文件        |

#### Paragraph menu

| Id                          | Default                                       | Description                              |
| --------------------------- | --------------------------------------------- | ---------------------------------------- |
| `paragraph.heading-1`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd> | 设置行为 heading 1                       |
| `paragraph.heading-2`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>2</kbd> | 设置行为 heading 2                       |
| `paragraph.heading-3`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>3</kbd> | 设置行为 heading 3                       |
| `paragraph.heading-4`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>4</kbd> | 设置行为 heading 4                       |
| `paragraph.heading-5`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>5</kbd> | 设置行为 heading 5                       |
| `paragraph.heading-6`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>6</kbd> | 设置行为 heading 6                       |
| `paragraph.upgrade-heading` | <kbd>Ctrl</kbd>+<kbd>Plus</kbd>               | 升级 heading 级别                        |
| `paragraph.degrade-heading` | <kbd>Ctrl</kbd>+<kbd>-</kbd>                  | 降级 heading 级别                        |
| `paragraph.table`           | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> | 插入表格                                 |
| `paragraph.code-fence`      | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>K</kbd> | 插入代码块                               |
| `paragraph.quote-block`     | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd> | 插入引用块                               |
| `paragraph.math-formula`    | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>M</kbd>   | 插入数学公式块                           |
| `paragraph.html-block`      | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>H</kbd>   | 插入 HTML 块                             |
| `paragraph.order-list`      | <kbd>Ctrl</kbd>+<kbd>G</kbd>                  | 插入有序列表                             |
| `paragraph.bullet-list`     | <kbd>Ctrl</kbd>+<kbd>H</kbd>                  | 插入无序列表                             |
| `paragraph.task-list`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> | 插入任务列表                             |
| `paragraph.loose-list-item` | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd> | 将列表项转换为松散列表项                 |
| `paragraph.paragraph`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>0</kbd> | 将 heading 转换为段落                    |
| `paragraph.horizontal-line` | <kbd>Ctrl</kbd>+<kbd>\_</kbd>                 | 添加水平线                               |
| `paragraph.front-matter`    | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Y</kbd> | 插入 YAML frontmatter 块                 |

#### Format menu

| Id                    | Default                                       | Description                                     |
| --------------------- | --------------------------------------------- | ----------------------------------------------- |
| `format.strong`       | <kbd>Ctrl</kbd>+<kbd>B</kbd>                  | 将选中文本设置为粗体                          |
| `format.emphasis`     | <kbd>Ctrl</kbd>+<kbd>I</kbd>                  | 将选中文本设置为斜体                          |
| `format.underline`    | <kbd>Ctrl</kbd>+<kbd>U</kbd>                  | 将选中文本设置为下划线                        |
| `format.superscript`  | -                                             | 将选中文本设置为上标                          |
| `format.subscript`    | -                                             | 将选中文本设置为下标                          |
| `format.highlight`    | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd> | 使用 <mark>标签</mark>高亮选中文本             |
| `format.inline-code`  | <kbd>Ctrl</kbd>+<kbd>Y</kbd>                  | 将选中文本设置为行内代码                      |
| `format.inline-math`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> | 将选中文本设置为行内数学公式                  |
| `format.strike`       | <kbd>Ctrl</kbd>+<kbd>D</kbd>                  | 将选中文本设置为删除线                        |
| `format.hyperlink`    | <kbd>Ctrl</kbd>+<kbd>L</kbd>                  | 插入超链接                                    |
| `format.image`        | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> | 插入图片                                      |
| `format.clear-format` | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> | 清除选中文本的格式                            |

#### Window menu

| Id                            | Default                      | Description               |
| ----------------------------- | ---------------------------- | ------------------------- |
| `window.minimize`             | <kbd>Ctrl</kbd>+<kbd>M</kbd> | 最小化窗口                |
| `window.toggle-always-on-top` | -                            | 切换窗口置顶模式          |
| `window.zoomIn`               | -                            | 放大                      |
| `window.zoomOut`              | -                            | 缩小                      |
| `window.toggle-full-screen`   | <kbd>F11</kbd>               | 切换 fullscreen 模式      |

#### View menu

| Id                      | Default                                       | Description                              |
| ----------------------- | --------------------------------------------- | ---------------------------------------- |
| `view.command-palette`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> | 切换命令面板                             |
| `view.source-code-mode` | <kbd>Ctrl</kbd>+<kbd>E</kbd>                  | 切换到源代码模式                         |
| `view.typewriter-mode`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> | 启用 typewriter 模式                     |
| `view.focus-mode`       | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd> | 启用 focus 模式                          |
| `view.toggle-sidebar`   | <kbd>Ctrl</kbd>+<kbd>J</kbd>                  | 切换 sidebar                             |
| `view.toggle-tabbar`    | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> | 切换标签栏                               |
| `view.toggle-toc` .     | <kbd>Ctrl</kbd>+<kbd>K</kbd>                  | 切换 toc                                 |
| `view.toggle-dev-tools` | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>   | 切换开发者工具（仅限调试模式）           |
| `view.dev-reload`       | <kbd>Ctrl</kbd>+<kbd>F5</kbd>                 | 重新加载窗口（仅限调试模式）             |
| `view.reload-images`    | <kbd>F5</kbd>                                 | 重新加载图片                             |

## Available key bindings

#### Tabs

| Id                     | Default                                         | Description                  |
| ---------------------- | ----------------------------------------------- | ---------------------------- |
| `tabs.cycle-forward`   | <kbd>Ctrl</kbd>+<kbd>Tab</kbd>                  | 正向循环切换标签页           |
| `tabs.cycle-backward`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Tab</kbd> | 反向循环切换标签页           |
| `tabs.switchToleft`    | <kbd>Ctrl</kbd>+<kbd>PageUp</kbd>               | 切换到左侧标签页             |
| `tabs.switchToright`   | <kbd>Ctrl</kbd>+<kbd>PageDown</kbd>             | 切换到右侧标签页             |
| `tabs.switchTofirst`   | <kbd>Ctrl</kbd>+<kbd>1</kbd>                    | 切换到第 1 个标签页          |
| `tabs.switchTosecond`  | <kbd>Ctrl</kbd>+<kbd>2</kbd>                    | 切换到第 2 个标签页          |
| `tabs.switchTothird`   | <kbd>Ctrl</kbd>+<kbd>3</kbd>                    | 切换到第 3 个标签页          |
| `tabs.switchTofourth`  | <kbd>Ctrl</kbd>+<kbd>4</kbd>                    | 切换到第 4 个标签页          |
| `tabs.switchTofifth`   | <kbd>Ctrl</kbd>+<kbd>5</kbd>                    | 切换到第 5 个标签页          |
| `tabs.switchTosixth`   | <kbd>Ctrl</kbd>+<kbd>6</kbd>                    | 切换到第 6 个标签页          |
| `tabs.switchToseventh` | <kbd>Ctrl</kbd>+<kbd>7</kbd>                    | 切换到第 7 个标签页          |
| `tabs.switchToeighth`  | <kbd>Ctrl</kbd>+<kbd>8</kbd>                    | 切换到第 8 个标签页          |
| `tabs.switchToninth`   | <kbd>Ctrl</kbd>+<kbd>9</kbd>                    | 切换到第 9 个标签页          |
| `tabs.switchTotenth`   | <kbd>Ctrl</kbd>+<kbd>0</kbd>                    | 切换到第 10 个标签页         |

#### Misc

| Id                | Default                      | Description            |
| ----------------- | ---------------------------- | ---------------------- |
| `file.quick-open` | <kbd>Ctrl</kbd>+<kbd>P</kbd> | 显示快速打开对话框     |
