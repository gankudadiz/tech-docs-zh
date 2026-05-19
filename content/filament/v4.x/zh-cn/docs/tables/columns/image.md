---
title: 图片列
---

## 简介

表格可以根据列状态中的路径渲染图片：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
```

在这种情况下，`header_image` 状态可能包含 `posts/header-images/4281246003439.jpg`，这是相对于存储磁盘根目录的路径。存储磁盘在[配置文件](../../introduction/installation#publishing-configuration)中定义，默认为 `local`。你也可以设置 `FILESYSTEM_DISK` 环境变量来更改。

或者，状态可以包含图片的绝对 URL，如 `https://example.com/images/header.jpg`。

![图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/simple.jpg)

## 管理图片磁盘

默认存储磁盘在[配置文件](../../introduction/installation#publishing-configuration)中定义，默认为 `local`。你也可以设置 `FILESYSTEM_DISK` 环境变量来更改。如果你想偏离默认磁盘，可以向 `disk()` 方法传递自定义磁盘名称：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('header_image')
    ->disk('s3')
```

除固定值外，`disk()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 公开图片

默认情况下，Filament 会为文件系统中的图片生成临时 URL，除非[磁盘](#managing-the-image-disk)设置为 `public`。如果你的图片存储在公开磁盘中，可以将 `visibility()` 设置为 `public`：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('header_image')
    ->visibility('public')
```

除固定值外，`visibility()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 自定义大小

你可以通过传递 `imageWidth()` 和 `imageHeight()` 或同时使用 `imageSize()` 来自定义图片大小：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('header_image')
    ->imageWidth(200)

ImageColumn::make('header_image')
    ->imageHeight(50)

ImageColumn::make('avatar')
    ->imageSize(40)
```

![自定义大小的图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/size.jpg)

除固定值外，`imageWidth()`、`imageHeight()` 和 `imageSize()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 正方形图片

你可以使用 1:1 宽高比显示图片：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
    ->imageHeight(40)
    ->square()
```

![正方形图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/square.jpg)

你可以选择传递一个布尔值来控制图片是否应为正方形：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
    ->imageHeight(40)
    ->square(FeatureFlag::active())
```

除固定值外，`square()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 圆形图片

你可以使图片完全圆形，这对于渲染头像很有用：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
    ->imageHeight(40)
    ->circular()
```

![圆形图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/circular.jpg)

你可以选择传递一个布尔值来控制图片是否应为圆形：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
    ->imageHeight(40)
    ->circular(FeatureFlag::active())
```

除固定值外，`circular()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 添加默认图片 URL

如果图片尚不存在，你可以通过向 `defaultImageUrl()` 方法传递 URL 来显示占位图片：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('header_image')
    ->defaultImageUrl(url('storage/posts/header-images/default.jpg'))
```

除固定值外，`defaultImageUrl()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 堆叠图片

你可以使用 `stacked()` 将多张图片显示为重叠的图片堆栈：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
```

![堆叠图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/stacked.jpg)

你可以选择传递一个布尔值来控制图片是否应堆叠：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked(FeatureFlag::active())
```

除固定值外，`stacked()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 自定义堆叠环宽度

默认环宽度为 `3`，但你可以将其自定义为 `0` 到 `8`：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->ring(5)
```

![堆叠环宽度的图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/stacked-ring.jpg)

除固定值外，`ring()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 自定义堆叠重叠

默认重叠为 `4`，但你可以将其自定义为 `0` 到 `8`：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->overlap(2)
```

![堆叠重叠的图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/stacked-overlap.jpg)

除固定值外，`overlap()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 设置限制

你可以通过传递 `limit()` 来限制要显示的最大图片数量：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
```

除固定值外，`limit()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![限制图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/limited.jpg)

### 显示剩余图片数量

设置限制时，你还可以通过传递 `limitedRemainingText()` 来显示剩余图片的数量。

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText()
```

![带剩余文本的限制图片列](/assets/filament/v4.x/screenshots/images/light/tables/columns/image/limited-remaining-text.jpg)

你可以选择传递一个布尔值来控制是否应显示剩余文本：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(FeatureFlag::active())
```

除固定值外，`limitedRemainingText()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

#### 自定义剩余文本大小

默认情况下，剩余文本的大小为 `TextSize::Small`。你可以使用 `size` 参数将其自定义为 `TextSize::ExtraSmall`、`TextSize::Medium` 或 `TextSize::Large`：

```php
use Filament\Tables\Columns\ImageColumn;
use Filament\Support\Enums\TextSize;

ImageColumn::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(size: TextSize::Large)
```

除固定值外，`limitedRemainingText()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 防止文件存在性检查

加载模式时，它会自动检测图片是否存在以防止缺失文件错误。这都在后端完成。使用远程存储和大量图片时，这可能很耗时。你可以使用 `checkFileExistence(false)` 方法禁用此功能：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('attachment')
    ->checkFileExistence(false)
```

除固定值外，`checkFileExistence()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 换行多张图片

如果图片无法放在一行上，可以使用 `wrap()` 设置换行：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->wrap()
```

:::tip
换行的"宽度"受列标签影响，因此你可能需要使用更短或隐藏的标签来更紧密地换行。
:::

## 为图片添加额外 HTML 属性

你可以通过 `extraImgAttributes()` 方法向 `<img>` 元素传递额外的 HTML 属性。属性应以数组表示，其中键是属性名，值是属性值：

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('logo')
    ->extraImgAttributes([
        'alt' => 'Logo',
        'loading' => 'lazy',
    ])
```

除固定值外，`extraImgAttributes()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

默认情况下，多次调用 `extraImgAttributes()` 将覆盖先前的属性。如果你希望合并属性，可以向方法传递 `merge: true`。
