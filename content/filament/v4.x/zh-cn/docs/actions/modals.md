---
title: 模态框
---

## 简介

操作在执行前可能需要用户的额外确认或输入。你可以在操作执行前打开一个模态框来实现这一点。

## 确认模态框

你可以使用 `requiresConfirmation()` 方法在操作运行前要求确认。这对于特别具有破坏性的操作非常有用，例如删除记录。

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
```

![确认模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/confirmation.jpg)

:::warning
当设置 `url()` 而不是 `action()` 时，确认模态框不可用。相反，你应该在 `action()` 闭包中重定向到该 URL。
:::

## 控制模态框内容

### 自定义模态框的标题、描述和提交操作标签

你可以自定义模态框中的标题、描述和提交按钮标签：

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
    ->modalHeading('删除文章')
    ->modalDescription('你确定要删除这篇文章吗？此操作无法撤销。')
    ->modalSubmitActionLabel('是的，删除它')
```

![带有自定义文本的确认模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/confirmation-custom-text.jpg)

### 在模态框中渲染 Schema

Filament 允许你在模态框中渲染 [Schema](../schemas)，这使你可以渲染任何可用的组件来构建 UI。通常，在 Schema 中构建表单以在操作运行前从用户收集额外信息非常有用，但可以渲染任何 UI：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;

Action::make('viewUser')
    ->schema([
        Grid::make(2)
            ->schema([
                Section::make('详情')
                    ->schema([
                        TextInput::make('name'),
                        Select::make('position')
                            ->options([
                                'developer' => '开发者',
                                'designer' => '设计师',
                            ]),
                        Checkbox::make('is_admin'),
                    ]),
                Section::make('审计')
                    ->schema([
                        TextEntry::make('created_at')
                            ->dateTime(),
                        TextEntry::make('updated_at')
                            ->dateTime(),
                    ]),
            ]),
    ])
```

:::tip
除了允许静态值外，`schema()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有 Schema 布局的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/schema.jpg)

#### 在模态框中渲染表单

你可以使用[表单字段](../forms)来创建操作模态框表单。表单中的数据可在 `action()` 闭包的 `$data` 数组中获取：

```php
use App\Models\Post;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;

Action::make('updateAuthor')
    ->schema([
        Select::make('authorId')
            ->label('作者')
            ->options(User::query()->pluck('name', 'id'))
            ->required(),
    ])
    ->action(function (array $data, Post $record): void {
        $record->author()->associate($data['authorId']);
        $record->save();
    })
```

![带有表单的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/form.jpg)

##### 使用现有数据填充表单

你可以使用 `fillForm()` 方法用现有数据填充表单：

```php
use App\Models\Post;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;

Action::make('updateAuthor')
    ->fillForm(fn (Post $record): array => [
        'authorId' => $record->author->id,
    ])
    ->schema([
        Select::make('authorId')
            ->label('作者')
            ->options(User::query()->pluck('name', 'id'))
            ->required(),
    ])
    ->action(function (array $data, Post $record): void {
        $record->author()->associate($data['authorId']);
        $record->save();
    })
```

:::tip
`fillForm()` 方法还接受一个函数来动态计算要填充表单的数据。你可以将各种实用工具作为参数注入到函数中。
:::

##### 禁用所有表单字段

你可能希望禁用模态框中的所有表单字段，确保用户无法编辑它们。你可以使用 `disabledForm()` 方法来实现：

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

Action::make('approvePost')
    ->schema([
        TextInput::make('title'),
        Textarea::make('content'),
    ])
    ->disabledForm()
    ->action(function (Post $record): void {
        $record->approve();
    })
```

![带有禁用表单字段的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/disabled-form.jpg)

#### 在模态框中渲染向导

你可以在模态框内创建[多步表单向导](../schemas/wizards)。 instead of using a `schema()`, define a `steps()` array and pass your `Step` objects:

```php
use Filament\Actions\Action;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Wizard\Step;

