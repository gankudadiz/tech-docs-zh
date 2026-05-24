---
title: 测试操作
---

## 在测试中调用操作

你可以通过将操作的名称或类传递给 `callAction()` 来调用操作：

```php
use function Pest\Livewire\livewire;

it('can send invoices', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callAction('send');

    expect($invoice->refresh())
        ->isSent()->toBeTrue();
});
```

## 测试表格操作

要测试表格操作，你可以使用 `TestAction` 对象配合 `table()` 方法。此对象接收你想要测试的操作名称，并在你想要使用的任何测试方法中替换操作的名称。例如：

```php
use Filament\Actions\Testing\TestAction;
use function Pest\Livewire\livewire;

$invoice = Invoice::factory()->create();

livewire(ListInvoices::class)
    ->callAction(TestAction::make('send')->table($invoice));

livewire(ListInvoices::class)
    ->assertActionVisible(TestAction::make('send')->table($invoice))

livewire(ListInvoices::class)
    ->assertActionExists(TestAction::make('send')->table($invoice))
```

### 测试表格头部操作

要测试头部操作，你可以使用 `table()` 方法而不传入特定记录：

```php
use Filament\Actions\Testing\TestAction;
use function Pest\Livewire\livewire;

livewire(ListInvoices::class)
    ->callAction(TestAction::make('create')->table());

livewire(ListInvoices::class)
    ->assertActionVisible(TestAction::make('create')->table())

livewire(ListInvoices::class)
    ->assertActionExists(TestAction::make('create')->table())
```

### 测试表格批量操作

要测试批量操作，首先调用 `selectTableRecords()` 并传入你想要选择的记录。然后，使用 `TestAction` 的 `bulk()` 方法来指定你想要测试的操作。例如：

```php
use Filament\Actions\Testing\TestAction;
use function Pest\Livewire\livewire;

$invoices = Invoice::factory()->count(3)->create();

livewire(ListInvoices::class)
    ->selectTableRecords($invoices->pluck('id')->toArray())
    ->callAction(TestAction::make('send')->table()->bulk());

livewire(ListInvoices::class)
    ->assertActionVisible(TestAction::make('send')->table()->bulk())

livewire(ListInvoices::class)
    ->assertActionExists(TestAction::make('send')->table()->bulk())
```

## 测试 schema 中的操作

如果操作属于资源信息列表中某个组件的操作，例如在信息列表条目的 `belowContent()` 方法中，你可以使用 `TestAction` 对象配合 `schemaComponent()` 方法。此对象接收你想要测试的操作名称，并在你想要使用的任何测试方法中替换操作的名称。例如：

```php
use Filament\Actions\Testing\TestAction;
use function Pest\Livewire\livewire;

$invoice = Invoice::factory()->create();

livewire(EditInvoice::class)
    ->callAction(TestAction::make('send')->schemaComponent('customer_id'));

livewire(EditInvoice::class)
    ->assertActionVisible(TestAction::make('send')->schemaComponent('customer_id'))

livewire(EditInvoice::class)
    ->assertActionExists(TestAction::make('send')->schemaComponent('customer_id'))
```

## 测试另一个操作的 schema / 表单内的操作

如果操作属于另一个操作的 `schema()`（或 `form()`）中某个组件的操作，例如在操作模态框的表单字段的 `belowContent()` 方法中，你可以使用 `TestAction` 对象配合 `schemaComponent()` 方法。此对象接收你想要测试的操作名称，并在你想要使用的任何测试方法中替换操作的名称。你应该按顺序传递 `TestAction` 对象数组，例如：

```php
use Filament\Actions\Testing\TestAction;
use function Pest\Livewire\livewire;

$invoice = Invoice::factory()->create();

livewire(ManageInvoices::class)
    ->callAction([
        TestAction::make('view')->table($invoice),
        TestAction::make('send')->schemaComponent('customer.name'),
    ]);
    
livewire(ManageInvoices::class)
    ->assertActionVisible([
        TestAction::make('view')->table($invoice),
        TestAction::make('send')->schemaComponent('customer.name'),
    ]);
    
livewire(ManageInvoices::class)
    ->assertActionExists([
        TestAction::make('view')->table($invoice),
        TestAction::make('send')->schemaComponent('customer.name'),
    ]);
```

## 测试资源的 `getFormActions()`

