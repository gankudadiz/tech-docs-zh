---
title: 创建记录
---

![资源创建页面](/assets/filament/v4.x/screenshots/images/light/panels/resources/creating.jpg)

## 在保存前自定义数据

有时，你可能希望在表单数据最终保存到数据库之前对其进行修改。为此，你可以在创建页面类中定义 `mutateFormDataBeforeCreate()` 方法，该方法接收 `$data` 数组并返回修改后的版本：

```php
protected function mutateFormDataBeforeCreate(array $data): array
{
    $data['user_id'] = auth()->id();

    return $data;
}
```

或者，如果你在模态操作中创建记录，请查阅[操作文档](../actions/create#在保存前自定义数据)。

## 自定义创建过程

你可以使用创建页面类中的 `handleRecordCreation()` 方法来调整记录的创建方式：

```php
use Illuminate\Database\Eloquent\Model;

protected function handleRecordCreation(array $data): Model
{
    return static::getModel()::create($data);
}
```

或者，如果你在模态操作中创建记录，请查阅[操作文档](../actions/create#自定义创建过程)。

## 自定义重定向

默认情况下，保存表单后，用户将被重定向到资源的[编辑页面](editing-records)，如果存在[查看页面](viewing-records)则重定向到查看页面。

你可以通过覆盖创建页面类中的 `getRedirectUrl()` 方法来设置自定义重定向。

例如，表单可以重定向回[列表页面](listing-records)：

```php
protected function getRedirectUrl(): string
{
    return $this->getResource()::getUrl('index');
}
```

如果你希望重定向到上一个页面，否则回到索引页面：

```php
protected function getRedirectUrl(): string
{
    return $this->previousUrl ?? $this->getResource()::getUrl('index');
}
```

你还可以使用[配置](../panel-configuration)一次性为所有资源自定义默认重定向页面：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->resourceCreatePageRedirect('index') // 或
        ->resourceCreatePageRedirect('view') // 或
        ->resourceCreatePageRedirect('edit');
}
```

## 自定义保存通知

当记录成功创建时，系统会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请在创建页面类中定义 `getCreatedNotificationTitle()` 方法：

```php
protected function getCreatedNotificationTitle(): ?string
{
    return '用户已注册';
}
```

或者，如果你在模态操作中创建记录，请查阅[操作文档](../actions/create#自定义保存通知)。

你可以通过覆盖创建页面类中的 `getCreatedNotification()` 方法来自定义整个通知：

```php
use Filament\Notifications\Notification;

protected function getCreatedNotification(): ?Notification
{
    return Notification::make()
        ->success()
        ->title('用户已注册')
        ->body('用户已成功创建。');
}
```

要完全禁用通知，请从创建页面类中的 `getCreatedNotification()` 方法返回 `null`：

```php
use Filament\Notifications\Notification;

protected function getCreatedNotification(): ?Notification
{
    return null;
}
```

## 创建另一条记录

### 禁用"创建并继续"

要禁用"创建并继续"功能，请在创建页面类中将 `$canCreateAnother` 属性定义为 `false`：

```php
protected static bool $canCreateAnother = false;
```

或者，如果你想指定动态条件来禁用此功能，可以覆盖创建页面类中的 `canCreateAnother()` 方法：

```php
public function canCreateAnother(): bool
{
    return false;
}
```

### 创建另一条记录时保留数据

默认情况下，当用户使用"创建并继续"功能时，所有表单数据会被清除，以便用户从头开始。如果你想保留部分表单数据，可以覆盖创建页面类中的 `preserveFormDataWhenCreatingAnother()` 方法，并返回你希望保留的 `$data` 数组部分：

```php
use Illuminate\Support\Arr;

protected function preserveFormDataWhenCreatingAnother(array $data): array
{
    return Arr::only($data, ['is_admin', 'organization']);
}
```

要保留所有数据，返回整个 `$data` 数组：

```php
protected function preserveFormDataWhenCreatingAnother(array $data): array
{
    return $data;
}
```

## 生命周期钩子

钩子可用于在页面生命周期的不同节点执行代码，例如在表单保存之前。要设置钩子，请在创建页面类中创建一个以钩子名称命名的 protected 方法：

```php
protected function beforeCreate(): void
{
    // ...
}
```

在此示例中，`beforeCreate()` 方法中的代码将在表单数据保存到数据库之前被调用。

创建页面有以下几个可用的钩子：

```php
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    // ...

    protected function beforeFill(): void
    {
        // Runs before the form fields are populated with their default values.
    }

    protected function afterFill(): void
    {
        // Runs after the form fields are populated with their default values.
    }

    protected function beforeValidate(): void
    {
        // Runs before the form fields are validated when the form is submitted.
    }

    protected function afterValidate(): void
    {
        // Runs after the form fields are validated when the form is submitted.
    }

    protected function beforeCreate(): void
    {
        // Runs before the form fields are saved to the database.
    }

    protected function afterCreate(): void
    {
        // Runs after the form fields are saved to the database.
    }
}
```

或者，如果你在模态操作中创建记录，请查阅[操作文档](../actions/create#生命周期钩子)。

## 中止创建过程

你可以随时在生命周期钩子或修改方法中调用 `$this->halt()`，这将中止整个创建过程：

```php
use Filament\Actions\Action;
use Filament\Notifications\Notification;

