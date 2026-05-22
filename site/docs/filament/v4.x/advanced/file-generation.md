---
title: 文件生成
---

## 简介

Filament 包含许多用于生成文件的 CLI 命令。本指南解释如何自定义生成的文件。

Filament 生成的绝大多数文件是 PHP 类。Filament 使用 [`nette/php-generator`](https://github.com/nette/php-generator) 来程序化生成类，而不是使用模板文件。这样做的优势是生成的文件有更大的灵活性，这对于需要支持 Filament 所具有的众多不同配置选项来说非常重要。

每种类型的类都由一个 `ClassGenerator` 类生成。以下是 Filament 使用的 `ClassGenerator` 类列表：

- `Filament\Actions\Commands\FileGenerators\ExporterClassGenerator` 由 `make:filament-exporter` 命令使用。
- `Filament\Actions\Commands\FileGenerators\ImporterClassGenerator` 由 `make:filament-importer` 命令使用。
- `Filament\Forms\Commands\FileGenerators\FieldClassGenerator` 由 `make:filament-form-field` 命令使用。
- `Filament\Forms\Commands\FileGenerators\FormSchemaClassGenerator` 由 `make:filament-form` 命令使用。
- `Filament\Forms\Commands\FileGenerators\LivewireFormComponentClassGenerator` 由 `make:filament-livewire-form` 命令使用。
- `Filament\Infolists\Commands\FileGenerators\EntryClassGenerator` 由 `make:filament-infolist-entry` 命令使用。
- `Filament\Commands\FileGenerators\Resources\Pages\ResourceCreateRecordPageClassGenerator` 由 `make:filament-resource` 和 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\Resources\Pages\ResourceCustomPageClassGenerator` 由 `make:filament-resource` 和 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\Resources\Pages\ResourceEditRecordPageClassGenerator` 由 `make:filament-resource` 和 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\Resources\Pages\ResourceListRecordsPageClassGenerator` 由 `make:filament-resource` 和 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\Resources\Pages\ResourceManageRecordsPageClassGenerator` 由 `make:filament-resource` 和 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\Resources\Pages\ResourceManageRelatedRecordsPageClassGenerator` 由 `make:filament-resource` 和 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\Resources\Pages\ResourceViewRecordPageClassGenerator` 由 `make:filament-resource` 和 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\Resources\SchemasResourceFormSchemaClassGenerator` 由 `make:filament-resource` 命令使用。
- `Filament\Commands\FileGenerators\Resources\SchemasResourceInfolistSchemaClassGenerator` 由 `make:filament-resource` 命令使用。
- `Filament\Commands\FileGenerators\Resources\SchemasResourceTableClassGenerator` 由 `make:filament-resource` 命令使用。
- `Filament\Commands\FileGenerators\Resources\RelationManagerClassGenerator` 由 `make:filament-relation-manager` 命令使用。
- `Filament\Commands\FileGenerators\Resources\ResourceClassGenerator` 由 `make:filament-resource` 命令使用。
- `Filament\Commands\FileGenerators\ClusterClassGenerator` 由 `make:filament-cluster` 命令使用。
- `Filament\Commands\FileGenerators\CustomPageClassGenerator` 由 `make:filament-page` 命令使用。
- `Filament\Commands\FileGenerators\PanelProviderClassGenerator` 由 `filament:install` 和 `make:filament-panel` 命令使用。
- `Filament\Schemas\Commands\FileGenerators\ComponentClassGenerator` 由 `make:filament-schema-component` 命令使用。
- `Filament\Schemas\Commands\FileGenerators\LivewireSchemaComponentClassGenerator` 由 `make:filament-livewire-schema` 命令使用。
- `Filament\Schemas\Commands\FileGenerators\SchemaClassGenerator` 由 `make:filament-schema` 命令使用。
- `Filament\Tables\Commands\FileGenerators\ColumnClassGenerator` 由 `make:filament-table-column` 命令使用。
- `Filament\Tables\Commands\FileGenerators\LivewireTableComponentClassGenerator` 由 `make:filament-livewire-table` 命令使用。
- `Filament\Tables\Commands\FileGenerators\TableClassGenerator` 由 `make:filament-table` 命令使用。
- `Filament\Widgets\Commands\FileGenerators\ChartWidgetClassGenerator` 由 `make:filament-widget` 命令使用。
- `Filament\Widgets\Commands\FileGenerators\CustomWidgetClassGenerator` 由 `make:filament-widget` 命令使用。
- `Filament\Widgets\Commands\FileGenerators\StatsOverviewWidgetClassGenerator` 由 `make:filament-widget` 命令使用。
- `Filament\Widgets\Commands\FileGenerators\TableWidgetClassGenerator` 由 `make:filament-widget` 命令使用。

## 类生成器的结构

了解类生成器的最佳方式是查看它们的源代码。它们都遵循非常相似的模式，并使用 [`nette/php-generator`](https://github.com/nette/php-generator) 的功能。

以下是一些需要注意的方法：

- `__construct()` 接受传递给生成器的参数。这是你作为生成类上下文所能访问的所有信息。
- `getImports()` 返回正在生成的类中使用的导入。这不是一个排他性列表，在生成属性和方法时也可以添加导入，如果这比预先提供更容易的话。
- `getExtends()` 返回正在被继承的类的完全限定名称。
- `addTraitsToClass()` 用于向正在生成的类添加 trait。来自 `nette/php-generator` 的 `Class` 对象作为参数传入。
- `addPropertiesToClass()` 用于向正在生成的类添加属性。来自 `nette/php-generator` 的 `Class` 对象作为参数传入。
- `add*PropertyToClass()` 方法用于向正在生成的类添加单个属性。来自 `nette/php-generator` 的 `Class` 对象作为参数传入。它们通常从 `addPropertiesToClass()` 中调用。
- `addMethodsToClass()` 用于向正在生成的类添加方法。来自 `nette/php-generator` 的 `Class` 对象作为参数传入。
- `add*MethodToClass()` 方法用于向正在生成的类添加单个方法。来自 `nette/php-generator` 的 `Class` 对象作为参数传入。它们通常从 `addMethodsToClass()` 中调用。

## 替换类生成器

要能够更改文件的生成方式，你需要识别正确的类生成器（见上面的列表）并替换它。

要替换它，创建一个新类来继承你要替换的类生成器。例如，如果你想替换 `ResourceClassGenerator`，创建一个如下所示的新类：

```php
namespace App\Filament\Commands\FileGenerators\Resources;

use Filament\Commands\FileGenerators\Resources\ResourceClassGenerator as BaseResourceClassGenerator;

class ResourceClassGenerator extends BaseResourceClassGenerator
{
   // ...
}
```

你还需要在服务容器中将其注册为绑定。你可以在服务提供者（如 `AppServiceProvider`）中完成此操作：

```php
use App\Filament\Commands\FileGenerators\Resources\ResourceClassGenerator;
use Filament\Commands\FileGenerators\Resources\ResourceClassGenerator as BaseResourceClassGenerator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // ...
    
        $this->app->bind(BaseResourceClassGenerator::class, ResourceClassGenerator::class);
        
        // ...
    }
}
```

## 自定义类中的现有属性或方法

查看类生成器的源代码时，找到你想要自定义的属性或方法。你可以通过在类生成器中定义一个同名的新方法来覆盖它。例如，以下是一个你可以找到的用于向资源类添加 `$navigationIcon` 属性的方法：

```php
use BackedEnum;
use Filament\Support\Icons\Heroicon;
use Nette\PhpGenerator\ClassType;
use Nette\PhpGenerator\Literal;

