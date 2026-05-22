---
title: CSS 钩子
---

## 简介

Filament 使用 CSS "钩子"类来允许通过 CSS 自定义各种 HTML 元素。

## 发现钩子类

我们可以为整个 Filament UI 中的所有钩子类编写文档，但这会是很大的工作量，而且对你来说可能不太实用。相反，我们建议使用浏览器的开发者工具来检查你想要自定义的元素，然后使用钩子类来定位这些元素。

所有钩子类都以 `fi-` 为前缀，这是识别它们的好方法。它们通常位于类列表的开头，所以很容易找到，但有时如果我们需要通过 JavaScript 或 Blade 条件性地应用它们，它们可能会出现在列表的较后位置。

如果你没有找到所需的钩子类，请尽量不要绕过它，因为这可能会使你的样式自定义在未来的版本中遇到破坏性变更。相反，请提交一个 Pull Request 来添加你需要的钩子类。我们可以帮助你保持命名一致性。你甚至不需要在本地拉取 Filament 仓库，只需在 GitHub 上直接编辑 Blade 文件即可。

## 对钩子类应用样式

例如，如果你想自定义侧边栏的颜色，可以在浏览器的开发者工具中检查侧边栏元素，发现它使用了 `fi-sidebar`，然后在你的应用中添加如下 CSS：

```css
.fi-sidebar {
    background-color: #fafafa;
}
```

或者，由于 Filament 基于 Tailwind CSS 构建，你可以使用它们的 `@apply` 指令将 Tailwind 类应用到 Filament 元素：

```css
.fi-sidebar {
    @apply bg-gray-50 dark:bg-gray-950;
}
```

偶尔，你可能需要使用 `!important` 修饰符来覆盖现有样式，但请尽量少用，因为它会使样式难以维护：

```css
.fi-sidebar {
    @apply bg-gray-50 dark:bg-gray-950 !important;
}
```

你甚至可以仅对特定的 Tailwind 类应用 `!important`，这样侵入性更小，只需在类名前加 `!`：

```css
.fi-sidebar {
    @apply !bg-gray-50 dark:!bg-gray-950;
}
```

## 常见钩子类缩写

我们在钩子类中使用了一些常见的缩写来保持简短和可读：

- `fi` 是 "Filament" 的缩写
- `fi-ac` 用于表示 Actions 包中使用的类
- `fi-fo` 用于表示 Forms 包中使用的类
- `fi-in` 用于表示 Infolists 包中使用的类
- `fi-no` 用于表示 Notifications 包中使用的类
- `fi-sc` 用于表示 Schema 包中使用的类
- `fi-ta` 用于表示 Tables 包中使用的类
- `fi-wi` 用于表示 Widgets 包中使用的类
- `btn` 是 "button" 的缩写
- `col` 是 "column" 的缩写
- `ctn` 是 "container" 的缩写
- `wrp` 是 "wrapper" 的缩写

## 发布 Blade 视图

你可能想要将内部 Blade 视图发布到你的应用中以便自定义。我们不建议这样做，因为它会在未来的更新中给你的应用引入破坏性变更。请尽可能使用 [CSS 钩子类](#对钩子类应用样式)。

如果你确实决定发布 Blade 视图，请在 `composer.json` 文件中将所有 Filament 包锁定到特定版本，然后通过更改此版本号手动更新 Filament，并在每次更新后测试整个应用。这将帮助你安全地识别破坏性变更。
