---
title: 自定义列
---

## 简介

你可以创建自己的自定义列类和视图，在项目中重复使用，甚至作为插件发布给社区。

要创建自定义列类和视图，可以使用以下命令：

```bash
php artisan make:filament-table-column AudioPlayerColumn
```

这将创建以下组件类：

```php
use Filament\Tables\Columns\Column;

class AudioPlayerColumn extends Column
{
    protected string $view = 'filament.tables.columns.audio-player-column';
}
```

它还将在 `resources/views/filament/tables/columns/audio-player-column.blade.php` 创建一个视图文件。

:::info
Filament 表格列**不是** Livewire 组件。在表格列类上定义公共属性和方法不会使它们在 Blade 视图中可访问。
:::

## 在 Blade 视图中访问列的状态

在 Blade 视图中，你可以使用 `$getState()` 函数访问列的[状态](overview#column-content-state)：

```blade
<div>
    {{ $getState() }}
</div>
```

## 在 Blade 视图中访问 Eloquent 记录

在 Blade 视图中，你可以使用 `$record` 变量访问当前表格行的 Eloquent 记录：

```blade
<div>
    {{ $record->name }}
</div>
```

## 在 Blade 视图中访问当前 Livewire 组件实例

在 Blade 视图中，你可以使用 `$this` 访问当前 Livewire 组件实例：

```blade
@php
    use Filament\Resources\Users\RelationManagers\ConferencesRelationManager;
@endphp

<div>
    @if ($this instanceof ConferencesRelationManager)
        You are editing the conferences of a user.
    @endif
</div>
```

## 在 Blade 视图中访问当前列实例

在 Blade 视图中，你可以使用 `$column` 访问当前列实例。你可以调用此对象上的公共方法来访问其他可能在变量中不可用的信息：

```blade
<div>
    @if ($column->isLabelHidden())
        This is a new conference.
    @endif
</div>
```

## 为自定义列类添加配置方法

你可以向自定义列类添加一个公共方法，接受配置值，将其存储在受保护的属性中，并从另一个公共方法返回：

```php
use Filament\Tables\Columns\Column;

class AudioPlayerColumn extends Column
{
    protected string $view = 'filament.tables.columns.audio-player-column';

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

现在，在自定义列的 Blade 视图中，你可以使用 `$getSpeed()` 函数访问速度：

```blade
<div>
    {{ $getSpeed() }}
</div>
```

你在自定义列类上定义的任何公共方法都可以作为变量函数在 Blade 视图中以这种方式访问。

要将配置值传递给自定义列类，可以使用公共方法：

```php
use App\Filament\Tables\Columns\AudioPlayerColumn;

AudioPlayerColumn::make('recording')
    ->speed(0.5)
```

## 在自定义列配置方法中允许实用工具注入

[实用工具注入](overview#column-utility-injection)是 Filament 的强大功能，允许用户使用可以访问各种实用工具的函数来配置组件。你可以通过确保配置的参数类型和属性类型允许用户传递 `Closure` 来允许实用工具注入。在 getter 方法中，你应该将配置值传递给 `$this->evaluate()` 方法，如果用户传递了函数，它会将实用工具注入到用户的函数中，如果是静态值则返回该值：

```php
use Closure;
use Filament\Tables\Columns\Column;

class AudioPlayerColumn extends Column
{
    protected string $view = 'filament.tables.columns.audio-player-column';

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

现在，你可以向 `speed()` 方法传递静态值或函数，并[注入任何实用工具](overview#component-utility-injection)作为参数：

```php
use App\Filament\Tables\Columns\AudioPlayerColumn;

AudioPlayerColumn::make('recording')
    ->speed(fn (Conference $record): float => $record->isGlobal() ? 1 : 0.5)
```
