---
title: 导航
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/navigate.md
source_version: v3.8.0
translation_status: draft
---

许多现代 Web 应用被构建为"单页应用"（SPA）。在这些应用中，渲染的每个页面不再需要完整的浏览器页面重新加载，避免了每次请求时重新下载 JavaScript 和 CSS 资源的开销。

与*单页应用*相对的是*多页应用*。在这些应用中，每当用户点击链接时，都会请求一个全新的 HTML 页面并在浏览器中渲染。

虽然大多数 PHP 应用传统上都是多页应用，但 Livewire 通过一个可以添加到应用中链接的简单属性 `wire:navigate`，提供了单页应用的体验。

## 基本用法

让我们探索一个使用 `wire:navigate` 的示例。下面是一个典型的 Laravel 路由文件（`routes/web.php`），其中定义了三个 Livewire 组件作为路由：

```php
use App\Livewire\Dashboard;
use App\Livewire\ShowPosts;
use App\Livewire\ShowUsers;

Route::get('/', Dashboard::class);

Route::get('/posts', ShowPosts::class);

Route::get('/users', ShowUsers::class);
```

通过在每个页面的导航菜单中的每个链接上添加 `wire:navigate`，Livewire 将阻止链接点击的标准处理方式，并替换为它自己更快的版本：

```blade
<nav>
    <a href="/" wire:navigate>Dashboard</a>
    <a href="/posts" wire:navigate>Posts</a>
    <a href="/users" wire:navigate>Users</a>
</nav>
```

以下是点击 `wire:navigate` 链接时发生的过程分解：

* 用户点击链接
* Livewire 阻止浏览器访问新页面
* 相反，Livewire 在后台请求页面，并在页面顶部显示一个加载条
* 当新页面的 HTML 被接收后，Livewire 用新页面的元素替换当前页面的 URL、`<title>` 标签和 `<body>` 内容

这种技术可以实现更快的页面加载时间——通常是原来的两倍——并使应用"感觉"像 JavaScript 驱动的单页应用。

## 重定向

当你的某个 Livewire 组件将用户重定向到应用内的另一个 URL 时，你也可以指示 Livewire 使用其 `wire:navigate` 功能来加载新页面。为此，请向 `redirect()` 方法提供 `navigate` 参数：

```php
return $this->redirect('/posts', navigate: true);
```

现在，Livewire 将用新页面的内容和 URL 替换当前页面的内容和 URL，而不是使用完整的页面请求来将用户重定向到新 URL。

## 预取链接

默认情况下，Livewire 包含一种温和的策略，可以在用户点击链接之前*预取*页面：

* 用户按下鼠标按钮
* Livewire 开始请求页面
* 用户松开鼠标按钮完成*点击*
* Livewire 完成请求并导航到新页面

令人惊讶的是，用户按下和松开鼠标按钮之间的时间通常足以从服务器加载一半甚至整个页面。

如果你想要更激进的预取方法，可以在链接上使用 `.hover` 修饰符：

```blade
<a href="/posts" wire:navigate.hover>Posts</a>
```

`.hover` 修饰符将指示 Livewire 在用户悬停在链接上 `60` 毫秒后预取页面。

:::warning 悬停预取会增加服务器使用量
因为并非所有悬停在链接上的用户都会点击它，添加 `.hover` 将请求可能不需要的页面，不过 Livewire 会尝试通过等待 `60` 毫秒后再预取页面来减轻部分开销。
:::

## 跨页面持久化元素

有时，用户界面中有一些部分需要在页面加载之间保持持久，例如音频或视频播放器。例如，在播客应用中，用户可能希望在浏览其他页面时继续收听节目。

你可以在 Livewire 中使用 `@persist` 指令实现这一点。

通过用 `@persist` 包裹一个元素并为其提供名称，当使用 `wire:navigate` 请求新页面时，Livewire 会寻找新页面上具有匹配 `@persist` 的元素。Livewire 不会像通常那样替换该元素，而是将前一页面中的现有 DOM 元素复用到新页面中，从而保留元素内的任何状态。

以下是一个使用 `@persist` 跨页面持久化 `<audio>` 播放器元素的示例：

```blade
@persist('player')
    <audio src="{{ $episode->file }}" controls></audio>
@endpersist
```

如果上述 HTML 同时出现在当前页面和下一个页面上，则原始元素将被复用到新页面中。对于音频播放器来说，在从一个页面导航到另一个页面时，音频播放不会中断。

请注意，持久化的元素必须放在 Livewire 组件外部。一种常见做法是将持久化元素放在主布局中，例如 `resources/views/components/layouts/app.blade.php`。

```html
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        <main>
            {{ $slot }}
        </main>

        @persist('player') <!-- [tl! highlight:2] -->
            <audio src="{{ $episode->file }}" controls></audio>
        @endpersist
    </body>
</html>
```

### 高亮活动链接

你可能习惯于使用服务端 Blade 来高亮导航栏中当前活动的页面链接，如下所示：

