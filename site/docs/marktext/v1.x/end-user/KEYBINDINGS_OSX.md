---
title: macOS 快捷键
description: MarkText macOS 平台快捷键参考
sidebar_position: 12
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/KEYBINDINGS_OSX.md
translation_status: translated
---

# macOS 快捷键

MarkText 的 macOS 平台快捷键。请参阅[通用快捷键](KEYBINDINGS.md)了解如何使用自定义快捷键。


## Available menu key bindings

#### MarkText menu

| Id                 | Default                                           | Description                            |
| ------------------ | ------------------------------------------------- | -------------------------------------- |
| `mt.hide`          | <kbd>Command</kbd>+<kbd>H</kbd>                   | 隐藏 MarkText                          |
| `mt.hide-others`   | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>H</kbd> | 隐藏除 MarkText 外的所有窗口           |
| `file.preferences` | <kbd>Command</kbd>+<kbd>,</kbd>                   | 打开设置窗口                           |
| `file.quit`        | <kbd>Command</kbd>+<kbd>Q</kbd>                   | 退出 MarkText                          |

#### File menu

| Id                     | Default                                          | Description                           |
| :--------------------- | ------------------------------------------------ | ------------------------------------- |
| `file.new-window`      | <kbd>Command</kbd>+<kbd>N</kbd>                  | 新建窗口                              |
| `file.new-tab`         | <kbd>Command</kbd>+<kbd>T</kbd>                  | 新建 tab                              |
| `file.open-file`       | <kbd>Command</kbd>+<kbd>O</kbd>                  | 打开 markdown 文件                    |
| `file.open-folder`     | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd> | 打开文件夹                            |
| `file.save`            | <kbd>Command</kbd>+<kbd>S</kbd>                  | 保存                                  |
| `file.save-as`         | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> | 另存为...                             |
| `file.export-file.pdf` | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd>      | 导出为 PDF                            |
| `file.move-file`       | -                                                | 移动当前文件到其他位置                |
| `file.rename-file`     | -                                                | 重命名当前文件                        |
| `file.print`           | -                                                | 打印当前 tab                          |
| `file.close-tab`       | <kbd>Command</kbd>+<kbd>W</kbd>                  | 关闭 tab                              |
| `file.close-window`    | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd> | 关闭窗口                              |

#### Edit menu

| Id                        | Default                                           | Description                                     |
| :------------------------ | ------------------------------------------------- | ----------------------------------------------- |
| `edit.undo`               | <kbd>Command</kbd>+<kbd>Z</kbd>                   | 撤销上一步操作                                  |
| `edit.redo`               | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>  | 重做上一步操作                                  |
| `edit.cut`                | <kbd>Command</kbd>+<kbd>X</kbd>                   | 剪切选中文本                                    |
| `edit.copy`               | <kbd>Command</kbd>+<kbd>C</kbd>                   | 复制选中文本                                    |
| `edit.paste`              | <kbd>Command</kbd>+<kbd>V</kbd>                   | 粘贴文本                                        |
| `edit.copy-as-rich`       | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>  | 将选中文本复制为 markdown                       |
| `edit.copy-as-html`       | -                                                 | 将选中文本复制为 HTML                           |
| `edit.paste-as-plaintext` | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>  | 将选中文本复制为纯文本                          |
| `edit.select-all`         | <kbd>Command</kbd>+<kbd>A</kbd>                   | 选中文档全部内容                                |
| `edit.duplicate`          | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>P</kbd> | 复制当前段落                                    |
| `edit.create-paragraph`   | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd>  | 在当前段落后新建段落                            |
| `edit.delete-paragraph`   | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>  | 删除当前段落                                    |
| `edit.find`               | <kbd>Command</kbd>+<kbd>F</kbd>                   | 在文档中查找内容                                |
| `edit.find-next`          | <kbd>Cmd</kbd>+<kbd>G</kbd>                       | 继续搜索并查找下一个匹配项                      |
| `edit.find-previous`      | <kbd>Shift</kbd>+<kbd>Cmd</kbd>+<kbd>G</kbd>      | 继续搜索并查找上一个匹配项                      |
| `edit.replace`            | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>F</kbd> | 替换查找内容                                    |
| `edit.find-in-folder`     | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>  | 在已打开的文件夹中查找包含关键字的文件          |
| `edit.screenshot`         | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>A</kbd> | 截图                                            |

