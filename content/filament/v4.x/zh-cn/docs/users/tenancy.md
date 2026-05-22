---
title: 多租户
---

## 简介

多租户是应用的单个实例为多个客户提供服务的概念。每个客户都有自己的数据和访问规则，防止他们查看或修改彼此的数据。这是 SaaS 应用中的常见模式。用户通常属于用户组（通常称为团队或组织）。记录由组拥有，用户可以是多个组的成员。这适用于用户需要在数据上协作的应用。

多租户是一个非常敏感的话题。了解多租户的安全影响以及如何正确实现它非常重要。如果部分或不正确地实现，属于一个租户的数据可能会暴露给另一个租户。Filament 提供了一组工具来帮助你在应用中实现多租户，但你需要了解如何使用它们。

:::warning
Filament 不提供任何关于应用安全性的保证。确保应用安全是你的责任。请参阅[安全](#租户安全)部分了解更多信息。
:::

## 简单的一对多租户

"多租户"一词很广泛，在不同上下文中可能意味着不同的事情。Filament 的租户系统意味着用户属于**多个**租户（*组织、团队、公司等*），并且可以在它们之间切换。

如果你的情况更简单，不需要多对多关系，那么你不需要在 Filament 中设置租户。你可以改用[观察者](https://laravel.com/docs/eloquent#observers)和[全局作用域](https://laravel.com/docs/eloquent#global-scopes)。

假设你有一个数据库列 `users.team_id`，你可以使用[全局作用域](https://laravel.com/docs/eloquent#global-scopes)将所有记录限定为与用户具有相同的 `team_id`：

```php
use Illuminate\Database\Eloquent\Builder;

class Post extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope('team', function (Builder $query) {
            if (auth()->hasUser()) {
                $query->where('team_id', auth()->user()->team_id);
                // or with a `team` relationship defined:
                $query->whereBelongsTo(auth()->user()->team);
            }
        });
    }
}
```

要在创建记录时自动设置 `team_id`，你可以创建一个[观察者](https://laravel.com/docs/eloquent#observers)：

```php
class PostObserver
{
    public function creating(Post $post): void
    {
        if (auth()->hasUser()) {
            $post->team_id = auth()->user()->team_id;
            // or with a `team` relationship defined:
            $post->team()->associate(auth()->user()->team);
        }
    }
}
```

## 设置租户

要设置租户，你需要在[配置](../panel-configuration)中指定"租户"（如团队或组织）模型：

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class);
}
```

你还需要告诉 Filament 用户属于哪些租户。你可以在 `App\Models\User` 模型上实现 `HasTenants` 接口来做到这一点：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection;

class User extends Authenticatable implements FilamentUser, HasTenants
{
    // ...

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }

    public function getTenants(Panel $panel): Collection
    {
        return $this->teams;
    }

    public function canAccessTenant(Model $tenant): bool
    {
        return $this->teams()->whereKey($tenant)->exists();
    }
}
```

在此示例中，用户属于多个团队，因此有一个 `teams()` 关系。`getTenants()` 方法返回用户所属的团队。Filament 使用它来列出用户有权访问的租户。

![带有多租户和租户切换器的面板](/assets/filament/v4.x/screenshots/images/light/panels/tenancy.jpg)

为了安全，你还需要实现 `HasTenants` 接口的 `canAccessTenant()` 方法，以防止用户通过猜测租户 ID 并将其放入 URL 来访问其他租户的数据。

你还会希望用户能够[注册新团队](#添加租户注册页面)。

## 添加租户注册页面

注册页面将允许用户创建新租户。

登录后访问应用时，如果用户还没有租户，将被重定向到此页面。

要设置注册页面，你需要创建一个继承 `Filament\Pages\Tenancy\RegisterTenant` 的新页面类。这是一个全页 Livewire 组件。你可以将其放在任何位置，例如 `app/Filament/Pages/Tenancy/RegisterTeam.php`：

```php
namespace App\Filament\Pages\Tenancy;

use App\Models\Team;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Tenancy\RegisterTenant;
use Filament\Schemas\Schema;

class RegisterTeam extends RegisterTenant
{
    public static function getLabel(): string
    {
        return 'Register team';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name'),
                // ...
            ]);
    }

    protected function handleRegistration(array $data): Team
    {
        $team = Team::create($data);

        $team->members()->attach(auth()->user());

        return $team;
    }
}
```

你可以在 `form()` 方法中添加任何[表单组件](../forms)，并在 `handleRegistration()` 方法中创建团队。

现在，我们需要告诉 Filament 使用这个页面。我们可以在[配置](../panel-configuration)中做到这一点：

```php
use App\Filament\Pages\Tenancy\RegisterTeam;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantRegistration(RegisterTeam::class);
}
```

![租户注册页面](/assets/filament/v4.x/screenshots/images/light/panels/tenancy/registration.jpg)

### 自定义租户注册页面

你可以重写基础注册页面类上的任何方法来使其按你想要的方式工作。甚至 `$view` 属性也可以被重写以使用你选择的自定义视图。

## 添加租户个人资料页面

个人资料页面将允许用户编辑有关租户的信息。

要设置个人资料页面，你需要创建一个继承 `Filament\Pages\Tenancy\EditTenantProfile` 的新页面类。这是一个全页 Livewire 组件。你可以将其放在任何位置，例如 `app/Filament/Pages/Tenancy/EditTeamProfile.php`：

```php
namespace App\Filament\Pages\Tenancy;

use Filament\Forms\Components\TextInput;
use Filament\Pages\Tenancy\EditTenantProfile;
use Filament\Schemas\Schema;

class EditTeamProfile extends EditTenantProfile
{
    public static function getLabel(): string
    {
        return 'Team profile';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name'),
                // ...
            ]);
    }
}
```

你可以在 `form()` 方法中添加任何[表单组件](../forms)。它们将直接保存到租户模型中。

现在，我们需要告诉 Filament 使用这个页面。我们可以在[配置](../panel-configuration)中做到这一点：

```php
use App\Filament\Pages\Tenancy\EditTeamProfile;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantProfile(EditTeamProfile::class);
}
```

![租户个人资料页面](/assets/filament/v4.x/screenshots/images/light/panels/tenancy/profile.jpg)

### 自定义租户个人资料页面

你可以重写基础个人资料页面类上的任何方法来使其按你想要的方式工作。甚至 `$view` 属性也可以被重写以使用你选择的自定义视图。

## 访问当前租户

在应用中的任何位置，你可以使用 `Filament::getTenant()` 访问当前请求的租户模型：

```php
use Filament\Facades\Filament;

$tenant = Filament::getTenant();
```

## 计费

### 使用 Laravel Spark

Filament 提供与 [Laravel Spark](https://spark.laravel.com) 的计费集成。你的用户可以开始订阅并管理其计费信息。

要安装集成，首先[安装 Spark](https://spark.laravel.com/docs/installation) 并为你的租户模型配置它。

现在，你可以使用 Composer 安装 Filament 的 Spark 计费提供者：

```bash
composer require filament/spark-billing-provider
```

在[配置](../panel-configuration)中，将 Spark 设置为 `tenantBillingProvider()`：

```php
use Filament\Billing\Providers\SparkBillingProvider;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantBillingProvider(new SparkBillingProvider());
}
```

现在，一切就绪！用户可以通过点击租户菜单中的链接来管理其计费。

### 要求订阅

要要求订阅才能使用应用的任何部分，你可以使用 `requiresTenantSubscription()` 配置方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->requiresTenantSubscription();
}
```

现在，如果用户没有活跃订阅，将被重定向到计费页面。

#### 为特定资源和页面要求订阅

有时，你可能希望只要求订阅才能访问应用中的某些[资源](../resources/overview)和[自定义页面](../navigation/custom-pages)。你可以通过在资源或页面类的 `isTenantSubscriptionRequired()` 方法中返回 `true` 来做到这一点：

```php
public static function isTenantSubscriptionRequired(Panel $panel): bool
{
    return true;
}
```

如果你使用 `requiresTenantSubscription()` 配置方法，则可以从此方法返回 `false` 作为例外允许访问资源或页面。

### 编写自定义计费集成

计费集成编写起来非常简单。你只需要一个实现 `Filament\Billing\Providers\Contracts\Provider` 接口的类。此接口有两个方法。

`getRouteAction()` 用于获取用户访问计费页面时应运行的路由操作。这可以是回调函数、控制器名称或 Livewire 组件——任何在 Laravel 中正常使用 `Route::get()` 时有效的东西。例如，你可以使用回调函数简单地重定向到你自己的计费页面。

`getSubscribedMiddleware()` 返回用于检查租户是否有活跃订阅的中间件名称。如果租户没有活跃订阅，此中间件应将用户重定向到计费页面。

以下是使用回调函数作为路由操作和中间件作为订阅中间件的示例计费提供者：

```php
use App\Http\Middleware\RedirectIfUserNotSubscribed;
use Filament\Billing\Providers\Contracts\BillingProvider;
use Illuminate\Http\RedirectResponse;

class ExampleBillingProvider implements BillingProvider
{
    public function getRouteAction(): string
    {
        return function (): RedirectResponse {
            return redirect('https://billing.example.com');
        };
    }

    public function getSubscribedMiddleware(): string
    {
        return RedirectIfUserNotSubscribed::class;
    }
}
```

### 自定义计费路由 slug

你可以在[配置](../panel-configuration)中使用 `tenantBillingRouteSlug()` 方法自定义用于计费路由的 URL slug：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantBillingRouteSlug('billing');
}
```

## 自定义租户菜单

租户切换菜单位于管理布局中。它是完全可自定义的。

每个菜单项由一个[操作](../actions)表示，可以用相同的方式自定义。要注册新项，你可以将操作传递给[配置](../panel-configuration)的 `tenantMenuItems()` 方法：

```php
use App\Filament\Pages\Settings;
use Filament\Actions\Action;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            Action::make('settings')
                ->url(fn (): string => Settings::getUrl())
                ->icon('heroicon-m-cog-8-tooth'),
            // ...
        ]);
}
```

### 允许搜索租户

你可以使用[配置](../panel-configuration)中的 `searchableTenantMenu()` 方法允许搜索租户：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->searchableTenantMenu();
}
```

当用户的列表中超过 10 个租户时，此功能会自动启用。你可以使用 `searchableTenantMenu(false)` 禁用它。

### 自定义注册链接

要自定义租户菜单中的[注册](#添加租户注册页面)链接，使用 `register` 数组键注册一个新项，并传递一个[自定义操作](../actions)对象的函数：

```php
use Filament\Actions\Action;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            'register' => fn (Action $action) => $action->label('Register new team'),
            // ...
        ]);
}
```

### 自定义个人资料链接

要自定义租户菜单开头的用户个人资料链接，使用 `profile` 数组键注册一个新项，并传递一个[自定义操作](../actions)对象的函数：

```php
use Filament\Actions\Action;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            'profile' => fn (Action $action) => $action->label('Edit team profile'),
            // ...
        ]);
}
```

### 自定义计费链接

要自定义租户菜单中的计费链接，使用 `profile` 数组键注册一个新项，并传递一个[自定义操作](../actions)对象的函数：

```php
use Filament\Actions\Action;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            'billing' => fn (Action $action) => $action->label('Manage subscription'),
            // ...
        ]);
}
```

### 条件隐藏租户菜单项

你还可以通过使用 `visible()` 或 `hidden()` 方法并传入要检查的条件来条件隐藏租户菜单项。传递函数会将条件求值延迟到菜单实际渲染时：

```php
use Filament\Actions\Action;

