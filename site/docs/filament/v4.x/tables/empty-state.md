---
title: 空状态
---

## 简介

表格的"空状态"在表格中没有行时渲染。

![带空状态的表格](/assets/filament/v4.x/screenshots/images/light/tables/empty-state.jpg)

## 设置空状态标题

要自定义空状态的标题，请使用 `emptyStateHeading()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateHeading('No posts yet');
}
```

![带自定义空状态标题的表格](/assets/filament/v4.x/screenshots/images/light/tables/empty-state-heading.jpg)

## 设置空状态描述

要自定义空状态的描述，请使用 `emptyStateDescription()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateDescription('Once you write your first post, it will appear here.');
}
```

![带空状态描述的表格](/assets/filament/v4.x/screenshots/images/light/tables/empty-state-description.jpg)

## 设置空状态图标

要自定义空状态的[图标](../styling/icons)，请使用 `emptyStateIcon()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateIcon('heroicon-o-bookmark');
}
```

![带自定义空状态图标的表格](/assets/filament/v4.x/screenshots/images/light/tables/empty-state-icon.jpg)

## 添加空状态操作

你可以向空状态添加[操作](actions)以提示用户采取行动。将这些传递给 `emptyStateActions()` 方法：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateActions([
            Action::make('create')
                ->label('Create post')
                ->url(route('posts.create'))
                ->icon('heroicon-m-plus')
                ->button(),
        ]);
}
```

![带空状态操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/empty-state-actions.jpg)

## 使用自定义空状态视图

你可以通过将其传递给 `emptyState()` 方法来使用完全自定义的空状态视图：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyState(view('tables.posts.empty-state'));
}
```
