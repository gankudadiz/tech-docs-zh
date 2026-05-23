---
title: 升级指南
---

:::info
如果你发现本指南中有任何遗漏，请随时向我们的仓库[提交 Pull Request](https://github.com/filamentphp/filament/edit/4.x/docs/14-upgrade-guide.md)！我们感谢任何帮助！
:::

## 新的版本要求

- PHP 8.2+
- Laravel v11.28+
- 如果你当前在 Filament 中使用的是 Tailwind CSS v3.0，则需要升级到 Tailwind CSS v4.1+。如果你只是使用 Filament 面板而没有自定义主题 CSS 文件，则不适用此要求。
- Filament 不再依赖 `doctrine/dbal`，但如果你的应用仍然需要它，且你没有直接安装它，请将其添加到你的 `composer.json` 文件中。

## 运行自动升级脚本

:::info
升级脚本并不能替代升级指南。它处理了许多升级指南中未提及的小改动，但并不能处理所有破坏性变更。你仍然需要阅读[手动升级步骤](#必须手动处理的破坏性变更)，查看需要对代码做出哪些修改。
:::

:::info
你正在使用的某些插件可能尚未支持 v4。你可以暂时从 `composer.json` 文件中移除它们，直到它们完成升级；或者使用兼容 v4 的类似插件替代；或者等待插件升级后再升级你的应用；甚至可以提交 PR 帮助插件作者完成升级。
:::

升级 Filament 应用的第一步是运行自动升级脚本。该脚本会自动将你的应用升级到最新版本的 Filament，并对代码进行修改，以处理大多数破坏性变更：

```bash
composer require filament/upgrade:"^4.0" -W --dev

vendor/bin/filament-v4

# 运行升级脚本输出的命令，这些命令因你的应用而异
composer require filament/filament:"^4.0" -W --no-update
composer update
```

:::warning
在 Windows PowerShell 中安装 Filament 时，你可能需要运行以下命令，因为它会忽略版本约束中的 `^` 字符：

```bash
composer require filament/upgrade:"~4.0" -W --dev

vendor/bin/filament-v4

# 运行升级脚本输出的命令，这些命令因你的应用而异
composer require filament/filament:"~4.0" -W --no-update
composer update
```
:::

:::warning
如果安装升级脚本失败，请确保你的 PHPStan 版本至少为 v2，或 Larastan 版本至少为 v3。该脚本使用 Rector v2，它要求 PHPStan v2 或更高版本。
:::

请务必仔细按照说明操作，并审查脚本所做的更改。之后你可能需要对代码进行一些手动修改，但脚本应该能为你处理大部分重复性工作。

Filament v4 引入了新的默认目录结构，用于存放 Filament 资源和集群。如果你使用的是带有资源和集群的 Filament 面板，可以选择保留旧的目录结构，或迁移到新的目录结构。如果你想迁移到新的目录结构，可以运行以下命令：

```bash
php artisan filament:upgrade-directory-structure-to-v4 --dry-run
```

`--dry-run` 选项会显示命令将要执行的操作，但不会实际做出任何更改。如果你对更改满意，可以在不使用 `--dry-run` 选项的情况下运行命令来应用更改：

```bash
php artisan filament:upgrade-directory-structure-to-v4
```

:::warning
此目录升级脚本无法完美更新资源和集群文件中同一命名空间内类的所有引用，这些引用需要在脚本运行后手动更新。你应该使用 [PHPStan](https://phpstan.org) 等工具来识别升级后损坏的类引用。
:::

你现在可以运行 `composer remove filament/upgrade --dev` 来移除升级脚本，因为不再需要它了。

## 发布配置文件

Filament v4 中的某些更改可以通过配置文件来恢复。如果你还没有发布配置文件，可以通过运行以下命令来发布：

```bash
php artisan vendor:publish --tag=filament-config
```

首先，v4 中的 `default_filesystem_disk` 设置为 `FILESYSTEM_DISK` 变量，而不是 `FILAMENT_FILESYSTEM_DISK`。要保留 v3 的行为，请确保使用以下设置：

```php
return [

    // ...

    'default_filesystem_disk' => env('FILAMENT_FILESYSTEM_DISK', 'public'),

    // ...

]
```

v4 对 Filament 生成文件的方式引入了一些更改。v4 配置文件中新增了 `file_generation` 部分，以便你在需要时恢复到 v3 风格，使新代码与升级前保持一致。如果你的配置文件中还没有 `file_generation` 部分，应该自行添加，或重新发布配置文件并按需调整：

```php
use Filament\Support\Commands\FileGenerators\FileGenerationFlag;

return [

    // ...

    'file_generation' => [
        'flags' => [
            FileGenerationFlag::EMBEDDED_PANEL_RESOURCE_SCHEMAS, // 在资源类内部定义新的表单和信息列表，而不是在单独的 schema 类中。
            FileGenerationFlag::EMBEDDED_PANEL_RESOURCE_TABLES, // 在资源类内部定义新的表格，而不是在单独的 table 类中。
            FileGenerationFlag::PANEL_CLUSTER_CLASSES_OUTSIDE_DIRECTORIES, // 在目录外部创建新的集群类。如果你运行了 `php artisan filament:upgrade-directory-structure-to-v4` 则不需要此标志。
            FileGenerationFlag::PANEL_RESOURCE_CLASSES_OUTSIDE_DIRECTORIES, // 在目录外部创建新的资源类。如果你运行了 `php artisan filament:upgrade-directory-structure-to-v4` 则不需要此标志。
            FileGenerationFlag::PARTIAL_IMPORTS, // 部分导入组件（如表单字段和表格列），而不是显式导入每个组件。
        ],
    ],

    // ...

]
```

:::tip
`filament/upgrade` 包包含一个命令，可帮助你将面板资源和集群移动到新的目录结构中，这是 v4 中的默认结构：

```bash
php artisan filament:upgrade-directory-structure-to-v4 --dry-run
```

`--dry-run` 选项会显示命令将要执行的操作，但不会实际做出任何更改。如果你对更改满意，可以在不使用 `--dry-run` 选项的情况下运行命令来应用更改：

```bash
php artisan filament:upgrade-directory-structure-to-v4
```

此目录升级脚本无法完美更新资源和集群文件中同一命名空间内类的所有引用，这些引用需要在脚本运行后手动更新。你应该使用 [PHPStan](https://phpstan.org) 等工具来识别升级后损坏的类引用。

运行该命令后，你不再需要在配置文件中保留 `FileGenerationFlag::PANEL_CLUSTER_CLASSES_OUTSIDE_DIRECTORIES` 或 `FileGenerationFlag::PANEL_RESOURCE_CLASSES_OUTSIDE_DIRECTORIES` 标志，因为新的目录结构现在是默认结构。你可以从 `file_generation.flags` 数组中移除它们。
:::

## 必须手动处理的破坏性变更

以下是可以按需筛选的升级指南，你可以只选择项目中使用的包：

**可选的包筛选（仅供参考）：**
- Panels（面板）
- Forms（表单）— 也常在面板中使用，或配合 tables 和 actions 包使用
- Infolists（信息列表）— 也常在面板中使用，或配合 tables 和 actions 包使用
- Tables（表格）— 也常在面板中使用
- Actions（操作）— 也常在面板中使用
- Notifications（通知）— 也常在面板中使用
- Widgets（小部件）— 也常在面板中使用
- Blade UI components（Blade UI 组件）
- Spatie Translatable Plugin（Spatie 多语言插件）

### 高影响变更

<details open>
<summary>非本地磁盘的文件可见性现在默认为私有</summary>

除了[默认磁盘已更改为 `local`](#发布配置文件) 之外，各个组件中非本地磁盘（如 `s3`，但不包括 `public` 或 `local`）的文件可见性设置也已从 `public` 更改为 `private`。这意味着文件默认不公开可访问，你需要生成临时签名 URL 才能访问它们。此更改影响以下组件：

- `FileUpload` 表单字段，包括 `SpatieMediaLibraryFileUpload`
- `ImageColumn` 表格列，包括 `SpatieMediaLibraryImageColumn`
- `ImageEntry` 信息列表条目，包括 `SpatieMediaLibraryImageEntry`

:::tip
如果你使用 `s3` 等非本地磁盘，可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中添加以下代码，以在整个应用中保留旧的默认行为：

```php
use Filament\Forms\Components\FileUpload;
use Filament\Infolists\Components\ImageEntry;
use Filament\Tables\Columns\ImageColumn;

FileUpload::configureUsing(fn (FileUpload $fileUpload) => $fileUpload
    ->visibility('public'));

ImageColumn::configureUsing(fn (ImageColumn $imageColumn) => $imageColumn
    ->visibility('public'));

ImageEntry::configureUsing(fn (ImageEntry $imageEntry) => $imageEntry
    ->visibility('public'));
```
:::

</details>

<details open>
<summary>自定义主题需要升级到 Tailwind CSS v4</summary>

以前，自定义主题 CSS 文件包含以下内容：

```css
@import '../../../../vendor/filament/filament/resources/css/theme.css';

@config 'tailwind.config.js';
```

现在，它们应该包含以下内容：

```css
@import '../../../../vendor/filament/filament/resources/css/theme.css';

@source '../../../../app/Filament/**/*';
@source '../../../../resources/views/filament/**/*';
```

这将加载 Tailwind CSS。`@source` 条目告诉 Tailwind 在哪里查找你的应用中使用的类。你应该检查旧的 `tailwind.config.js` 文件中的 `content` 路径，并将它们作为 `@source` 条目添加。你**不需要**将 `vendor/filament` 作为 `@source` 包含，但请检查你安装的插件是否需要 `@source` 条目。

最后，你应该使用 [Tailwind 升级工具](https://tailwindcss.com/docs/upgrade-guide#using-the-upgrade-tool)来自动调整你的配置文件以使用 Tailwind v4，并安装 Tailwind v4 包来替代 Tailwind v3 包：

```bash
npx @tailwindcss/upgrade
```

你的主题的 `tailwind.config.js` 文件将不再使用，因为 Tailwind CSS v4 [在 CSS 中定义配置](https://tailwindcss.com/docs/adding-custom-styles)。你对 `tailwind.config.js` 文件所做的任何自定义都应添加到 CSS 文件中。

</details>

<details open>
<summary>没有自定义主题时，Filament 视图中的 Tailwind CSS 类不再可用</summary>

在 v3 中，Filament 的 Blade 视图直接在 HTML 中包含 Tailwind CSS 类。这意味着如果你在自己的代码中使用了相同的 Tailwind 类（如 `hidden` 或 `text-primary-600`），它们会"开箱即用"，你无需设置自定义主题——Filament 的资源编译会为你包含这些类。

在 v4 中，Filament 的 Tailwind 类已通过 Tailwind 的 `@apply` 指令移至 CSS 文件中。这意味着这些类在编译资源时不再被 Tailwind 扫描，因此不会包含在 Filament 的默认样式表中。

如果你在自己的 Blade 视图、Livewire 组件或其他代码中使用了 Tailwind 类，且没有自定义主题，这些样式将不再生效。要解决此问题，你需要创建一个自定义主题。

运行 `php artisan make:filament-theme` 并按照[主题文档](styling/overview#creating-a-custom-theme)操作。在你的主题 CSS 文件中，添加指向使用 Tailwind 类的文件的 `@source` 条目：

```css
@import '../../../../vendor/filament/filament/resources/css/theme.css';

@source '../../../../app/Filament/**/*';
@source '../../../../resources/views/filament/**/*';
@source '../../../../resources/views/components/**/*'; /* 添加你自己的路径 */
@source '../../../../resources/views/livewire/**/*'; /* 添加你自己的路径 */
```

:::tip
此更改仅在你依赖 Filament 编译后的样式来包含自己代码中使用的 Tailwind 类时才会影响你。如果你已经有自定义主题，可能不会注意到任何差异。
:::

</details>

<details open>
<summary>表格筛选器的变更默认为延迟应用</summary>

Filament v3 中的 `deferFilters()` 方法现在是 Filament v4 的默认行为，因此用户必须点击按钮后筛选器才会应用到表格。要禁用此行为，可以使用 `deferFilters(false)` 方法。

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->deferFilters(false);
}
```

:::tip
你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中添加以下代码，以在整个应用中保留旧的默认行为：

```php
use Filament\Tables\Table;

Table::configureUsing(fn (Table $table) => $table
    ->deferFilters(false));
```
:::

</details>

<details open>
<summary>`Grid`、`Section` 和 `Fieldset` 布局组件现在默认不再跨所有列</summary>

在 v3 中，`Grid`、`Section` 和 `Fieldset` 布局组件默认占满其父级网格的完整宽度。这与 Filament 中其他所有组件的行为不一致，其他组件默认只占网格的一列。这样设计的目的是让这些组件更容易集成到默认的 Filament 资源表单和信息列表中，因为默认使用的是两列网格。

在 v4 中，`Grid`、`Section` 和 `Fieldset` 布局组件现在默认只占网格的一列。如果你想让它们跨所有列，可以使用 `columnSpanFull()` 方法：

```php
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;

Fieldset::make()
    ->columnSpanFull()

Grid::make()
    ->columnSpanFull()

Section::make()
    ->columnSpanFull()
```

:::tip
你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中添加以下代码，以在整个应用中保留旧的默认行为：

```php
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;

Fieldset::configureUsing(fn (Fieldset $fieldset) => $fieldset
    ->columnSpanFull());

Grid::configureUsing(fn (Grid $grid) => $grid
    ->columnSpanFull());

Section::configureUsing(fn (Section $section) => $section
    ->columnSpanFull());
```
:::

</details>

<details open>
<summary>`unique()` 验证规则在忽略 Eloquent 记录时的行为变更</summary>

在 v3 中，`unique()` 方法在验证时默认不会忽略当前表单的 Eloquent 记录。此行为需要通过 `ignoreRecord: true` 参数或传入自定义的 `ignorable` 记录来启用。

在 v4 中，`unique()` 方法的 `ignoreRecord` 参数默认为 `true`。

如果你之前在使用 `unique()` 验证规则时没有使用 `ignoreRecord` 或 `ignorable` 参数，应该使用 `ignoreRecord: false` 来禁用新行为。

:::tip
你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中添加以下代码，以在整个应用中保留旧的默认行为：

```php
use Filament\Forms\Components\Field;

Field::configureUsing(fn (Field $field) => $field
    ->uniqueValidationIgnoresRecordByDefault(false));
```
:::

</details>

<details open>
<summary>表格默认不再提供 `all` 分页选项</summary>

`all` 分页选项现在默认不在表格中可用。如果你想在表格中使用它，可以将其添加到配置中：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginationPageOptions([5, 10, 25, 50, 'all']);
}
```

请注意，使用 `all` 时在处理大量记录的情况下会导致性能问题。

:::tip
你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中添加以下代码，以在整个应用中保留旧的默认行为：

```php
use Filament\Tables\Table;

Table::configureUsing(fn (Table $table) => $table
    ->paginationPageOptions([5, 10, 25, 50, 'all']));
```
:::

</details>

<details open>
<summary>官方 Spatie Translatable 插件已被弃用</summary>

去年，Filament 团队决定将 Spatie Translatable 插件的维护工作移交给 [Lara Zeus](https://larazeus.com) 团队，他们是多个 Filament 插件的可信开发者。此后他们一直维护着该插件的分支。

官方 Spatie Translatable 插件不会获得 v4 支持，现已被弃用。你可以使用 [Lara Zeus Translatable 插件](https://github.com/lara-zeus/spatie-translatable)作为直接替代。该插件与官方插件兼容相同版本的 Spatie Translatable，并已通过 Filament v4 的测试。它还修复了官方插件中的一些长期存在的 bug。

[自动升级脚本](#运行自动升级脚本)会建议卸载官方插件并安装 Lara Zeus 插件的命令，并将代码中对官方插件的引用替换为 Lara Zeus 插件。

</details>

### 中等影响变更

<details>
<summary>`columnSpan()` 现在默认针对 >= `lg` 设备</summary>

与 `columns()` 方法接受一个数字并默认影响 >= `lg` 设备类似，`columnSpan()` 方法也已更改为相同的行为。这提高了 API 之间的一致性，使它们更易于使用，更不容易导致布局问题。

在 v3 中，可能会编写以下代码。如果你使用 `columnSpan(2)` 而不是 `columnSpan(['lg' => 2])`，在 < `lg` 设备上布局会有些问题：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

Section::make()
    ->columns(3)
    ->schema([
        TextInput::make()
            ->columnSpan(['lg' => 2]),
    ])
```

在 v4 中，`columnSpan()` 默认影响 >= `lg` 设备，与 `columns()` 的方式相同，因此需要改为以下代码：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

Section::make()
    ->columns(3)
    ->schema([
        TextInput::make()
            ->columnSpan(2),
    ])
```

当然，你仍然可以使用数组来定义组件在不同断点下应跨多少列：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

Section::make()
    ->columns(3)
    ->schema([
        TextInput::make()
            ->columnSpan(['lg' => 3, 'xl' => 2, '2xl' => 1]),
    ])
```

</details>

<details>
<summary>枚举字段状态</summary>

在 v3 中，写入模型枚举属性的字段（如使用 `options(Enum::class)` 的 `Select`、`CheckboxList` 或 `Radio` 字段）会不一致地返回枚举值或枚举实例，取决于字段最后是由服务器还是用户修改的。这并不实用，你必须检查字段返回值的类型来确定它是枚举值还是枚举实例。

在 v4 中，字段状态始终作为枚举实例返回。这意味着你始终可以在字段状态上使用枚举方法。如果你之前没有在代码中处理字段状态可能是枚举实例的情况，现在需要这样做。

以下代码示例说明了字段状态现在如何返回枚举实例：

```php
use App\Enums\Status;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;

Select::make('status')
    ->options(Status::class)
    ->afterStateUpdated(function (?Status $state) {
        // `$state` 现在始终是 `Status` 的实例，如果字段为空则为 `null`。
    });

TextInput::make('...')
    ->afterStateUpdated(function (Get $get) {
        // `$get('status')` 现在始终是 `Status` 的实例，如果字段为空则为 `null`。
    });

$data = $this->form->getState();
// `$data['status']` 现在始终是 `Status` 的实例，如果字段为空则为 `null`。
```

</details>

<details>
<summary>URL 参数名称已更改</summary>

Filament v4 重命名了资源页面上使用的一些 URL 参数，使它们在 URL 中更简洁且更容易记忆：

- `activeRelationManager` 在编辑/查看资源页面上已重命名为 `relation`。
- `activeTab` 在列表/管理关联资源页面上已重命名为 `tab`。
- `isTableReordering` 在列表/管理关联资源页面上已重命名为 `reordering`。
- `tableFilters` 在列表/管理关联资源页面上已重命名为 `filters`。
- `tableGrouping` 在列表/管理关联资源页面上已重命名为 `grouping`。
- `tableGroupingDirection` 在列表/管理关联资源页面上已重命名为 `groupingDirection`。
- `tableSearch` 在列表/管理关联资源页面上已重命名为 `search`。
- `tableSort` 在列表/管理关联资源页面上已重命名为 `sort`。

要查明你的代码中是否使用了这些参数，可以尝试在代码中搜索 `'activeRelationManager' => `（等），以及使用 `::getUrl()` 或其他带参数生成 URL 的方法的地方。

</details>

<details>
<summary>自动租户全局作用域和关联</summary>

在 v3 中使用租户功能时，Filament 仅将资源查询限定在当前租户范围内：用于渲染资源表单、解析 URL 参数和获取全局搜索结果。在面板中，许多其他查询默认不会被限定范围，开发者必须手动限定。虽然这是一个有文档说明的功能，但它给开发者带来了大量额外工作。

在 v4 中，Filament 会自动将面板中的所有查询限定在当前租户范围内，并使用模型事件自动将新记录与当前租户关联。这意味着在大多数情况下，你不再需要手动限定查询范围或关联新的 Eloquent 记录。仍有一些重要的注意事项，因此[文档](users/tenancy#tenancy-security)已更新以反映这些变化。

</details>

<details>
<summary>`Radio` 的 `inline()` 方法行为变更</summary>

在 v3 中，`inline()` 方法使单选按钮彼此内联，同时也与标签内联。这与其他组件的行为不一致。

在 v4 中，`inline()` 方法现在仅使单选按钮彼此内联，而不与标签内联。如果你想让单选按钮与标签内联，可以同时使用 `inlineLabel()` 方法。

如果你之前使用 `inline()->inlineLabel(false)` 来实现 v4 的行为，现在可以简单地使用 `inline()`。

:::tip
你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中添加以下代码，以在整个应用中保留旧的默认行为：

```php
use Filament\Forms\Components\Radio;

Radio::configureUsing(fn (Radio $radio) => $radio
    ->inlineLabel(fn (): bool => $radio->isInline()));
```
:::

</details>

<details>
<summary>导入和导出作业的重试</summary>

在 Filament v3 中，导入和导出作业失败后会连续重试 24 小时，默认没有退避间隔。这对某些用户造成了问题，因为没有退避期，作业可能被过快重试，导致队列被持续失败的作业淹没。

在 v4 中，它们会重试 3 次，每次重试之间有 60 秒的退避间隔。

此行为可以在[导入器](actions/import#customizing-the-import-job-retries)和[导出器](actions/export#customizing-the-export-job-retries)类中自定义。

</details>

### 低影响变更

<details>
<summary>`ImageColumn::limitedRemainingText()` 和 `ImageEntry::limitedRemainingText()` 的 `isSeparate` 参数已被移除</summary>

以前，用户可以使用 `isSeparate` 参数将限制的图片数量单独显示在图片堆栈旁边。现在该参数已被移除，如果存在堆栈，文字将始终堆叠在顶部，不会单独显示。如果图片未堆叠，文字将单独显示。

</details>

<details>
<summary>`RichEditor` 组件的 `disableGrammarly()` 方法已被移除</summary>

`disableGrammarly()` 方法已从 `RichEditor` 组件中移除。此方法用于禁用 Grammarly 浏览器扩展在编辑器上的作用。由于编辑器的底层实现已从 Trix 迁移到 TipTap，我们尚未找到在编辑器上禁用 Grammarly 的方法。

</details>

<details>
<summary>重写 `Field::make()`、`MorphToSelect::make()`、`Placeholder::make()` 或 `Builder\Block::make()` 方法</summary>

`Field::make()`、`MorphToSelect::make()`、`Placeholder::make()` 和 `Builder\Block::make()` 方法的签名已更改。任何扩展 `Field`、`MorphToSelect`、`Placeholder` 或 `Builder\Block` 类并重写 `make()` 方法的类，都必须更新方法签名以匹配新的签名。新签名如下：

```php
public static function make(?string $name = null): static
```

这是由于引入了 `getDefaultName()` 方法，可以重写该方法来提供默认的 `$name` 值（当未指定 `$name` 即传入 `null` 时）。如果你之前重写 `make()` 方法是为了提供默认的 `$name` 值，建议你改为重写 `getDefaultName()` 方法，以避免未来的维护负担：

```php
public static function getDefaultName(): ?string
{
    return 'default';
}
```

如果你重写 `make()` 方法是为了在对象实例化后传递默认配置，请注意建议改为重写 `setUp()` 方法，该方法在对象实例化后立即调用：

```php
protected function setUp(): void
{
    parent::setUp();

    $this->label('Default label');
}
```

理想情况下，你应该完全避免重写 `make()` 方法，因为有 `setUp()` 等替代方案，而且这样做会导致你的代码在 Filament 决定将来引入新的构造函数参数时变得脆弱。

</details>

<details>
<summary>重写 `Entry::make()` 方法</summary>

`Entry::make()` 方法的签名已更改。任何扩展 `Entry` 类并重写 `make()` 方法的类，都必须更新方法签名以匹配新的签名。新签名如下：

```php
public static function make(?string $name = null): static
```

这是由于引入了 `getDefaultName()` 方法，可以重写该方法来提供默认的 `$name` 值（当未指定 `$name` 即传入 `null` 时）。如果你之前重写 `make()` 方法是为了提供默认的 `$name` 值，建议你改为重写 `getDefaultName()` 方法，以避免未来的维护负担：

```php
public static function getDefaultName(): ?string
{
    return 'default';
}
```

如果你重写 `make()` 方法是为了在对象实例化后传递默认配置，请注意建议改为重写 `setUp()` 方法，该方法在对象实例化后立即调用：

```php
protected function setUp(): void
{
    parent::setUp();

    $this->label('Default label');
}
```

理想情况下，你应该完全避免重写 `make()` 方法，因为有 `setUp()` 等替代方案，而且这样做会导致你的代码在 Filament 决定将来引入新的构造函数参数时变得脆弱。

</details>

<details>
<summary>重写 `Column::make()` 或 `Constraint::make()` 方法</summary>

`Column::make()` 和 `Constraint::make()` 方法的签名已更改。任何扩展 `Column` 或 `Constraint` 类并重写 `make()` 方法的类，都必须更新方法签名以匹配新的签名。新签名如下：

```php
public static function make(?string $name = null): static
```

这是由于引入了 `getDefaultName()` 方法，可以重写该方法来提供默认的 `$name` 值（当未指定 `$name` 即传入 `null` 时）。如果你之前重写 `make()` 方法是为了提供默认的 `$name` 值，建议你改为重写 `getDefaultName()` 方法，以避免未来的维护负担：

```php
public static function getDefaultName(): ?string
{
    return 'default';
}
```

如果你重写 `make()` 方法是为了在对象实例化后传递默认配置，请注意建议改为重写 `setUp()` 方法，该方法在对象实例化后立即调用：

```php
protected function setUp(): void
{
    parent::setUp();

    $this->label('Default label');
}
```

理想情况下，你应该完全避免重写 `make()` 方法，因为有 `setUp()` 等替代方案，而且这样做会导致你的代码在 Filament 决定将来引入新的构造函数参数时变得脆弱。

</details>

<details>
<summary>重写 `ExportColumn::make()` 或 `ImportColumn::make()` 方法</summary>

`ExportColumn::make()` 和 `ImportColumn::make()` 方法的签名已更改。任何扩展 `ExportColumn` 或 `ImportColumn` 类并重写 `make()` 方法的类，都必须更新方法签名以匹配新的签名。新签名如下：

```php
public static function make(?string $name = null): static
```

这是由于引入了 `getDefaultName()` 方法，可以重写该方法来提供默认的 `$name` 值（当未指定 `$name` 即传入 `null` 时）。如果你之前重写 `make()` 方法是为了提供默认的 `$name` 值，建议你改为重写 `getDefaultName()` 方法，以避免未来的维护负担：

```php
public static function getDefaultName(): ?string
{
    return 'default';
}
```

如果你重写 `make()` 方法是为了在对象实例化后传递默认配置，请注意建议改为重写 `setUp()` 方法，该方法在对象实例化后立即调用：

```php
protected function setUp(): void
{
    parent::setUp();

    $this->label('Default label');
}
```

理想情况下，你应该完全避免重写 `make()` 方法，因为有 `setUp()` 等替代方案，而且这样做会导致你的代码在 Filament 决定将来引入新的构造函数参数时变得脆弱。

</details>

<details>
<summary>在导入和导出作业中对用户进行身份验证</summary>

在 v3 中，导入和导出作业会触发 `Illuminate\Auth\Events\Login` 事件来设置当前用户。在 v4 中不再是这样：用户会被身份验证，但不会触发该事件，以避免运行那些只应在实际用户登录时运行的监听器。

</details>

<details>
<summary>表格现在默认按主键排序</summary>

Filament v4 为表格引入了新的默认行为：它们现在会自动对查询应用主键排序，以确保记录始终以一致的顺序返回。

如果你的表格没有主键，或你想禁用此行为，可以使用 `defaultKeySort(false)` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->defaultKeySort(false);
}
```

:::tip
你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中添加以下代码，以在整个应用中保留旧的默认行为：

```php
use Filament\Tables\Table;

Table::configureUsing(fn (Table $table) => $table
    ->defaultKeySort(false));
```
:::

</details>

<details>
<summary>重写 `Resource`、`RelationManager` 或 `ManageRelatedRecords` 类上的 `can*()` 授权方法</summary>

虽然这些方法（如 `canCreate()`、`canViewAny()` 和 `canDelete()`）没有文档说明，但如果你在 v3 中重写它们来提供自定义授权逻辑，你应该知道它们在 v4 中并不总是被调用。授权逻辑已得到改进，以正确支持[策略响应对象](https://laravel.com/docs/authorization#policy-responses)，而这些方法过于简单，因为它们只能返回布尔值。

如果你能在模型的策略中完成授权自定义，就应该这样做。如果你需要在资源或关联管理器类中自定义授权逻辑，应该改为重写 `get*AuthorizationResponse()` 方法，如 `getCreateAuthorizationResponse()`、`getViewAnyAuthorizationResponse()` 和 `getDeleteAuthorizationResponse()`。这些方法在执行授权逻辑时被调用，并返回[策略响应对象](https://laravel.com/docs/authorization#policy-responses)。如果你移除 `can*()` 方法的重写，`get*AuthorizationResponse()` 方法将用于确定授权响应的布尔值，因此你不必维护两份逻辑。

</details>

<details>
<summary>欧洲葡萄牙语翻译</summary>

欧洲葡萄牙语翻译已从 `pt_PT` 移至 `pt`，这似乎是 Laravel 社区中更常用的语言代码。

</details>

<details>
<summary>尼泊尔语翻译</summary>

尼泊尔语翻译已从 `np` 移至 `ne`，这似乎是 Laravel 社区中更常用的语言代码。

</details>

<details>
<summary>挪威语翻译</summary>

挪威语翻译已从 `no` 移至 `nb`，这似乎是 Laravel 社区中更常用的语言代码。

</details>

<details>
<summary>高棉语翻译</summary>

高棉语翻译已从 `kh` 移至 `km`，这似乎是 Laravel 社区中更常用的语言代码。

</details>

<details>
<summary>一些已弃用的表格配置方法已被移除</summary>

在 Filament v3 之前，可以通过在 Livewire 组件类上重写方法来配置表格，而不是修改 `$table` 配置对象。这在 v3 中已被弃用，并在 v4 中被移除。如果你使用了以下任何方法，应该从 Livewire 组件类中移除它们，并使用对应的 `$table` 配置方法：

- `getTableRecordUrlUsing()` 应替换为 `$table->recordUrl()`
- `getTableRecordClassesUsing()` 应替换为 `$table->recordClasses()`
- `getTableRecordActionUsing()` 应替换为 `$table->recordAction()`
- `isTableRecordSelectable()` 应替换为 `$table->checkIfRecordIsSelectableUsing()`

</details>
