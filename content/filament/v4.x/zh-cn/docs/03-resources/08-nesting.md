---
title: 嵌套资源
---

## 概述

[关联管理器](managing-relationships#creating-a-relation-manager)和[关联页面](managing-relationships#relation-pages)为你提供了一种在资源中渲染关联记录表格的简便方式。

例如，在 `CourseResource` 中，你可能有一个用于该课程所属 `lessons` 的关联管理器或页面。你可以从表格中创建和编辑课程，这会打开模态对话框。

然而，课程可能过于复杂，无法在模态中创建和编辑。你可能希望课程拥有自己的资源，这样创建和编辑它们将是一种完整的页面体验。这就是嵌套资源。

![在文章下嵌套资源列出评论的示例](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/nested.jpg)

## 创建嵌套资源

要创建嵌套资源，你可以使用 `make:filament-resource` 命令并配合 `--nested` 选项：

```bash
php artisan make:filament-resource Lesson --nested
```

要访问嵌套资源，你还需要一个[关联管理器](managing-relationships#creating-a-relation-manager)或[关联页面](managing-relationships#relation-pages)。这是用户查看关联记录列表，并点击"创建"和"编辑"页面链接的地方。

要创建关联管理器或页面，你可以使用 `make:filament-relation-manager` 或 `make:filament-page` 命令：

```bash
php artisan make:filament-relation-manager CourseResource lessons title

php artisan make:filament-page ManageCourseLessons --resource=CourseResource --type=ManageRelatedRecords
```

创建关联管理器或页面时，Filament 会询问你是否希望每个表格行都链接到资源而不是打开模态，你应该回答"是"并选择你刚刚创建的嵌套资源。

生成关联管理器或页面后，它将包含一个指向嵌套资源的属性：

```php
use App\Filament\Resources\Courses\Resources\Lessons\LessonResource;

protected static ?string $relatedResource = LessonResource::class;
```

嵌套资源类将包含一个指向父资源的属性：

```php
use App\Filament\Resources\Courses\CourseResource;

protected static ?string $parentResource = CourseResource::class;
```

## 自定义关联名称

与关联管理器和页面根据关系中的模型来预测关系名称的方式类似，嵌套资源也采用同样的方式。有时，你可能有一个不符合传统关系命名约定的关系，这时你需要通知 Filament 嵌套资源的正确关联名称。

要自定义关联名称，首先从嵌套资源类中移除 `$parentResource` 属性。然后定义 `getParentResourceRegistration()` 方法：

```php
use App\Filament\Resources\Courses\CourseResource;
use Filament\Resources\ParentResourceRegistration;

public static function getParentResourceRegistration(): ?ParentResourceRegistration
{
    return CourseResource::asParent()
        ->relationship('lessons')
        ->inverseRelationship('course');
}
```

如果你希望使用默认名称，可以省略 `relationship()` 和 `inverseRelationship()` 的调用。

## 以正确的 URL 注册关联管理器

当处理由关联管理器列出的嵌套资源，且该关联管理器与其他关联管理器共存于同一页面时，你可能会注意到从嵌套资源重定向回该关联管理器时 URL 不正确。这是因为资源上注册的每个关联管理器都被分配了一个整数，用于在 URL 中标识它，以便在多个关联管理器之间切换。例如，URL 中的 `?relation=0` 可能代表一个关联管理器，而 `?relation=1` 可能代表另一个。

从嵌套资源重定向回关联管理器时，Filament 会假设关系名称用于在 URL 中标识该关联管理器。例如，如果你有一个嵌套的 `LessonResource` 和一个 `LessonsRelationManager`，关系名称是 `lessons`，在注册时它应作为该关联管理器的 [URL 参数键](managing-relationships#customizing-the-relation-managers-url-parameter)：

```php
public static function getRelations(): array
{
    return [
        'lessons' => LessonsRelationManager::class,
    ];
}
```
