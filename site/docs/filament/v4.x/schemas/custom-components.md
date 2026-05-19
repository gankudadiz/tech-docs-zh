---
title: 自定义组件
---

## 向 schema 插入 Blade 视图

你可以使用"视图"组件将 Blade 视图任意插入 schema：

```php
use Filament\Schemas\Components\View;

View::make('filament.schemas.components.chart')
```

这假设你有一个 `resources/views/filament/schemas/components/chart.blade.php` 文件。

你可以通过 `viewData()` 方法向此视图传递数据：

```php
use Filament\Schemas\Components\View;

View::make('filament.schemas.components.chart')
    ->viewData(['data' => $data])
```

### 渲染组件的子 schema

你可以将子 schema 组件数组传递给组件的 `schema()` 方法：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\View;

View::make('filament.schemas.components.chart')
    ->schema([
        TextInput::make('subtotal'),
        TextInput::make('total'),
    ])
```

在 Blade 视图内部，你可以使用 `$getChildSchema()` 函数渲染组件的 `schema()`：

```blade
<div>
    {{ $getChildSchema() }}
</div>
```

### 在 Blade 视图中访问另一个组件的状态

在 Blade 视图内部，你可以使用 `$get()` 函数访问 schema 中另一个组件的状态：

```blade
<div>
    {{ $get('email') }}
</div>
```

:::tip
除非表单字段是[响应式的](../forms/overview#响应式基础)，否则当字段值更改时，Blade 视图不会刷新，只有在下一次用户交互导致向服务器发送请求时才会刷新。如果你需要对字段值的更改做出反应，它应该是 `live()` 的。
:::

### 在 Blade 视图中访问 Eloquent 记录

在 Blade 视图内部，你可以使用 `$record` 变量访问当前 Eloquent 记录：

```blade
<div>
    {{ $record->name }}
</div>
```

### 在 Blade 视图中访问当前操作

在 Blade 视图内部，你可以使用 `$operation` 变量访问当前操作，通常是 `create`、`edit` 或 `view`：

```blade
<p>
    @if ($operation === 'create')
        这是一篇新文章。
    @else
        这是一篇现有文章。
    @endif
</p>
```

### 在 Blade 视图中访问当前 Livewire 组件实例

在 Blade 视图内部，你可以使用 `$this` 访问当前 Livewire 组件实例：

```blade
@php
    use Filament\Resources\Users\RelationManagers\PostsRelationManager;
@endphp

<p>
    @if ($this instanceof PostsRelationManager)
        你正在编辑用户的文章。
    @endif
</p>
```

### 在 Blade 视图中访问当前组件实例

在 Blade 视图内部，你可以使用 `$schemaComponent` 访问当前组件实例。你可以调用此对象上的公共方法来访问变量中可能不可用的其他信息：

```blade
<p>
    @if ($schemaComponent->getState())
        这是一篇新文章。
    @endif
</p>
```

## 向 schema 插入 Livewire 组件

你可以将 Livewire 组件直接插入 schema：

```php
use App\Livewire\Chart;
use Filament\Schemas\Components\Livewire;

Livewire::make(Chart::class)
```

:::info
将 Livewire 组件插入 schema 时，功能有限。只有可序列化的数据可以从嵌套的 Livewire 组件访问，因为它们是单独渲染的。因此，你无法[渲染子 schema](#渲染组件的子-schema)、[访问另一个组件的实时状态](#在-blade-视图中访问另一个组件的状态)、[访问当前 Livewire 组件实例](#在-blade-视图中访问当前-livewire-组件实例)或[访问当前组件实例](#在-blade-视图中访问当前组件实例)。只有[你传递给 Livewire 组件的静态数据](#向-livewire-组件传递参数)和[当前记录](#在-livewire-组件中访问当前记录)是可访问的。由于这些限制，你应该渲染嵌套 Livewire 组件而不是 [Blade 视图](#向-schema-插入-blade-视图)的情况很少。
:::

如果你正在渲染多个相同的 Livewire 组件，请确保为每个组件传递一个唯一的 `key()`：

```php
use App\Livewire\Chart;
use Filament\Schemas\Components\Livewire;

Livewire::make(Chart::class)
    ->key('chart-first')

Livewire::make(Chart::class)
    ->key('chart-second')

Livewire::make(Chart::class)
    ->key('chart-third')
```

### 向 Livewire 组件传递参数

你可以向 Livewire 组件传递一个参数数组：

```php
use App\Livewire\Chart;
use Filament\Schemas\Components\Livewire;

