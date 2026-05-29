---
title: 颜色
---

## 简介

Filament 使用 CSS 变量来定义其调色板。这些 CSS 变量在你安装 Filament 时加载的预设文件中映射到 Tailwind 类。Filament 使用 CSS 变量的原因是它允许框架通过 `@filamentStyles` Blade 指令渲染的 `<style>` 元素从 PHP 传递调色板。

默认情况下，Filament 的 Tailwind 预设文件包含 6 种颜色：

- `primary`，默认为 [Tailwind 的 `amber` 色](https://tailwindcss.com/docs/customizing-colors)
- `success`，默认为 [Tailwind 的 `green` 色](https://tailwindcss.com/docs/customizing-colors)
- `warning`，默认为 [Tailwind 的 `amber` 色](https://tailwindcss.com/docs/customizing-colors)
- `danger`，默认为 [Tailwind 的 `red` 色](https://tailwindcss.com/docs/customizing-colors)
- `info`，默认为 [Tailwind 的 `blue` 色](https://tailwindcss.com/docs/customizing-colors)
- `gray`，默认为 [Tailwind 的 `zinc` 色](https://tailwindcss.com/docs/customizing-colors)

你可以[了解如何更改这些颜色并注册新颜色](#自定义默认颜色)。

## 如何向 Filament 传递颜色

在 Filament 中注册的"颜色"不仅仅是一个色阶。实际上，它是由 [11 个色阶](https://tailwindcss.com/docs/customizing-colors)组成的完整调色板：`50`、`100`、`200`、`300`、`400`、`500`、`600`、`700`、`800`、`900` 和 `950`。当你在 Filament 中使用颜色时，框架会根据上下文决定使用哪个色阶。例如，它可能使用 `600` 色阶作为组件的背景，悬停时使用 `500`，边框使用 `400`。如果用户启用了暗色模式，它可能会使用 `700`、`800` 或 `900`。

一方面，这意味着你可以在 Filament 中指定颜色而无需担心使用哪个具体色阶，也无需为组件的每个部分指定色阶。Filament 会负责选择能与其他元素产生足够对比度的色阶。

要自定义 Filament 中某物的颜色，你可以使用其名称。例如，如果你想使用 `success` 颜色，可以这样传给 PHP 组件的颜色方法：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Toggle;

Action::make('proceed')
    ->color('success')
    
Toggle::make('is_active')
    ->onColor('success')
```

如果你想在 [Blade 组件](../components/overview)中使用颜色，可以将其作为属性传递：

```blade
<x-filament::badge color="success">
    Active
</x-filament::badge>
```

## 自定义默认颜色

在服务提供者的 `boot()` 方法或中间件中，你可以调用 `FilamentColor::register()` 方法，用来自定义 Filament 在 UI 元素中使用的颜色。

Filament 中有 6 种贯穿使用的默认颜色，你可以自定义：

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'danger' => Color::Red,
    'gray' => Color::Zinc,
    'info' => Color::Blue,
    'primary' => Color::Amber,
    'success' => Color::Green,
    'warning' => Color::Amber,
]);
```

`Color` 类包含了每个可供选择的 [Tailwind CSS 颜色](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)。

![使用自定义主色调的面板](/assets/filament/v4.x/screenshots/images/light/panels/configuration/colors.jpg)

你也可以传入一个闭包给 `register()`，该闭包仅在应用渲染时调用。这在从服务提供者调用 `register()` 且需要访问稍后在中间件中初始化的对象（如当前认证用户）时非常有用。

### 注册额外的颜色

你可以通过将新颜色传给 `FilamentColor::register()` 方法来注册新颜色，以在任何 Filament 组件中使用，数组的键为颜色名称：

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'secondary' => Color::Indigo,
]);
```

现在你可以在任何 Filament 组件中使用 `secondary` 作为颜色。

## 使用非 Tailwind 颜色

你可以使用不在 [Tailwind CSS 颜色](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)调色板中的自定义颜色，方法是传入从 `50` 到 `950` 的 OKLCH 格式色阶数组：

```php
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'danger' => [
        50 => 'oklch(0.969 0.015 12.422)',
        100 => 'oklch(0.941 0.03 12.58)',
        200 => 'oklch(0.892 0.058 10.001)',
        300 => 'oklch(0.81 0.117 11.638)',
        400 => 'oklch(0.712 0.194 13.428)',
        500 => 'oklch(0.645 0.246 16.439)',
        600 => 'oklch(0.586 0.253 17.585)',
        700 => 'oklch(0.514 0.222 16.935)',
        800 => 'oklch(0.455 0.188 13.697)',
        900 => 'oklch(0.41 0.159 10.272)',
        950 => 'oklch(0.271 0.105 12.094)',
    ],
]);
```

### 生成自定义调色板

如果你想让系统尝试根据单个十六进制或 RGB 值为你生成调色板，可以直接传入：

```php
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'danger' => '#ff0000',
]);

FilamentColor::register([
    'danger' => 'rgb(255, 0, 0)',
]);
```

## Filament 如何选择无障碍色阶

当你为 Filament 组件分配颜色时（例如 `->color('primary')`），Filament 会接收到完整的 11 色阶调色板，并在运行时决定使用哪个色阶作为背景、文本、悬停状态、暗色模式变体等。选择由 [WCAG 2.1 对比度比率](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)驱动：对于每个槽位，Filament 会遍历调色板，选择满足与组件所在表面最低对比度要求的最浅（或最深，取决于上下文）色阶。

这种设计意味着：

- 你只需为每个颜色名称注册一个调色板。每个组件的色阶选择是自动的。
- 相同的颜色在不同组件中可能渲染不同 -- `success` 按钮使用一种背景/文本组合，`success` 徽章使用另一种 -- 因为每个组件应用适合其视觉角色的对比度规则。
- 如果你更换调色板（例如将 `primary` 从 amber 切换到更深的色调），使用它的每个组件都会重新推导其色阶以保持无障碍性。

Filament 使用的对比度阈值来自 WCAG 2.1：

- **普通文本（`Color::WCAG_AA_TEXT`，4.5:1）** -- 应用于带有文本的组件，如按钮、徽章、链接、下拉菜单项和文本列。来自[成功标准 1.4.3 对比度（最低）](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)。
- **用户界面组件和图形对象（`Color::WCAG_AA_NON_TEXT`，3:1）** -- 应用于仅图标的组件，如图标按钮、切换开关、图标列和图标条目。来自[成功标准 1.4.11 非文本对比度](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)。

`Filament\Support\Colors\Color` 类将这些公开为常量 -- `WCAG_AA_TEXT`、`WCAG_AA_LARGE_TEXT`、`WCAG_AA_NON_TEXT`、`WCAG_AAA_TEXT`、`WCAG_AAA_LARGE_TEXT` -- 以便你在自定义时可以按名称引用。

### 为什么某些按钮渲染深色文本而不是白色

对于实心按钮，Filament 会预先构建一个"每个背景色阶的最佳文本色阶"查找表，然后通过检查哪些候选背景色阶最终与浅色文本配对来选择实际的按钮背景。

对于红色、蓝色或靛蓝色等鲜艳颜色，色阶 `600` 足够深，白色文本能通过 4.5:1 的对比度阈值。解析器选择 `bg: 600`、`hover:bg: 500`，配白色文本 -- 这是大多数颜色采用的路径。

对于黄色、amber 或 lime 等浅色，即使色阶 `600` 也足够亮，*深色*文本比白色文本通过对比度更好。解析器检测到这一点并回退到较浅的背景 -- `bg: 400` -- 配深色文本。结果是黄色按钮在浅黄色背景上显示深色文本，而不是难以阅读的白底黄字组合。

这是有意为之的行为。将每种颜色强制使用相同的 `bg: 600, text: white` 模式会对暖色调或浅色调调色板产生无障碍性问题。双路径设计使 `success` 和 `danger` 看起来像实心彩色按钮，而 `warning`（通常是 amber）通过其较浅的背景正确可读。

## 自定义色阶选择

如果你需要覆盖特定组件选择色阶的方式 -- 例如，在应用中强制执行 WCAG AAA 对比度，或让按钮偏向使用更深的色阶 -- 你可以扩展相关的视图组件并通过 Laravel 的容器重新绑定它。

Filament 为此公开了三个颜色映射类，都在 `Filament\Support\View\Components\ColorMaps` 命名空间下。每个都遵循相同的流式结构 -- `make($palette)` 开始，链式配置设置器，然后 `get()` 返回一个 `array<string, int>` 映射，将槽位名称（如 `bg`、`text`、`dark:hover:bg`）映射到色阶数字。

三个类分别是：

- `ComponentColorMap` -- 用于每个槽位选择一个色阶的组件，如徽章、链接、文本列、图标、下拉菜单和切换开关。
- `ButtonComponentColorMap` -- 用于实心按钮。选择一个背景色阶并搭配匹配的文本色阶。
- `IconButtonComponentColorMap` -- 用于仅图标按钮。选择一个图标色阶并从中派生悬停变体。

### 可覆盖的组件

每个从调色板中选择色阶的 Filament 组件都实现了 `getColorMap()`。要自定义某个组件，扩展该类，覆盖 `getColorMap()`，并通过 Laravel 的容器绑定你的子类。

| 组件类 | 使用者 | 文档 |
| --- | --- | --- |
| `Filament\Support\View\Components\BadgeComponent` | 徽章 | [Badge](../components/badge) |
| `Filament\Support\View\Components\ButtonComponent` | 按钮（实心和描边） | [Button](../components/button) |
| `Filament\Support\View\Components\IconButtonComponent` | 仅图标按钮 | [Icon button](../components/icon-button) |
| `Filament\Support\View\Components\LinkComponent` | 链接 | [Link](../components/link) |
| `Filament\Support\View\Components\ToggleComponent` | 表单切换开关 | [Toggle](../forms/toggle) |
| `Filament\Support\View\Components\DropdownComponent\HeaderComponent` | 下拉菜单头部 | [Dropdown](../components/dropdown) |
| `Filament\Support\View\Components\DropdownComponent\ItemComponent` | 下拉菜单项 | [Dropdown](../components/dropdown) |
| `Filament\Schemas\View\Components\TextComponent` | Schema 文本 prime | [Prime components](../schemas/primes) |
| `Filament\Infolists\View\Components\TextEntryComponent\ItemComponent` | 信息列表文本条目 | [Text entry](../infolists/text-entry) |
| `Filament\Infolists\View\Components\IconEntryComponent\IconComponent` | 信息列表图标条目 | [Icon entry](../infolists/icon-entry) |
| `Filament\Tables\View\Components\Columns\TextColumnComponent\ItemComponent` | 表格文本列 | [Text column](../tables/columns/text) |
| `Filament\Tables\View\Components\Columns\IconColumnComponent\IconComponent` | 表格图标列 | [Icon column](../tables/columns/icon) |
| `Filament\Tables\View\Components\Columns\Summarizers\CountComponent\IconComponent` | 表格计数汇总器 | [Summaries](../tables/summaries) |
| `Filament\Widgets\View\Components\StatsOverviewWidgetComponent\StatComponent\DescriptionComponent` | 统计概览小部件描述 | [Stats overview](../widgets/stats-overview) |

:::tip
编写自定义 `getColorMap()` 的最快方法是复制你要覆盖的类中的原始实现，然后调整配置值。源文件位于 `packages/<package>/src/View/Components/` 中，与文档中的类并列。每个文件都是几行流式调用 -- 了解接口最简单的方式就是阅读默认值然后修改它。
:::

### `ComponentColorMap`

一次构建一个槽位映射条目。每个输出槽位调用一次 `slot()`，然后调用 `get()`。

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;
use Filament\Support\View\Components\ColorMaps\ComponentColorMap;

$gray = FilamentColor::getColor('gray');

ComponentColorMap::make($color)
    ->slot('text', surface: $gray[50], minRatio: Color::WCAG_AA_TEXT, fallback: 900)
    ->slot('dark:text', surface: $gray[700], maxShade: 500, shouldStartFromDarkest: true, fallback: 200)
    ->get();
```

`slot()` 参数：

- `$name` -- 输出映射键（`text`、`bg`、`hover:text`、`dark:hover:bg` 等）。
- `$surface` -- 所选色阶必须与之形成对比的颜色（通常是 `$gray[50]`、`$gray[700]` 或 `'oklch(1 0 0)'`）。
- `$minRatio` -- 最低 WCAG 对比度比率。默认为 `Color::WCAG_AA_TEXT`（`4.5`）；对于图标使用 `WCAG_AA_NON_TEXT`（`3.0`），对于 AAA 使用 `WCAG_AAA_TEXT`（`7.0`）。
- `$maxShade` -- 可选的色阶数字上限。
- `$minShade` -- 可选的色阶数字下限。
- `$shouldStartFromDarkest` -- 从最深到最浅遍历，而非默认的从最浅到最深。用于暗色模式查找。
- `$fallback` -- 没有候选色阶满足条件时返回的色阶。亮色模式通常为 `900`，暗色模式为 `200`。

### `ButtonComponentColorMap`

从一次 `get()` 调用返回实心按钮所需的全部八个槽位（`bg`、`hover:bg`、`dark:bg`、`dark:hover:bg`、`text`、`hover:text`、`dark:text`、`dark:hover:text`）。你配置使用哪些背景色阶；每个背景色阶的匹配文本色阶会自动找到。至少需要一个 `lightBackground()` 和一个 `darkBackground()`。

```php
use Filament\Support\Colors\Color;
use Filament\Support\View\Components\ColorMaps\ButtonComponentColorMap;

ButtonComponentColorMap::make($color)
    ->minContrastRatio(Color::WCAG_AA_TEXT)
    ->lightBackground(bg: 600, hover: 500)
    ->lightBackground(bg: 400, hover: 300, alternateHover: 500)
    ->darkBackground(bg: 600, hover: 500, alternateHover: 700)
    ->get();
```

`minContrastRatio()` 设置背景和文本之间的最低 WCAG 比率。默认为 `Color::WCAG_AA_TEXT`（`4.5`）；对于 AAA 设为 `WCAG_AAA_TEXT`（`7.0`）。

`lightBackground()` 和 `darkBackground()` 共享相同的形状 `(bg, hover, alternateHover?)` 和相同的选择算法 -- 它们仅在配置的模式上不同。每次调用为该模式的列表追加一个候选，按顺序使用两轮评估：

1. **首选** -- 遍历列表，在第一个 `bg` 产生浅色文本的候选处停止。对于该候选，如果 `hover` 也产生浅色文本则使用它；否则使用 `alternateHover`（如果*它*产生浅色文本）；否则跳过。
2. **回退** -- 如果第一轮没有合格的，取*最后一个*候选。当其文本明度与 `bg` 的一致时使用 `hover`，否则使用 `alternateHover`。一致性检查避免了悬停时的文本颜色闪烁。

`alternateHover` 在任何候选上的处理方式相同 -- 第一个、最后一个或中间的。仅在主 `hover` 不合适时才会使用它。

要表达颜色感知的级联 -- "如果调色板能承受就用 800，否则 700，否则 600，对黄色回退到较浅的背景配深色文本" -- 链接候选并以浅色友好的回退结束：

```php
ButtonComponentColorMap::make($color)
    ->lightBackground(bg: 800, hover: 700)
    ->lightBackground(bg: 700, hover: 600)
    ->lightBackground(bg: 600, hover: 500)
    ->lightBackground(bg: 400, hover: 300, alternateHover: 500) // 浅色回退
    ->darkBackground(bg: 600, hover: 500, alternateHover: 700)
    ->get();
```

:::warning
最后一个候选同时也作为回退，当没有候选的 `bg` 产生浅色文本时使用。如果你只配置了鲜艳色友好的候选而你的调色板是浅色的，该最后候选仍会被使用 -- 可能产生深色文本配深色背景的按钮。务必以浅色友好的候选（通常 `bg` 在 `400` 左右）结束，以处理黄色、amber 和 lime。
:::

### `IconButtonComponentColorMap`

返回仅图标按钮的四个图标槽位（`text`、`hover:text`、`dark:text`、`dark:hover:text`）。悬停变体通过固定的 `100` 色阶偏移从静止色阶派生，以增强图标。至少需要一个 `lightSurface()` 和一个 `darkSurface()`。

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;
use Filament\Support\View\Components\ColorMaps\IconButtonComponentColorMap;

$gray = FilamentColor::getColor('gray');

IconButtonComponentColorMap::make($color)
    ->minContrastRatio(Color::WCAG_AA_NON_TEXT)
    ->lightSurface($gray[50])
    ->darkSurface($gray[700])
    ->darkMaxShade(500)
    ->get();
```

- `minContrastRatio()` -- 图标与表面之间的最低对比度比率。默认为 `Color::WCAG_AA_NON_TEXT`（`3.0`）。
- `lightSurface()` / `darkSurface()` -- 图标在每种模式下必须与之形成对比的主体表面颜色。通常是 `$gray[50]` 和 `$gray[700]`。
- `darkMaxShade()` -- 暗色模式图标颜色考虑的色阶上限。默认为 `500`；要获得更浅的图标可降低此值。

### 实际示例：按钮的 AAA 对比度

以下是一个完整的子类，用于在实心按钮上强制执行 WCAG AAA 对比度，并将背景选择偏向更深的色阶：

```php
namespace App\View\Components;

use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;
use Filament\Support\View\Components\ButtonComponent as BaseButtonComponent;
use Filament\Support\View\Components\ColorMaps\ButtonComponentColorMap;
use Filament\Support\View\Components\ColorMaps\ComponentColorMap;

class ButtonComponent extends BaseButtonComponent
{
    public function getColorMap(array $color): array
    {
        $gray = FilamentColor::getColor('gray');

        if ($this->isOutlined) {
            return ComponentColorMap::make($color)
                ->slot('text', surface: $gray[50], minRatio: Color::WCAG_AAA_TEXT, fallback: 900)
                ->slot('dark:text', surface: $gray[700], minRatio: Color::WCAG_AAA_TEXT, maxShade: 500, shouldStartFromDarkest: true, fallback: 200)
                ->get();
        }

        return ButtonComponentColorMap::make($color)
            ->minContrastRatio(Color::WCAG_AAA_TEXT)
            ->lightBackground(bg: 700, hover: 600)
            ->lightBackground(bg: 400, hover: 300, alternateHover: 500)
            ->darkBackground(bg: 600, hover: 500, alternateHover: 700)
            ->get();
    }
}
```

在服务提供者的 `register()` 方法中绑定你的子类：

```php
use App\View\Components\ButtonComponent;
use Filament\Support\View\Components\ButtonComponent as BaseButtonComponent;

public function register(): void
{
    $this->app->bind(BaseButtonComponent::class, ButtonComponent::class);
}
```

同样的模式适用于上面列出的任何组件 -- 扩展、覆盖 `getColorMap()`，然后绑定。

:::tip
默认值适用于绝大多数调色板。只有在你有特定的无障碍要求（如 AAA 合规性）或设计系统要求不同的色阶偏好时，才需要覆盖这些类。
:::