Action::make('settings')
    ->visible(fn (): bool => auth()->user()->can('manage-team'))
    // or
    ->hidden(fn (): bool => ! auth()->user()->can('manage-team'))
```

### 从租户菜单项发送 `POST` HTTP 请求

你可以通过向 `url()` 方法传递 URL 并使用 `postToUrl()` 从租户菜单项发送 `POST` HTTP 请求：

```php
use Filament\Actions\Action;

Action::make('lockSession')
    ->url(fn (): string => route('lock-session'))
    ->postToUrl()
```

### 禁用租户切换器

默认情况下，用户可以使用租户菜单在租户之间切换。如果你想保持租户菜单可见但防止用户切换租户，可以在[配置](../panel-configuration)中使用 `tenantSwitcher()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantSwitcher(false);
}
```

这保持租户菜单可见，显示当前租户名称和任何自定义菜单项，但隐藏其他租户的列表。当你想显示租户信息而不允许切换，或者切换应通过其他方式控制时，这很有用。

### 隐藏租户菜单

你可以使用 `tenantMenu(false)` 隐藏租户菜单

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenu(false);
}
```

但是，这表明 Filament 的租户功能不适合你的项目。如果每个用户只属于一个租户，你应该坚持使用[简单的一对多租户](#简单的一对多租户)。

## 设置头像

开箱即用，Filament 使用 [ui-avatars.com](https://ui-avatars.com) 根据用户名生成头像。但是，如果你的用户模型有 `avatar_url` 属性，则会改用该属性。要自定义 Filament 获取用户头像 URL 的方式，你可以实现 `HasAvatar` contract：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Illuminate\Database\Eloquent\Model;

class Team extends Model implements HasAvatar
{
    // ...

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }
}
```

`getFilamentAvatarUrl()` 方法用于获取当前用户的头像。如果此方法返回 `null`，Filament 将回退到 [ui-avatars.com](https://ui-avatars.com)。

你可以通过创建新的头像提供者轻松替换 [ui-avatars.com](https://ui-avatars.com) 为其他服务。[你可以在这里了解如何操作。](overview#using-a-different-avatar-provider)

## 配置租户关系

在创建和列出与租户关联的记录时，Filament 需要访问每个资源的两个 Eloquent 关系——在资源模型类上定义的"所有权"关系，以及在租户模型类上的关系。默认情况下，Filament 将根据标准 Laravel 约定尝试猜测这些关系的名称。例如，如果租户模型是 `App\Models\Team`，它将在资源模型类上查找 `team()` 关系。如果资源模型类是 `App\Models\Post`，它将在租户模型类上查找 `posts()` 关系。

### 自定义所有权关系名称

你可以使用 `tenant()` 配置方法的 `ownershipRelationship` 参数一次自定义所有资源使用的 ownership 关系名称。在此示例中，资源模型类定义了 `owner` 关系：

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, ownershipRelationship: 'owner');
}
```

或者，你可以在资源类上设置 `$tenantOwnershipRelationshipName` 静态属性，然后可用于自定义仅用于该资源的所有权关系名称。在此示例中，`Post` 模型类定义了 `owner` 关系：

```php
use Filament\Resources\Resource;

class PostResource extends Resource
{
    protected static ?string $tenantOwnershipRelationshipName = 'owner';

    // ...
}
```

### 自定义资源关系名称

你可以在资源类上设置 `$tenantRelationshipName` 静态属性，然后可用于自定义用于获取该资源的关系名称。在此示例中，租户模型类定义了 `blogPosts` 关系：

```php
use Filament\Resources\Resource;

class PostResource extends Resource
{
    protected static ?string $tenantRelationshipName = 'blogPosts';

    // ...
}
```

## 配置 slug 属性

使用像团队这样的租户时，你可能希望在 URL 中添加 slug 字段而不是团队的 ID。你可以使用 `tenant()` 配置方法的 `slugAttribute` 参数来做到这一点：

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, slugAttribute: 'slug');
}
```

## 配置名称属性

默认情况下，Filament 会使用租户的 `name` 属性在应用中显示其名称。要更改此设置，你可以实现 `HasName` contract：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\HasName;
use Illuminate\Database\Eloquent\Model;

class Team extends Model implements HasName
{
    // ...

    public function getFilamentName(): string
    {
        return "{$this->name} {$this->subscription_plan}";
    }
}
```