#### Paragraph menu

| Id                          | Default                                           | Description                              |
| --------------------------- | ------------------------------------------------- | ---------------------------------------- |
| `paragraph.heading-1`       | <kbd>Command</kbd>+<kbd>1</kbd>                   | 设置为 heading 1                         |
| `paragraph.heading-2`       | <kbd>Command</kbd>+<kbd>2</kbd>                   | 设置为 heading 2                         |
| `paragraph.heading-3`       | <kbd>Command</kbd>+<kbd>3</kbd>                   | 设置为 heading 3                         |
| `paragraph.heading-4`       | <kbd>Command</kbd>+<kbd>4</kbd>                   | 设置为 heading 4                         |
| `paragraph.heading-5`       | <kbd>Command</kbd>+<kbd>5</kbd>                   | 设置为 heading 5                         |
| `paragraph.heading-6`       | <kbd>Command</kbd>+<kbd>6</kbd>                   | 设置为 heading 6                         |
| `paragraph.upgrade-heading` | <kbd>Command</kbd>+<kbd>Plus</kbd>                | 升级 heading 级别                        |
| `paragraph.degrade-heading` | <kbd>Command</kbd>+<kbd>-</kbd>                   | 降级 heading 级别                        |
| `paragraph.table`           | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd>  | 插入表格                                 |
| `paragraph.code-fence`      | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>C</kbd> | 插入代码块                               |
| `paragraph.quote-block`     | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>Q</kbd> | 插入引用块                               |
| `paragraph.math-formula`    | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>M</kbd> | 插入数学公式块                           |
| `paragraph.html-block`      | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>J</kbd> | 插入 HTML 块                             |
| `paragraph.order-list`      | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>O</kbd> | 插入有序列表                             |
| `paragraph.bullet-list`     | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>U</kbd> | 插入无序列表                             |
| `paragraph.task-list`       | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>X</kbd> | 插入任务列表                             |
| `paragraph.loose-list-item` | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>L</kbd> | 将列表项转换为松散列表项                 |
| `paragraph.paragraph`       | <kbd>Command</kbd>+<kbd>0</kbd>                   | 将 heading 转换为段落                    |
| `paragraph.horizontal-line` | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>-</kbd> | 插入水平分割线                           |
| `paragraph.front-matter`    | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>Y</kbd> | 插入 YAML frontmatter 块                |

#### Format menu