Action::make('create')
    ->steps([
        Step::make('名称')
            ->description('给分类一个唯一的名称')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->disabled()
                    ->required()
                    ->unique(Category::class, 'slug'),
            ])
            ->columns(2),
        Step::make('描述')
            ->description('添加一些额外的详细信息')
            ->schema([
                MarkdownEditor::make('description'),
            ]),
        Step::make('可见性')
            ->description('控制谁可以查看它')
            ->schema([
                Toggle::make('is_visible')
                    ->label('对客户可见')
                    ->default(true),
            ]),
    ])
```

![带有向导的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/wizard.jpg)

### 在模态框中添加图标

你可以使用 `modalIcon()` 方法在模态框中添加[图标](../styling/icons)：

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
    ->modalIcon('heroicon-o-trash')
```

:::tip
`modalIcon()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

![带有图标的确认模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/icon.jpg)

默认情况下，图标将继承操作按钮的颜色。你可以使用 `modalIconColor()` 方法自定义图标颜色：

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
    ->color('danger')
    ->modalIcon('heroicon-o-trash')
    ->modalIconColor('warning')
```

:::tip
`modalIconColor()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

![带有自定义图标颜色的确认模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/icon-color.jpg)

### 自定义模态框内容的对齐方式

默认情况下，模态框内容会对齐到起始位置，如果模态框的[宽度](#更改-modal-宽度)为 `xs` 或 `sm` 则居中对齐。如果你想更改模态框中内容的对齐方式，可以使用 `modalAlignment()` 方法并传入 `Alignment::Start` 或 `Alignment::Center`：

```php
use Filament\Actions\Action;
use Filament\Support\Enums\Alignment;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalAlignment(Alignment::Center)
```

:::tip
`modalAlignment()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

![带有居中内容对齐的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/alignment.jpg)

### 使模态框头部固定

当模态框内容超出模态框大小时，头部会随内容一起滚动出视图。然而，滑出式面板有一个固定头部，始终可见。你可以使用 `stickyModalHeader()` 来控制此行为：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->stickyModalHeader()
```

### 使模态框页脚固定

默认情况下，模态框的页脚在内容之后内联渲染。然而，滑出式面板有一个固定页脚，在滚动内容时始终显示。你也可以使用 `stickyModalFooter()` 为模态框启用此功能：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->stickyModalFooter()
```

![带有固定头部和页脚的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/sticky-header.jpg)

### 自定义模态框内容

你可以定义要在模态框中渲染的自定义内容，通过将 Blade 视图传递给 `modalContent()` 方法来指定：

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('advance')
    ->action(fn (Post $record) => $record->advance())
    ->modalContent(view('filament.pages.actions.advance'))
```

:::tip
`modalContent()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

#### 向自定义模态框内容传递数据

你可以通过从函数返回数据来传递给视图。例如，如果操作的 `$record` 已设置，你可以将其传递给视图：

```php
use Filament\Actions\Action;
use Illuminate\Contracts\View\View;

Action::make('advance')
    ->action(fn (Contract $record) => $record->advance())
    ->modalContent(fn (Contract $record): View => view(
        'filament.pages.actions.advance',
        ['record' => $record],
    ))
```

#### 在表单下方添加自定义模态框内容

默认情况下，如果存在模态框表单，自定义内容会显示在模态框表单上方，但你可以使用 `modalContentFooter()` 在下方添加内容：

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('advance')
    ->action(fn (Post $record) => $record->advance())
    ->modalContentFooter(view('filament.pages.actions.advance'))
```

:::tip
`modalContentFooter()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

#### 向自定义模态框内容添加操作

你可以向自定义模态框内容添加操作按钮，如果你想添加一个执行主操作以外的操作的按钮，这非常有用。你可以通过使用 `registerModalActions()` 方法注册操作，然后将其传递给视图来实现：

