---
title: 自定义条目
---

## 简介

你可以创建自己的自定义条目类和视图，在项目中重复使用，甚至作为插件发布给社区。

要创建自定义条目类和视图，可以使用以下命令：

```bash
php artisan make:filament-infolist-entry AudioPlayerEntry
```

这将创建以下组件类：

```php
use Filament\Infolists\Components\Entry;

class AudioPlayerEntry extends Entry
{
    protected string $view = 'filament.infolists.components.audio-player-entry';
}
```

它还将在 `resources/views/filament/infolists/components/audio-player-entry.blade.php` 创建一个视图文件。

:::info
    Filament 信息列表条目**不是** Livewire 组件。在信息列表条目类上定义公共属性和方法不会使它们在 Blade 视图中可访问。
:::

## 在 Blade 视图中访问条目的状态

在 Blade 视图内，你可以使用 `$getState()` 函数访问条目的[状态](overview#entry-content-state)：

```blade
<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    {{ $getState() }}
</x-dynamic-component>
```

## 在 Blade 视图中访问另一个组件的状态

在 Blade 视图内，你可以使用 `$get()` 函数访问 schema 中另一个组件的状态：

```blade
<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    {{ $get('email') }}
</x-dynamic-component>
```

:::tip
    除非表单字段是[响应式的](../infolists/overview#the-basics-of-reactivity)，否则当字段值更改时，Blade 视图不会刷新，只有在下一次用户交互发生并向服务器发出请求时才会刷新。如果你需要对字段值的更改做出反应，它应该是 `live()`。
:::

## 在 Blade 视图中访问 Eloquent 记录

在 Blade 视图内，你可以使用 `$record` 变量访问当前 Eloquent 记录：

```blade
<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    {{ $record->name }}
</x-dynamic-component>
```

## 在 Blade 视图中访问当前操作

在 Blade 视图内，你可以使用 `$operation` 变量访问当前操作，通常是 `create`、`edit` 或 `view`：

```blade
<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    @if ($operation === 'create')
        This is a new conference.
    @else
        This is an existing conference.
    @endif
</x-dynamic-component>
```

## 在 Blade 视图中访问当前 Livewire 组件实例

在 Blade 视图内，你可以使用 `$this` 访问当前 Livewire 组件实例：

```blade
@php
    use Filament\Resources\Users\RelationManagers\ConferencesRelationManager;
@endphp

<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    @if ($this instanceof ConferencesRelationManager)
        You are editing conferences the of a user.
    @endif
</x-dynamic-component>
```

## 在 Blade 视图中访问当前条目实例

在 Blade 视图内，你可以使用 `$entry` 访问当前条目实例。你可以调用此对象上的公共方法来访问变量中可能不可用的其他信息：

```blade
<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    @if ($entry->isLabelHidden())
        This is a new conference.
    @endif
</x-dynamic-component>
```

## 向自定义条目类添加配置方法

你可以向自定义条目类添加一个公共方法，该方法接受配置值，将其存储在受保护的属性中，然后从另一个公共方法返回它：

```php
use Filament\Infolists\Components\Entry;

class AudioPlayerEntry extends Entry
{
    protected string $view = 'filament.infolists.components.audio-player-entry';

    protected ?float $speed = null;

    public function speed(?float $speed): static
    {
        $this->speed = $speed;

        return $this;
    }

    public function getSpeed(): ?float
    {
        return $this->speed;
    }
}
```

现在，在自定义条目的 Blade 视图中，你可以使用 `$getSpeed()` 函数访问速度：

```blade
<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    {{ $getSpeed() }}
</x-dynamic-component>
```

你在自定义条目类上定义的任何公共方法都可以作为变量函数在 Blade 视图中以这种方式访问。

要将配置值传递给自定义条目类，可以使用公共方法：

```php
use App\Filament\Infolists\Components\AudioPlayerEntry;

AudioPlayerEntry::make('recording')
    ->speed(0.5)
```

## 在自定义条目配置方法中允许工具注入

[工具注入](overview#entry-utility-injection)是 Filament 的一个强大功能，允许用户使用可以访问各种实用工具的函数来配置组件。你可以通过确保配置的参数类型和属性类型允许用户传递 `Closure` 来允许工具注入。在 getter 方法中，你应该将配置值传递给 `$this->evaluate()` 方法，如果用户传递了函数，它将把实用工具注入到用户的函数中，或者如果它是静态值则返回该值：

```php
use Closure;
use Filament\Infolists\Components\Entry;

class AudioPlayerEntry extends Entry
{
    protected string $view = 'filament.infolists.components.audio-player-entry';

    protected float | Closure | null $speed = null;

    public function speed(float | Closure | null $speed): static
    {
        $this->speed = $speed;

        return $this;
    }

    public function getSpeed(): ?float
    {
        return $this->evaluate($this->speed);
    }
}
```

现在，你可以向 `speed()` 方法传递静态值或函数，并[注入任何实用工具](overview#entry-utility-injection)作为参数：

```php
use App\Filament\Infolists\Components\AudioPlayerEntry;

AudioPlayerEntry::make('recording')
    ->speed(fn (Conference $record): float => $record->isGlobal() ? 1 : 0.5)
```

## 从 JavaScript 调用条目方法

有时你需要从 Blade 视图中的 JavaScript 调用条目类上的方法。例如，你可能想要异步获取数据或执行一些服务器端计算。Filament 提供了一种使用 `#[ExposedLivewireMethod]` 属性将条目类上的方法公开给 JavaScript 的方式。

### 公开方法

要将方法公开给 JavaScript，请在自定义条目类的公共方法上添加 `#[ExposedLivewireMethod]` 属性：

```php
use Filament\Infolists\Components\Entry;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;

class AudioPlayerEntry extends Entry
{
    protected string $view = 'filament.infolists.components.audio-player-entry';

    #[ExposedLivewireMethod]
    public function getWaveformData(): array
    {
        // 从音频文件生成波形数据...

        return $waveformData;
    }
}
```

:::info
    只有标记了 `#[ExposedLivewireMethod]` 的方法才能从 JavaScript 调用。这是一项安全措施，防止任意方法执行。
:::

### 从 JavaScript 调用方法

在 Blade 视图中，你可以使用 `$wire.callSchemaComponentMethod()` 调用公开的方法。第一个参数是组件的键（通过 `$getKey()` 可用），第二个参数是方法名称。你可以将参数作为第三个参数传递：

```blade
@php
    $key = $getKey();
@endphp

<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    <div
        x-data="{
            waveform: null,
            async loadWaveform() {
                this.waveform = await $wire.callSchemaComponentMethod(
                    @js($key),
                    'getWaveformData',
                )
            },
        }"
        x-init="loadWaveform"
    >
        <template x-if="waveform">
            {{-- 渲染波形可视化 --}}
        </template>
    </div>
</x-dynamic-component>
```

### 防止重新渲染

默认情况下，调用公开的方法会触发 Livewire 组件的重新渲染。如果你的方法不需要更新 UI，可以在 `#[ExposedLivewireMethod]` 旁边添加 Livewire 的 `#[Renderless]` 属性来跳过重新渲染：

```php
use Filament\Infolists\Components\Entry;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;
use Livewire\Attributes\Renderless;

class AudioPlayerEntry extends Entry
{
    protected string $view = 'filament.infolists.components.audio-player-entry';

    #[ExposedLivewireMethod]
    #[Renderless]
    public function getWaveformData(): array
    {
        // ...
    }
}
```
