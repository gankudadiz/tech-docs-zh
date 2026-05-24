---
title: 图片条目
---

## 简介

信息列表可以根据条目状态中的路径渲染图片：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
```

在这种情况下，`header_image` 状态可能包含 `posts/header-images/4281246003439.jpg`，这是相对于存储磁盘根目录的路径。存储磁盘在[配置文件](../introduction/installation#发布配置)中定义，默认为 `local`。你也可以设置 `FILESYSTEM_DISK` 环境变量来更改此设置。

或者，状态可能包含图片的绝对 URL，例如 `https://example.com/images/header.jpg`。

![图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/simple.jpg)

## 管理图片磁盘

默认存储磁盘在[配置文件](../introduction/installation#发布配置)中定义，默认为 `local`。你也可以设置 `FILESYSTEM_DISK` 环境变量来更改此设置。如果你想偏离默认磁盘，可以将自定义磁盘名称传递给 `disk()` 方法：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->disk('s3')
```

除了允许静态值外，`disk()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 公开图片

默认情况下，Filament 会为文件系统中的图片生成临时 URL，除非[磁盘](#管理图片磁盘)设置为 `public`。如果你的图片存储在公开磁盘中，可以将 `visibility()` 设置为 `public`：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->visibility('public')
```

除了允许静态值外，`visibility()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 自定义大小

你可以通过传递 `imageWidth()` 和 `imageHeight()`，或使用 `imageSize()` 同时设置两者来自定义图片大小：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->imageWidth(200)

ImageEntry::make('header_image')
    ->imageHeight(50)

ImageEntry::make('author.avatar')
    ->imageSize(40)
```

除了允许静态值外，`imageWidth()`、`imageHeight()` 和 `imageSize()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。

![自定义大小的图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/size.jpg)

### 正方形图片

你可以使用 1:1 的宽高比显示图片：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->square()
```

![正方形图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/square.jpg)

你可以选择传递一个布尔值来控制图片是否应该是正方形：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->square(FeatureFlag::active())
```

除了允许静态值外，`square()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 圆形图片

你可以使图片完全圆角，这对于渲染头像很有用：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->circular()
```

![圆形图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/circular.jpg)

你可以选择传递一个布尔值来控制图片是否应该是圆形：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->circular(FeatureFlag::active())
```

除了允许静态值外，`circular()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 添加默认图片 URL

如果图片尚不存在，你可以通过向 `defaultImageUrl()` 方法传递 URL 来显示占位图片：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->defaultImageUrl(url('storage/posts/header-images/default.jpg'))
```

除了允许静态值外，`defaultImageUrl()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 堆叠图片

你可以使用 `stacked()` 将多张图片显示为重叠的图片堆栈：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
```

![堆叠图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/stacked.jpg)

你可以选择传递一个布尔值来控制图片是否应该堆叠：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked(FeatureFlag::active())
```

除了允许静态值外，`stacked()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 自定义堆叠环宽度

默认环宽度为 `3`，但你可以将其自定义为 `0` 到 `8`：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->ring(5)
```

![带有堆叠环宽度的图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/stacked-ring.jpg)

除了允许静态值外，`ring()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 自定义堆叠重叠

默认重叠为 `4`，但你可以将其自定义为 `0` 到 `8`：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->overlap(2)
```

![带有堆叠重叠的图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/stacked-overlap.jpg)

除了允许静态值外，`overlap()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 设置限制

你可以通过传递 `limit()` 来限制要显示的最大图片数量：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
```

除了允许静态值外，`limit()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![受限图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/limited.jpg)

### 显示剩余图片数量

设置限制时，你还可以通过传递 `limitedRemainingText()` 来显示剩余图片的数量。

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText()
```

![带有剩余文本的受限图片条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/limited-remaining-text.jpg)

你可以选择传递一个布尔值来控制是否显示剩余文本：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(FeatureFlag::active())
```

除了允许静态值外，`limitedRemainingText()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

#### 自定义受限剩余文本大小

默认情况下，剩余文本的大小为 `TextSize::Small`。你可以使用 `size` 参数将其自定义为 `TextSize::ExtraSmall`、`TextSize::Medium` 或 `TextSize::Large`：

```php
use Filament\Infolists\Components\ImageEntry;
use Filament\Support\Enums\TextSize;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(size: TextSize::Large)
```

除了允许静态值外，`limitedRemainingText()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 防止文件存在检查

加载 schema 时，它会自动检测图片是否存在以防止文件缺失错误。这都在后端完成。当使用远程存储并有大量图片时，这可能很耗时。你可以使用 `checkFileExistence(false)` 方法禁用此功能：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('attachment')
    ->checkFileExistence(false)
```

除了允许静态值外，`checkFileExistence()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 向图片添加额外 HTML 属性

你可以通过 `extraImgAttributes()` 方法将额外的 HTML 属性传递给 `<img>` 元素。属性应由数组表示，其中键是属性名称，值是属性值：

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('logo')
    ->extraImgAttributes([
        'alt' => 'Logo',
        'loading' => 'lazy',
    ])
```

除了允许静态值外，`extraImgAttributes()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

默认情况下，多次调用 `extraImgAttributes()` 将覆盖之前的属性。如果你想合并属性，可以将 `merge: true` 传递给方法。
