---
title: 日期时间选择器
---

## 简介

日期时间选择器提供了一个用于选择日期和/或时间的交互式界面。

```php
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TimePicker;

DateTimePicker::make('published_at')
DatePicker::make('date_of_birth')
TimePicker::make('alarm_at')
```

![日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/simple.jpg)

## 自定义存储格式

你可以使用 `format()` 方法自定义字段在数据库中的存储格式。该方法接受一个使用 [PHP 日期格式化符号](https://www.php.net/manual/en/datetime.format.php) 的字符串日期格式：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->format('d/m/Y')
```

:::tip
`format()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

## 禁用秒数输入

使用时间选择器时，你可以使用 `seconds(false)` 方法禁用秒数输入：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->seconds(false)
```

:::tip
`seconds()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![不显示秒数的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/without-seconds.jpg)

## 时区

如果你希望用户能够在自己的时区中管理日期，可以使用 `timezone()` 方法：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->timezone('America/New_York')
```

虽然日期仍会使用应用程序配置的时区存储，但日期将在新时区中加载，并在表单保存时转换回来。

:::tip
`timezone()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

如果你没有为组件传递 `timezone()`，它将使用 Filament 的默认时区。你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中使用 `FilamentTimezone::set()` 方法设置 Filament 的默认时区：

```php
use Filament\Support\Facades\FilamentTimezone;

public function boot(): void
{
    FilamentTimezone::set('America/New_York');
}
```

如果你想为应用程序中所有日期时间选择器设置默认时区，这非常有用。它也用于 Filament 中使用时区的其他地方。

:::warning
Filament 的默认时区仅在字段存储时间时生效。如果字段仅存储日期（使用 `DatePicker` 而非 `DateTimePicker` 或 `TimePicker`），则不会应用时区。这是为了防止在存储不含时间的日期时时区偏移。
:::

## 启用 JavaScript 日期选择器

默认情况下，Filament 使用原生 HTML5 日期选择器。你可以使用 `native(false)` 方法启用更可自定义的 JavaScript 日期选择器：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
```

:::tip
`native()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![基于 JavaScript 的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/javascript.jpg)

:::info
JavaScript 日期选择器不支持与原生日期选择器相同的完整键盘输入。如果你需要完整的键盘输入，应使用原生日期选择器。
:::

### 自定义显示格式

你可以自定义字段的显示格式，与数据库中的存储格式分开设置。为此，使用 `displayFormat()` 方法，该方法同样接受使用 [PHP 日期格式化符号](https://www.php.net/manual/en/datetime.format.php) 的字符串日期格式：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
    ->displayFormat('d/m/Y')
```

:::tip
`displayFormat()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![自定义显示格式的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/display-format.jpg)

你还可以配置渲染显示时使用的语言环境，如果你想使用与应用配置不同的语言环境。为此，可以使用 `locale()` 方法：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
    ->displayFormat('d F Y')
    ->locale('fr')
```

:::tip
`locale()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

### 配置时间输入间隔

你可以使用 `hoursStep()`、`minutesStep()` 或 `secondsStep()` 方法自定义增加/减少小时/分钟/秒的输入间隔：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->native(false)
    ->hoursStep(2)
    ->minutesStep(15)
    ->secondsStep(10)
```

:::tip
`hoursStep()`、`minutesStep()` 和 `secondsStep()` 方法除了接受静态值外，还接受函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

### 配置一周的第一天

在某些国家，一周的第一天不是星期一。要自定义日期选择器中一周的第一天，请在组件上使用 `firstDayOfWeek()` 方法。接受 0 到 7 的值，其中星期一为 1，星期日为 7 或 0：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->native(false)
    ->firstDayOfWeek(7)
```

:::tip
`firstDayOfWeek()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![一周从星期日开始的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/week-starts-on-sunday.jpg)

还有一些便捷的辅助方法可以更具语义化地设置一周的第一天：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->native(false)
    ->weekStartsOnMonday()

DateTimePicker::make('published_at')
    ->native(false)
    ->weekStartsOnSunday()
```

### 禁用特定日期

要阻止选择特定日期：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('date')
    ->native(false)
    ->disabledDates(['2000-01-03', '2000-01-15', '2000-01-20'])
```

:::tip
`disabledDates()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![禁用特定日期的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/disabled-dates.jpg)

### 选择日期后关闭选择器

要在选择日期后关闭选择器，可以使用 `closeOnDateSelection()` 方法：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('date')
    ->native(false)
    ->closeOnDateSelection()
```

你也可以传入一个布尔值来控制选择日期后是否关闭输入框：

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('date')
    ->native(false)
    ->closeOnDateSelection(FeatureFlag::active())
```

:::tip
`closeOnDateSelection()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

## 使用数据列表自动补全日期

除非你使用的是 [JavaScript 日期选择器](#启用-javascript-日期选择器)，否则你可以使用 `datalist()` 方法为日期选择器指定 [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) 选项：

```php
use Filament\Forms\Components\TimePicker;

TimePicker::make('appointment_at')
    ->datalist([
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
    ])
```

数据列表在用户使用选择器时提供自动补全选项。但是，这些只是建议，用户仍然可以在输入框中输入任何值。如果你想严格限制用户只能选择预定义的选项，请查看[选择字段](select)。

:::tip
`datalist()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

### 聚焦默认日历日期

默认情况下，如果字段没有状态，打开日历面板将打开当前日期的日历。对于希望在特定日期打开日历的情况，这可能不太方便。你可以使用 `defaultFocusedDate()` 设置日历的默认聚焦日期：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('custom_starts_at')
    ->native(false)
    ->placeholder(now()->startOfMonth())
    ->defaultFocusedDate(now()->startOfMonth())
```

:::tip
`defaultFocusedDate()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![带默认聚焦日期的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/default-focused-date.jpg)

## 在字段旁添加前后缀文本

你可以使用 `prefix()` 和 `suffix()` 方法在输入框前后放置文本：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date')
    ->prefix('Starts')
    ->suffix('at midnight')
```

:::tip
`prefix()` 和 `suffix()` 方法除了接受静态值外，还接受函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![带前后缀的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/affix.jpg)

### 使用图标作为前后缀

你可以使用 `prefixIcon()` 和 `suffixIcon()` 方法在输入框前后放置[图标](../styling/icons)：

```php
use Filament\Forms\Components\TimePicker;
use Filament\Support\Icons\Heroicon;

TimePicker::make('at')
    ->prefixIcon(Heroicon::Play)
```

:::tip
`prefixIcon()` 和 `suffixIcon()` 方法除了接受静态值外，还接受函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![带前缀图标的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/prefix-icon.jpg)

#### 设置前后缀图标颜色

前后缀图标默认为灰色，但你可以使用 `prefixIconColor()` 和 `suffixIconColor()` 方法设置不同的颜色：

```php
use Filament\Forms\Components\TimePicker;
use Filament\Support\Icons\Heroicon;

TimePicker::make('at')
    ->prefixIcon(Heroicon::CheckCircle)
    ->prefixIconColor('success')
```

:::tip
`prefixIconColor()` 和 `suffixIconColor()` 方法除了接受静态值外，还接受函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

![带颜色前缀图标的日期时间选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/date-time-picker/prefix-icon-color.jpg)

## 将字段设为只读

不要与[禁用字段](overview#禁用字段)混淆，你可以使用 `readonly()` 方法将字段设为"只读"：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->readonly()
```

请注意，此设置仅在原生日期选择器上强制执行。如果你使用的是 [JavaScript 日期选择器](#启用-javascript-日期选择器)，则需要使用 [`disabled()`](overview#禁用字段)。

与 [`disabled()`](overview#禁用字段) 相比，有以下几个区别：

- 使用 `readOnly()` 时，字段在表单提交时仍会被发送到服务器。它可以通过浏览器控制台或 JavaScript 进行修改。你可以使用 [`saved(false)`](overview#阻止字段被保存) 来防止这种情况。
- 使用 `readOnly()` 时不会有样式变化，例如降低不透明度。
- 使用 `readOnly()` 时字段仍然可以获得焦点。

你也可以传入一个布尔值来控制字段是否为只读：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->readOnly(FeatureFlag::active())
```

:::tip
`readOnly()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以在函数中注入各种实用工具作为参数。
:::

## 日期时间选择器验证

除了[验证](validation)页面上列出的所有规则外，还有一些专门针对日期时间选择器的附加规则。

### 最大日期/最小日期验证

你可以限制选择器可选择的最小和最大日期。`minDate()` 和 `maxDate()` 方法接受一个 `DateTime` 实例（例如 `Carbon`）或字符串：

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
    ->minDate(now()->subYears(150))
    ->maxDate(now())
```

:::tip
`minDate()` 和 `maxDate()` 方法除了接受静态值外，还接受函数来动态计算。如果函数返回 `null`，则不应用验证规则。你可以在函数中注入各种实用工具作为参数。
:::
