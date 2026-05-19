---
title: 复选框列
---

## 简介

复选框列允许你在表格中渲染一个复选框，可用于更新数据库记录，无需打开新页面或模态框：

```php
use Filament\Tables\Columns\CheckboxColumn;

CheckboxColumn::make('is_admin')
```

![复选框列](/assets/filament/v4.x/screenshots/images/light/tables/columns/checkbox/simple.jpg)

## 生命周期钩子

钩子可用于在复选框生命周期的不同点执行代码：

```php
CheckboxColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 在状态保存到数据库之前运行。
    })
    ->afterStateUpdated(function ($record, $state) {
        // 在状态保存到数据库之后运行。
    })
```

## 安全

### 授权

复选框列在保存更改之前不会自动检查 Laravel 模型策略。当用户通过复选框列更新值时，Filament 会检查列是否被 `disabled()`，但不会运行任何 `update` 策略门检查。这意味着，如果用户可以在表格中看到记录且列未被禁用，他们可以更新该列的值，无论你定义了什么 `update` 策略。如果你需要限制谁可以编辑此列，应使用 `disabled()` 方法基于你自己的授权逻辑有条件地阻止编辑，例如 `disabled(fn ($record) => $record->user_id !== auth()->id())`。或者，考虑使用完整的编辑页面或模态框操作，其中 Filament 的资源授权会被强制执行。
