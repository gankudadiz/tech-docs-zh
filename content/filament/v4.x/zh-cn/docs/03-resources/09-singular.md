---
title: 单一资源
---

## 概述

资源并不是在 Filament 面板中与 Eloquent 记录交互的唯一方式。尽管资源可能解决了你的许多需求，但资源的"索引"（根）页面包含一个显示该资源中记录列表的表格。

有时并不需要一个列出资源中所有记录的表格。用户只需与单个记录进行交互。如果用户访问页面时该记录尚不存在，则会在用户首次提交表单保存时创建。如果记录已存在，则会在页面首次加载时加载到表单中，并在表单提交时更新。

例如，一个 CMS 可能有一个 `Page` Eloquent 模型和一个 `PageResource`，但你可能还想在 `PageResource` 之外创建一个单一页面来编辑网站的"首页"。这样用户可以直接编辑首页，而无需导航到 `PageResource` 并在表格中找到首页记录。

其他使用场景还包括"设置"页面，或当前登录用户的"个人资料"页面。不过对于这些用例，我们建议使用 [Spatie Settings 插件](https://filamentphp.com/plugins/filament-spatie-settings) 和 Filament 的[个人资料](../users/overview#authentication-features)功能，它们需要更少的代码即可实现。

![用于管理首页的单一资源页面](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/singular.jpg)

## 创建单一资源

尽管 Filament 中没有特定的"单一资源"功能，但这是一个被广泛需求的行为，可以使用[自定义页面](../navigation/custom-pages)配合[表单](../forms)轻松实现。本指南将介绍如何操作。

首先，创建一个[自定义页面](../navigation/custom-pages)：

```bash
php artisan make:filament-page ManageHomepage
```

此命令将创建两个文件——一个页面类位于资源目录的 `/Filament/Pages` 目录中，一个 Blade 视图位于资源视图目录的 `/filament/pages` 目录中。

页面类应包含以下元素：
- 一个 `$data` 属性，用于保存表单的当前状态。
- 一个 `mount()` 方法，用于从数据库加载当前记录并将其数据填充到表单中。如果记录不存在，将向表单的 `fill()` 方法传递 `null`，这会为表单字段分配默认值。
- 一个 `form()` 方法，用于定义表单模式。表单在 `components()` 方法中包含字段。应使用 `record()` 方法指定表单应加载关联数据的记录。应使用 `statePath()` 方法指定表单状态存储的属性名（`$data`）。
- 一个 `save()` 方法，用于将表单数据保存到数据库。`getState()` 方法运行表单验证并返回有效的表单数据。此方法应检查记录是否已存在，如果不存在则创建新记录。可以使用模型的 `wasRecentlyCreated` 属性来判断记录是否刚刚创建，如果是则还应保存关联关系。发送通知给用户以确认记录已保存。
- 一个 `getRecord()` 方法，虽然不是严格必需的，但建议保留。此方法将返回表单正在编辑的 Eloquent 记录。它可以在其他方法中使用，以避免代码重复。

```php
namespace App\Filament\Pages;

use App\Models\WebsitePage;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Schema;

/**
 * @property-read Schema $form
 */
class ManageHomepage extends Page
{
    protected string $view = 'filament.pages.manage-homepage';

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill($this->getRecord()?->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255),
                    RichEditor::make('content'),
                    // ...
                ])
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make([
                            Action::make('save')
                                ->submit('save')
                                ->keyBindings(['mod+s']),
                        ]),
                    ]),
            ])
            ->record($this->getRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        
        $record = $this->getRecord();
        
        if (! $record) {
            $record = new WebsitePage();
            $record->is_homepage = true;
        }
        
        $record->fill($data);
        $record->save();
        
        if ($record->wasRecentlyCreated) {
            $this->form->record($record)->saveRelationships();
        }

        Notification::make()
            ->success()
            ->title('Saved')
            ->send();
    }
    
    public function getRecord(): ?WebsitePage
    {
        return WebsitePage::query()
            ->where('is_homepage', true)
            ->first();
    }
}
```

页面 Blade 视图应渲染表单：

```blade
<x-filament::page>
    {{ $this->form }}
</x-filament::page>
```
