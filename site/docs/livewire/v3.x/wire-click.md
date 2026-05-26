---
title: wire:click
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-click.md
source_version: v3.8.0
translation_status: draft
---

Livewire 提供了简单的 `wire:click` 指令，用于在用户点击页面上的特定元素时调用组件方法（即 actions）。

例如，下面的 `ShowInvoice` 组件：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Invoice;

class ShowInvoice extends Component
{
    public Invoice $invoice;

    public function download()
    {
        return response()->download(
            $this->invoice->file_path, 'invoice.pdf'
        );
    }
}
```

你可以通过添加 `wire:click="download"` 来在用户点击"下载发票"按钮时触发上述类中的 `download()` 方法：

```html
<button type="button" wire:click="download"> <!-- [tl! highlight] -->
    Download Invoice
</button>
```

## 在链接上使用 `wire:click`

在 `<a>` 标签上使用 `wire:click` 时，必须附加 `.prevent` 来阻止浏览器的默认链接处理行为。否则，浏览器会访问该链接并更新页面 URL。

```html
<a href="#" wire:click.prevent="...">
```

## 深入了解

`wire:click` 指令只是 Livewire 提供的众多事件监听器之一。关于它（及其他事件监听器）的功能完整文档，请访问 [Livewire 操作文档页面](/docs/livewire/v3.x/actions)。