```php
use App\Models\Post;
use Filament\Actions\Action;
use Illuminate\Contracts\View\View;

Action::make('advance')
    ->registerModalActions([
        Action::make('report')
            ->requiresConfirmation()
            ->action(fn (Post $record) => $record->report()),
    ])
    ->action(fn (Post $record) => $record->advance())
    ->modalContent(fn (Action $action): View => view(
        'filament.pages.actions.advance',
        ['action' => $action],
    ))
```

现在，在视图文件中，你可以通过调用 `getModalAction()` 来渲染操作按钮：

```blade
<div>
    {{ $action->getModalAction('report') }}
</div>
```

## 使用滑出式面板代替模态框

你可以使用 `slideOver()` 方法打开"滑出式"对话框而不是模态框：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->slideOver()
```

![带有表单的滑出式面板](/assets/filament/v4.x/screenshots/images/light/actions/modal/slide-over.jpg)

模态框内容将不再在屏幕中央打开，而是从右侧滑入并占据浏览器的整个高度。

### 更改滑出式面板位置

默认情况下，滑出式面板从屏幕末端进入（在从左到右的语言中为右侧，在从右到左的语言中为左侧）。你可以通过将 `SlideOverPosition::Start` 传递给 `slideOverPosition()` 方法来将其更改为屏幕起始位置：

```php
use Filament\Actions\Action;
use Filament\Support\Enums\SlideOverPosition;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->slideOver()
    ->slideOverPosition(SlideOverPosition::Start)
```

![从屏幕起始位置滑出的面板](/assets/filament/v4.x/screenshots/images/light/actions/modal/slide-over-start.jpg)

当操作触发器位于视口起始位置附近时，这非常有用——例如，表行开头的行操作——因此滑出式面板在其触发器旁边打开，而不是跨越屏幕。

## 更改模态框宽度

你可以使用 `modalWidth()` 方法更改模态框的宽度。选项对应于 [Tailwind 的 max-width 比例](https://tailwindcss.com/docs/max-width)。选项包括 `ExtraSmall`、`Small`、`Medium`、`Large`、`ExtraLarge`、`TwoExtraLarge`、`ThreeExtraLarge`、`FourExtraLarge`、`FiveExtraLarge`、`SixExtraLarge`、`SevenExtraLarge` 和 `Screen`：

```php
use Filament\Actions\Action;
use Filament\Support\Enums\Width;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalWidth(Width::FiveExtraLarge)
```

:::tip
`modalWidth()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

![带有自定义宽度的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/wide.jpg)

## 在模态框打开时执行代码

你可以在模态框打开时在闭包中执行代码，通过将其传递给 `mountUsing()` 方法：

```php
use Filament\Actions\Action;
use Filament\Schemas\Schema;

Action::make('create')
    ->mountUsing(function (Schema $form) {
        $form->fill();

        // ...
    })
```

