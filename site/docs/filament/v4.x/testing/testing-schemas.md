---
title: 测试 Schema
---

## 在测试中填充表单

要向表单填充数据，请将数据传递给 `fillForm()`：

```php
use function Pest\Livewire\livewire;

livewire(CreatePost::class)
    ->fillForm([
        'title' => fake()->sentence(),
        // ...
    ]);
```

> 如果你的 Livewire 组件上有多个 schema，你可以使用 `fillForm([...], 'createPostForm')` 来指定要填充的表单。

## 测试表单字段和信息列表条目的状态

要检查表单是否有数据，请使用 `assertSchemaStateSet()`：

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('can automatically generate a slug from the title', function () {
    $title = fake()->sentence();

    livewire(CreatePost::class)
        ->fillForm([
            'title' => $title,
        ])
        ->assertSchemaStateSet([
            'slug' => Str::slug($title),
        ]);
});
```

> 如果你的 Livewire 组件上有多个 schema，你可以使用 `assertSchemaStateSet([...], 'createPostForm')` 来指定要检查的 schema。

你可能还会发现向 `assertSchemaStateSet()` 方法传递一个函数很有用，这允许你访问表单 `$state` 并执行额外的断言：

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('can automatically generate a slug from the title without any spaces', function () {
    $title = fake()->sentence();

    livewire(CreatePost::class)
        ->fillForm([
            'title' => $title,
        ])
        ->assertSchemaStateSet(function (array $state): array {
            expect($state['slug'])
                ->not->toContain(' ');
                
            return [
                'slug' => Str::slug($title),
            ];
        });
});
```

如果你希望 Filament 在函数运行后继续断言 schema 状态，可以从函数中返回一个数组。

## 测试表单验证

使用 `assertHasFormErrors()` 来确保表单中的数据经过正确验证：

```php
use function Pest\Livewire\livewire;

it('can validate input', function () {
    livewire(CreatePost::class)
        ->fillForm([
            'title' => null,
        ])
        ->call('create')
        ->assertHasFormErrors(['title' => 'required']);
});
```

使用 `assertHasNoFormErrors()` 来确保没有验证错误：

```php
use function Pest\Livewire\livewire;

livewire(CreatePost::class)
    ->fillForm([
        'title' => fake()->sentence(),
        // ...
    ])
    ->call('create')
    ->assertHasNoFormErrors();
```

> 如果你的 Livewire 组件上有多个 schema，你可以将特定表单的名称作为第二个参数传递，例如 `assertHasFormErrors(['title' => 'required'], 'createPostForm')` 或 `assertHasNoFormErrors([], 'createPostForm')`。

## 测试表单的存在性

要检查 Livewire 组件是否有表单，请使用 `assertSchemaExists('form')`：

```php
use function Pest\Livewire\livewire;

it('has a form', function () {
    livewire(CreatePost::class)
        ->assertSchemaExists('form');
});
```

> 如果你的 Livewire 组件上有多个 schema，你可以传递特定表单的名称，例如 `assertSchemaExists('createPostForm')`。

## 测试表单字段的存在性

要确保表单有给定的字段，请将字段名传递给 `assertFormFieldExists()`：

```php
use function Pest\Livewire\livewire;

it('has a title field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title');
});
```

你可以传递一个函数作为额外参数，以断言字段通过了给定的"真值测试"。这对于断言字段具有特定配置非常有用：

```php
use function Pest\Livewire\livewire;

it('has a title field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title', function (TextInput $field): bool {
            return $field->isDisabled();
        });
});
```

要断言表单没有给定的字段，请将字段名传递给 `assertFormFieldDoesNotExist()`：

```php
use function Pest\Livewire\livewire;

it('does not have a conditional field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldDoesNotExist('no-such-field');
});
```

> 如果你的 Livewire 组件上有多个 schema，你可以指定要检查字段存在性的表单，例如 `assertFormFieldExists('title', 'createPostForm')`。

## 测试表单字段的可见性

要确保某个字段可见，请将名称传递给 `assertFormFieldVisible()`：

```php
use function Pest\Livewire\livewire;

test('title is visible', function () {
    livewire(CreatePost::class)
        ->assertFormFieldVisible('title');
});
```

或者要确保某个字段隐藏，你可以将名称传递给 `assertFormFieldHidden()`：

```php
use function Pest\Livewire\livewire;

test('title is hidden', function () {
    livewire(CreatePost::class)
        ->assertFormFieldHidden('title');
});
```

