---
title: 资源打包
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/bundling.md
source_version: v3.8.0
translation_status: draft
---

Livewire 中的每次组件更新都会触发一个网络请求。默认情况下，当多个组件同时触发更新时，它们会被打包到同一个请求中。

这样可以减少与服务器的网络连接数量，并大幅降低服务器负载。

除了性能提升之外，这也使得内部需要多个组件协作的功能（如[响应式属性](/docs/livewire/v3.x/nesting#reactive-props)、[可模型绑定属性](/docs/livewire/v3.x/nesting#binding-to-child-data-using-wiremodel)等）成为可能。

然而，有时出于性能考虑，需要禁用这种打包行为。以下页面概述了在 Livewire 中自定义此行为的各种方法。

## 隔离组件请求

通过使用 Livewire 的 `#[Isolate]` 类属性，你可以将组件标记为"已隔离"。这意味着当该组件进行一次服务端往返时，它将尝试与其他组件请求隔离开来。

如果更新操作开销较大，希望该组件的更新能与其他组件并行执行，这将非常有用。例如，当多个组件同时使用 `wire:poll` 或监听页面上的事件时，你可能希望隔离那些更新开销较大、否则会拖慢整个请求的组件。

```php
use Livewire\Attributes\Isolate;
use Livewire\Component;

#[Isolate] // [tl! highlight]
class ShowPost extends Component
{
    // ...
}
```

通过添加 `#[Isolate]` 属性，该组件的请求将不再与其他组件的更新打包在一起。

## 延迟组件默认是隔离的

当单个页面上有多个组件是"延迟"加载的（使用 `#[Lazy]` 属性），通常希望它们的请求是隔离的且并行发送。因此，Livewire 默认将延迟更新隔离。

如果你希望禁用此行为，可以在 `#[Lazy]` 属性中传递 `isolate: false` 参数，如下所示：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy(isolate: false)] // [tl! highlight]
class Revenue extends Component
{
    // ...
}
```

现在，如果同一个页面上有多个 `Revenue` 组件，所有的十次更新将被打包在一起，作为单个延迟加载的网络请求发送到服务器。
