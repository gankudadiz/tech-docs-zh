---
title: 键值对条目
---

## 简介

键值对条目允许你从一维 JSON 对象 / PHP 数组中渲染键值对数据。

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
```

例如，此条目的状态可能表示为：

```php
[
    'description' => 'Filament is a collection of Laravel packages',
    'og:type' => 'website',
    'og:site_name' => 'Filament',
]
```

![键值对条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/key-value/simple.jpg)

如果你在 Eloquent 中保存数据，应该确保在模型属性上添加 `array` [转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

```php
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'meta' => 'array',
        ];
    }

    // ...
}
```

## 自定义键列的标签

你可以使用 `keyLabel()` 方法自定义键列的标签：

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
    ->keyLabel('Property name')
```

除了允许静态值外，`keyLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 自定义值列的标签

你可以使用 `valueLabel()` 方法自定义值列的标签：

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
    ->valueLabel('Property value')
```

除了允许静态值外，`valueLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![带有自定义列标签的键值对条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/key-value/custom-labels.jpg)
