---
title: 概述
---

## 简介

默认情况下，所有 `App\Models\User` 都可以在本地访问 Filament。要允许他们在生产环境中访问 Filament，你必须采取一些额外的步骤来确保只有正确的用户才能访问应用。

![默认登录页面](/assets/filament/v4.x/screenshots/images/light/panels/login.jpg)

## 授权访问面板

要设置你的 `App\Models\User` 在非本地环境中访问 Filament，你必须实现 `FilamentUser` contract：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser
{
    // ...

    public function canAccessPanel(Panel $panel): bool
    {
        return str_ends_with($this->email, '@yourdomain.com') && $this->hasVerifiedEmail();
    }
}
```

`canAccessPanel()` 方法根据用户是否被允许访问 `$panel` 返回 `true` 或 `false`。在此示例中，我们检查用户的电子邮件是否以 `@yourdomain.com` 结尾，以及他们是否已验证了电子邮件地址。

由于你可以访问当前的 `$panel`，你可以为不同的面板编写条件检查。例如，只限制访问管理面板，同时允许所有用户访问你应用的其他面板：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser
{
    // ...

    public function canAccessPanel(Panel $panel): bool
    {
        if ($panel->getId() === 'admin') {
            return str_ends_with($this->email, '@yourdomain.com') && $this->hasVerifiedEmail();
        }

        return true;
    }
}
```

## 授权访问资源

请参阅资源文档中的[授权](../resources/overview#授权)部分，了解如何控制对资源页面及其数据记录的访问。

## 设置用户头像

开箱即用，Filament 使用 [ui-avatars.com](https://ui-avatars.com) 根据用户名生成头像。但是，如果你的用户模型有 `avatar_url` 属性，则会改用该属性。要自定义 Filament 获取用户头像 URL 的方式，你可以实现 `HasAvatar` contract：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasAvatar
{
    // ...

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }
}
```

`getFilamentAvatarUrl()` 方法用于获取当前用户的头像。如果此方法返回 `null`，Filament 将回退到 [ui-avatars.com](https://ui-avatars.com)。

### 使用不同的头像提供者

你可以通过创建新的头像提供者轻松替换 [ui-avatars.com](https://ui-avatars.com) 为其他服务。

在此示例中，我们在 `app/Filament/AvatarProviders/BoringAvatarsProvider.php` 创建一个新文件用于 [boringavatars.com](https://boringavatars.com)。`get()` 方法接受一个用户模型实例并返回该用户的头像 URL：

```php
<?php

namespace App\Filament\AvatarProviders;

use Filament\AvatarProviders\Contracts;
use Filament\Facades\Filament;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class BoringAvatarsProvider implements Contracts\AvatarProvider
{
    public function get(Model | Authenticatable $record): string
    {
        $name = str(Filament::getNameForDefaultAvatar($record))
            ->trim()
            ->explode(' ')
            ->map(fn (string $segment): string => filled($segment) ? mb_substr($segment, 0, 1) : '')
            ->join(' ');

        return 'https://source.boringavatars.com/beam/120/' . urlencode($name);
    }
}
```

现在，在[配置](../panel-configuration)中注册这个新的头像提供者：

```php
use App\Filament\AvatarProviders\BoringAvatarsProvider;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->defaultAvatarProvider(BoringAvatarsProvider::class);
}
```

## 配置用户的名称属性

默认情况下，Filament 会使用用户的 `name` 属性在应用中显示其名称。要更改此设置，你可以实现 `HasName` contract：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasName
{
    // ...

    public function getFilamentName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
```

`getFilamentName()` 方法用于获取当前用户的名称。

## 认证功能

你可以轻松地在配置文件中为面板启用认证功能：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->login()
        ->registration()
        ->passwordReset()
        ->emailVerification()
        ->emailChangeVerification()
        ->profile();
}
```

![默认注册页面](/assets/filament/v4.x/screenshots/images/light/panels/registration.jpg)

![默认密码重置页面](/assets/filament/v4.x/screenshots/images/light/panels/password-reset.jpg)

![默认个人资料页面](/assets/filament/v4.x/screenshots/images/light/panels/profile.jpg)

Filament 还支持多因素认证，你可以在[多因素认证](multi-factor-authentication)部分了解更多信息。

### 自定义认证功能

如果你想用自己的页面替换这些页面，可以向这些方法传入任何 Filament 页面类。

大多数人可以通过继承 Filament 代码库中的基础页面类、重写 `form()` 等方法，然后将新的页面类传入配置来实现所需的自定义：

```php
use App\Filament\Pages\Auth\EditProfile;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->profile(EditProfile::class);
}
```

在此示例中，我们将自定义个人资料页面。我们需要在 `app/Filament/Pages/Auth/EditProfile.php` 创建一个新的 PHP 类：

```php
<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\EditProfile as BaseEditProfile;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class EditProfile extends BaseEditProfile
{
    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('username')
                    ->required()
                    ->maxLength(255),
                $this->getNameFormComponent(),
                $this->getEmailFormComponent(),
                $this->getPasswordFormComponent(),
                $this->getPasswordConfirmationFormComponent(),
            ]);
    }
}
```

此类继承自 Filament 代码库中的基础个人资料页面类。你可以继承的其他页面类包括：

- `Filament\Auth\Pages\Login`
- `Filament\Auth\Pages\Register`
- `Filament\Auth\Pages\EmailVerification\EmailVerificationPrompt`
- `Filament\Auth\Pages\PasswordReset\RequestPasswordReset`
- `Filament\Auth\Pages\PasswordReset\ResetPassword`

在示例的 `form()` 方法中，我们调用 `getNameFormComponent()` 等方法来获取页面的默认表单组件。你可以根据需要自定义这些组件。有关所有可用的自定义选项，请参阅 Filament 代码库中的基础 `EditProfile` 页面类——它包含所有你可以重写来进行更改的方法。

#### 无需重新定义表单即可自定义认证字段

如果你想自定义认证表单中的字段而无需定义新的 `form()` 方法，可以继承特定的字段方法并链式调用你的自定义：

```php
use Filament\Schemas\Components\Component;

