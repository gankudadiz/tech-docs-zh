---
title: 查看操作
---
## 简介

Filament 包含一个能够查看 Eloquent 记录的操作。当触发按钮被点击时，将会打开一个包含信息的模态框。Filament 使用表单字段来组织这些信息。所有表单字段都是禁用的，因此用户无法编辑。你可以像这样使用它：

```php
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;

// 创建查看操作（只读模态框）
ViewAction::make()
    ->schema([                                    // 定义只读表单字段
        TextInput::make('title')                  // 标题字段（禁用状态）
            ->required()
            ->maxLength(255),
        // ...
    ])
```

![查看操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/view-action/modal.jpg)

## 在填充表单前自定义数据

你可能希望在将记录数据填充到表单之前对其进行修改。为此，你可以使用 `mutateRecordDataUsing()` 方法来修改 `$data` 数组，并在填充到表单之前返回修改后的版本：

```php
use Filament\Actions\ViewAction;

// 在填充表单前修改记录数据
ViewAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();          // 添加当前用户 ID

        return $data;                             // 返回修改后的数据
    })
```

除了 `$data`，`mutateRecordDataUsing()` 函数还可以注入各种工具作为参数。
