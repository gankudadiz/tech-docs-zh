---
title: 自定义字段
---

## 简介

Livewire 组件是将其状态存储在用户浏览器中的 PHP 类。当发起网络请求时，状态被发送到服务器，并填充到 Livewire 组件类的公共属性中，在那里可以像访问 PHP 中任何其他类属性一样访问它。

假设你有一个带有名为 `$name` 的公共属性的 Livewire 组件。你可以通过两种方式之一将该属性绑定到 Livewire 组件 HTML 中的输入字段：使用 [`wire:model` 属性](https://livewire.laravel.com/docs/properties#data-binding)，或者通过将其与 Alpine.js 属性[关联](https://livewire.laravel.com/docs/javascript#the-wire-object)：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <input wire:model="name" />

    <!-- 或者 -->

    <div x-data="{ state: $wire.$entangle('name') }">
        <input x-model="state" />
    </div>
</x-dynamic-component>
```

当用户在输入字段中输入时，`$name` 属性在 Livewire 组件类中更新。当用户提交表单时，`$name` 属性被发送到服务器，在那里可以被保存。

这是 Filament 中字段工作方式的基础。每个字段都被分配到 Livewire 组件类中的一个公共属性，这就是字段状态存储的地方。我们将此属性的名称称为字段的"状态路径"。你可以在字段的视图中使用 `$getStatePath()` 函数访问字段的状态路径：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <input wire:model="{{ $getStatePath() }}" />

    <!-- 或者 -->

    <div x-data="{ state: $wire.$entangle('{{ $getStatePath() }}') }">
        <input x-model="state" />
    </div>
</x-dynamic-component>
```

如果你的组件严重依赖第三方库，我们建议你使用 Filament 资产系统异步加载 Alpine.js 组件。这确保 Alpine.js 组件仅在需要时加载，而不是在每次页面加载时。要了解如何做到这一点，请查看我们的[资产文档](../advanced/assets#异步-alpinejs-组件)。

### 自定义字段类

你可以创建自己的自定义字段类和视图，在项目中重复使用，甚至作为插件发布给社区。

要创建自定义字段类和视图，你可以使用以下命令：

```bash
php artisan make:filament-form-field LocationPicker
```

这将创建以下组件类：

```php
use Filament\Forms\Components\Field;

class LocationPicker extends Field
{
    protected string $view = 'filament.forms.components.location-picker';
}
```

它还将在 `resources/views/filament/forms/components/location-picker.blade.php` 创建一个视图文件。

:::info
Filament 表单字段**不是** Livewire 组件。在表单字段类上定义公共属性和方法不会使它们在 Blade 视图中可访问。
:::

## 在 Blade 视图中访问其他组件的状态

在 Blade 视图内部，你可以使用 `$get()` 函数访问 schema 中其他组件的状态：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    {{ $get('email') }}
</x-dynamic-component>
```

:::tip
除非表单字段是[响应式的](../forms/overview#响应式基础)，否则当字段值更改时，Blade 视图不会刷新，只有在下一次用户交互发起服务器请求时才会刷新。如果你需要对字段值的变化做出反应，它应该是 `live()` 的。
:::

## 在 Blade 视图中访问 Eloquent 记录

在 Blade 视图内部，你可以使用 `$record` 变量访问当前的 Eloquent 记录：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    {{ $record->name }}
</x-dynamic-component>
```

## 在 Blade 视图中访问当前操作

在 Blade 视图内部，你可以使用 `$operation` 变量访问当前操作，通常是 `create`、`edit` 或 `view`：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    @if ($operation === 'create')
        This is a new conference.
    @else
        This is an existing conference.
    @endif
</x-dynamic-component>
```

## 在 Blade 视图中访问当前 Livewire 组件实例

在 Blade 视图内部，你可以使用 `$this` 访问当前的 Livewire 组件实例：

```blade
@php
    use Filament\Resources\Users\RelationManagers\ConferencesRelationManager;
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    @if ($this instanceof ConferencesRelationManager)
        You are editing conferences the of a user.
    @endif
</x-dynamic-component>
```

## 在 Blade 视图中访问当前字段实例

在 Blade 视图内部，你可以使用 `$field` 访问当前的字段实例。你可以调用此对象上的公共方法来访问其他可能在变量中不可用的信息：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    @if ($field->getState())
        This is a new conference.
    @endif
</x-dynamic-component>
```

## 为自定义字段类添加配置方法

你可以在自定义字段类上添加一个公共方法，接受配置值，将其存储在受保护的属性中，然后从另一个公共方法返回：

```php
use Filament\Forms\Components\Field;

class LocationPicker extends Field
{
    protected string $view = 'filament.forms.components.location-picker';

    protected ?float $zoom = null;

    public function zoom(?float $zoom): static
    {
        $this->zoom = $zoom;

        return $this;
    }

    public function getZoom(): ?float
    {
        return $this->zoom;
    }
}
```

现在，在自定义字段的 Blade 视图中，你可以使用 `$getZoom()` 函数访问 zoom：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    {{ $getZoom() }}
</x-dynamic-component>
```

你在自定义字段类上定义的任何公共方法都可以作为变量函数在 Blade 视图中以这种方式访问。

要将配置值传递给自定义字段类，你可以使用公共方法：

```php
use App\Filament\Forms\Components\LocationPicker;

LocationPicker::make('location')
    ->zoom(0.5)
```

## 在自定义字段配置方法中允许工具注入

[工具注入](overview#字段工具注入)是 Filament 的一个强大功能，允许用户使用可以访问各种工具的函数来配置组件。你可以通过确保配置的参数类型和属性类型允许用户传递 `Closure` 来允许工具注入。在 getter 方法中，你应该将配置值传递给 `$this->evaluate()` 方法，如果用户传递了函数，它会将工具注入到用户的函数中，如果是静态值则返回该值：

```php
use Closure;
use Filament\Forms\Components\Field;

class LocationPicker extends Field
{
    protected string $view = 'filament.forms.components.location-picker';

    protected float | Closure | null $zoom = null;

    public function zoom(float | Closure | null $zoom): static
    {
        $this->zoom = $zoom;

        return $this;
    }

    public function getZoom(): ?float
    {
        return $this->evaluate($this->zoom);
    }
}
```

现在，你可以向 `zoom()` 方法传递静态值或函数，并[注入任何工具](overview#字段工具注入)作为参数：

```php
use App\Filament\Forms\Components\LocationPicker;

LocationPicker::make('location')
    ->zoom(fn (Conference $record): float => $record->isGlobal() ? 1 : 0.5)
```

## 遵守状态绑定修饰符

当你将字段绑定到状态路径时，你可以使用 `defer` 修饰符来确保状态仅在用户提交表单时或下一次 Livewire 请求时发送到服务器。这是默认行为。

然而，你可以在字段上使用 [`live()`](overview#响应式基础) 来确保当用户与字段交互时，状态立即发送到服务器。这允许许多高级用例，如文档中[响应式](overview#响应式基础)部分所述。

Filament 提供了一个 `$applyStateBindingModifiers()` 函数，你可以在视图中使用它来将任何状态绑定修饰符应用于 `wire:model` 或 `$wire.$entangle()` 绑定：

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <input {{ $applyStateBindingModifiers('wire:model') }}="{{ $getStatePath() }}" />

    <!-- 或者 -->

    <div x-data="{ state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$getStatePath()}')") }} }">
        <input x-model="state" />
    </div>
</x-dynamic-component>
```

## 从 JavaScript 调用字段方法

有时你需要在 Blade 视图中从 JavaScript 调用字段类上的方法。例如，你可能想要异步获取数据、处理文件上传或执行一些服务器端计算。Filament 提供了一种使用 `#[ExposedLivewireMethod]` 属性将字段类上的方法暴露给 JavaScript 的方式。

### 暴露方法

要将方法暴露给 JavaScript，请在自定义字段类的公共方法上添加 `#[ExposedLivewireMethod]` 属性：

```php
use Filament\Forms\Components\Field;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;

class LocationPicker extends Field
{
    protected string $view = 'filament.forms.components.location-picker';

    #[ExposedLivewireMethod]
    public function geocodeAddress(string $address): array
    {
        // 执行地理编码逻辑...

        return [
            'latitude' => $latitude,
            'longitude' => $longitude,
        ];
    }
}
```

:::info
只有标记了 `#[ExposedLivewireMethod]` 的方法才能从 JavaScript 调用。这是一项安全措施，防止任意方法执行。
:::

### 从 JavaScript 调用方法

在你的 Blade 视图中，你可以使用 `$wire.callSchemaComponentMethod()` 调用暴露的方法。第一个参数是组件的键（通过 `$getKey()` 获取），第二个参数是方法名。你可以将参数作为第三个参数传递：

```blade
@php
    $key = $getKey();
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div
        x-data="{
            address: '',
            coordinates: null,
            async geocode() {
                this.coordinates = await $wire.callSchemaComponentMethod(
                    @js($key),
                    'geocodeAddress',
                    { address: this.address },
                )
            },
        }"
    >
        <input type="text" x-model="address" />
        <button type="button" x-on:click="geocode">Geocode</button>

        <template x-if="coordinates">
            <p x-text="`${coordinates.latitude}, ${coordinates.longitude}`"></p>
        </template>
    </div>
</x-dynamic-component>
```

### 防止重新渲染

默认情况下，调用暴露的方法会触发 Livewire 组件的重新渲染。如果你的方法不需要更新 UI，你可以在 `#[ExposedLivewireMethod]` 旁边添加 Livewire 的 `#[Renderless]` 属性来跳过重新渲染：

```php
use Filament\Forms\Components\Field;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;
use Livewire\Attributes\Renderless;

class LocationPicker extends Field
{
    protected string $view = 'filament.forms.components.location-picker';

    #[ExposedLivewireMethod]
    #[Renderless]
    public function geocodeAddress(string $address): array
    {
        // ...
    }
}
```