protected function getPasswordFormComponent(): Component
{
    return parent::getPasswordFormComponent()
        ->revealable(false);
}
```

### 电子邮件变更验证

如果你同时使用 `profile()` 功能和 `emailChangeVerification()` 功能，在个人资料表单中更改电子邮件地址的用户将被要求验证其新电子邮件地址后才能使用它登录。这是通过向新地址发送验证邮件来完成的，邮件中包含用户必须点击的链接以验证其新电子邮件地址。数据库中的电子邮件地址在用户点击邮件中的链接之前不会更新。

发送给用户的链接有效期为 60 分钟。在向新地址发送邮件的同时，也会向旧地址发送一封邮件，其中包含阻止更改的链接。这是一个安全功能，可潜在地防止用户受到恶意行为者的影响。

### 在个人资料页面上使用侧边栏

默认情况下，个人资料页面不使用带有侧边栏的标准页面布局。这是为了使其与[多租户](tenancy)功能兼容，否则如果用户没有租户，将无法访问，因为侧边栏链接路由到当前租户。

如果你的面板中没有使用[多租户](tenancy)，并且希望个人资料页面使用带有侧边栏的标准页面布局，可以在注册页面时将 `isSimple: false` 参数传递给 `$panel->profile()`：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->profile(isSimple: false);
}
```

### 自定义认证路由 slug

你可以在[配置](../panel-configuration)中自定义用于认证路由的 URL slug：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->loginRouteSlug('login')
        ->registrationRouteSlug('register')
        ->passwordResetRoutePrefix('password-reset')
        ->passwordResetRequestRouteSlug('request')
        ->passwordResetRouteSlug('reset')
        ->emailVerificationRoutePrefix('email-verification')
        ->emailVerificationPromptRouteSlug('prompt')
        ->emailVerificationRouteSlug('verify')
        ->emailChangeVerificationRoutePrefix('email-change-verification')
        ->emailChangeVerificationRouteSlug('verify');
}
```

### 设置认证守卫

要设置 Filament 使用的认证守卫，你可以将守卫名称传入 `authGuard()` [配置](../panel-configuration)方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authGuard('web');
}
```

### 设置密码代理

要设置 Filament 使用的密码代理，你可以将代理名称传入 `authPasswordBroker()` [配置](../panel-configuration)方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authPasswordBroker('users');
}
```

### 禁用可显示的密码输入

默认情况下，认证表单中的所有密码输入都是[`revealable()`](../forms/text-input#可显示的密码输入)。这允许用户通过点击按钮查看正在输入的密码的明文版本。要禁用此功能，你可以向 `revealablePasswords()` [配置](../panel-configuration)方法传入 `false`：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->revealablePasswords(false);
}
```

你也可以在[继承基础页面类](#无需重新定义表单即可自定义认证字段)时通过在字段对象上调用 `->revealable(false)` 来逐字段禁用此功能。

## 设置面板的访客访问

默认情况下，Filament 期望只与已认证的用户一起工作。要允许访客访问面板，你需要避免使用期望已登录用户的组件（如个人资料、头像），并移除内置的认证中间件：

- 从面板配置的 `authMiddleware()` 数组中移除默认的 `Authenticate::class`。
- 从面板中移除 `->login()` 和任何其他[认证功能](#认证功能)。
- 从 `widgets()` 数组中移除默认的 `AccountWidget`，因为它会读取当前用户的数据。

### 在策略中授权访客

当存在时，Filament 依赖 [Laravel 模型策略](https://laravel.com/docs/authorization#generating-policies)进行访问控制。要为[策略中的访客用户](https://laravel.com/docs/authorization#guest-users)提供读取访问权限，创建策略并更新 `viewAny()` 和 `view()` 方法，将 `User $user` 参数更改为 `?User $user` 使其成为可选的，并 `return true;`。或者，你可以完全从策略中移除这些方法。
