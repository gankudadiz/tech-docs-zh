---
title: Synthesizers
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/synthesizers.md
source_version: v3.8.0
translation_status: draft
---

由于 Livewire 组件在请求之间会被脱水（序列化）为 JSON，然后水合（反序列化）回 PHP 组件，它们的属性需要是 JSON 可序列化的。

原生 PHP 可以轻松地将大多数原始值序列化为 JSON。然而，为了让 Livewire 组件支持更复杂的属性类型（如模型、集合、Carbon 实例和 Stringable），需要一个更强大的系统。

因此，Livewire 提供了一个称为 "Synthesizers" 的扩展点，允许用户支持他们想要的任何自定义属性类型。

:::tip[确保先理解水合概念]
在使用 Synthesizer 之前，完全理解 Livewire 的水合系统会很有帮助。你可以通过阅读[水合文档](/docs/livewire/v3.x/hydration)了解更多。
:::

## 理解 Synthesizer

在探索创建自定义 Synthesizer 之前，让我们先看看 Livewire 用于支持 [Laravel Stringable](https://laravel.com/docs/strings) 的内部 Synthesizer。

假设你的应用包含以下 `CreatePost` 组件：

```php
class CreatePost extends Component
{
    public $title = '';
}
```

在请求之间，Livewire 可能会将此组件的状态序列化为如下 JSON 对象：

```js
state: { title: '' },
```

现在，考虑一个更高级的示例，其中 `$title` 属性值是一个 Stringable 而不是普通字符串：

```php
class CreatePost extends Component
{
    public $title = '';

    public function mount()
    {
        $this->title = str($this->title);
    }
}
```

表示此组件状态的脱水 JSON 现在包含一个[元数据元组](/docs/livewire/v3.x/hydration#deeply-nested-tuples)，而不是普通的空字符串：

```js
state: { title: ['', { s: 'str' }] },
```

Livewire 现在可以使用这个元组在下一个请求中将 `$title` 属性水合回 Stringable。

现在你已经从外部看到了 Synthesizer 的效果，以下是 Livewire 内部 Stringable Synth 的实际源代码：

```php
use Illuminate\Support\Stringable;

class StringableSynth extends Synth
{
    public static $key = 'str';

    public static function match($target)
    {
        return $target instanceof Stringable;
    }

    public function dehydrate($target)
    {
        return [$target->__toString(), []];
    }

    public function hydrate($value)
    {
        return str($value);
    }
}
```

让我们逐一解释。

首先是 `$key` 属性：

```php
public static $key = 'str';
```

每个 Synth 必须包含一个静态的 `$key` 属性，Livewire 用来将[元数据元组](/docs/livewire/v3.x/hydration#deeply-nested-tuples)（如 `['', { s: 'str' }]`）转换回 Stringable。你可能已经注意到，每个元数据元组都有一个 `s` 键引用这个 key。

反过来，当 Livewire 正在脱水一个属性时，它将使用 Synth 的静态 `match()` 函数来识别此特定的 Synthesizer 是否是脱水当前属性的合适候选（`$target` 是属性的当前值）：

```php
public static function match($target)
{
    return $target instanceof Stringable;
}
```

如果 `match()` 返回 true，`dehydrate()` 方法将被调用，接收属性的 PHP 值作为输入，并返回 JSON 可序列化的[元数据](/docs/livewire/v3.x/hydration#deeply-nested-tuples)元组：

```php
public function dehydrate($target)
{
    return [$target->__toString(), []];
}
```

现在，在下一次请求的开始，当此 Synthesizer 被元组中的 `{ s: 'str' }` 键匹配后，`hydrate()` 方法将被调用，接收属性的原始 JSON 表示形式，并期望返回分配给属性的完整 PHP 兼容值。

```php
public function hydrate($value)
{
    return str($value);
}
```

## 注册自定义 Synthesizer

为了演示你如何编写自己的 Synthesizer 来支持自定义属性，我们将以下面的 `UpdateProperty` 组件为例：

```php
class UpdateProperty extends Component
{
    public Address $address;

    public function mount()
    {
        $this->address = new Address();
    }
}
```

以下是 `Address` 类的源代码：

```php
namespace App\Dtos\Address;

class Address
{
    public $street = '';
    public $city = '';
    public $state = '';
    public $zip = '';
}
```

要支持 `Address` 类型的属性，我们可以使用以下 Synthesizer：

```php
use App\Dtos\Address;

class AddressSynth extends Synth
{
    public static $key = 'address';

    public static function match($target)
    {
        return $target instanceof Address;
    }

    public function dehydrate($target)
    {
        return [[
            'street' => $target->street,
            'city' => $target->city,
            'state' => $target->state,
            'zip' => $target->zip,
        ], []];
    }

    public function hydrate($value)
    {
        $instance = new Address;

        $instance->street = $value['street'];
        $instance->city = $value['city'];
        $instance->state = $value['state'];
        $instance->zip = $value['zip'];

        return $instance;
    }
}
```

要使其在应用中全局可用，你可以使用 Livewire 的 `propertySynthesizer` 方法从服务提供者的 boot 方法中注册 Synthesizer：

```php
class AppServiceProvider extends ServiceProvider
{
    /**
     * 引导任何应用服务。
     */
    public function boot(): void
    {
        Livewire::propertySynthesizer(AddressSynth::class);
    }
}
```

## 支持数据绑定

使用上述 `UpdateProperty` 示例，你可能希望支持 `wire:model` 直接绑定到 `Address` 对象的属性。Synthesizer 允许你使用 `get()` 和 `set()` 方法支持此功能：

```php
use App\Dtos\Address;

class AddressSynth extends Synth
{
    public static $key = 'address';

    public static function match($target)
    {
        return $target instanceof Address;
    }

    public function dehydrate($target)
    {
        return [[
            'street' => $target->street,
            'city' => $target->city,
            'state' => $target->state,
            'zip' => $target->zip,
        ], []];
    }

    public function hydrate($value)
    {
        $instance = new Address;

        $instance->street = $value['street'];
        $instance->city = $value['city'];
        $instance->state = $value['state'];
        $instance->zip = $value['zip'];

        return $instance;
    }

    public function get(&$target, $key) // [tl! highlight:8]
    {
        return $target->{$key};
    }

    public function set(&$target, $key, $value)
    {
        $target->{$key} = $value;
    }
}
```