protected function addNavigationIconPropertyToClass(ClassType $class): void
{
    $this->namespace->addUse(BackedEnum::class);
    $this->namespace->addUse(Heroicon::class);

    $property = $class->addProperty('navigationIcon', new Literal('Heroicon::OutlinedRectangleStack'))
        ->setProtected()
        ->setStatic()
        ->setType('string|BackedEnum|null');
    $this->configureNavigationIconProperty($property);
}
```

你可以覆盖该方法来更改其行为，或者你可以只覆盖 `configureNavigationIconProperty()` 方法来钩入属性的配置方式。例如，将属性从 `protected` 改为 `public`：

```php
use Nette\PhpGenerator\Property;

protected function configureNavigationIconProperty(Property $property): void
{
    $property->setPublic();
}
```

## 向类中添加新属性或方法

要向类中添加新属性或方法，你可以在 `addPropertiesToClass()` 或 `addMethodsToClass()` 方法中完成。要继承现有属性而不是替换它们，请确保在方法开头调用 `parent::addPropertiesToClass()` 或 `parent::addMethodsToClass()`。例如，以下是如何向资源类添加新属性：

```php
use Nette\PhpGenerator\ClassType;
use Nette\PhpGenerator\Literal;

protected function addPropertiesToClass(ClassType $class): void
{
    parent::addPropertiesToClass($class);

    $class->addProperty('navigationSort', 10)
        ->setProtected()
        ->setStatic()
        ->setType('?int');
}
```
