---
title: 快速开始
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/quickstart.md
source_version: v3.8.0
translation_status: draft
---

要开始你的 Livewire 之旅，我们会创建一个简单的“计数器”组件，并在浏览器中渲染它。这个示例非常适合作为第一次体验 Livewire 的入口，因为它用最简单的方式展示了 Livewire 的“实时性”。

## 前置条件

开始之前，请确认你已经安装：

- Laravel 10 或更高版本
- PHP 8.1 或更高版本

## 安装 Livewire

在 Laravel 应用的根目录中，运行下面的 [Composer](https://getcomposer.org/) 命令：

```shell
composer require livewire/livewire
```

:::warning[确保 Alpine 没有被重复安装]
如果你使用的应用已经安装了 AlpineJS，需要先将它移除，Livewire 才能正常工作；否则 Alpine 会被加载两次，Livewire 将无法运行。例如，如果你安装了 Laravel Breeze 的 “Blade with Alpine” 入门套件，就需要从 `resources/js/app.js` 中移除 Alpine。
:::

## 创建 Livewire 组件

Livewire 提供了一个方便的 Artisan 命令，可以快速生成新组件。运行下面的命令创建一个新的 `Counter` 组件：

```shell
php artisan make:livewire counter
```

这个命令会在项目中生成两个新文件：

- `app/Livewire/Counter.php`
- `resources/views/livewire/counter.blade.php`

## 编写类

打开 `app/Livewire/Counter.php`，将内容替换为：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function decrement()
    {
        $this->count--;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

上面代码的简要说明：

- `public $count = 1;` 声明一个名为 `$count` 的公共属性，初始值为 `1`。
- `public function increment()` 声明一个名为 `increment()` 的公共方法，每次调用时都会递增 `$count`。这类公共方法可以通过多种方式从浏览器触发，包括用户点击按钮。
- `public function render()` 声明一个 `render()` 方法，返回一个 Blade 视图。这个 Blade 视图将包含组件的 HTML 模板。

## 编写视图

打开 `resources/views/livewire/counter.blade.php` 文件，将内容替换为：

```blade
<div>
    <h1>{{ $count }}</h1>

    <button wire:click="increment">+</button>

    <button wire:click="decrement">-</button>
</div>
```

这段代码会显示 `$count` 属性的值，并提供两个按钮，分别用于递增和递减 `$count`。

:::warning[Livewire 组件必须只有一个根元素]
为了让 Livewire 正常工作，组件必须只有**一个**根元素。如果检测到多个根元素，Livewire 会抛出异常。建议像示例中一样使用 `<div>` 元素。HTML 注释也会被视为独立元素，因此应放在根元素内部。

在渲染[全页组件](https://livewire.laravel.com/docs/3.x/components#full-page-components)时，布局文件的命名插槽可以放在根元素之外。它们会在组件渲染前被移除。
:::

## 为组件注册路由

打开 Laravel 应用中的 `routes/web.php` 文件，添加下面的代码：

```php
use App\Livewire\Counter;

Route::get('/counter', Counter::class);
```

现在，`counter` 组件已经被分配给 `/counter` 路由。当用户访问应用中的 `/counter` 端点时，浏览器就会渲染这个组件。

## 创建模板布局

在浏览器中访问 `/counter` 之前，我们还需要一个 HTML 布局，让组件在其中渲染。默认情况下，Livewire 会自动查找名为 `resources/views/components/layouts/app.blade.php` 的布局文件。

如果这个文件还不存在，可以运行下面的命令创建它：

```shell
php artisan livewire:layout
```

这个命令会生成 `resources/views/components/layouts/app.blade.php` 文件，内容如下：

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

`counter` 组件会渲染到上面模板中的 `$slot` 位置。

你可能已经注意到，这里没有提供任何 Livewire 的 JavaScript 或 CSS 资源。这是因为 Livewire 3 及以上版本会自动注入它所需的前端资源。

## 试试看

组件类和模板都准备好之后，这个组件就可以测试了。

在浏览器中访问 `/counter`，你应该能看到页面上显示一个数字，以及两个用于递增和递减数字的按钮。

点击任意按钮后，你会发现数字会实时更新，而页面不会重新加载。这就是 Livewire 的魔力：用 PHP 编写动态前端应用。

我们才刚刚触及 Livewire 能力的表面。继续阅读文档，你会看到 Livewire 提供的更多功能。