| Id                    | Default                                          | Description                                     |
| --------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `format.strong`       | <kbd>Command</kbd>+<kbd>B</kbd>                  | 将选中文本设置为粗体                            |
| `format.emphasis`     | <kbd>Command</kbd>+<kbd>I</kbd>                  | 将选中文本设置为斜体                            |
| `format.underline`    | <kbd>Command</kbd>+<kbd>U</kbd>                  | 将选中文本添加下划线                            |
| `format.superscript`  | -                                                | 将选中文本设置为上标                            |
| `format.subscript`    | -                                                | 将选中文本设置为下标                            |
| `format.highlight`    | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd> | 用 <mark>标签</mark> 高亮选中文本              |
| `format.inline-code`  | <kbd>Command</kbd>+<kbd>`</kbd>                  | 将选中文本转换为行内代码                        |
| `format.inline-math`  | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> | 将选中文本转换为行内数学公式                    |
| `format.strike`       | <kbd>Command</kbd>+<kbd>D</kbd>                  | 给选中文本添加删除线                            |
| `format.hyperlink`    | <kbd>Command</kbd>+<kbd>L</kbd>                  | 插入超链接                                      |
| `format.image`        | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> | 插入图片                                        |
| `format.clear-format` | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> | 清除选中文本的格式                              |

#### Window menu

| Id                            | Default                                         | Description               |
| ----------------------------- | ----------------------------------------------- | ------------------------- |
| `window.minimize`             | <kbd>Command</kbd>+<kbd>M</kbd>                 | 最小化窗口                |
| `window.toggle-always-on-top` | -                                               | 切换置顶模式              |
| `window.zoomIn`               | -                                               | 放大                      |
| `window.zoomOut`              | -                                               | 缩小                      |
| `window.toggle-full-screen`   | <kbd>Ctrl</kbd>+<kbd>Command</kbd>+<kbd>F</kbd> | 切换 fullscreen 模式      |

#### View menu

| Id                      | Default                                           | Description                              |
| ----------------------- | ------------------------------------------------- | ---------------------------------------- |
| `view.command-palette`  | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>  | 切换命令面板                             |
| `view.source-code-mode` | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>S</kbd> | 切换到源码模式                           |
| `view.typewriter-mode`  | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>T</kbd> | 启用 typewriter 模式                     |
| `view.focus-mode`       | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd>  | 启用 focus 模式                          |
| `view.toggle-sidebar`   | <kbd>Command</kbd>+<kbd>J</kbd>                   | 切换 sidebar                             |
| `view.toggle-tabbar`    | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>B</kbd> | 切换标签栏                               |
| `view.toggle-toc` .     | <kbd>Command</kbd>+<kbd>K</kbd>                   | 切换 toc                                 |
| `view.toggle-dev-tools` | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>I</kbd> | 切换开发者工具（仅调试模式）             |
| `view.dev-reload`       | <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>R</kbd> | 重新加载窗口（仅调试模式）               |
| `view.reload-images`    | <kbd>Command</kbd>+<kbd>R</kbd>                   | 重新加载图片                             |

## Available key bindings

#### Tabs

| Id                     | Default                                         | Description                  |
| ---------------------- | ----------------------------------------------- | ---------------------------- |
| `tabs.cycle-forward`   | <kbd>Ctrl</kbd>+<kbd>Tab</kbd>                  | 向前切换 tab                 |
| `tabs.cycle-backward`  | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Tab</kbd> | 向后切换 tab                 |
| `tabs.switchToleft`    | <kbd>Command</kbd>+<kbd>PageUp</kbd>            | 切换到左侧 tab               |
| `tabs.switchToright`   | <kbd>Command</kbd>+<kbd>PageDown</kbd>          | 切换到右侧 tab               |
| `tabs.switchTofirst`   | <kbd>Ctrl</kbd>+<kbd>1</kbd>                    | 切换到第 1 个 tab            |
| `tabs.switchTosecond`  | <kbd>Ctrl</kbd>+<kbd>2</kbd>                    | 切换到第 2 个 tab            |
| `tabs.switchTothird`   | <kbd>Ctrl</kbd>+<kbd>3</kbd>                    | 切换到第 3 个 tab            |
| `tabs.switchTofourth`  | <kbd>Ctrl</kbd>+<kbd>4</kbd>                    | 切换到第 4 个 tab            |
| `tabs.switchTofifth`   | <kbd>Ctrl</kbd>+<kbd>5</kbd>                    | 切换到第 5 个 tab            |
| `tabs.switchTosixth`   | <kbd>Ctrl</kbd>+<kbd>6</kbd>                    | 切换到第 6 个 tab            |
| `tabs.switchToseventh` | <kbd>Ctrl</kbd>+<kbd>7</kbd>                    | 切换到第 7 个 tab            |
| `tabs.switchToeighth`  | <kbd>Ctrl</kbd>+<kbd>8</kbd>                    | 切换到第 8 个 tab            |
| `tabs.switchToninth`   | <kbd>Ctrl</kbd>+<kbd>9</kbd>                    | 切换到第 9 个 tab            |
| `tabs.switchTotenth`   | <kbd>Ctrl</kbd>+<kbd>0</kbd>                    | 切换到第 10 个 tab           |

#### Misc

| Id                | Default                         | Description            |
| ----------------- | ------------------------------- | ---------------------- |
| `file.quick-open` | <kbd>Command</kbd>+<kbd>P</kbd> | 打开快速打开对话框     |
