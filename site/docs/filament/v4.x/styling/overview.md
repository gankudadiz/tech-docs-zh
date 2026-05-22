---
title: 样式概述
---

## 修改颜色

在[配置](../panel-configuration)中，你可以轻松修改使用的颜色。Filament 内置了 6 种预定义颜色，贯穿整个框架。你可以按如下方式自定义：

```php
use Filament\Panel;
use Filament\Support\Colors\Color;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->colors([
            'danger' => Color::Rose,
            'gray' => Color::Gray,
            'info' => Color::Blue,
            'primary' => Color::Indigo,
            'success' => Color::Emerald,
            'warning' => Color::Orange,
        ]);
}
```

`Filament\Support\Colors\Color` 类包含了所有 [Tailwind CSS 调色板](https://tailwindcss.com/docs/customizing-colors)的颜色选项。

![使用自定义颜色的面板](/assets/filament/v4.x/screenshots/images/light/panels/styling/colors.jpg)

你也可以传入一个闭包给 `register()`，该闭包仅在应用渲染时调用。这在从服务提供者调用 `register()` 且需要访问稍后在中间件中初始化的对象（如当前认证用户）时非常有用。

或者，你也可以传入 OKLCH 颜色数组作为自定义调色板：

```php
$panel
    ->colors([
        'primary' => [
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
    ])
```

### 生成调色板

如果你想让系统尝试根据单个十六进制或 RGB 值为你生成调色板，可以直接传入：

```php
$panel
    ->colors([
        'primary' => '#6366f1',
    ])

$panel
    ->colors([
        'primary' => 'rgb(99, 102, 241)',
    ])
```

## 修改字体

默认情况下，我们使用 [Inter](https://fonts.google.com/specimen/Inter) 字体。你可以在[配置](../panel-configuration)文件中使用 `font()` 方法来修改：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->font('Poppins');
}
```

所有 [Google Fonts](https://fonts.google.com) 都可使用。

![使用自定义字体的面板](/assets/filament/v4.x/screenshots/images/light/panels/styling/font.jpg)

### 修改字体提供商

默认使用 [Bunny Fonts CDN](https://fonts.bunny.net) 来提供字体服务，它符合 GDPR 要求。如果你想改用 [Google Fonts CDN](https://fonts.google.com)，可以使用 `font()` 方法的 `provider` 参数：

```php
use Filament\FontProviders\GoogleFontProvider;

$panel->font('Inter', provider: GoogleFontProvider::class)
```

或者如果你想从本地样式表提供字体服务，可以使用 `LocalFontProvider`：

```php
use Filament\FontProviders\LocalFontProvider;

$panel->font(
    'Inter',
    url: asset('css/fonts.css'),
    provider: LocalFontProvider::class,
)
```

## 创建自定义主题

Filament 允许你通过编译自定义样式表来替换默认样式，从而更改渲染 UI 所使用的 CSS。这个自定义样式表被称为"主题"。主题使用 [Tailwind CSS](https://tailwindcss.com)。

要为面板创建自定义主题，可以使用 `php artisan make:filament-theme` 命令：

```bash
php artisan make:filament-theme
```

如果你有多个面板，可以指定要创建主题的面板：

```bash
php artisan make:filament-theme admin
```

默认情况下，此命令会使用 NPM 安装依赖。如果你想使用其他包管理器，可以使用 `--pm` 选项：

```bash
php artisan make:filament-theme --pm=bun
````

此命令将：

1. 安装所需的 Tailwind CSS 依赖
2. 在 `resources/css/filament/{panel}/theme.css` 生成 CSS 文件
3. 尝试自动将主题添加到 `vite.config.js` 的 input 数组中
4. 尝试自动在面板提供者中注册 `->viteTheme()`
5. 提供使用 Vite 编译主题的选项

如果命令无法自动配置你的文件（由于非标准格式），它将显示手动操作说明。在这种情况下，请按照以下步骤操作：

### 手动配置

将主题的 CSS 文件添加到 Laravel 插件的 `input` 数组中，在 `vite.config.js` 里：

```js
input: [
    // ...
    'resources/css/filament/admin/theme.css',
]
```

在面板提供者中注册 Vite 编译的主题 CSS 文件：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->viteTheme('resources/css/filament/admin/theme.css');
}
```

然后使用 Vite 编译主题：

```bash
npm run build
```

:::info
请检查命令输出以获取确切的文件路径（例如 `admin/theme.css`），因为它可能因面板 ID 不同而有所变化。
:::

现在你可以通过编辑 `resources/css/filament` 中的 CSS 文件来自定义主题。

## 在 Blade 视图或 PHP 文件中使用 Tailwind CSS 类

:::warning
**要在你自己的代码中使用 Tailwind CSS 类，必须先创建自定义主题。** Filament 默认的编译样式表不包含任意的 Tailwind 类 -- 它仅包含 Filament 自身 UI 组件所需的样式。
:::

如果你想在自己的 Blade 视图、Livewire 组件或 PHP 文件中使用 Tailwind CSS 工具类（如 `text-primary-600`、`bg-gray-100`、`p-4` 等），**必须先创建自定义主题**。

如果没有自定义主题，你添加到代码中的任何 Tailwind 类都不会生效 -- 样式不会被应用，因为它们未包含在编译后的 CSS 中。

### 为项目设置 Tailwind CSS

要在项目中使用 Tailwind CSS 类，你需要设置一个[自定义主题](#创建自定义主题)。运行以下命令：

```bash
php artisan make:filament-theme
```

在生成的 `theme.css` 文件中，你会找到 `@source` 指令，用于告诉 Tailwind CSS 扫描哪些位置的类：

```css
@source '../../../../app/Filament/**/*';
@source '../../../../resources/views/filament/**/*';
```

**添加你自己的目录**，即你使用 Tailwind 类的位置。例如：

```css
@source '../../../../app/Filament/**/*';
@source '../../../../resources/views/filament/**/*';
@source '../../../../resources/views/components/**/*';
@source '../../../../resources/views/livewire/**/*';
@source '../../../../app/Livewire/**/*';
```

添加目录后，重新构建你的主题：

```bash
npm run build
```

你可以在 Tailwind CSS 文档中[了解更多关于 `@source` 指令](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources)的内容。

## 禁用暗色模式

要禁用暗色模式切换，可以在[配置](../panel-configuration)文件中设置：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->darkMode(false);
}
```

