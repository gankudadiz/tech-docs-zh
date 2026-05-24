---
title: 测试资源
---

## 用户认证

确保你在 `TestCase` 中已通过认证以访问应用：

```php
use App\Models\User;

protected function setUp(): void
{
    parent::setUp();

    $this->actingAs(User::factory()->create());
}
```

或者，如果你使用 Pest，可以在测试文件顶部使用 `beforeEach()` 函数进行认证：

```php
use App\Models\User;

beforeEach(function () {
    $user = User::factory()->create();

    actingAs($user);
});
```

## 测试资源列表页面

要测试列表页面是否能够加载，将列表页面作为 Livewire 组件进行测试，并调用 `assertOk()` 以确保 HTTP 响应为 200 OK。你还可以使用 `assertCanSeeTableRecords()` 方法检查记录是否正在表格中显示：

```php
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;

it('can load the page', function () {
    $users = User::factory()->count(5)->create();

    livewire(ListUsers::class)
        ->assertOk()
        ->assertCanSeeTableRecords($users);
});
```

要测试列表页面上的表格，请访问[测试表格](testing-tables)部分。要测试页面头部的任何操作或表格中的操作，请访问[测试操作](testing-actions)部分。以下是你可以在列表页面上运行的其他一些常见测试示例。

要[测试表格搜索是否正常工作](testing-tables#测试列是否可搜索)，你可以使用 `searchTable()` 方法搜索特定记录。你还可以使用 `assertCanSeeTableRecords()` 和 `assertCanNotSeeTableRecords()` 方法检查正确的记录是否正在表格中显示：

```php
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;

it('can search users by `name` or `email`', function () {
    $users = User::factory()->count(5)->create();

    livewire(ListUsers::class)
        ->assertCanSeeTableRecords($users)
        ->searchTable($users->first()->name)
        ->assertCanSeeTableRecords($users->take(1))
        ->assertCanNotSeeTableRecords($users->skip(1))
        ->searchTable($users->last()->email)
        ->assertCanSeeTableRecords($users->take(-1))
        ->assertCanNotSeeTableRecords($users->take($users->count() - 1));
});
```

要[测试表格排序是否正常工作](testing-tables#测试列是否可排序)，你可以使用 `sortTable()` 方法按特定列对表格进行排序。你还可以使用 `assertCanSeeTableRecords()` 方法检查记录是否以正确的顺序显示：

```php
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;

it('can sort users by `name`', function () {
    $users = User::factory()->count(5)->create();

    livewire(ListUsers::class)
        ->assertCanSeeTableRecords($users)
        ->sortTable('name')
        ->assertCanSeeTableRecords($users->sortBy('name'), inOrder: true)
        ->sortTable('name', 'desc')
        ->assertCanSeeTableRecords($users->sortByDesc('name'), inOrder: true);
});
```

要[测试表格过滤是否正常工作](testing-tables#测试过滤器)，你可以使用 `filterTable()` 方法按特定列过滤表格。你还可以使用 `assertCanSeeTableRecords()` 和 `assertCanNotSeeTableRecords()` 方法检查正确的记录是否正在表格中显示：

```php
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;

it('can filter users by `locale`', function () {
    $users = User::factory()->count(5)->create();

    livewire(ListUsers::class)
        ->assertCanSeeTableRecords($users)
        ->filterTable('locale', $users->first()->locale)
        ->assertCanSeeTableRecords($users->where('locale', $users->first()->locale))
        ->assertCanNotSeeTableRecords($users->where('locale', '!=', $users->first()->locale));
});
```

要[测试表格批量操作是否正常工作](testing-actions#测试表格批量操作)，你可以使用 `selectTableRecords()` 方法在表格中选择多个记录。你还可以使用 `callAction()` 方法对选定的记录调用特定操作：

```php
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use Filament\Actions\Testing\TestAction;
use function Pest\Laravel\assertDatabaseMissing;

it('can bulk delete users', function () {
    $users = User::factory()->count(5)->create();

    livewire(ListUsers::class)
        ->assertCanSeeTableRecords($users)
        ->selectTableRecords($users)
        ->callAction(TestAction::make(DeleteBulkAction::class)->table()->bulk())
        ->assertNotified()
        ->assertCanNotSeeTableRecords($users);

    $users->each(fn (User $user) => assertDatabaseMissing($user));
});
```

## 测试资源创建页面

要测试创建页面是否能够加载，将创建页面作为 Livewire 组件进行测试，并调用 `assertOk()` 以确保 HTTP 响应为 200 OK：

```php
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Models\User;

it('can load the page', function () {
    livewire(CreateUser::class)
        ->assertOk();
});
```

要测试创建页面上的表单，请访问[测试 schema](testing-schemas)部分。要测试页面头部或表单中的任何操作，请访问[测试操作](testing-actions)部分。以下是你可以在创建页面上运行的其他一些常见测试示例。

要测试表单是否正确创建记录，你可以使用 `fillForm()` 方法填写表单字段，然后使用 `call('create')` 方法创建记录。你还可以使用 `assertNotified()` 方法检查是否显示了通知，以及使用 `assertRedirect()` 方法检查用户是否被重定向到另一个页面：

```php
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Models\User;
use function Pest\Laravel\assertDatabaseHas;

it('can create a user', function () {
    $newUserData = User::factory()->make();

    livewire(CreateUser::class)
        ->fillForm([
            'name' => $newUserData->name,
            'email' => $newUserData->email,
        ])
        ->call('create')
        ->assertNotified()
        ->assertRedirect();

    assertDatabaseHas(User::class, [
        'name' => $newUserData->name,
        'email' => $newUserData->email,
    ]);
});
```

要测试表单是否正确验证，你可以使用 `fillForm()` 方法填写表单字段，然后使用 `call('create')` 方法创建记录。你还可以使用 `assertHasFormErrors()` 方法检查表单是否有错误，以及使用 `assertNotNotified()` 方法检查是否没有显示通知。你还可以使用 `assertNoRedirect()` 方法检查用户是否没有被重定向到另一个页面。在此示例中，我们使用 [Pest 数据集](https://pestphp.com/docs/datasets#content-bound-datasets)来测试多个规则，而无需重复测试代码：

```php
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Models\User;
use Illuminate\Support\Str;

it('validates the form data', function (array $data, array $errors) {
    $newUserData = User::factory()->make();

    livewire(CreateUser::class)
        ->fillForm([
            'name' => $newUserData->name,
            'email' => $newUserData->email,
            ...$data,
        ])
        ->call('create')
        ->assertHasFormErrors($errors)
        ->assertNotNotified()
        ->assertNoRedirect();
})->with([
    '`name` is required' => [['name' => null], ['name' => 'required']],
    '`name` is max 255 characters' => [['name' => Str::random(256)], ['name' => 'max']],
    '`email` is a valid email address' => [['email' => Str::random()], ['email' => 'email']],
    '`email` is required' => [['email' => null], ['email' => 'required']],
    '`email` is max 255 characters' => [['email' => Str::random(256)], ['email' => 'max']],
]);
```

## 测试资源编辑页面

要测试编辑页面是否能够加载，将编辑页面作为 Livewire 组件进行测试，并调用 `assertOk()` 以确保 HTTP 响应为 200 OK。你还可以使用 `assertSchemaStateSet()` 方法检查表单字段是否设置为正确的值：

```php
use App\Filament\Resources\Users\Pages\EditUser;
use App\Models\User;

it('can load the page', function () {
    $user = User::factory()->create();

    livewire(EditUser::class, [
        'record' => $user->id,
    ])
        ->assertOk()
        ->assertSchemaStateSet([
            'name' => $user->name,
            'email' => $user->email,
        ]);
});
```

要测试编辑页面上的表单，请访问[测试 schema](testing-schemas)部分。要测试页面头部或表单中的任何操作，请访问[测试操作](testing-actions)部分。以下是你可以在编辑页面上运行的其他一些常见测试示例。

```php
use App\Filament\Resources\Users\Pages\EditUser;
use App\Models\User;
use function Pest\Laravel\assertDatabaseHas;

it('can update a user', function () {
    $user = User::factory()->create();

    $newUserData = User::factory()->make();

    livewire(EditUser::class, [
        'record' => $user->id,
    ])
        ->fillForm([
            'name' => $newUserData->name,
            'email' => $newUserData->email,
        ])
        ->call('save')
        ->assertNotified();

    assertDatabaseHas(User::class, [
        'id' => $user->id,
        'name' => $newUserData->name,
        'email' => $newUserData->email,
    ]);
});
```

要测试表单是否正确验证，你可以使用 `fillForm()` 方法填写表单字段，然后使用 `call('save')` 方法保存记录。你还可以使用 `assertHasFormErrors()` 方法检查表单是否有错误，以及使用 `assertNotNotified()` 方法检查是否没有显示通知。在此示例中，我们使用 [Pest 数据集](https://pestphp.com/docs/datasets#content-bound-datasets)来测试多个规则，而无需重复测试代码：

```php
use App\Filament\Resources\Users\Pages\EditUser;
use App\Models\User;
use Illuminate\Support\Str;

it('validates the form data', function (array $data, array $errors) {
    $user = User::factory()->create();

    $newUserData = User::factory()->make();

    livewire(EditUser::class, [
        'record' => $user->id,
    ])
        ->fillForm([
            'name' => $newUserData->name,
            'email' => $newUserData->email,
            ...$data,
        ])
        ->call('save')
        ->assertHasFormErrors($errors)
        ->assertNotNotified();
})->with([
    '`name` is required' => [['name' => null], ['name' => 'required']],
    '`name` is max 255 characters' => [['name' => Str::random(256)], ['name' => 'max']],
    '`email` is a valid email address' => [['email' => Str::random()], ['email' => 'email']],
    '`email` is required' => [['email' => null], ['email' => 'required']],
    '`email` is max 255 characters' => [['email' => Str::random(256)], ['email' => 'max']],
]);
```

要[测试操作是否正常工作](testing-actions)，例如 `DeleteAction`，你可以使用 `callAction()` 方法调用删除操作。你还可以使用 `assertNotified()` 方法检查是否显示了通知，以及使用 `assertRedirect()` 方法检查用户是否被重定向到另一个页面：

```php
use App\Filament\Resources\Users\Pages\EditUser;
use App\Models\User;
use Filament\Actions\DeleteAction;
use function Pest\Laravel\assertDatabaseMissing;

it('can delete a user', function () {
    $user = User::factory()->create();

    livewire(EditUser::class, [
        'record' => $user->id,
    ])
        ->callAction(DeleteAction::class)
        ->assertNotified()
        ->assertRedirect();

    assertDatabaseMissing($user);
});
```

## 测试资源查看页面

要测试查看页面是否能够加载，将查看页面作为 Livewire 组件进行测试，并调用 `assertOk()` 以确保 HTTP 响应为 200 OK。你还可以使用 `assertSchemaStateSet()` 方法检查信息列表条目是否设置为正确的值：

```php
use App\Filament\Resources\Users\Pages\ViewUser;
use App\Models\User;

it('can load the page', function () {
    $user = User::factory()->create();

    livewire(ViewUser::class, [
        'record' => $user->id,
    ])
        ->assertOk()
        ->assertSchemaStateSet([
            'name' => $user->name,
            'email' => $user->email,
        ]);
});
```

要测试查看页面上的信息列表，请访问[测试 schema](testing-schemas)部分。要测试页面头部或信息列表中的任何操作，请访问[测试操作](testing-actions)部分。

## 测试关联管理器

要测试关联管理器是否在页面上渲染，例如资源的编辑页面，你可以使用 `assertSeeLivewire()` 方法检查关联管理器是否正在渲染：

```php
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\RelationManagers\PostsRelationManager;
use App\Models\User;

it('can load the relation manager', function () {
    $user = User::factory()->create();

    livewire(EditUser::class, [
        'record' => $user->id,
    ])
        ->assertSeeLivewire(PostsRelationManager::class);
});
```

由于关联管理器是 Livewire 组件，你也可以测试关联管理器本身的功能，例如它是否能够成功加载并返回 200 OK 响应，以及表格中是否有正确的记录。在测试关联管理器时，你需要传入 `ownerRecord`（即你所在资源的记录）和 `pageClass`（即你所在页面的类）：

```php
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\RelationManagers\PostsRelationManager;
use App\Models\Post;
use App\Models\User;

it('can load the relation manager', function () {
    $user = User::factory()
        ->has(Post::factory()->count(5))
        ->create();

    livewire(PostsRelationManager::class, [
        'ownerRecord' => $user,
        'pageClass' => EditUser::class,
    ])
        ->assertOk()
        ->assertCanSeeTableRecords($user->posts);
});
```

你可以像在资源列表页面上一样[测试搜索](testing-tables#测试列是否可搜索)、[排序](testing-tables#测试列是否可排序)和[过滤](testing-tables#测试过滤器)。

你也可以[测试操作](testing-actions)，例如表格头部的 `CreateAction`：

```php
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\RelationManagers\PostsRelationManager;
use App\Models\Post;
use App\Models\User;
use Filament\Actions\Testing\TestAction;
use function Pest\Laravel\assertDatabaseHas;

it('can create a post', function () {
    $user = User::factory()->create();

    $newPostData = Post::factory()->make();

    livewire(PostsRelationManager::class, [
        'ownerRecord' => $user,
        'pageClass' => EditUser::class,
    ])
        ->callAction(TestAction::make(CreateAction::class)->table(), [
            'title' => $newPostData->title,
            'content' => $newPostData->content,
        ])
        ->assertNotified();

    assertDatabaseHas(Post::class, [
        'title' => $newPostData->title,
        'content' => $newPostData->content,
        'user_id' => $user->id,
    ]);
});
```

## 测试创建/编辑页面的 `getFormActions()`

在测试资源页面上 `getFormActions()` 中的操作时，使用 `schemaComponent()` 方法并指定 `content` schema 中的 `form-actions` 键。例如，如果你的 `CreateUser` 页面的 `getFormActions()` 方法中有自定义的 `Action::make('createAndVerifyEmail')` 操作，可以这样测试：

```php
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Models\User;
use Filament\Actions\Testing\TestAction;

it('can create a user and verify their email address', function () {
    livewire(CreateUser::class)
        ->fillForm([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ])
        ->callAction(TestAction::make('createAndVerifyEmail')->schemaComponent('form-actions', schema: 'content'));

    expect(User::query()->where('email', 'test@example.com')->first())
        ->hasVerifiedEmail()->toBeTrue();
});
```

## 测试多个面板

如果你有多个面板，并且想要测试非默认面板，你需要告诉 Filament 你正在测试哪个面板。这可以在测试用例的 `setUp()` 方法中完成，也可以在特定测试的开头完成。Filament 通常在你通过请求访问面板时在中间件中执行此操作，因此如果你的测试中没有像测试 Livewire 组件时那样发出请求，则需要手动设置当前面板：

```php
use Filament\Facades\Filament;

Filament::setCurrentPanel('app'); // 其中 `app` 是你要测试的面板的 ID。
```

## 测试多租户面板

在测试多租户面板中的资源时，你可能需要在设置租户后调用 `Filament::bootCurrentPanel()` 以应用租户作用域和模型事件监听器：

```php
use Filament\Facades\Filament;

$team = Team::factory()->create();

Filament::setTenant($this->team);
Filament::setCurrentPanel('admin');
Filament::bootCurrentPanel();
```
