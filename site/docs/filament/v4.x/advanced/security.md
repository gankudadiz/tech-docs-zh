---
title: 安全
---

## 简介

:::info
本页提供了使用 Filament 时的安全注意事项概述。许多单独的功能都有各自特定的安全建议文档 -- 例如文件上传、富文本编辑器、内联可编辑列等。使用任何 Filament 功能时，请确保阅读该功能的完整文档，包括其中包含的任何安全警告。
:::

Filament 是一个强大的框架，为开发者提供了对组件配置和渲染方式的广泛控制。这种灵活性是设计使然 -- 开发者需要能够使用 `url()`、`icon()`、`html()` 等配置方法完成强大的操作。然而，这意味着 Filament 信任你传递给这些方法的值，你有责任确保任何用户提供的数据在到达 Filament 之前得到了适当的验证和清理。

本页涵盖了使用 Filament 构建应用时的关键安全注意事项，包括授权、输入验证和 HTML 清理。

## 授权

### 资源授权

Filament 会自动检查 [Laravel 模型策略](https://laravel.com/docs/authorization#creating-policies)来处理[资源](../resources/overview#authorization)的标准 CRUD 操作。当资源的模型存在策略时，Filament 会在允许访问相应页面和操作之前检查 `viewAny()`、`create()`、`update()`、`view()`、`delete()` 等方法。

然而，Filament 的自动授权仅覆盖这些内置资源操作。你添加的任何自定义功能 -- 自定义操作、自定义页面、自定义 Livewire 组件、API 端点或其他业务逻辑 -- 都必须由你自行授权。Filament 无法了解标准 CRUD 操作之外的应用授权需求。

### 授权与 Livewire 请求生命周期

Filament 在每个 Livewire 请求上都会重新运行授权 -- 无论是在初始页面加载时还是在每次后续更新（搜索、过滤、分页、操作调用、表单交互）时。这意味着如果用户在使用面板期间权限发生变化，他们进行的下一次交互将根据当前策略状态进行授权，而不是组件首次挂载时的策略状态。

这适用于 Filament 提供的每个 Livewire 组件：

- **资源页面**（`ListRecords`、`CreateRecord`、`EditRecord`、`ViewRecord`、`ManageRelatedRecords`） -- 资源级别的 `Resource::canAccess()` 检查（以及父资源的检查，如果有）通过 `CanAuthorizeResourceAccess` trait 在每个请求上重新运行。页面特定的记录范围检查（`canEdit($record)`、`canView($record)`、`canCreate()`、参数化的 `canAccess(['record' => ...])`）通过每种页面类型的 `hydrate()` 方法在每个请求上重新运行，镜像了现有的 `mount()` 时期调用的 `$this->authorizeAccess()`。
- **自定义面板页面**（任何继承 `Filament\Pages\Page` 的页面，包括 `SettingsPage`、认证页面、仪表盘、集群页面） -- 页面的 `canAccess()` 方法通过 `CanAuthorizeAccess` trait 在每个请求上重新运行。
- **关联管理器** -- `canViewForRecord($ownerRecord, $pageClass)` 检查通过 `Filament\Resources\RelationManagers\Concerns` 下的 `CanAuthorizeAccess` trait 在每个请求上重新运行。初始挂载由父页面的渲染时过滤器控制，因此该 trait 仅注册 hydrate 时检查以避免在第一次请求时重复调用。
- **小部件** -- 静态 `canView()` 检查通过 `Filament\Widgets\Concerns` 下的 `CanAuthorizeAccess` trait 在每个请求上重新运行。与关联管理器一样，父仪表盘的渲染时过滤器处理初始挂载的门控。
- **租户页面**（`RegisterTenant`、`EditTenantProfile`） -- 它们的 `canView()` 检查通过镜像现有 `mount()` 时期检查的 `hydrate()` 方法在每个 Livewire 请求上重新运行。

面板级别的访问（`canAccessPanel`）由面板的 `Authenticate` 中间件强制执行，该中间件在每个 HTTP 请求上运行（包括 Livewire 更新） -- 因此在会话中失去面板访问权限的用户会在中间件层被拦截，而不会到达任何组件级别的授权。

当你在 Filament 面板上构建自定义 Livewire 组件时，请注意**多个 Livewire 活动在 Filament 的授权钩子触发之前运行**：

- 公共属性在任何钩子运行之前从请求负载中反序列化（Livewire 的 "synth" 步骤）。
- `boot()` 和 `boot{TraitName}()` 生命周期钩子在授权之前触发。
- 用户的 `mount()` 主体在初始挂载时在 trait 级别的 `mount{TraitName}` 钩子之前运行。
- 每个属性的 `hydrate{PropertyName}()` 钩子在 Filament 的 hydrate 时授权之后触发，但在请求继续到更新或渲染之前完成。

在实践中，这意味着**在这些早期钩子中发生的工作即使授权随后会中止请求也会运行**。Filament 在响应被渲染或任何更新方法被调用之前中止，因此未经授权的数据永远不会返回给用户，但服务器端的副作用（解析记录的数据库查询、在 `SELECT` 时触发的审计日志条目、自定义钩子中派发的事件等）可能在中止之前发生。

如果你的组件做了任何对未经授权用户不应发生的重大操作 -- 发出事件、写入数据库、调用外部服务 -- 请在 Filament 的授权已经触发**之后**运行的方法或钩子中执行这些工作（例如，在显式 `$this->authorizeAccess()` 调用**之后**的 `mount()` 主体中，或在通过 `wire:click` 调用的操作方法中，该方法始终在授权后运行）。避免将此类工作放在 `boot()` 或每个属性的 hydrate 钩子中。

### 内联可编辑列

内联可编辑表格列，如 `ToggleColumn`、`TextInputColumn`、`SelectColumn` 和 `CheckboxColumn`，在保存更改之前不会检查模型策略。它们只检查列的 `disabled()` 状态。如果你需要限制谁可以编辑这些列，请使用 `disabled()` 方法配合你自己的授权逻辑。有关更多详细信息，请参阅每种[可编辑列类型的文档](../tables/columns/toggle)。

### 自定义操作

当你创建[自定义操作](../actions/overview#authorization)时，你有责任对其进行授权。Filament 提供了 `visible()`、`hidden()` 和 `authorize()` 方法来帮助完成此工作，但你必须使用它们 -- 它们不会自动应用。如果操作修改数据或执行敏感操作，请始终确保它已获得授权。

### 测试授权

你的应用应该有一个全面的测试套件，验证授权在所有入口点都被正确执行 -- 不仅是 Filament 的资源页面，还包括任何自定义操作、自定义页面、Livewire 组件、API 路由和其他功能。Filament 提供了[测试助手](../testing/overview)来断言操作、页面和资源对不同用户角色的正确行为。

不要仅依赖 Filament 的内置策略检查。将它们视为一个有用的层，但始终通过测试验证你的授权规则是否端到端地执行。

## 验证用户输入

许多 Filament 配置方法接受可以返回动态值的闭包。像 `url()`、`icon()`、`html()` 等方法被设计为灵活的，允许开发者构建丰富的动态界面。然而，当传递给这些方法的值来自用户输入或不受信任的数据库内容时，你有责任适当验证和清理它们。

例如，列、条目和操作上的 `url()` 方法会使用你提供的任何值渲染一个 `<a href="...">` 标签。如果你传递了来自用户输入的 URL 而未验证，像 `javascript:alert(document.cookie)` 这样的恶意值可能会被渲染为可点击的链接，导致 XSS。在传递给 Filament 之前，请始终验证 URL 使用了安全的协议，如 `http` 或 `https`：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('website')
    ->url(function (string $state): ?string {
        if (! str_starts_with($state, 'http://') && ! str_starts_with($state, 'https://')) {
            return null;
        }

        return $state;
    })
```

`icon()` 方法期望一个 Blade 图标名称（如 `heroicon-o-user`）或一个图片 URL（任何包含 `/` 的字符串）。图标名称字符串通过 Blade 的图标系统解析，URL 字符串在渲染到 `src` 属性之前会被转义。然而，从用户输入传递无效的图标名称会导致渲染错误，因此如果图标值由用户控制，你仍然应该根据已知的允许列表验证它们。

像 `extraAttributes()`、`extraInputAttributes()`、`extraCellAttributes()` 和其他 `extra*Attributes()` 方法会在不转义的情况下将值渲染到 HTML 中。这是设计使然，因为这些方法通常用于传递不能被转义的 Alpine.js 指令和 Livewire 属性。然而，如果你将用户控制的数据作为属性名称或值传递，攻击者可能会突破 HTML 属性并注入任意标记，导致 XSS。始终确保传递给这些方法的任何动态值都经过验证或来自受信任的数据源。

一般规则：每当你将用户控制的数据传递给 Filament 配置方法时，都要以与在 Blade 模板中直接渲染时相同的谨慎态度对待它。

## HTML 清理

通过 `TextColumn` 和 `TextEntry` 等组件上的 `html()` 或 `markdown()` 方法渲染 HTML 内容时，Filament 使用 Symfony 的 [HtmlSanitizer](https://symfony.com/doc/current/html_sanitizer.html) 组件自动清理输出。这会移除潜在的危险元素（如 `<script>` 标签）以帮助防止 XSS 攻击。

### 默认清理器配置

Filament 在 Laravel 的服务容器中将 `HtmlSanitizerConfig` 注册为 scoped 绑定，具有以下默认配置：

```php
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

(new HtmlSanitizerConfig)
    ->allowSafeElements()
    ->allowRelativeLinks()
    ->allowRelativeMedias()
    ->allowAttribute('class', allowedElements: '*')
    ->allowAttribute('data-color', allowedElements: '*')
    ->allowAttribute('data-cols', allowedElements: '*')
    ->allowAttribute('data-col-span', allowedElements: '*')
    ->allowAttribute('data-from-breakpoint', allowedElements: '*')
    ->allowAttribute('data-id', allowedElements: '*')
    ->allowAttribute('data-type', allowedElements: '*')
    ->allowAttribute('style', allowedElements: '*')
    ->allowAttribute('width', allowedElements: 'img')
    ->allowAttribute('height', allowedElements: 'img')
    ->withMaxInputLength(500000)
```

`data-*` 属性由 Filament 的富文本编辑器内部使用，用于文本颜色、网格布局、合并标签、提及和自定义块等功能。`style` 属性对于支持富文本格式功能（如字体颜色、文本高亮和图片大小调整）是必需的。然而，这意味着像 `background: url(...)`（可能触发外部 HTTP 请求）或 `position: fixed`（可能创建钓鱼覆盖层）这样的 CSS 属性不会被剥离。

如果你的应用渲染来自不受信任用户的 HTML 内容，你应该考虑限制默认配置。

### 自定义清理器

由于 `HtmlSanitizerConfig` 绑定在服务容器中，你可以在服务提供者中使用 `extend()` 来修改默认配置，而无需完全替换它。

#### 添加允许的属性

要允许额外的属性通过清理器，请扩展配置：

```php
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

public function register(): void
{
    $this->app->extend(
        HtmlSanitizerConfig::class,
        fn (HtmlSanitizerConfig $config): HtmlSanitizerConfig => $config
            ->allowAttribute('data-custom', allowedElements: '*'),
    );
}
```

#### 限制允许的属性

要移除 Filament 默认允许的属性，请使用 `dropAttribute()`：

```php
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

public function register(): void
{
    $this->app->extend(
        HtmlSanitizerConfig::class,
        fn (HtmlSanitizerConfig $config): HtmlSanitizerConfig => $config
            ->dropAttribute('style', '*'),
    );
}
```

:::danger
移除 Filament 富文本编辑器依赖的属性（如 `data-color`、`data-cols`、`data-id` 或 `style`）可能会破坏富文本渲染。只有在你了解这些属性对 Filament 组件的影响时才限制它们。
:::

#### 完全替换清理器配置

如果你需要完全控制，可以在服务提供者中完全重新绑定 `HtmlSanitizerConfig`：

```php
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

public function register(): void
{
    $this->app->scoped(
        HtmlSanitizerConfig::class,
        fn (): HtmlSanitizerConfig => (new HtmlSanitizerConfig)
            ->allowSafeElements()
            ->allowRelativeLinks()
            ->allowRelativeMedias()
            ->allowAttribute('class', allowedElements: '*')
            ->withMaxInputLength(500000),
    );
}
```

有关完整的配置选项列表，请参阅 [Symfony HtmlSanitizer 文档](https://symfony.com/doc/current/html_sanitizer.html)。

### 在 Blade 视图中清理

在你自己的 Blade 视图中输出富文本内容（来自富文本编辑器或 Markdown 编辑器）时，你有责任对其进行清理。你可以使用 Filament 的 `sanitizeHtml()` 字符串助手：

```blade
{!! str($record->content)->sanitizeHtml() !!}
```

永远不要对未清理的用户内容使用 `{!! $content !!}`。如果你需要将 Markdown 渲染为 HTML，请链式调用助手：

```blade
{!! str($record->content)->markdown()->sanitizeHtml() !!}
```

## 面板访问

默认情况下，所有 `App\Models\User` 记录都可以在本地环境中访问 Filament 面板。在生产环境中，你必须在 User 模型上实现 `FilamentUser` 契约并定义 `canAccessPanel()` 方法来控制谁可以登录。有关详细信息，请参阅[用户文档](../users/overview#authorizing-access-to-the-panel)。

如果你的应用有多个面板（例如管理面板和面向用户的面板），请确保 `canAccessPanel()` 检查 `$panel` 参数并为每个面板返回适当的结果。

### 多因素认证

Filament 通过 TOTP 应用和电子邮件验证码支持[多因素认证](../users/multi-factor-authentication)，但默认未启用。MFA 在 Filament 面板认证流程中强制执行 -- 如果你的应用有其他认证路径（如 API 路由或非 Filament 登录页面），除非你单独实现，否则 MFA 不会在这些路径上强制执行。

## 模型属性暴露

Filament 通过 Livewire 的模型绑定将所有非 `$hidden` 的模型属性暴露给 JavaScript。这对于动态表单功能是必需的，只有具有对应表单字段的属性才实际可编辑 -- 这不是批量赋值漏洞。然而，如果你的模型包含不应在浏览器中可见的敏感属性（如 API 密钥或内部标志），你应该将它们添加到模型的 `$hidden` 属性中，或在编辑或查看页面上使用 `mutateFormDataBeforeFill()` 方法移除它们。有关更多详细信息，请参阅[资源文档](../resources/overview#protecting-model-attributes)。

## 文件上传

Filament 的 `FileUpload` 组件使用 Livewire 的文件上传机制。允许用户上传文件时有重要的安全注意事项，特别是在文件名、存储可见性和接受的文件类型方面。

默认情况下，Filament 生成随机文件名并以 `private` 可见性存储文件。如果你使用 `preserveFilenames()` 或 `getUploadedFileNameForStorageUsing()` 配合本地或公共磁盘，攻击者可能会上传一个带有欺骗性 MIME 类型的 PHP 文件，该文件会被你的服务器执行。更安全的替代方案是使用 `storeFileNamesIn()`，它将原始文件名存储在单独的数据库列中，同时在磁盘上保留随机生成的文件名。有关这些风险和推荐缓解措施的完整说明，请参阅[文件上传文档](../forms/file-upload#security-implications-of-controlling-file-names)。

你应该始终使用 `acceptedFileTypes()` 来限制用户可以上传的文件类型，并使用 `maxSize()` 验证文件大小。这些约束在服务器端强制执行，而不仅仅是在浏览器中。

## 文件路径篡改

`FileUpload` 字段的值是一个指向其配置磁盘上文件的字符串（或字符串数组）。`RichEditor` 通过在每个图像节点的 `data-id` 属性中存储其标识符来嵌入图像，在内容渲染时同样会根据磁盘解析。与任何其他 Livewire 表单字段值一样，两者都由客户端控制 -- 请求可以被拦截以将提交的路径或 `data-id` 更改为同一磁盘上的任何其他文件。如果磁盘还存储了属于其他用户或记录的文件，攻击者可以让记录引用（并通过签名 URL 提供）其他人的文件。

Filament 默认允许这样做，因为合法功能依赖于它 -- 例如，将字段设置为预上传模板文件的操作，或"从其他记录复制"按钮。如果你的表单不依赖此类流程，请选择启用内置检查：

- 对于 `FileUpload` 字段，调用 [`preventFilePathTampering()`](../forms/file-upload#authorizing-existing-file-paths) 以在提交的路径与记录上的原始值不匹配时使验证失败。
- 对于 `RichEditor` 字段，调用 [`preventFileAttachmentPathTampering()`](../forms/rich-editor#securing-file-attachment-ids) 以在提交的 `data-id` 不存在于记录存储内容中时使验证失败。

这两种方法都通过 `$record->getOriginal()` 将提交的值与记录上的属性进行比较，并且都接受 `allowFilePathUsing` 回调用于在记录之外合法添加的路径（如共享模板文件）。新上传的文件和图像始终会原封不动地通过。

:::warning
这些检查需要表单上有记录，因此在创建页面上，每个提交的现有路径都会使验证失败，除非 `allowFilePathUsing` 回调批准它。新上传的不受影响。
:::

如果你希望这些检查在整个应用中生效，而不是记住在每个字段上添加它们，请从服务提供者的 `boot()` 方法中使用 `configureUsing()` 全局启用它们：

```php
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;

FileUpload::configureUsing(function (FileUpload $component): void {
    $component->preventFilePathTampering();
});

RichEditor::configureUsing(function (RichEditor $component): void {
    $component->preventFileAttachmentPathTampering();
});
```

个别字段仍然可以通过向相应方法传递 `false` 来选择退出（例如 `preventFilePathTampering(false)`），当特定表单合法需要接受不在记录上的路径时。

如果你的应用在磁盘级别隔离了每个用户或每个记录的上传 -- 例如，通过为每个租户使用单独的磁盘或目录 -- 此类篡改不可被利用，这些方法是不必要的。`spatie/laravel-medialibrary` 富文本编辑器提供者也通过针对记录自己的媒体集合查找每个 `data-id` 来隐式执行等效检查。

## 查询范围限定

在构建表格、资源或自定义 Livewire 组件时，请确保数据库查询被正确限定到当前用户的权限范围。Filament 的资源系统使用默认返回所有记录的 Eloquent 查询 -- 由你使用表格上的 `modifyQueryUsing()` 方法或覆盖资源上的 `getEloquentQuery()` 方法来应用适当的查询范围，确保用户只能访问他们有权查看的记录。

例如，在多租户应用中，忘记将查询限定到当前租户将允许用户看到其他租户的数据。如果你使用 Filament 内置的[租户](../users/tenancy)功能，资源的查询会自动限定范围。但是，你构建的任何自定义查询、操作或页面都必须手动限定范围。