```blade
<nav>
    <a href="/" class="@if (request->is('/')) font-bold text-zinc-800 @endif">Dashboard</a>
    <a href="/posts" class="@if (request->is('/posts')) font-bold text-zinc-800 @endif">Posts</a>
    <a href="/users" class="@if (request->is('/users')) font-bold text-zinc-800 @endif">Users</a>
</nav>
```

然而，这在持久化元素内部不会生效，因为这些元素会在页面加载之间被复用。相反，你应该使用 Livewire 的 `wire:current` 指令来高亮当前活动链接。

只需将要应用于当前活动链接的任何 CSS 类传递给 `wire:current`：

```blade
<nav>
    <a href="/dashboard" ... wire:current="font-bold text-zinc-800">Dashboard</a>
    <a href="/posts" ... wire:current="font-bold text-zinc-800">Posts</a>
    <a href="/users" ... wire:current="font-bold text-zinc-800">Users</a>
</nav>
```

现在，当访问 `/posts` 页面时，"Posts" 链接将比其他链接具有更强的字体效果。

更多信息请参阅 [`wire:current` 文档](/docs/livewire/v3.x/wire-current)。

### 保留滚动位置

默认情况下，Livewire 会在页面之间前进和后退时保留页面的滚动位置。但是，有时你可能希望保留在页面加载之间持久化的单个元素的滚动位置。

为此，你必须在包含滚动条的元素上添加 `wire:scroll`，如下所示：

```html
@persist('scrollbar')
<div class="overflow-y-scroll" wire:scroll> <!-- [tl! highlight] -->
    <!-- ... -->
</div>
@endpersist
```

## JavaScript 钩子

每次页面导航会触发三个生命周期钩子：

* `livewire:navigate`
* `livewire:navigating`
* `livewire:navigated`

需要注意的是，这些钩子事件会在所有类型的导航上触发。这包括使用 `Livewire.navigate()` 的手动导航、启用导航的重定向，以及浏览器的前进和后退按钮操作。

以下是为每个事件注册监听器的示例：

```js
document.addEventListener('livewire:navigate', (event) => {
    // 当导航被触发时触发。

    // 可以"取消"（阻止导航实际执行）：
    event.preventDefault()

    // 包含有关导航触发的有用上下文：
    let context = event.detail

    // 导航目标地址的 URL 对象...
    context.url

    // 一个布尔值 [true/false]，指示此导航
    // 是否由前进/后退（历史状态）导航触发...
    context.history

    // 一个布尔值 [true/false]，指示是否存在
    // 此页面的缓存版本可供使用，而不是
    // 通过网络往返获取新页面...
    context.cached
})

document.addEventListener('livewire:navigating', (e) => {
    // 当新 HTML 即将被交换到页面上时触发...

    // 这是在页面被导航离开之前
    // 修改任何 HTML 的好时机...

    // 你可以注册一个 onSwap 回调，在新 HTML
    // 被交换到页面上之后、脚本加载之前运行代码。
    // 这是应用关键样式（如暗色模式）
    // 以防止闪烁的好时机...
    e.detail.onSwap(() => {
        // ...
    })
})

document.addEventListener('livewire:navigated', () => {
    // 在任何页面导航的最后一步触发...

    // 也会在页面加载时触发，而不是 "DOMContentLoaded"...
})
```

:::warning 事件监听器会跨页面持久存在
当你将事件监听器附加到 document 上时，它不会在你导航到不同页面时被移除。如果你需要代码仅在导航到特定页面后运行，或者你在每个页面上都添加了相同的事件监听器，这可能会导致意外行为。如果你不移除事件监听器，它可能会在其他页面上查找不存在的元素时引发异常，或者可能导致事件监听器每次导航执行多次。
:::

:::warning
移除事件监听器的一个简单方法是在其运行后，将 `{once: true}` 选项作为第三个参数传递给 `addEventListener` 函数。
```js
document.addEventListener('livewire:navigated', () => {
    // ...
}, { once: true })
```
:::

## 手动访问新页面

除了 `wire:navigate` 之外，你还可以手动调用 `Livewire.navigate()` 方法，通过 JavaScript 触发对新页面的访问：

```html
<script>
    // ...

    Livewire.navigate('/new/url')
</script>
```

## 与分析软件一起使用

在应用中使用 `wire:navigate` 导航页面时，`<head>` 中的任何 `<script>` 标签仅在页面首次加载时执行。

