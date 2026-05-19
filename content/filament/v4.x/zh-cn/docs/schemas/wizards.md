---
title: 向导
---

## 简介

类似于[标签页](tabs)，你可能想要使用多步向导来减少一次可见的组件数量。如果你的表单有明确的时间顺序，你希望在用户推进时验证每个步骤，这些特别有用。

```php
use Filament\Schemas\Components\Wizard;
use Filament\Schemas\Components\Wizard\Step;

Wizard::make([
    Step::make('订单')
        ->schema([
            // ...
        ]),
    Step::make('配送')
        ->schema([
            // ...
        ]),
    Step::make('账单')
        ->schema([
            // ...
        ]),
])
```

![向导](/assets/filament/v4.x/screenshots/images/light/schemas/layout/wizard/simple.jpg)

:::tip
如果你想在[面板资源](../resources/creating-records#使用向导)或[操作模态框](../actions/modals#在模态框中渲染向导)内的创建过程中添加向导，我们有不同的设置说明。遵循该文档将确保提交表单的功能仅在向导的最后一步可用。
:::

## 在最后一步渲染提交按钮

你可以使用 `submitAction()` 方法在向导的最后一步末尾渲染提交按钮 HTML 或视图。这比始终在向导下方显示提交按钮提供了更清晰的用户体验：

```php
use Filament\Schemas\Components\Wizard;
use Illuminate\Support\HtmlString;

Wizard::make([
    // ...
])->submitAction(view('order-form.submit-button'))

Wizard::make([
    // ...
])->submitAction(new HtmlString('<button type="submit">提交</button>'))
```

或者，你可以使用内置的 Filament 按钮 Blade 组件：

```php
use Filament\Schemas\Components\Wizard;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\HtmlString;

Wizard::make([
    // ...
])->submitAction(new HtmlString(Blade::render(<<<BLADE
    <x-filament::button
        type="submit"
        size="sm"
    >
        提交
    </x-filament::button>
BLADE)))
```

如果你愿意，可以将此组件提取到单独的 Blade 视图中。

![最后一步带有提交按钮的向导](/assets/filament/v4.x/screenshots/images/light/schemas/layout/wizard/submit-action.jpg)

## 设置步骤图标

步骤可以有一个[图标](../styling/icons)，你可以使用 `icon()` 方法设置：

```php
use Filament\Schemas\Components\Wizard\Step;
use Filament\Support\Icons\Heroicon;

Step::make('订单')
    ->icon(Heroicon::ShoppingBag)
    ->schema([
        // ...
    ]),
```

:::tip
除了允许静态值外，`icon()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有步骤图标的向导](/assets/filament/v4.x/screenshots/images/light/schemas/layout/wizard/icons.jpg)

## 自定义已完成步骤的图标

你可以使用 `completedIcon()` 方法自定义已完成步骤的[图标](#设置步骤图标)：

```php
use Filament\Schemas\Components\Wizard\Step;
use Filament\Support\Icons\Heroicon;

Step::make('订单')
    ->completedIcon(Heroicon::HandThumbUp)
    ->schema([
        // ...
    ]),
```

:::tip
除了允许静态值外，`completedIcon()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有已完成步骤图标的向导](/assets/filament/v4.x/screenshots/images/light/schemas/layout/wizard/completed-icons.jpg)

## 向步骤添加描述

你可以使用 `description()` 方法在每个步骤的标题后添加简短描述：

```php
use Filament\Schemas\Components\Wizard\Step;

Step::make('订单')
    ->description('查看你的购物篮')
    ->schema([
        // ...
    ]),
```

:::tip
除了允许静态值外，`description()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有步骤描述的向导](/assets/filament/v4.x/screenshots/images/light/schemas/layout/wizard/descriptions.jpg)

## 设置默认活动步骤

你可以使用 `startOnStep()` 方法在向导中加载特定步骤：

```php
use Filament\Schemas\Components\Wizard;

Wizard::make([
    // ...
])->startOnStep(2)
```

:::tip
除了允许静态值外，`startOnStep()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 允许跳过步骤

如果你想允许自由导航，所有步骤都可跳过，请使用 `skippable()` 方法：

```php
use Filament\Schemas\Components\Wizard;

Wizard::make([
    // ...
])->skippable()
```

可选地，`skippable()` 方法接受一个布尔值来控制步骤是否可跳过：

```php
use Filament\Schemas\Components\Wizard;

Wizard::make([
    // ...
])->skippable(FeatureFlag::active())
```

:::tip
除了允许静态值外，`skippable()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 在 URL 查询字符串中持久化当前步骤

默认情况下，当前步骤不会持久化在 URL 查询字符串中。你可以使用 `persistStepInQueryString()` 方法更改此行为：

```php
use Filament\Schemas\Components\Wizard;

Wizard::make([
    // ...
])->persistStepInQueryString()
```

启用后，当前步骤使用 `step` 键持久化在 URL 查询字符串中。你可以通过将其传递给 `persistStepInQueryString()` 方法来更改此键：

```php
use Filament\Schemas\Components\Wizard;

Wizard::make([
    // ...
])->persistStepInQueryString('wizard-step')
```

:::tip
除了允许静态值外，`persistStepInQueryString()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 步骤生命周期钩子

你可以使用 `afterValidation()` 和 `beforeValidation()` 方法在步骤验证之前和之后运行代码：

```php
use Filament\Schemas\Components\Wizard\Step;

Step::make('订单')
    ->afterValidation(function () {
        // ...
    })
    ->beforeValidation(function () {
        // ...
    })
    ->schema([
        // ...
    ]),
```

:::tip
你可以将各种实用工具作为参数注入到 `afterValidation()` 和 `beforeValidation()` 函数中。
:::

### 阻止加载下一步

在 `afterValidation()` 或 `beforeValidation()` 内部，你可以抛出 `Filament\Support\Exceptions\Halt`，这将阻止向导加载下一步：

```php
use Filament\Schemas\Components\Wizard\Step;
use Filament\Support\Exceptions\Halt;

Step::make('订单')
    ->afterValidation(function () {
        // ...

        if (true) {
            throw new Halt();
        }
    })
    ->schema([
        // ...
    ]),
```

## 在步骤中使用网格列

你可以使用 `columns()` 方法自定义步骤内的[网格](layouts#网格系统)：

```php
use Filament\Schemas\Components\Wizard;
use Filament\Schemas\Components\Wizard\Step;

Wizard::make([
    Step::make('订单')
        ->columns(2)
        ->schema([
            // ...
        ]),
    // ...
])
```

:::tip
除了允许静态值外，`columns()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 自定义向导操作对象

此组件使用操作对象来轻松自定义其中的按钮。你可以通过将函数传递给操作注册方法来自定义这些按钮。该函数可以访问 `$action` 对象，你可以使用它来[自定义它](../actions/overview)。以下方法可用于自定义操作：

- `nextAction()`
- `previousAction`

以下是自定义操作的示例：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Wizard;

Wizard::make([
    // ...
])
    ->nextAction(
        fn (Action $action) => $action->label('下一步'),
    )
```

:::tip
操作注册方法可以将各种实用工具作为参数注入到函数中。
:::