`getFilamentName()` 方法用于获取当前用户的名称。

## 设置当前租户标签

在租户切换器中，你可能希望在当前团队名称上方添加一个小标签，如"活跃团队"。你可以通过在租户模型上实现 `HasCurrentTenantLabel` 方法来做到这一点：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\HasCurrentTenantLabel;
use Illuminate\Database\Eloquent\Model;

class Team extends Model implements HasCurrentTenantLabel
{
    // ...

    public function getCurrentTenantLabel(): string
    {
        return 'Active team';
    }
}
```

## 设置默认租户

登录时，Filament 会将用户重定向到从 `getTenants()` 方法返回的第一个租户。

有时，你可能希望更改此行为。例如，你可能存储了上次活跃的团队，并将用户重定向到该团队。

要自定义此行为，你可以在用户上实现 `HasDefaultTenant` contract：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasDefaultTenant;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Model implements FilamentUser, HasDefaultTenant, HasTenants
{
    // ...

    public function getDefaultTenant(Panel $panel): ?Model
    {
        return $this->latestTeam;
    }

    public function latestTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'latest_team_id');
    }
}
```

## 为租户感知路由应用中间件

你可以通过在[面板配置文件](../panel-configuration)中将中间件类数组传递给 `tenantMiddleware()` 方法来为所有租户感知路由应用额外的中间件：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMiddleware([
            // ...
        ]);
}
```

默认情况下，中间件将在页面首次加载时运行，但在后续的 Livewire AJAX 请求中不会运行。如果你想在每个请求上运行中间件，可以通过将 `true` 作为第二个参数传递给 `tenantMiddleware()` 方法使其持久化：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMiddleware([
            // ...
        ], isPersistent: true);
}
```