这给诸如 [Fathom Analytics](https://usefathom.com/) 之类的分析软件带来了问题。这些工具依赖于每次页面变更时都执行 `<script>` 代码片段，而不仅仅是第一次。

像 [Google Analytics](https://marketingplatform.google.com/about/analytics/) 这样的工具足够智能，可以自动处理这个问题，但是，当使用 Fathom Analytics 时，你必须在 script 标签中添加 `data-spa="auto"`，以确保每次页面访问都被正确跟踪：

```blade
<head>
    <!-- ... -->

    <!-- Fathom Analytics -->
    @if (! config('app.debug'))
        <script src="https://cdn.usefathom.com/script.js" data-site="ABCDEFG" data-spa="auto" defer></script> <!-- [tl! highlight] -->
    @endif
</head>
```

## 脚本评估

当使用 `wire:navigate` 导航到新页面时，感觉就像浏览器已经切换了页面；然而，从浏览器的角度来看，你实际上仍然停留在原始页面上。

因此，样式和脚本在第一个页面上正常执行，但在后续页面上，你可能需要调整编写 JavaScript 的方式。

以下是使用 `wire:navigate` 时应注意的一些注意事项和场景。

### 不要依赖 `DOMContentLoaded`

通常的做法是将 JavaScript 放入 `DOMContentLoaded` 事件监听器中，这样你想要运行的代码仅在页面完全加载后才会执行。

当使用 `wire:navigate` 时，`DOMContentLoaded` 仅在第一次页面访问时触发，后续访问不会触发。

要在每次页面访问时运行代码，请将每个 `DOMContentLoaded` 实例替换为 `livewire:navigated`：

```js
document.addEventListener('DOMContentLoaded', () => { // [tl! remove]
document.addEventListener('livewire:navigated', () => { // [tl! add]
    // ...
})
```

现在，放在此监听器内的任何代码都将在初始页面访问时运行，并且在 Livewire 完成导航到后续页面后也会运行。

监听此事件对于初始化第三方库等情况非常有用。

### `<head>` 中的脚本只加载一次

如果两个页面在 `<head>` 中包含相同的 `<script>` 标签，该脚本将仅在初始页面访问时运行，在后续页面访问时不会运行。

```blade
<!-- 页面一 -->
<head>
    <script src="/app.js"></script>
</head>

<!-- 页面二 -->
<head>
    <script src="/app.js"></script>
</head>
```

### 新的 `<head>` 脚本会被评估

如果后续页面包含一个在初始页面访问的 `<head>` 中不存在的新的 `<script>` 标签，Livewire 将运行这个新的 `<script>` 标签。

在下面的示例中，*页面二* 包含一个用于第三方工具的新 JavaScript 库。当用户导航到*页面二*时，该库将被评估。

```blade
<!-- 页面一 -->
<head>
    <script src="/app.js"></script>
</head>

<!-- 页面二 -->
<head>
    <script src="/app.js"></script>
    <script src="/third-party.js"></script>
</head>
```

:::info Head 资源是阻塞的
如果你正在导航到一个新页面，该页面的 head 标签中包含 ` <script src="...">` 这样的资源，该资源将在导航完成且新页面被交换进来之前被获取和处理。这可能是出乎意料的行为，但它确保任何依赖于这些资源的脚本可以立即访问它们。
:::

### 资源变更时重新加载

通常的做法是在应用的主 JavaScript 文件名中包含版本哈希。这确保在部署新版本的应用后，用户会收到新鲜的 JavaScript 资源，而不是从浏览器缓存中提供旧版本。

但是，既然你正在使用 `wire:navigate`，并且每次页面访问不再是全新的浏览器页面加载，用户在部署后可能仍然收到过时的 JavaScript。

为防止这种情况，你可以在 `<head>` 中的 `<script>` 标签上添加 `data-navigate-track`：

```blade
<!-- 页面一 -->
<head>
    <script src="/app.js?id=123" data-navigate-track></script>
</head>

<!-- 页面二 -->
<head>
    <script src="/app.js?id=456" data-navigate-track></script>
</head>
```

当用户访问*页面二*时，Livewire 会检测到新的 JavaScript 资源并触发完整的浏览器页面重新加载。

如果你使用 [Laravel 的 Vite 插件](https://laravel.com/docs/vite#loading-your-scripts-and-styles) 来打包和提供资源，Livewire 会自动将 `data-navigate-track` 添加到渲染后的 HTML 资源标签中。你可以像往常一样继续引用资源和脚本：

```blade
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

Livewire 会自动将 `data-navigate-track` 注入到渲染后的 HTML 标签中。

:::warning 只跟踪查询字符串的变化
Livewire 只有在 `[data-navigate-track]` 元素的查询字符串（`?id="456"`）发生变化时才会重新加载页面，而不会因为 URI 本身（`/app.js`）的变化而重新加载。
:::

### `<body>` 中的脚本会重新评估

因为 Livewire 在每个新页面都会替换整个 `<body>` 内容，所以新页面上的所有 `<script>` 标签都会被执行：

```blade
<!-- 页面一 -->
<body>
    <script>
        console.log('在页面一上运行')
    </script>
</body>

<!-- 页面二 -->
<body>
    <script>
        console.log('在页面二上运行')
    </script>
</body>
```

如果你有一个在 body 中只想运行一次的 `<script>` 标签，可以给该 `<script>` 标签添加 `data-navigate-once` 属性，Livewire 将仅在初始页面访问时运行它：

```blade
<script data-navigate-once>
    console.log('仅在页面一上运行')
</script>
```

## 自定义进度条

当页面加载时间超过 150ms 时，Livewire 会在页面顶部显示一个进度条。

你可以在 Livewire 的配置文件（`config/livewire.php`）中自定义此条的颜色，或完全禁用它：

```php
'navigate' => [
    'show_progress_bar' => false,
    'progress_bar_color' => '#2299dd',
],
```
