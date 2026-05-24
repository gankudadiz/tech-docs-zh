---
title: 多因素认证
---

## 简介

Filament 中的用户默认可以使用电子邮件地址和密码登录。但是，你可以启用多因素认证（MFA）为用户账户添加额外的安全层。

当 MFA 启用后，用户在通过认证并获得应用访问权限之前必须执行额外的步骤。

![多因素认证挑战页面](/assets/filament/v4.x/screenshots/images/light/panels/mfa-challenge.jpg)

Filament 包含两种 MFA 方法，你可以开箱即用：

- [应用认证](#应用认证)使用兼容 Google Authenticator 的应用（如 Google Authenticator、Authy 或 Microsoft Authenticator 应用）生成基于时间的一次性密码（TOTP）来验证用户。
- [电子邮件认证](#电子邮件认证)向用户的电子邮件地址发送一次性代码，用户必须输入该代码来验证其身份。

在 Filament 中，用户从其[个人资料页面](overview#认证功能)设置多因素认证。如果你使用 Filament 的个人资料页面功能，设置多因素认证将自动在个人资料页面上添加正确的 UI 元素：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->profile();
}
```

![个人资料页面上的多因素认证选项](/assets/filament/v4.x/screenshots/images/light/panels/mfa.jpg)

## 应用认证

要在面板中启用应用认证，你必须首先向 `users` 表（或在此面板中用于"可认证"Eloquent 模型的任何表）添加一个新列。该列需要存储用于生成和验证基于时间的一次性密码的密钥。它可以在迁移中是普通的 `text()` 列：

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->text('app_authentication_secret')->nullable();
});
```

在 `User` 模型中，你应该实现 `HasAppAuthentication` 接口并使用 `InteractsWithAppAuthentication` trait，它提供了与密钥代码和集成相关信息交互的必要方法：

```php
use Filament\Auth\MultiFactor\App\Contracts\HasAppAuthentication;
use Filament\Auth\MultiFactor\App\Concerns\InteractsWithAppAuthentication;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasAppAuthentication, MustVerifyEmail
{
    use InteractsWithAppAuthentication;
    
    // ...
}
```

:::tip
Filament 提供了默认实现以提高速度和简便性，但你可以自己实现所需的方法并自定义列名或将密钥存储在完全独立的表中。
:::

最后，你应该在面板中激活应用认证功能。为此，在[配置](../panel-configuration)中使用 `multiFactorAuthentication()` 方法，并向其传递一个 `AppAuthentication` 实例：

```php
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            AppAuthentication::make(),
        ]);
}
```

### 设置应用恢复码

如果你的用户失去了对双因素认证应用的访问权限，他们将无法登录你的应用。为了防止这种情况，你可以生成一组恢复码，用户可以在失去对双因素认证应用的访问权限时使用这些恢复码登录。

与 `app_authentication_secret` 列类似，你应该向 `users` 表（或在此面板中用于"可认证"Eloquent 模型的任何表）添加一个新列。该列需要存储恢复码。它可以在迁移中是普通的 `text()` 列：

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->text('app_authentication_recovery_codes')->nullable();
});
```

接下来，你应该在 `User` 模型上实现 `HasAppAuthenticationRecovery` 接口并使用 `InteractsWithAppAuthenticationRecovery` trait，它为 Filament 提供了与恢复码交互的必要方法：

```php
use Filament\Auth\MultiFactor\App\Contracts\HasAppAuthentication;
use Filament\Auth\MultiFactor\App\Concerns\InteractsWithAppAuthentication;
use Filament\Auth\MultiFactor\App\Contracts\HasAppAuthenticationRecovery;
use Filament\Auth\MultiFactor\App\Concerns\InteractsWithAppAuthenticationRecovery;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasAppAuthentication, HasAppAuthenticationRecovery, MustVerifyEmail
{
    use InteractsWithAppAuthentication;
    use InteractsWithAppAuthenticationRecovery;
    
    // ...
}
```

:::tip
Filament 提供了默认实现以提高速度和简便性，但你可以自己实现所需的方法并自定义列名或将恢复码存储在完全独立的表中。
:::

最后，你应该在面板中激活应用认证恢复码功能。为此，在[配置](../panel-configuration)的 `multiFactorAuthentication()` 方法中向 `AppAuthentication` 实例传递 `recoverable()` 方法：

```php
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            AppAuthentication::make()
                ->recoverable(),
        ]);
}
```

#### 更改生成的恢复码数量

默认情况下，Filament 为每个用户生成 8 个恢复码。如果你想更改此设置，可以在[配置](../panel-configuration)的 `multiFactorAuthentication()` 方法中使用 `AppAuthentication` 实例的 `recoveryCodeCount()` 方法：

```php
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            AppAuthentication::make()
                ->recoverable()
                ->recoveryCodeCount(10),
        ]);
}
```

#### 防止用户重新生成恢复码

默认情况下，用户可以访问其个人资料来重新生成恢复码。如果你想阻止此操作，可以在[配置](../panel-configuration)的 `multiFactorAuthentication()` 方法中使用 `AppAuthentication` 实例的 `regenerableRecoveryCodes(false)` 方法：

```php
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            AppAuthentication::make()
                ->recoverable()
                ->regenerableRecoveryCodes(false),
        ]);
}
```

### 更改应用代码过期时间

应用代码使用基于时间的一次性密码（TOTP）算法发出，这意味着它们只在生成前后短时间内有效。时间定义在一个"窗口"中。默认情况下，Filament 使用过期窗口为 `8`，这在生成时间的两侧各创建 4 分钟的有效期（总共 8 分钟）。

要更改窗口，例如只在生成后 2 分钟内有效，你可以在 `AppAuthentication` 实例上使用 `codeWindow()` 方法，设置为 `4`：

```php
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            AppAuthentication::make()
                ->codeWindow(4),
        ]);
}
```

### 自定义应用认证品牌名称

每个应用认证集成都有一个在认证应用中显示的"品牌名称"。默认情况下，这是你的应用名称。如果你想更改此设置，可以在[配置](../panel-configuration)的 `multiFactorAuthentication()` 方法中使用 `AppAuthentication` 实例的 `brandName()` 方法：

```php
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            AppAuthentication::make()
                ->brandName('Filament Demo'),
        ]);
}
```

## 电子邮件认证

电子邮件认证向用户发送一次性代码到其电子邮件地址，用户必须输入该代码来验证其身份。

要在面板中启用电子邮件认证，你必须首先向 `users` 表（或在此面板中用于"可认证"Eloquent 模型的任何表）添加一个新列。该列需要存储一个布尔值，指示是否启用了电子邮件认证：

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->boolean('has_email_authentication')->default(false);
});
```