## 添加租户路由前缀

默认情况下，URL 结构将租户 ID 或 slug 放在面板路径之后。如果你想在其前面添加另一个 URL 段，请使用 `tenantRoutePrefix()` 方法：

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->path('admin')
        ->tenant(Team::class)
        ->tenantRoutePrefix('team');
}
```

之前，租户 1 的 URL 结构是 `/admin/1`。现在，它是 `/admin/team/1`。

## 使用域来标识租户

使用租户时，你可能希望使用域或子域路由，如 `team1.example.com/posts`，而不是路由前缀如 `/team1/posts`。你可以使用 `tenantDomain()` 方法以及 `tenant()` 配置方法来做到这一点。`tenant` 参数对应于租户模型的 slug 属性：

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, slugAttribute: 'slug')
        ->tenantDomain('{tenant:slug}.example.com');
}
```

在上面的示例中，租户位于主应用域的子域上。你也可以设置系统从租户解析整个域：

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, slugAttribute: 'domain')
        ->tenantDomain('{tenant:domain}');
}
```

在此示例中，`domain` 属性应包含有效的域主机，如 `example.com` 或 `subdomain.example.com`。

:::info
当使用整个域的参数（`tenantDomain('{tenant:domain}')`）时，Filament 将为应用程序中所有 `tenant` 参数注册一个[全局路由参数模式](https://laravel.com/docs/routing#parameters-global-constraints)，即 `[a-z0-9.\-]+`。这是因为 Laravel 默认不允许路由参数中出现 `.` 字符。这可能与使用租户的其他面板或应用程序中使用 `tenant` 路由参数的其他部分冲突。
:::

## 为资源禁用租户

默认情况下，具有租户的面板中的所有资源都将限定到当前租户。如果你有在租户之间共享的资源，可以通过在资源类上将 `$isScopedToTenant` 静态属性设置为 `false` 来为其禁用租户：

```php
protected static bool $isScopedToTenant = false;
```

### 为所有资源禁用租户

如果你希望为每个资源选择启用租户而不是选择退出，可以在服务提供者的 `boot()` 方法或中间件中调用 `Resource::scopeToTenant(false)`：

```php
use Filament\Resources\Resource;