protected function beforeCreate(): void
{
    if (! auth()->user()->team->subscribed()) {
        Notification::make()
            ->warning()
            ->title('你没有有效的订阅！')
            ->body('请选择一个方案以继续。')
            ->persistent()
            ->actions([
                Action::make('subscribe')
                    ->button()
                    ->url(route('subscribe'), shouldOpenInNewTab: true),
            ])
            ->send();

        $this->halt();
    }
}
```

或者，如果你在模态操作中创建记录，请查阅[操作文档](../actions/create#中止创建过程)。

## 授权

在授权方面，Filament 会遵循应用中注册的所有[模型策略](https://laravel.com/docs/authorization#creating-policies)。

如果模型策略的 `create()` 方法返回 `true`，用户可以访问创建页面。

## 使用向导

你可以轻松地将创建过程转变为多步向导。

在页面类中添加对应的 `HasWizard` trait：

```php
use App\Filament\Resources\Categories\CategoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCategory extends CreateRecord
{
    use CreateRecord\Concerns\HasWizard;

    protected static string $resource = CategoryResource::class;

    protected function getSteps(): array
    {
        return [
            // ...
        ];
    }
}
```

在 `getSteps()` 数组中返回你的[向导步骤](../schemas/wizards)：

```php
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Wizard\Step;

protected function getSteps(): array
{
    return [
        Step::make('名称')
            ->description('为分类起一个清晰且唯一的名称')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->disabled()
                    ->required()
                    ->unique(Category::class, 'slug', fn ($record) => $record),
            ]),
        Step::make('描述')
            ->description('添加一些额外信息')
            ->schema([
                MarkdownEditor::make('description')
                    ->columnSpan('full'),
            ]),
        Step::make('可见性')
            ->description('控制谁可以查看它')
            ->schema([
                Toggle::make('is_visible')
                    ->label('对客户可见')
                    ->default(true),
            ]),
    ];
}
```

或者，如果你在模态操作中创建记录，请查阅[操作文档](../actions/create#使用向导)。

现在，创建一条新记录来查看你的向导效果！编辑页面仍将使用资源类中定义的表单。

![带向导的资源创建页面](/assets/filament/v4.x/screenshots/images/light/panels/resources/creating-wizard.jpg)

如果你想允许自由导航（即所有步骤都可以跳过），请覆盖 `hasSkippableSteps()` 方法：

```php
public function hasSkippableSteps(): bool
{
    return true;
}
```

### 在表单和向导之间共享字段

如果你想减少资源表单和向导步骤之间的重复代码，一个好的做法是将公共表单字段提取为静态方法，这样你可以轻松地在表单或向导中获取字段实例：

```php
use Filament\Forms;
use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                static::getNameFormField(),
                static::getSlugFormField(),
                // ...
            ]);
    }

    public static function getNameFormField(): Forms\Components\TextInput
    {
        return TextInput::make('name')
            ->required()
            ->live()
            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state)));
    }

    public static function getSlugFormField(): Forms\Components\TextInput
    {
        return TextInput::make('slug')
            ->disabled()
            ->required()
            ->unique(Category::class, 'slug', fn ($record) => $record);
    }
}
```

```php
use App\Filament\Resources\Categories\Schemas\CategoryForm;
use Filament\Resources\Pages\CreateRecord;