有关如何测试资源页面 `getFormActions()` 中自定义操作的详细信息，请参阅[测试资源](testing-resources#测试创建编辑页面的-getformactions)文档。

## 测试操作模态框中的表单

要向操作传递数据数组，请使用 `data` 参数：

```php
use function Pest\Livewire\livewire;

it('can send invoices', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callAction('send', data: [
            'email' => $email = fake()->email(),
        ])
        ->assertHasNoFormErrors();

    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($email);
});
```

如果你需要仅设置操作的数据而不立即调用它，可以使用 `fillForm()`：

```php
use function Pest\Livewire\livewire;

it('can send invoices', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountAction('send')
        ->fillForm([
            'email' => $email = fake()->email(),
        ])
});
```

### 测试操作模态框表单中的验证错误

`assertHasNoFormErrors()` 用于断言在提交操作表单时没有发生验证错误。

要检查数据是否发生验证错误，请使用 `assertHasFormErrors()`，类似于 Livewire 中的 `assertHasErrors()`：

```php
use function Pest\Livewire\livewire;

it('can validate invoice recipient email', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callAction('send', data: [
            'email' => Str::random(),
        ])
        ->assertHasFormErrors(['email' => ['email']]);
});
```

要检查操作是否预填充了数据，你可以使用 `assertSchemaStateSet()` 方法：

```php
use function Pest\Livewire\livewire;

it('can send invoices to the primary contact by default', function () {
    $invoice = Invoice::factory()->create();
    $recipientEmail = $invoice->company->primaryContact->email;

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountAction('send')
        ->assertSchemaStateSet([
            'email' => $recipientEmail,
        ])
        ->callMountedAction()
        ->assertHasNoFormErrors();

    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($recipientEmail);
});
```

## 测试操作模态框的内容

要断言模态框的内容，你应该首先挂载操作（而不是调用它，因为调用会关闭模态框）。然后你可以使用 `assertMountedActionModalSee()`、`assertMountedActionModalDontSee()`、`assertMountedActionModalSeeHtml()` 或 `assertMountedActionModalDontSeeHtml()` 来断言模态框包含你期望的内容：

```php
use function Pest\Livewire\livewire;

it('confirms the target address before sending', function () {
    $invoice = Invoice::factory()->create();
    $recipientEmail = $invoice->company->primaryContact->email;

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountAction('send')
        ->assertMountedActionModalSee($recipientEmail);
});
```

## 测试操作的存在性

要确保操作存在或不存在，你可以使用 `assertActionExists()` 或 `assertActionDoesNotExist()` 方法：

```php
use function Pest\Livewire\livewire;

it('can send but not unsend invoices', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionExists('send')
        ->assertActionDoesNotExist('unsend');
});
```

你可以传递一个函数作为额外参数，以断言操作通过了给定的"真值测试"。这对于断言操作具有特定配置非常有用：

```php
use Filament\Actions\Action;
use function Pest\Livewire\livewire;

it('has the correct description', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionExists('send', function (Action $action): bool {
            return $action->getModalDescription() === 'This will send an email to the customer\'s primary address, with the invoice attached as a PDF';
        });
});
```

## 测试操作的可见性

要确保操作对用户隐藏或可见，你可以使用 `assertActionHidden()` 或 `assertActionVisible()` 方法：

```php
use function Pest\Livewire\livewire;

it('can only print invoices', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHidden('send')
        ->assertActionVisible('print');
});
```

## 测试禁用的操作

要确保操作对用户启用或禁用，你可以使用 `assertActionEnabled()` 或 `assertActionDisabled()` 方法：

```php
use function Pest\Livewire\livewire;

it('can only print a sent invoice', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionDisabled('send')
        ->assertActionEnabled('print');
});
```

要确保操作集以正确的顺序存在，你可以使用 `assertActionListInOrder()`：

```php
use function Pest\Livewire\livewire;

it('can have actions in order', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionListInOrder(['send', 'export']);
});
```

要检查操作是否对用户隐藏，你可以使用 `assertActionHidden()` 方法：

```php
use function Pest\Livewire\livewire;

it('can not send invoices', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHidden('send');
});
```

## 测试操作的标签

要确保操作具有正确的标签，你可以使用 `assertActionHasLabel()` 和 `assertActionDoesNotHaveLabel()`：

```php
use function Pest\Livewire\livewire;

it('send action has correct label', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHasLabel('send', 'Email Invoice')
        ->assertActionDoesNotHaveLabel('send', 'Send');
});
```

## 测试操作的图标

要确保操作的按钮显示正确的图标，你可以使用 `assertActionHasIcon()` 或 `assertActionDoesNotHaveIcon()`：

```php
use function Pest\Livewire\livewire;

it('when enabled the send button has correct icon', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionEnabled('send')
        ->assertActionHasIcon('send', 'envelope-open')
        ->assertActionDoesNotHaveIcon('send', 'envelope');
});
```

## 测试操作的颜色

要确保操作的按钮显示正确的颜色，你可以使用 `assertActionHasColor()` 或 `assertActionDoesNotHaveColor()`：

```php
use function Pest\Livewire\livewire;

it('actions display proper colors', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHasColor('delete', 'danger')
        ->assertActionDoesNotHaveColor('print', 'danger');
});
```

## 测试操作的 URL

要确保操作具有正确的 URL，你可以使用 `assertActionHasUrl()`、`assertActionDoesNotHaveUrl()`、`assertActionShouldOpenUrlInNewTab()` 和 `assertActionShouldNotOpenUrlInNewTab()`：

```php
use function Pest\Livewire\livewire;

it('links to the correct Filament sites', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHasUrl('filament', 'https://filamentphp.com/')
        ->assertActionDoesNotHaveUrl('filament', 'https://github.com/filamentphp/filament')
        ->assertActionShouldOpenUrlInNewTab('filament')
        ->assertActionShouldNotOpenUrlInNewTab('github');
});
```

## 测试操作参数

要测试操作参数，你可以使用 `TestAction` 对象配合 `arguments()` 方法。此对象接收你想要测试的操作名称，并在你想要使用的任何测试方法中替换操作的名称。例如：

```php
use Filament\Actions\Testing\TestAction;
use function Pest\Livewire\livewire;

$invoice = Invoice::factory()->create();

livewire(ManageInvoices::class)
    ->callAction(TestAction::make('send')->arguments(['invoice' => $invoice->getKey()]));

livewire(ManageInvoices::class)
    ->assertActionVisible(TestAction::make('send')->arguments(['invoice' => $invoice->getKey()]))

livewire(ManageInvoices::class)
    ->assertActionExists(TestAction::make('send')->arguments(['invoice' => $invoice->getKey()]))
```

## 测试操作是否被中止

要检查操作是否被中止，你可以使用 `assertActionHalted()`：

```php
use function Pest\Livewire\livewire;

it('stops sending if invoice has no email address', function () {
    $invoice = Invoice::factory(['email' => null])->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callAction('send')
        ->assertActionHalted('send');
});
```

## 在测试中使用操作类名

Filament 包含许多预构建的操作，如 `CreateAction`、`EditAction` 和 `DeleteAction`，你可以在测试中使用这些类名代替操作名称，例如：

```php
use Filament\Actions\CreateAction;
use function Pest\Livewire\livewire;

livewire(ManageInvoices::class)
    ->callAction(CreateAction::class)
```

如果你的应用中有自己的操作类，并且包含 `make()` 方法，Filament 无法发现你的操作名称，除非它运行 `make()` 方法，这并不高效。要在测试中使用你自己的操作类名，你可以在操作类上添加 `#[ActionName]` 属性，Filament 可以使用它来发现你的操作名称。传递给 `#[ActionName]` 属性的名称应该与你在测试中通常使用的操作名称相同。例如：

```php
use Filament\Actions\Action;
use Filament\Actions\ActionName;

#[ActionName('send')]
class SendInvoiceAction
{
    public static function make(): Action
    {
        return Action::make('send')
            ->requiresConfirmation()
            ->action(function () {
                // ...
            });
    }
}
```

现在，你可以在测试中使用类名：

```php
use App\Filament\Resources\Invoices\Actions\SendInvoiceAction;
use Filament\Actions\Testing\TestAction;
use function Pest\Livewire\livewire;

$invoice = Invoice::factory()->create();

livewire(ManageInvoices::class)
    ->callAction(TestAction::make(SendInvoiceAction::class)->table($invoice);
```

如果你有一个扩展 `Action` 类的操作类，你可以添加一个 `getDefaultName()` 静态方法，该方法将用于发现操作的名称。它还允许用户在实例化时省略 `make()` 方法中的操作名称。例如：

```php
use Filament\Actions\Action;

class SendInvoiceAction extends Action
{
    public static function getDefaultName(): string
    {
        return 'send';
    }

    protected function setUp(): void
    {
        parent::setUp();
        
        $this
            ->requiresConfirmation()
            ->action(function () {
                // ...
            });
    }
}
```
