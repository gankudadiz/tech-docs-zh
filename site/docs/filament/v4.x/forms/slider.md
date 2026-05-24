---
title: 滑块
---

## 简介

滑块组件允许你沿轨道拖动手柄来选择一个或多个数值：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
```

![滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/simple.jpg)

此组件使用 [noUiSlider](https://refreshless.com/nouislider) 包，其大部分 API 基于该库。

:::warning
由于其特性，滑块字段永远不能为空。字段的值永远不能为 `null` 或空数组。如果滑块字段为空，用户将没有可拖动的手柄。

因此，滑块字段开箱即用有一个默认值，设置为滑块[范围](#控制滑块范围)中允许的最小值。默认值在表单为空时使用，例如在资源的创建页面上。要了解更多关于默认值的信息，请查看 [`default()` 文档](overview#设置字段默认值)。
:::

## 控制滑块范围

滑块可选择的最小值和最大值默认为 0 和 100。Filament 会自动应用验证规则以确保用户不能超过这些值。你可以使用 `range()` 方法调整这些值：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 40, maxValue: 80)
```

:::tip
`range()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![自定义范围的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/range.jpg)

### 控制步长

默认情况下，用户可以选择最小值和最大值之间的任何小数值。你可以使用 `step()` 方法将值限制为特定的步长。Filament 会自动应用验证规则以确保用户不能偏离此步长：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->step(10)
```

:::tip
`step()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 限制小数位数

如果你希望允许用户选择最小值和最大值之间的任何小数值，而不是限制为某个步长，可以使用 `decimalPlaces()` 方法定义其选择的值将被四舍五入到的小数位数：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->decimalPlaces(2)
```

:::tip
`decimalPlaces()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 控制轨道的行为填充

默认情况下，用户可以沿整个轨道长度选择任何值。你可以使用 `rangePadding()` 方法为轨道添加行为填充。这将确保所选值始终与轨道边缘保持一定距离。Filament 默认应用于滑块的最小值和最大值验证会考虑填充，以确保用户不能超过填充范围：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->rangePadding(10)
```

:::tip
`rangePadding()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带有范围填充的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/range-padding.jpg)

在此示例中，即使最小值为 0，最大值为 100，用户也只能选择 10 到 90 之间的值。填充将应用于轨道的两端，因此所选值始终与轨道边缘保持至少 10 个单位的距离。

如果你想分别控制轨道每侧的填充，可以向 `rangePadding()` 方法传递一个包含两个值的数组。第一个值将应用于轨道的起始端，第二个值将应用于轨道的末端：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->rangePadding([10, 20])
```

### 从右到左的轨道

默认情况下，轨道从左到右运行。如果用户使用从右到左的语言环境（如阿拉伯语），轨道将自动从右到左显示。你也可以使用 `rtl()` 方法强制轨道从右到左显示：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->rtl()
```

你也可以传递一个布尔值来控制滑块是否应该从右到左：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->rtl(FeatureFlag::active())
```

:::tip
`rtl()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![从右到左的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/rtl.jpg)

## 为滑块添加多个值

如果滑块设置为值数组，用户将能够在允许范围内沿轨道拖动多个手柄。确保滑块设置了值数组的 [`default()` 值](overview#设置字段默认值)，以便在表单为空时使用：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->default([20, 70])
```

![多值滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/multiple.jpg)

如果你使用 Eloquent 保存多个滑块值，请确保为模型属性添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

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
            'slider' => 'array',
        ];
    }

    // ...
}
```

## 使用垂直轨道

你可以使用 `vertical()` 方法将滑块显示为垂直轨道而不是水平轨道：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->vertical()
```

![垂直滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/vertical.jpg)

你也可以传递一个布尔值来控制滑块是否应该是垂直的：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->vertical(FeatureFlag::active())
```

:::tip
`vertical()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 从上到下的轨道