Resource::scopeToTenant(false);
```

现在，你可以通过在资源类上将 `$isScopedToTenant` 静态属性设置为 `true` 来为每个资源选择启用租户：

```php
protected static bool $isScopedToTenant = true;
```

## 租户安全

了解多租户的安全影响以及如何正确实现它非常重要。如果部分或不正确地实现，属于一个租户的数据可能会暴露给另一个租户。Filament 提供了一组工具来帮助你在应用中实现多租户，但你需要了解如何使用它们。Filament 不提供任何关于应用安全性的保证。确保应用安全是你的责任。

以下是 Filament 提供的帮助你在应用中实现多租户的功能列表：

- 对属于启用租户的面板的[租户感知](#为资源禁用租户)资源自动全局作用域 Eloquent 模型查询。用于获取资源记录的查询会自动限定到当前租户。此查询用于渲染资源的列表表格，也用于在编辑或查看记录时从当前 URL 解析记录。这意味着如果用户尝试查看不属于当前租户的记录，他们将收到 404 错误。
    - 必须在启用租户的面板中存在[租户感知](#为资源禁用租户)资源，才能将全局作用域应用于资源的模型。如果你想限定没有对应资源的模型的查询，必须[使用中间件为该模型应用额外的全局作用域](#使用租户感知中间件应用额外的全局作用域)。
    - 全局作用域在从请求中识别出租户后应用。这发生在面板请求的中间件堆栈期间。如果在识别出租户之前进行查询，例如从堆栈中的早期中间件或在服务提供者中，查询将不会限定到当前租户。为保证中间件在识别当前租户后运行，应将其注册为[租户中间件](#为租户感知路由应用中间件)。
    - 根据上述观点，在启用租户的面板之外进行的查询无法访问当前租户，因此不会被限定。如有疑问，请在部署应用之前检查查询是否正确限定。
    - 如果你需要为特定查询禁用租户全局作用域，可以在查询上使用 `withoutGlobalScope(filament()->getTenancyScopeName())` 方法。
    - 如果你的任何查询禁用了所有全局作用域，租户全局作用域也将被禁用。使用此方法时应小心，因为它可能导致数据泄露。如果你需要禁用除租户全局作用域之外的所有全局作用域，可以使用 `withoutGlobalScopes()` 方法传入你想要禁用的全局作用域数组。

- 自动将新创建的 Eloquent 模型与当前租户关联。当为[租户感知](#为资源禁用租户)资源创建新记录时，租户会自动与记录关联。这意味着记录将属于当前租户，因为外键列会自动设置为租户的 ID。这是通过 Filament 为资源的 Eloquent 模型注册 `creating` 和 `created` 事件的事件监听器来实现的。
    - 必须在启用租户的面板中存在[租户感知](#为资源禁用租户)资源，才能将资源模型的自动关联。如果你想为没有对应资源的模型自动关联，必须[为该模型注册 `creating` 事件的监听器](https://laravel.com/docs/eloquent#events)，并将 `filament()->getTenant()` 与其关联。
    - 事件在从请求中识别出租户后运行。这发生在面板请求的中间件堆栈期间。如果在识别出租户之前创建模型，例如从堆栈中的早期中间件或在服务提供者中，它将不会与当前租户关联。为保证中间件在识别当前租户后运行，应将其注册为[租户中间件](#为租户感知路由应用中间件)。
    - 根据上述观点，在启用租户的面板之外创建的模型无法访问当前租户，因此不会被关联。如有疑问，请在部署应用之前检查模型是否正确关联。
    - 如果你需要为特定模型禁用自动关联，可以在创建时[暂时静默事件](https://laravel.com/docs/eloquent#muting-events)。如果你的代码目前这样做或永久移除了事件监听器，应检查这是否影响了租户功能。

### `unique` 和 `exists` 验证

Laravel 的 `unique` 和 `exists` 验证规则默认不使用 Eloquent 模型查询数据库，因此不会使用模型上定义的任何全局作用域，包括多租户。因此，即使在不同租户中存在具有相同值的软删除记录，验证也会失败。

如果你希望两个租户有完全的数据分离，应改用 `scopedUnique()` 或 `scopedExists()` 方法，它们使用模型查询数据库替换 Laravel 的 `unique` 和 `exists` 实现，应用模型上定义的任何全局作用域，包括多租户：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('email')
    ->scopedUnique()
    // or
    ->scopedExists()
```

有关更多信息，请参阅 [`unique()`](../forms/validation#unique) 和 [`exists()`](../forms/validation#exists) 的[验证文档](../forms/validation)。

### 使用租户感知中间件应用额外的全局作用域

由于只有面板中存在的资源的模型才会自动限定到当前租户，在面板中使用其他 Eloquent 模型时应用额外的租户限定可能很有用。这将允许你忘记将查询限定到当前租户，而是自动应用限定。为此，你可以创建一个新的中间件类，如 `ApplyTenantScopes`：

```bash
php artisan make:middleware ApplyTenantScopes
```

在 `handle()` 方法中，你可以应用任何你希望的全局作用域：

```php
use App\Models\Author;
use Closure;
use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ApplyTenantScopes
{
    public function handle(Request $request, Closure $next)
    {
        Author::addGlobalScope(
            'tenant',
            fn (Builder $query) => $query->whereBelongsTo(Filament::getTenant()),
        );

        return $next($request);
    }
}
```

你现在可以[注册此中间件](#为租户感知路由应用中间件)用于所有租户感知路由，并通过使其持久化确保在所有 Livewire AJAX 请求中使用：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMiddleware([
            ApplyTenantScopes::class,
        ], isPersistent: true);
}
```