接下来，你应该在 `User` 模型上实现 `HasEmailAuthentication` 接口并使用 `InteractsWithEmailAuthentication` trait，它为 Filament 提供了与指示是否启用了电子邮件认证的列交互的必要方法：

```php
use Filament\Auth\MultiFactor\Email\Contracts\HasEmailAuthentication;
use Filament\Auth\MultiFactor\Email\Concerns\InteractsWithEmailAuthentication;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasEmailAuthentication, MustVerifyEmail
{
    use InteractsWithEmailAuthentication;
    
    // ...
}
```

:::tip
Filament 提供了默认实现以提高速度和简便性，但你可以自己实现所需的方法并自定义列名或将值存储在完全独立的表中。
:::

最后，你应该在面板中激活电子邮件认证功能。为此，在[配置](../panel-configuration)中使用 `multiFactorAuthentication()` 方法，并向其传递一个 `EmailAuthentication` 实例：

```php
use Filament\Auth\MultiFactor\Email\EmailAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            EmailAuthentication::make(),
        ]);
}
```

### 更改电子邮件代码过期时间

电子邮件代码的有效期为 4 分钟，之后会过期。

要更改过期时间，例如只在代码生成后 2 分钟内有效，你可以在 `EmailAuthentication` 实例上使用 `codeExpiryMinutes()` 方法，设置为 `2`：

```php
use Filament\Auth\MultiFactor\Email\EmailAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            EmailAuthentication::make()
                ->codeExpiryMinutes(2),
        ]);
}
```

## 要求多因素认证

默认情况下，不要求用户设置多因素认证。你可以通过在[配置](../panel-configuration)的 `multiFactorAuthentication()` 方法中传递 `isRequired: true` 参数来要求用户配置它：

```php
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            AppAuthentication::make(),
        ], isRequired: true);
}
```

启用此功能后，如果用户尚未设置多因素认证，登录后将被提示设置多因素认证。

## 多因素认证的安全说明

在 Filament 中，多因素认证过程发生在用户实际通过应用认证之前。这使你可以确保没有用户可以在不通过多因素认证步骤的情况下通过认证并访问应用。你不需要记住在任何已认证路由上添加中间件来确保用户完成了多因素认证步骤。

但是，如果你的 Laravel 应用有其他认证用户的部分，请注意，如果他们已经在其他地方通过认证然后访问面板，他们不会被要求进行多因素认证，除非[要求多因素认证](#要求多因素认证)且他们尚未设置。