:::info
`mountUsing()` 方法默认由 Filament 用于初始化[表单](#在模态框中渲染表单)。如果你重写此方法，你需要调用 `$form->fill()` 来确保表单正确初始化。如果你想用数据填充表单，可以通过将数组传递给 `fill()` 方法来实现，而不是[在操作本身上使用 `fillForm()`](#使用现有数据填充表单)。
:::

## 自定义模态框页脚中的操作按钮

默认情况下，模态框页脚中有两个操作。第一个是提交按钮，执行 `action()`。第二个按钮关闭模态框并取消操作。

### 修改默认模态框页脚操作按钮

要修改用于渲染默认操作按钮之一的操作实例，你可以将闭包传递给 `modalSubmitAction()` 和 `modalCancelAction()` 方法：

```php
use Filament\Actions\Action;

Action::make('help')
    ->modalContent(view('actions.help'))
    ->modalCancelAction(fn (Action $action) => $action->label('关闭'))
```

[可用于自定义触发按钮的方法](overview)将用于修改闭包内的 `$action` 实例。

:::tip
要自定义模态框中的按钮标签，如果你不需要进一步的自定义，可以使用 `modalSubmitActionLabel()` 和 `modalCancelActionLabel()` 方法，而不是将函数传递给 `modalSubmitAction()` 和 `modalCancelAction()`。
:::

### 移除默认模态框页脚操作按钮

要移除默认操作，你可以将 `false` 传递给 `modalSubmitAction()` 或 `modalCancelAction()`：

```php
use Filament\Actions\Action;

Action::make('help')
    ->modalContent(view('actions.help'))
    ->modalSubmitAction(false)
```

### 向页脚添加额外的模态框操作按钮

你可以使用 `extraModalFooterActions()` 方法传递要在模态框页脚中渲染的额外操作数组，这些操作位于默认操作之间：

```php
use Filament\Actions\Action;

Action::make('create')
    ->schema([
        // ...
    ])
    // ...
    ->extraModalFooterActions(fn (Action $action): array => [
        $action->makeModalSubmitAction('createAnother', arguments: ['another' => true]),
    ])
```

:::tip
`extraModalFooterActions()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

![带有额外页脚操作按钮的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/extra-footer-actions.jpg)

`$action->makeModalSubmitAction()` 返回一个操作实例，可以使用[可用于自定义触发按钮的方法](overview)进行自定义。

`makeModalSubmitAction()` 的第二个参数允许你传递一个参数数组，这些参数将在操作的 `action()` 闭包中作为 `$arguments` 可访问。这些可以作为标志来指示操作应根据用户的决定而表现不同：

```php
use Filament\Actions\Action;

Action::make('create')
    ->schema([
        // ...
    ])
    // ...
    ->extraModalFooterActions(fn (Action $action): array => [
        $action->makeModalSubmitAction('createAnother', arguments: ['another' => true]),
    ])
    ->action(function (array $data, array $arguments): void {
        // 创建

        if ($arguments['another'] ?? false) {
            // 重置表单并不关闭模态框
        }
    })
```

#### 从额外页脚操作打开另一个模态框

你可以在彼此之间嵌套操作，允许你从额外页脚操作打开新模态框：

```php
use Filament\Actions\Action;

Action::make('edit')
    // ...
    ->extraModalFooterActions([
        Action::make('delete')
            ->requiresConfirmation()
            ->action(function () {
                // ...
            }),
    ])
```

现在，编辑模态框将在页脚中有一个"删除"按钮，点击时将打开确认模态框。此操作完全独立于 `edit` 操作，点击时不会运行 `edit` 操作。

然而，在此示例中，你可能希望在运行 `delete` 操作时取消 `edit` 操作。你可以使用 `cancelParentActions()` 方法来实现：

```php
use Filament\Actions\Action;

Action::make('delete')
    ->requiresConfirmation()
    ->action(function () {
        // ...
    })
    ->cancelParentActions()
```

如果你有深层嵌套的多个父操作，但不想取消所有操作，你可以将要取消的父操作名称（包括其子操作）传递给 `cancelParentActions()`：

```php
use Filament\Actions\Action;

Action::make('first')
    ->requiresConfirmation()
    ->action(function () {
        // ...
    })
    ->extraModalFooterActions([
        Action::make('second')
            ->requiresConfirmation()
            ->action(function () {
                // ...
            })
            ->extraModalFooterActions([
                Action::make('third')
                    ->requiresConfirmation()
                    ->action(function () {
                        // ...
                    })
                    ->extraModalFooterActions([
                        Action::make('fourth')
                            ->requiresConfirmation()
                            ->action(function () {
                                // ...
                            })
                            ->cancelParentActions('second'),
                    ]),
            ]),
    ])
```

在此示例中，如果运行 `fourth` 操作，`second` 操作将被取消，但 `third` 操作也会被取消，因为它是 `second` 的子操作。然而，`first` 操作不会被取消，因为它是 `second` 的父操作。`first` 操作的模态框将保持打开状态。

## 从子操作访问父操作信息

你可以通过在嵌套操作使用的函数中注入 `$mountedActions` 数组来访问父操作的实例及其原始数据和参数。例如，要获取页面上当前活动的最顶层父操作，你可以使用 `$mountedActions[0]`。从那里，你可以通过调用 `$mountedActions[0]->getRawData()` 获取该操作的原始数据。请注意，原始数据尚未验证，因为操作尚未提交：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;

Action::make('first')
    ->schema([
        TextInput::make('foo'),
    ])
    ->action(function () {
        // ...
    })
    ->extraModalFooterActions([
        Action::make('second')
            ->requiresConfirmation()
            ->action(function (array $mountedActions) {
                dd($mountedActions[0]->getRawData());
            
                // ...
            }),
    ])
```

你可以使用 `$mountedActions[0]->getArguments()` 方法对父操作的当前参数执行类似操作。

即使你有多层嵌套，`$mountedActions` 数组也将包含当前活动的每个操作，因此你可以访问有关它们的信息：

```php
use Filament\Actions\Action;

Action::make('first')
    ->schema([
        TextInput::make('foo'),
    ])
    ->action(function () {
        // ...
    })
    ->extraModalFooterActions([
        Action::make('second')
            ->schema([
                TextInput::make('bar'),
            ])
            ->arguments(['number' => 2])
            ->action(function () {
                // ...
            })
            ->extraModalFooterActions([
                Action::make('third')
                    ->schema([
                        TextInput::make('baz'),
                    ])
                    ->arguments(['number' => 3])
                    ->action(function () {
                        // ...
                    })
                    ->extraModalFooterActions([
                        Action::make('fourth')
                            ->requiresConfirmation()
                            ->action(function (array $mountedActions) {
                                dd(
                                    $mountedActions[0]->getRawData(),
                                    $mountedActions[0]->getArguments(),
                                    $mountedActions[1]->getRawData(),
                                    $mountedActions[1]->getArguments(),
                                    $mountedActions[2]->getRawData(),
                                    $mountedActions[2]->getArguments(),
                                );
                                // ...
                            }),
                    ]),
            ]),
    ])
```

## 关闭模态框

### 点击外部关闭模态框

默认情况下，当你点击模态框外部时，它会自动关闭。如果你想为特定操作禁用此行为，可以使用 `closeModalByClickingAway(false)` 方法：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->closeModalByClickingAway(false)
```

:::tip
`closeModalByClickingAway()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

如果你想更改应用程序中所有模态框的行为，可以在服务提供者或中间件中调用 `ModalComponent::closedByClickingAway()`：

```php
use Filament\Support\View\Components\ModalComponent;

ModalComponent::closedByClickingAway(false);
```

### 按 Escape 键关闭模态框

默认情况下，当你在模态框上按 Escape 键时，它会自动关闭。如果你想为特定操作禁用此行为，可以使用 `closeModalByEscaping(false)` 方法：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->closeModalByEscaping(false)
```

:::tip
`closeModalByEscaping()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

如果你想更改应用程序中所有模态框的行为，可以在服务提供者或中间件中调用 `ModalComponent::closedByEscaping()`：

```php
use Filament\Support\View\Components\ModalComponent;

ModalComponent::closedByEscaping(false);
```

### 隐藏模态框关闭按钮

默认情况下，模态框在右上角有一个关闭按钮。如果你想隐藏关闭按钮，可以使用 `modalCloseButton(false)` 方法：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalCloseButton(false)
```

:::tip
`modalCloseButton()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

如果你想为应用程序中的所有模态框隐藏关闭按钮，可以在服务提供者或中间件中调用 `ModalComponent::closeButton(false)`：

```php
use Filament\Support\View\Components\ModalComponent;

ModalComponent::closeButton(false);
```

![没有关闭按钮的模态框](/assets/filament/v4.x/screenshots/images/light/actions/modal/no-close-button.jpg)

## 阻止模态框自动聚焦

默认情况下，模态框在打开时会自动聚焦到第一个可聚焦元素。如果你想禁用此行为，可以使用 `modalAutofocus(false)` 方法：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->schema([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalAutofocus(false)
```

:::tip
`modalAutofocus()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

如果你想为应用程序中的所有模态框禁用自动聚焦，可以在服务提供者或中间件中调用 `ModalComponent::autofocus(false)`：

```php
use Filament\Support\View\Components\ModalComponent;

ModalComponent::autofocus(false);
```

## 将子操作模态框叠加在父操作模态框之上

默认情况下，当子操作打开其模态框时，父操作的模态框会暂时关闭，然后在子操作关闭后重新打开。如果你希望子操作的模态框出现在父操作模态框之上（保持父操作在下方可见），可以在子操作上使用 `overlayParentActions()` 方法：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Repeater;

Action::make('editItems')
    ->slideOver()
    ->schema([
        Repeater::make('items')
            ->schema([
                // ...
            ])
            ->deleteAction(
                fn (Action $action) => $action
                    ->requiresConfirmation()
                    ->overlayParentActions(),
            ),
    ])
    ->action(function () {
        // ...
    })
```

在此示例中，当用户点击重复器项目上的删除按钮时，确认对话框将出现在滑出式面板之上，而不是滑出式面板先关闭。这创建了更流畅的体验，特别是对于滑出式面板或复杂表单中的操作，关闭和重新打开父级会令人困惑。

![子确认模态框叠加在父滑出式面板之上](/assets/filament/v4.x/screenshots/images/light/actions/modal/overlaying-child.jpg)

## 优化模态框配置方法

当你在 `modalHeading()` 等模态框配置方法中使用数据库查询或其他繁重操作时，它们可能会被执行多次。这是因为 Filament 使用这些方法来决定是否渲染模态框，以及渲染模态框的内容。

要跳过 Filament 决定是否渲染模态框的检查，你可以使用 `modal()` 方法，这将通知 Filament 此操作存在模态框，无需再次检查：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->modal()
```

## 有条件地隐藏模态框

你可能需要有条件地显示确认模态框，同时回退到默认操作。这可以使用 `modalHidden()` 来实现：

```php
use Filament\Actions\Action;

Action::make('create')
    ->action(function (array $data): void {
        // ...
    })
    ->modalHidden($this->role !== 'admin')
    ->modalContent(view('filament.pages.actions.create'))
```

:::tip
`modalHidden()` 方法还接受一个函数来动态计算值。你可以将各种实用工具作为参数注入到函数中。
:::

## 向模态框窗口添加额外属性

你可以通过 `extraModalWindowAttributes()` 方法向模态框窗口传递额外的 HTML 属性，这些属性将合并到其外部 HTML 元素上。属性应由数组表示，其中键是属性名，值是属性值：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->extraModalWindowAttributes(['class' => 'update-author-modal'])
```

:::tip
除了允许静态值外，`extraModalWindowAttributes()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

:::info
默认情况下，多次调用 `extraModalWindowAttributes()` 将覆盖先前的属性。如果你想合并属性，可以将 `merge: true` 传递给该方法。
:::

## 向模态框遮罩层添加额外属性

你可以通过 `extraModalOverlayAttributes()` 向模态框遮罩层传递额外的 HTML 属性。属性应由数组表示，其中键是属性名，值是属性值：

```php
use Filament\Actions\Action;

Action::make('updateAuthor')
    ->extraModalOverlayAttributes(['class' => 'update-author-overlay'])
```

:::tip
除了允许静态值外，`extraModalOverlayAttributes()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

:::info
默认情况下，多次调用 `extraModalOverlayAttributes()` 将覆盖先前的属性。如果你想合并属性，可以将 `merge: true` 传递给该方法。
:::
