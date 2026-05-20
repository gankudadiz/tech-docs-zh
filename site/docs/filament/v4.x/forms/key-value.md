---
title: 键值对
---

## 简介

键值对字段允许你与一维 JSON 对象进行交互：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
```

![键值对](/assets/filament/v4.x/screenshots/images/light/forms/fields/key-value/simple.jpg)

如果你使用 Eloquent 保存数据，请确保为模型属性添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

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

## 添加行

字段下方会显示一个操作按钮，允许用户添加新行。

## 设置添加操作按钮的标签

你可以使用 `addActionLabel()` 方法来自定义添加行按钮中显示的文本：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->addActionLabel('Add property')
```

:::tip
`addActionLabel()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 阻止用户添加行

你可以使用 `addable(false)` 方法阻止用户添加行：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->addable(false)
```

:::tip
`addable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 删除行

每个项上会显示一个操作按钮，允许用户删除该项。

### 阻止用户删除行

你可以使用 `deletable(false)` 方法阻止用户删除行：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->deletable(false)
```

:::tip
`deletable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 编辑键

### 自定义键字段的标签

你可以使用 `keyLabel()` 方法自定义键字段的标签：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->keyLabel('Property name')
```

:::tip
`keyLabel()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 添加键字段占位符

你也可以使用 `keyPlaceholder()` 方法为键字段添加占位符：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->keyPlaceholder('Property name')
```

:::tip
`keyPlaceholder()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带有自定义标签和占位符的键值对](/assets/filament/v4.x/screenshots/images/light/forms/fields/key-value/custom-labels.jpg)

### 阻止用户编辑键

你可以使用 `editableKeys(false)` 方法阻止用户编辑键：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->editableKeys(false)
```

:::tip
`editableKeys()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 编辑值

### 自定义值字段的标签

你可以使用 `valueLabel()` 方法自定义值字段的标签：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->valueLabel('Property value')
```

:::tip
`valueLabel()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 添加值字段占位符

你也可以使用 `valuePlaceholder()` 方法为值字段添加占位符：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->valuePlaceholder('Property value')
```

:::tip
`valuePlaceholder()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 阻止用户编辑值

你可以使用 `editableValues(false)` 方法阻止用户编辑值：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->editableValues(false)
```

:::tip
`editableValues()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 重新排序行

你可以使用 `reorderable()` 方法允许用户在表格内重新排序行：

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->reorderable()
```

:::tip
`reorderable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![可重新排序行的键值对](/assets/filament/v4.x/screenshots/images/light/forms/fields/key-value/reorderable.jpg)

## 自定义键值对操作对象

此字段使用操作对象来自定义其中的按钮。你可以通过向操作注册方法传递函数来自定义这些按钮。该函数可以访问 `$action` 对象，你可以使用它来[自定义操作](../actions/overview)。以下方法可用于自定义操作：

- `addAction()`
- `deleteAction()`
- `reorderAction()`

以下是自定义操作的示例：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\KeyValue;
use Filament\Support\Icons\Heroicon;

KeyValue::make('meta')
    ->deleteAction(
        fn (Action $action) => $action->icon(Heroicon::XMark),
    )
```

:::tip
操作注册方法可以将各种工具注入到函数参数中。
:::