Livewire::make(Chart::class, ['bar' => 'baz'])
```

:::tip
除了允许静态值外，`make()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

现在，这些参数将传递给 Livewire 组件的 `mount()` 方法：

```php
class Chart extends Component
{
    public function mount(string $bar): void
    {       
        // ...
    }
}
```

或者，它们将作为 Livewire 组件上的公共属性可用：

```php
class Chart extends Component
{
    public string $bar;
}
```

#### 在 Livewire 组件中访问当前记录

你可以使用 `mount()` 方法中的 `$record` 参数或 `$record` 属性在 Livewire 组件中访问当前记录：

```php
use Illuminate\Database\Eloquent\Model;

class Chart extends Component
{
    public function mount(?Model $record = null): void
    {       
        // ...
    }
    
    // 或者
    
    public ?Model $record = null;
}
```

请注意，当记录尚未创建时，它将是 `null`。如果你想在记录为 `null` 时隐藏 Livewire 组件，可以使用 `hidden()` 方法：

```php
use Filament\Schemas\Components\Livewire;
use Illuminate\Database\Eloquent\Model;

Livewire::make(Chart::class)
    ->hidden(fn (?Model $record): bool => $record === null)
```

### 延迟加载 Livewire 组件

你可以使用 `lazy()` 方法允许组件[延迟加载](https://livewire.laravel.com/docs/lazy#rendering-placeholder-html)：

```php
use Filament\Schemas\Components\Livewire;
use App\Livewire\Chart;

Livewire::make(Chart::class)
    ->lazy()       
```

## 自定义组件类

你可以创建自己的自定义组件类和视图，你可以在项目中重复使用，甚至可以作为插件发布给社区。

:::tip
如果你只是创建一个简单的自定义组件使用一次，你可以改用[视图组件](#向-schema-插入-blade-视图)来渲染任何自定义 Blade 文件。
:::

要创建自定义组件类和视图，你可以使用以下命令：

```bash
php artisan make:filament-schema-component Chart
```

这将创建以下组件类：

```php
use Filament\Schemas\Components\Component;

class Chart extends Component
{
    protected string $view = 'filament.schemas.components.chart';

    public static function make(): static
    {
        return app(static::class);
    }
}
```

它还将在 `resources/views/filament/schemas/components/chart.blade.php` 创建一个视图文件。

你可以使用与[向 schema 插入 Blade 视图](#向-schema-插入-blade-视图)时相同的实用工具来[渲染组件的子 schema](#渲染组件的子-schema)、[访问另一个组件的实时状态](#在-blade-视图中访问另一个组件的状态)、[访问当前 Eloquent 记录](#在-blade-视图中访问-eloquent-记录)、[访问当前操作](#在-blade-视图中访问当前操作)、[访问当前 Livewire 组件实例](#在-blade-视图中访问当前-livewire-组件实例)和[访问当前组件实例](#在-blade-视图中访问当前组件实例)。

:::info
Filament schema 组件**不是** Livewire 组件。在 schema 组件类上定义公共属性和方法不会使它们在 Blade 视图中可访问。
:::

### 向自定义组件类添加配置方法

你可以向自定义组件类添加一个公共方法，该方法接受配置值，将其存储在受保护的属性中，然后从另一个公共方法返回它：

```php
use Filament\Schemas\Components\Component;

class Chart extends Component
{
    protected string $view = 'filament.schemas.components.chart';
    
    protected ?string $heading = null;

    public static function make(): static
    {
        return app(static::class);
    }

    public function heading(?string $heading): static
    {
        $this->heading = $heading;

        return $this;
    }

    public function getHeading(): ?string
    {
        return $this->heading;
    }
}
```

现在，在自定义组件的 Blade 视图中，你可以使用 `$getHeading()` 函数访问标题：

```blade
<div>
    {{ $getHeading() }}
</div>
```

你在自定义组件类上定义的任何公共方法都可以作为变量函数以这种方式在 Blade 视图中访问。

要将配置值传递给自定义组件类，你可以使用公共方法：

```php
use App\Filament\Schemas\Components\Chart;

Chart::make()
    ->heading('销售')
```

#### 在自定义组件配置方法中允许实用工具注入

[实用工具注入](overview#组件实用工具注入)是 Filament 的一个强大功能，允许用户使用可以访问各种实用工具的函数来配置组件。你可以通过确保配置的参数类型和属性类型允许用户传递 `Closure` 来允许实用工具注入。在 getter 方法中，你应该将配置值传递给 `$this->evaluate()` 方法，如果用户传递了函数，它将注入实用工具，如果是静态值则返回该值：

```php
use Closure;
use Filament\Schemas\Components\Component;

class Chart extends Component
{
    protected string $view = 'filament.schemas.components.chart';
    
    protected string | Closure | null $heading = null;

    public static function make(): static
    {
        return app(static::class);
    }

    public function heading(string | Closure | null $heading): static
    {
        $this->heading = $heading;

        return $this;
    }

    public function getHeading(): ?string
    {
        return $this->evaluate($this->heading);
    }
}
```

现在，你可以向 `heading()` 方法传递静态值或函数，并[注入任何实用工具](overview#组件实用工具注入)作为参数：

```php
use App\Filament\Schemas\Components\Chart;

Chart::make()
    ->heading(fn (Product $record): string => "{$record->name} 销售")
```

### 在自定义组件类的构造函数中接受配置值

你可以在自定义组件的 `make()` 构造函数方法中接受配置值，并将其传递给相应的 setter 方法：

```php
use Closure;
use Filament\Schemas\Components\Component;

class Chart extends Component
{
    protected string $view = 'filament.schemas.components.chart';

    protected string | Closure | null $heading = null;

    public function __construct(string | Closure | null $heading = null)
    {
        $this->heading($heading)
    }

    public static function make(string | Closure | null $heading = null): static
    {
        return app(static::class, ['heading' => $heading]);
    }

    public function heading(string | Closure | null $heading): static
    {
        $this->heading = $heading;

        return $this;
    }

    public function getHeading(): ?string
    {
        return $this->evaluate($this->heading);
    }
}
```

### 从 JavaScript 调用组件方法

有时你需要从 Blade 视图中的 JavaScript 调用组件类上的方法。例如，你可能想要异步获取数据或执行一些服务器端计算。Filament 提供了一种使用 `#[ExposedLivewireMethod]` 属性将组件类上的方法公开给 JavaScript 的方法。

#### 公开方法

要将方法公开给 JavaScript，请在自定义组件类的公共方法上添加 `#[ExposedLivewireMethod]` 属性：

```php
use Filament\Schemas\Components\Component;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;

class Chart extends Component
{
    protected string $view = 'filament.schemas.components.chart';

    public static function make(): static
    {
        return app(static::class);
    }

    #[ExposedLivewireMethod]
    public function getChartData(): array
    {
        // 获取和处理图表数据...

        return $chartData;
    }
}
```

:::info
只有标记了 `#[ExposedLivewireMethod]` 的方法才能从 JavaScript 调用。这是为了防止任意方法执行的安全措施。
:::

#### 从 JavaScript 调用方法

在你的 Blade 视图中，你可以使用 `$wire.callSchemaComponentMethod()` 调用公开的方法。第一个参数是组件的键（通过 `$getKey()` 可用），第二个参数是方法名。你可以将参数作为第三个参数传递：

```blade
@php
    $key = $getKey();
@endphp

<div
    x-data="{
        data: null,
        async loadData() {
            this.data = await $wire.callSchemaComponentMethod(
                @js($key),
                'getChartData',
            )
        },
    }"
    x-init="loadData"
>
    <template x-if="data">
        {{-- 使用数据渲染图表 --}}
    </template>
</div>
```

你可以通过提供对象作为第三个参数向方法传递参数：

```blade
@php
    $key = $getKey();
@endphp

<div
    x-data="{
        data: null,
        dateRange: 'week',
        async loadData() {
            this.data = await $wire.callSchemaComponentMethod(
                @js($key),
                'getChartData',
                { dateRange: this.dateRange },
            )
        },
    }"
    x-init="loadData"
>
    <select x-model="dateRange" x-on:change="loadData">
        <option value="week">本周</option>
        <option value="month">本月</option>
        <option value="year">本年</option>
    </select>

    <template x-if="data">
        {{-- 使用数据渲染图表 --}}
    </template>
</div>
```

#### 防止重新渲染

默认情况下，调用公开的方法将触发 Livewire 组件的重新渲染。如果你的方法不需要更新 UI，你可以在 `#[ExposedLivewireMethod]` 旁边添加 Livewire 的 `#[Renderless]` 属性以跳过重新渲染：

```php
use Filament\Schemas\Components\Component;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;
use Livewire\Attributes\Renderless;

class Chart extends Component
{
    protected string $view = 'filament.schemas.components.chart';

    public static function make(): static
    {
        return app(static::class);
    }

    #[ExposedLivewireMethod]
    #[Renderless]
    public function getChartData(): array
    {
        // ...
    }
}
```