:::tip
对于 `assertFormFieldHidden()` 和 `assertFormFieldVisible()`，你可以将字段所属的特定表单名称作为第二个参数传递，例如 `assertFormFieldHidden('title', 'createPostForm')`。
:::

## 测试禁用的表单字段

要确保某个字段已启用，请将名称传递给 `assertFormFieldEnabled()`：

```php
use function Pest\Livewire\livewire;

test('title is enabled', function () {
    livewire(CreatePost::class)
        ->assertFormFieldEnabled('title');
});
```

或者要确保某个字段被禁用，你可以将名称传递给 `assertFormFieldDisabled()`：

```php
use function Pest\Livewire\livewire;

test('title is disabled', function () {
    livewire(CreatePost::class)
        ->assertFormFieldDisabled('title');
});
```

:::tip
对于 `assertFormFieldEnabled()` 和 `assertFormFieldDisabled()`，你可以将字段所属的特定表单名称作为第二个参数传递，例如 `assertFormFieldEnabled('title', 'createPostForm')`。
:::

## 测试其他 schema 组件

如果你需要检查某个特定的 schema 组件（而不是字段）是否存在，可以使用 `assertSchemaComponentExists()`。由于组件没有名称，此方法使用开发者提供的 `key()`：

```php
use Filament\Schemas\Components\Section;

Section::make('Comments')
    ->key('comments-section')
    ->schema([
        //
    ])
```

```php
use function Pest\Livewire\livewire;

test('comments section exists', function () {
    livewire(EditPost::class)
        ->assertSchemaComponentExists('comments-section');
});
```

要断言 schema 没有给定的组件，请将组件键传递给 `assertSchemaComponentDoesNotExist()`：

```php
use function Pest\Livewire\livewire;

it('does not have a conditional component', function () {
    livewire(CreatePost::class)
        ->assertSchemaComponentDoesNotExist('no-such-section');
});
```

要检查组件是否存在并通过给定的真值测试，你可以将函数传递给 `assertSchemaComponentExists()` 的 `checkComponentUsing` 参数，如果组件通过测试则返回 true，否则返回 false：

```php
use Filament\Schemas\Components\Section;

use function Pest\Livewire\livewire;

test('comments section has heading', function () {
    livewire(EditPost::class)
        ->assertSchemaComponentExists(
            'comments-section',
            checkComponentUsing: function (Section $component): bool {
                return $component->getHeading() === 'Comments';
            },
        );
});
```

如果你想要更具信息量的测试结果，可以在真值测试回调中嵌入断言：

```php
use Filament\Schemas\Components\Section;
use Illuminate\Testing\Assert;

use function Pest\Livewire\livewire;

test('comments section is enabled', function () {
    livewire(EditPost::class)
        ->assertSchemaComponentExists(
            'comments-section',
            checkComponentUsing: function (Section $component): bool {
                Assert::assertTrue(
                    $component->isEnabled(),
                    'Failed asserting that comments-section is enabled.',
                );

                return true;
            },
        );
});
```

### 测试 schema 组件的可见性

要确保某个 schema 组件可见，请将键传递给 `assertSchemaComponentVisible()`：

```php
use function Pest\Livewire\livewire;

test('comments section is visible', function () {
    livewire(EditPost::class)
        ->assertSchemaComponentVisible('comments-section');
});
```

或者要确保某个 schema 组件隐藏，你可以将键传递给 `assertSchemaComponentHidden()`：

```php
use function Pest\Livewire\livewire;

test('comments section is hidden', function () {
    livewire(EditPost::class)
        ->assertSchemaComponentHidden('comments-section');
});
```

:::tip
对于 `assertSchemaComponentHidden()` 和 `assertSchemaComponentVisible()`，你可以将组件所属的特定 schema 名称作为第二个参数传递，例如 `assertSchemaComponentHidden('comments-section', 'createPostForm')`。
:::

## 测试重复器

在内部，重复器会为项目生成 UUID，以便更容易地在 Livewire HTML 中跟踪它们。这意味着当你测试带有重复器的表单时，你需要确保 UUID 在表单和测试之间保持一致。这可能比较棘手，如果你没有正确操作，你的测试可能会失败，因为测试期望的是 UUID 而不是数字键。

然而，由于 Livewire 在测试中不需要跟踪 UUID，你可以使用 `Repeater::fake()` 方法在测试开始时禁用 UUID 生成，并用数字键替换它们：

