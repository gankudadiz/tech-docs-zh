---
title: 文件下载
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/downloads.md
source_version: v3.8.0
translation_status: draft
---

Livewire 中的文件下载与 Laravel 本身的工作方式基本相同。通常情况下，你可以在 Livewire 组件中使用任何 Laravel 下载工具，它应该能够按预期工作。

然而，在后台，文件下载的处理方式与标准的 Laravel 应用有所不同。使用 Livewire 时，文件内容会被 Base64 编码，发送到前端，然后再解码回二进制数据，以便直接从客户端下载。

## 基本用法

在 Livewire 中触发文件下载非常简单，只需返回一个标准的 Laravel 下载响应即可。

下面是一个 `ShowInvoice` 组件的示例，其中包含一个用于下载发票 PDF 的"下载"按钮：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Invoice;

class ShowInvoice extends Component
{
    public Invoice $invoice;

    public function mount(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function download()
    {
        return response()->download( // [tl! highlight:2]
            $this->invoice->file_path, 'invoice.pdf'
        );
    }

    public function render()
    {
        return view('livewire.show-invoice');
    }
}
```

```blade
<div>
    <h1>{{ $invoice->title }}</h1>

    <span>{{ $invoice->date }}</span>
    <span>{{ $invoice->amount }}</span>

    <button type="button" wire:click="download">Download</button> <!-- [tl! highlight] -->
</div>
```

就像在 Laravel 控制器中一样，你也可以使用 `Storage` facade 来发起下载：

```php
public function download()
{
    return Storage::disk('invoices')->download('invoice.csv');
}
```

## 流式下载

Livewire 也可以进行流式下载；然而它们并非真正的流式传输。只有在收集完文件内容并交付给浏览器后，才会触发下载：

```php
public function download()
{
    return response()->streamDownload(function () {
        echo '...'; // Echo download contents directly...
    }, 'invoice.pdf');
}
```

## 测试文件下载

Livewire 还提供了 `->assertFileDownloaded()` 方法，可以轻松测试文件是否以指定的名称被下载：

```php
use App\Models\Invoice;

public function test_can_download_invoice()
{
    $invoice = Invoice::factory();

    Livewire::test(ShowInvoice::class)
        ->call('download')
        ->assertFileDownloaded('invoice.pdf');
}
```

你还可以使用 `->assertNoFileDownloaded()` 方法来确保文件未被下载：

```php
use App\Models\Invoice;

public function test_does_not_download_invoice_if_unauthorised()
{
    $invoice = Invoice::factory();

    Livewire::test(ShowInvoice::class)
        ->call('download')
        ->assertNoFileDownloaded();
}
```