## 更改默认主题模式

默认情况下，Filament 使用用户的系统主题作为默认模式。例如，如果用户的电脑处于暗色模式，Filament 将默认使用暗色模式。Filament 中的系统模式是响应式的，当用户更改电脑模式时会自动切换。如果你想将默认模式强制为亮色或暗色模式，可以使用 `defaultThemeMode()` 方法，传入 `ThemeMode::Light` 或 `ThemeMode::Dark`：

```php
use Filament\Enums\ThemeMode;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->defaultThemeMode(ThemeMode::Light);
}
```

## 添加 Logo

默认情况下，Filament 使用应用名称来渲染简单的文本 Logo。但你可以轻松自定义它。

如果你想修改 Logo 中使用的文本，可以使用 `brandName()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandName('Filament Demo');
}
```

![使用自定义品牌名称的面板](/assets/filament/v4.x/screenshots/images/light/panels/styling/brand-name.jpg)

要渲染图片 Logo，可以将 URL 传给 `brandLogo()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(asset('images/logo.svg'));
}
```

![使用自定义品牌 Logo 的面板](/assets/filament/v4.x/screenshots/images/light/panels/styling/brand-logo.jpg)

或者，你也可以直接将 HTML 传给 `brandLogo()` 方法来渲染内联 SVG 元素：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(fn () => view('filament.admin.logo'));
}
```

```blade
<svg
    viewBox="0 0 128 26"
    xmlns="http://www.w3.org/2000/svg"
    class="h-full fill-gray-500 dark:fill-gray-400"
>
    <!-- ... -->
</svg>
```

如果需要在应用处于暗色模式时使用不同的 Logo，可以同样方式传给 `darkModeBrandLogo()`。

Logo 高度默认为合理值，但无法涵盖所有可能的宽高比。因此，你可以使用 `brandLogoHeight()` 方法自定义渲染 Logo 的高度：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(fn () => view('filament.admin.logo'))
        ->brandLogoHeight('2rem');
}
```


## 添加 Favicon

要添加 Favicon，可以在[配置](../panel-configuration)文件中传入 Favicon 的公共 URL：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->favicon(asset('images/favicon.png'));
}
```