class CreateCategory extends CreateRecord
{
    use CreateRecord\Concerns\HasWizard;

    protected static string $resource = CategoryResource::class;

    protected function getSteps(): array
    {
        return [
            Step::make('名称')
                ->description('为分类起一个清晰且唯一的名称')
                ->schema([
                    CategoryForm::getNameFormField(),
                    CategoryForm::getSlugFormField(),
                ]),
            // ...
        ];
    }
}
```

## 导入资源记录

Filament 包含一个 `ImportAction`，你可以将其添加到[列表页面](listing-records)的 `getHeaderActions()` 中。它允许用户上传 CSV 文件来导入数据到资源中：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions;

protected function getHeaderActions(): array
{
    return [
        Actions\ImportAction::make()
            ->importer(ProductImporter::class),
        Actions\CreateAction::make(),
    ];
}
```

需要[创建](../actions/import#创建导入器)"导入器"类来告诉 Filament 如何导入 CSV 的每一行。你可以在[操作文档](../actions/import)中了解关于 `ImportAction` 的一切。

## 自定义操作

"操作"是显示在页面上的按钮，允许用户在页面上运行 Livewire 方法或访问 URL。

在资源页面上，操作通常出现在两个位置：页面右上角和表单下方。

例如，你可以在创建页面的头部添加一个新的按钮操作：

```php
use App\Filament\Imports\UserImporter;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    // ...

    protected function getHeaderActions(): array
    {
        return [
            Actions\ImportAction::make()
                ->importer(UserImporter::class),
        ];
    }
}
```

或者，在表单下方的"创建"按钮旁边添加一个新按钮：

```php
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    // ...

    protected function getFormActions(): array
    {
        return [
            ...parent::getFormActions(),
            Action::make('close')->action('createAndClose'),
        ];
    }

    public function createAndClose(): void
    {
        // ...
    }
}
```

要查看完整的操作 API，请访问[页面部分](../navigation/custom-pages#为页面添加操作)。

### 将创建操作按钮添加到头部

你可以通过覆盖 `getHeaderActions()` 方法并使用 `getCreateFormAction()` 将"创建"按钮移到页面头部。你需要向操作传递 `formId()`，以指定该操作应提交 ID 为 `form` 的表单，即页面视图中使用的 `<form>` ID：

```php
protected function getHeaderActions(): array
{
    return [
        $this->getCreateFormAction()
            ->formId('form'),
    ];
}
```

你可以通过覆盖 `getFormActions()` 方法返回空数组来移除表单中的所有操作：

```php
protected function getFormActions(): array
{
    return [];
}
```

![头部带创建操作的资源创建页面](/assets/filament/v4.x/screenshots/images/light/panels/resources/creating-header-action.jpg)

## 自定义页面内容

Filament 中的每个页面都有自己的[模式](../schemas)，用于定义整体结构和内容。你可以通过在页面上定义 `content()` 方法来覆盖页面的模式。创建页面的 `content()` 方法默认包含以下组件：

```php
use Filament\Schemas\Schema;

public function content(Schema $schema): Schema
{
    return $schema
        ->components([
            $this->getFormContentComponent(), // 此方法返回一个组件，用于显示此资源中定义的表单
        ]);
}
```

在 `components()` 数组中，你可以插入任何[模式组件](../schemas)。你可以通过更改数组的顺序来重新排列组件，或移除不需要的组件。

### 使用自定义 Blade 视图

为了进一步自定义，你可以覆盖页面类上的静态 `$view` 属性为应用中的自定义视图：

```php
protected string $view = 'filament.resources.users.pages.create-user';
```

这假设你已在 `resources/views/filament/resources/users/pages/create-user.blade.php` 创建了视图：

```blade
<x-filament-panels::page>
    {{ $this->content }} {{-- 这将渲染 `content()` 方法中定义的页面内容，如果你想从头开始可以移除它 --}}
</x-filament-panels::page>
```