默认情况下，垂直轨道从下到上运行。在 [noUiSlider](https://refreshless.com/nouislider) 中，这是[从右到左的行为](#从右到左的轨道)。要将最小值分配到轨道顶部，可以使用 `rtl(false)` 方法：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->vertical()
    ->rtl(false)
```

![从上到下的垂直滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/top-to-bottom.jpg)

## 为手柄添加工具提示

你可以使用 `tooltips()` 方法为滑块的手柄添加工具提示。工具提示将显示手柄的当前值：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->tooltips()
```

![带有工具提示的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/tooltips.jpg)

你也可以传递一个布尔值来控制滑块是否应该有工具提示：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->tooltips(FeatureFlag::active())
```

使用多个手柄时，会显示多个工具提示，每个手柄一个。工具提示也适用于[垂直轨道](#使用垂直轨道)。

![带有工具提示的垂直滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/tooltips-vertical.jpg)

### 自定义工具提示格式

你可以使用 JavaScript 自定义工具提示的格式。向 `tooltips()` 方法传递一个 `RawJs` 对象，其中包含要使用的 JavaScript 字符串表达式。要格式化的当前值将在 `$value` 变量中可用：

```php
use Filament\Forms\Components\Slider;
use Filament\Support\RawJs;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->tooltips(RawJs::make(<<<'JS'
        `$${$value.toFixed(2)}`
        JS))
```

![自定义工具提示格式的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/tooltips-formatting.jpg)

### 单独控制多个手柄的工具提示

如果滑块设置为值数组，你可以通过向 `tooltips()` 方法传递值数组来分别控制每个手柄的工具提示。第一个值将应用于第一个手柄，第二个值将应用于第二个手柄，依此类推：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->tooltips([true, false])
```

![多工具提示滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/tooltips-multiple.jpg)

## 为轨道填充颜色

默认情况下，轨道的颜色不受其手柄位置的影响。使用单个手柄时，你可以使用 `fillTrack()` 方法用颜色填充手柄之前的轨道部分：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->fillTrack()
```

![带填充的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/fill.jpg)

你也可以传递一个布尔值来控制滑块是否应该填充：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->fillTrack(FeatureFlag::active())
```

:::tip
`fillTrack()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

使用多个手柄时，你必须通过传递一个包含 `true` 和 `false` 值的数组来手动指定轨道的哪些部分应该被填充，每个部分一个值。值的总数应比手柄数量多一个。第一个值将应用于第一个手柄之前的部分，第二个值将应用于第一个和第二个手柄之间的部分，依此类推：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->fillTrack([false, true, false])
```

![多填充滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/fill-multiple.jpg)

填充也适用于[垂直轨道](#使用垂直轨道)：

![带填充的垂直滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/fill-vertical.jpg)

## 为轨道添加刻度线

你可以为轨道添加刻度线，它们是指示手柄位置的小标记。你可以使用 `pips()` 方法为轨道添加刻度线：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips()
```

![带刻度线的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips.jpg)

刻度线在有多个手柄时也适用：

![多刻度线滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-multiple.jpg)

你也可以为[垂直轨道](#使用垂直轨道)添加刻度线：

![带刻度线的垂直滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-vertical.jpg)

### 调整刻度线密度

默认情况下，刻度线以 `10` 的密度显示。这意味着轨道每 10 个单位会显示一个刻度线。你可以使用 `pips()` 方法的 `density` 参数调整此密度：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips(density: 5)
```

:::tip
`density` 参数除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![自定义刻度线密度的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-density.jpg)

### 自定义刻度线标签格式

你可以使用 JavaScript 自定义刻度线标签的格式。向 `pipsFormatter()` 方法传递一个 `RawJs` 对象，其中包含要使用的 JavaScript 字符串表达式。要格式化的当前值将在 `$value` 变量中可用：

```php
use Filament\Forms\Components\Slider;
use Filament\Support\RawJs;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips()
    ->pipsFormatter(RawJs::make(<<<'JS'
        `$${$value.toFixed(2)}`
        JS))
```

:::tip
`pipsFormatter()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![自定义刻度线格式的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-formatting.jpg)

### 为轨道的步长添加刻度线标签

如果你使用[步长](#控制步长)来限制轨道的移动，可以为每个步长添加刻度线标签。为此，请向 `pips()` 方法传递一个 `PipsMode::Steps` 对象：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\PipsMode;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->step(10)
    ->pips(PipsMode::Steps)
```

![步长刻度线的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-steps.jpg)

如果你想在轨道上添加没有标签的额外刻度线，也可以[调整刻度线的密度](#调整刻度线密度)：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\PipsMode;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->step(10)
    ->pips(PipsMode::Steps, density: 5)
```

![步长刻度线和自定义密度的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-steps-density.jpg)

### 为轨道的百分比位置添加刻度线标签

如果你想在特定百分比位置为轨道添加刻度线标签，可以向 `pips()` 方法传递一个 `PipsMode::Positions` 对象。百分比位置需要在 `pipsValues()` 方法中以数字数组定义：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\PipsMode;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips(PipsMode::Positions)
    ->pipsValues([0, 25, 50, 75, 100])
```

:::tip
`pipsValues()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![百分比位置刻度线的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-positions.jpg)

[密度](#调整刻度线密度)仍然控制没有标签的刻度线的间距。

### 为轨道添加固定数量的刻度线标签

如果你想为轨道添加固定数量的刻度线标签，可以向 `pips()` 方法传递一个 `PipsMode::Count` 对象。刻度线数量需要在 `pipsValues()` 方法中定义：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\PipsMode;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips(PipsMode::Count)
    ->pipsValues(5)
```

:::tip
`pipsValues()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![固定数量刻度线的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-count.jpg)

[密度](#调整刻度线密度)仍然控制没有标签的刻度线的间距。

### 为轨道上的设定值添加刻度线标签

除了定义[百分比位置](#为轨道的百分比位置添加刻度线标签)或[固定数量](#为轨道添加固定数量的刻度线标签)的刻度线标签外，你还可以定义一组值用于刻度线标签。为此，请向 `pips()` 方法传递一个 `PipsMode::Values` 对象。值需要在 `pipsValues()` 方法中以数字数组定义：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\PipsMode;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips(PipsMode::Values)
    ->pipsValues([5, 15, 25, 35, 45, 55, 65, 75, 85, 95])
```

:::tip
`pipsValues()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![设定值刻度线的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-values.jpg)

[密度](#调整刻度线密度)仍然控制没有标签的刻度线的间距：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\PipsMode;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips(PipsMode::Values, density: 5)
    ->pipsValues([5, 15, 25, 35, 45, 55, 65, 75, 85, 95])
```

![设定值刻度线和自定义密度的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-values-density.jpg)

### 手动过滤刻度线

要更精细地控制刻度线在轨道上的显示方式，可以使用 JavaScript 表达式。JavaScript 表达式应根据刻度线的外观返回不同的数字：

- 如果应该显示大的刻度线标签，表达式应返回 `1`。
- 如果应该显示小的刻度线标签，表达式应返回 `2`。
- 如果应该显示没有标签的刻度线，表达式应返回 `0`。
- 如果根本不应该显示刻度线，表达式应返回 `-1`。

刻度线的[密度](#调整刻度线密度)将控制哪些值传递给 JavaScript 表达式。表达式应使用 `$value` 变量访问刻度线的当前值。表达式应定义在 `RawJs` 对象中并传递给 `pipsFilter()` 方法：

```php
use Filament\Forms\Components\Slider;
use Filament\Support\RawJs;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->pips(density: 5)
    ->pipsFilter(RawJs::make(<<<'JS'
        ($value % 50) === 0
            ? 1
            : ($value % 10) === 0
                ? 2
                : ($value % 25) === 0
                    ? 0
                    : -1
        JS))
```

:::tip
`pipsFilter()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

在此示例中，`%` 运算符用于确定刻度线值的可整除性。表达式每 50 个单位返回 `1`，每 10 个单位返回 `2`，每 25 个单位返回 `0`，所有其他值返回 `-1`：

![带刻度过滤器的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/pips-filter.jpg)

## 设置手柄之间的最小差异

要设置手柄之间的最小距离，可以使用 `minDifference()` 方法，传入一个数字。这表示两个手柄值之间的实际差异，而不是它们的视觉距离：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->minDifference(10)
```

:::tip
`minDifference()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

:::warning
`minDifference()` 方法不会影响滑块的验证。熟练的用户可以使用 JavaScript 操作滑块的值来选择不符合最小差异的值。他们仍然会被阻止选择超出滑块范围的值。
:::

## 设置手柄之间的最大差异

要设置手柄之间的最大距离，可以使用 `maxDifference()` 方法，传入一个数字。这表示两个手柄值之间的实际差异，而不是它们的视觉距离：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->maxDifference(40)
```

:::tip
`maxDifference()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

:::warning
`maxDifference()` 方法不会影响滑块的验证。熟练的用户可以使用 JavaScript 操作滑块的值来选择不符合最大差异的值。他们仍然会被阻止选择超出滑块范围的值。
:::

## 控制滑块的常规行为

滑块的 `behavior()` 方法允许你传递一个或多个 `Behavior` 对象来控制滑块的行为。可用选项有：

- `Behavior::Tap` - 当用户点击轨道时，滑块会平滑移动到点击位置。这是默认行为，因此在应用其他行为时，如果你想保留它，也应该将其包含在数组中。
- `Behavior::Drag` - 当轨道上有两个手柄时，用户可以拖动轨道同时移动两个手柄。必须使用 [`fillTrack([false, true, false])`](#为轨道填充颜色) 方法以确保用户有可拖动的区域。
- `Behavior::Drag` 和 `Behavior::Fixed` - 当轨道上有两个手柄时，用户可以拖动轨道同时移动两个手柄，但不能改变它们之间的距离。必须使用 [`fillTrack([false, true, false])`](#为轨道填充颜色) 方法以确保用户有可拖动的区域。请注意，手柄之间的距离不会在后端自动验证，因此熟练的用户可以使用 JavaScript 操作滑块的值来选择不同距离的值。他们仍然会被阻止选择超出滑块范围的值。
- `Behavior::Unconstrained` - 当轨道上有多个手柄时，它们可以被拖过彼此。[`minDifference()`](#设置手柄之间的最小差异) 和 [`maxDifference()`](#设置手柄之间的最大差异) 方法将不适用于此行为。
- `Behavior::SmoothSteps` - 拖动手柄时，它们不会吸附到轨道的[步长](#控制步长)。一旦用户释放手柄，它将吸附到最近的步长。

例如，要同时使用 `Behavior::Tap`、`Behavior::Drag` 和 `Behavior::SmoothSteps`：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\Behavior;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->behavior([Behavior::Tap, Behavior::Drag, Behavior::SmoothSteps])
```

要禁用所有行为，包括默认的 `Behavior::Tap`，可以使用 `behavior(null)` 方法：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->behavior(null)
```

## 非线性轨道

你可以创建非线性轨道，其中轨道的某些部分被压缩或扩展，方法是在滑块的 `nonLinearPoints()` 方法中定义百分比点数组。数组的每个百分比键应有一个对应的实值，该值将用于计算手柄在轨道上的位置。下面的示例使用[刻度线](#为轨道添加刻度线)来演示轨道的非线性行为：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->nonLinearPoints(['20%' => 50, '50%' => 75])
    ->pips()
```

![非线性轨道的滑块](/assets/filament/v4.x/screenshots/images/light/forms/fields/slider/non-linear.jpg)

:::tip
`nonLinearPoints()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

使用非线性轨道时，你还可以控制每个部分的步进。通过为每个百分比点定义一个包含两个数字的数组，第一个数字将用作百分比位置的实值，第二个数字将用作该部分的步长大小，直到下一个百分比点为止：

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 100)
    ->nonLinearPoints(['20%' => [50, 5], '50%' => [75, 1]])
    ->pips()
```

:::warning
使用非线性轨道时，某些轨道部分的步长值不会影响滑块的验证。熟练的用户可以使用 JavaScript 操作滑块的值来选择不符合轨道步长值的值。他们仍然会被阻止选择超出滑块范围的值。
:::

将[刻度线](#为轨道添加刻度线)与非线性轨道一起使用时，你可以确保刻度线标签被四舍五入，并且只显示在轨道上可选择的位置。否则，轨道非线性部分的步进可能会将标签添加到不可选择的位置。为此，请使用 `steppedPips()` 方法：

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Slider\Enums\PipsMode;

Slider::make('slider')
    ->range(minValue: 0, maxValue: 10000)
    ->nonLinearPoints(['10%' => [500, 500], '50%' => [4000, 1000]])
    ->pips(PipsMode::Positions, density: 4)
    ->pipsValues([0, 25, 50, 75, 100])
    ->steppedPips()
```