```php
use Filament\Forms\Components\Repeater;
use function Pest\Livewire\livewire;

$undoRepeaterFake = Repeater::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertSchemaStateSet([
        'quotes' => [
            [
                'content' => 'First quote',
            ],
            [
                'content' => 'Second quote',
            ],
        ],
        // ...
    ]);

$undoRepeaterFake();
```

你可能还会发现通过向 `assertSchemaStateSet()` 方法传递函数来测试重复器中项目的数量很有用：

```php
use Filament\Forms\Components\Repeater;
use function Pest\Livewire\livewire;

$undoRepeaterFake = Repeater::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertSchemaStateSet(function (array $state) {
        expect($state['quotes'])
            ->toHaveCount(2);
    });

$undoRepeaterFake();
```

### 测试重复器操作

为了测试重复器操作是否按预期工作，你可以使用 `callFormComponentAction()` 方法来调用重复器操作，然后[执行额外的断言](../testing/overview#actions)。

要与特定重复器项目上的操作进行交互，你需要传入 `item` 参数，该参数包含该重复器项目的键。如果你的重复器正在从关系中读取数据，你应该在相关记录的 ID（键）前加上 `record-` 以形成重复器项目的键：

```php
use App\Models\Quote;
use Filament\Forms\Components\Repeater;
use function Pest\Livewire\livewire;

$quote = Quote::first();

livewire(EditPost::class, ['record' => $post])
    ->callAction(TestAction::make('sendQuote')->schemaComponent('quotes')->arguments([
        'item' => "record-{$quote->getKey()}",
    ]))
    ->assertNotified('Quote sent!');
```

## 测试构建器

在内部，构建器会为项目生成 UUID，以便更容易地在 Livewire HTML 中跟踪它们。这意味着当你测试带有构建器的表单时，你需要确保 UUID 在表单和测试之间保持一致。这可能比较棘手，如果你没有正确操作，你的测试可能会失败，因为测试期望的是 UUID 而不是数字键。

然而，由于 Livewire 在测试中不需要跟踪 UUID，你可以使用 `Builder::fake()` 方法在测试开始时禁用 UUID 生成，并用数字键替换它们：

```php
use Filament\Forms\Components\Builder;
use function Pest\Livewire\livewire;

$undoBuilderFake = Builder::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertSchemaStateSet([
        'content' => [
            [
                'type' => 'heading',
                'data' => [
                    'content' => 'Hello, world!',
                    'level' => 'h1',
                ],
            ],
            [
                'type' => 'paragraph',
                'data' => [
                    'content' => 'This is a test post.',
                ],
            ],
        ],
        // ...
    ]);

$undoBuilderFake();
```

你可能还会发现通过向 `assertSchemaStateSet()` 方法传递函数来测试重复器中项目的数量很有用：

```php
use Filament\Forms\Components\Builder;
use function Pest\Livewire\livewire;

$undoBuilderFake = Builder::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertSchemaStateSet(function (array $state) {
        expect($state['content'])
            ->toHaveCount(2);
    });

$undoBuilderFake();
```

## 测试向导

要转到向导的下一步，请使用 `goToNextWizardStep()`：

```php
use function Pest\Livewire\livewire;

it('moves to next wizard step', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep()
        ->assertHasFormErrors(['title']);
});
```

你也可以通过调用 `goToPreviousWizardStep()` 转到上一步：

```php
use function Pest\Livewire\livewire;

it('moves to next wizard step', function () {
    livewire(CreatePost::class)
        ->goToPreviousWizardStep()
        ->assertHasFormErrors(['title']);
});
```

如果你想转到特定步骤，请使用 `goToWizardStep()`，然后使用 `assertWizardCurrentStep` 方法，该方法可以确保你在所需的步骤上，而不会出现来自上一步的验证错误：

```php
use function Pest\Livewire\livewire;

it('moves to the wizards second step', function () {
    livewire(CreatePost::class)
        ->goToWizardStep(2)
        ->assertWizardCurrentStep(2);
});
```

如果你在单个 Livewire 组件上有多个 schema，任何向导测试助手都可以接受 `schema` 参数：

```php
use function Pest\Livewire\livewire;

it('moves to next wizard step only for fooForm', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep(schema: 'fooForm')
        ->assertHasFormErrors(['title'], schema: 'fooForm');
});
```
