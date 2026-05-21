---
title: Image entry
---

## Introduction

Infolists can render images, based on the path in the state of the entry:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
```

In this case, the `header_image` state could contain `posts/header-images/4281246003439.jpg`, which is relative to the root directory of the storage disk. The storage disk is defined in the [configuration file](../introduction/installation#publishing-configuration), `local` by default. You can also set the `FILESYSTEM_DISK` environment variable to change this.

Alternatively, the state could contain an absolute URL to an image, such as `https://example.com/images/header.jpg`.

![Image entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/simple.jpg)

## Managing the image disk

The default storage disk is defined in the [configuration file](../introduction/installation#publishing-configuration), `local` by default. You can also set the `FILESYSTEM_DISK` environment variable to change this. If you want to deviate from the default disk, you may pass a custom disk name to the `disk()` method:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->disk('s3')
```

As well as allowing a static value, the `disk()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Public images

By default, Filament will generate temporary URLs to images in the filesystem, unless the [disk](#managing-the-image-disk) is set to `public`. If your images are stored in a public disk, you can set the `visibility()` to `public`:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->visibility('public')
```

As well as allowing a static value, the `visibility()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Customizing the size

You may customize the image size by passing a `imageWidth()` and `imageHeight()`, or both with `imageSize()`:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->imageWidth(200)

ImageEntry::make('header_image')
    ->imageHeight(50)

ImageEntry::make('author.avatar')
    ->imageSize(40)
```

As well as allowing a static values, the `imageWidth()`, `imageHeight()` and `imageSize()` methods also accept functions to dynamically calculate them. You can inject various utilities into the function as parameters.

![Image entry with custom size](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/size.jpg)

### Square images

You may display the image using a 1:1 aspect ratio:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->square()
```

![Square image entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/square.jpg)

Optionally, you may pass a boolean value to control if the image should be square or not:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->square(FeatureFlag::active())
```

As well as allowing a static value, the `square()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Circular images

You may make the image fully rounded, which is useful for rendering avatars:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->circular()
```

![Circular image entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/circular.jpg)

Optionally, you may pass a boolean value to control if the image should be circular or not:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->imageHeight(40)
    ->circular(FeatureFlag::active())
```

As well as allowing a static value, the `circular()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Adding a default image URL

You can display a placeholder image if one doesn't exist yet, by passing a URL to the `defaultImageUrl()` method:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->defaultImageUrl(url('storage/posts/header-images/default.jpg'))
```

As well as allowing a static value, the `defaultImageUrl()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Stacking images

You may display multiple images as a stack of overlapping images by using `stacked()`:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
```

![Stacked image entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/stacked.jpg)

Optionally, you may pass a boolean value to control if the images should be stacked or not:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked(FeatureFlag::active())
```

As well as allowing a static value, the `stacked()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

### Customizing the stacked ring width

The default ring width is `3`, but you may customize it to be from `0` to `8`:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->ring(5)
```

![Image entry with stacked ring width](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/stacked-ring.jpg)

As well as allowing a static value, the `ring()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

### Customizing the stacked overlap

The default overlap is `4`, but you may customize it to be from `0` to `8`:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->overlap(2)
```

![Image entry with stacked overlap](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/stacked-overlap.jpg)

As well as allowing a static value, the `overlap()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Setting a limit

You may limit the maximum number of images you want to display by passing `limit()`:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
```

As well as allowing a static value, the `limit()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

![Limited image entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/limited.jpg)

### Showing the remaining images count

When you set a limit you may also display the count of remaining images by passing `limitedRemainingText()`.

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText()
```

![Limited image entry with remaining text](/assets/filament/v4.x/screenshots/images/light/infolists/entries/image/limited-remaining-text.jpg)

Optionally, you may pass a boolean value to control if the remaining text should be displayed or not:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->imageHeight(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(FeatureFlag::active())
```

As well as allowing a static value, the `limitedRemainingText()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

#### Customizing the limited remaining text size

By default, the size of the remaining text is `TextSize::Small`. You can customize this to be `TextSize::ExtraSmall`, `TextSize::Medium` or `TextSize::Large` using the `size` parameter:

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

As well as allowing a static value, the `limitedRemainingText()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Prevent file existence checks

When the schema is loaded, it will automatically detect whether the images exist to prevent errors for missing files. This is all done on the backend. When using remote storage with many images, this can be time-consuming. You can use the `checkFileExistence(false)` method to disable this feature:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('attachment')
    ->checkFileExistence(false)
```

As well as allowing a static value, the `checkFileExistence()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

## Adding extra HTML attributes to the image

You can pass extra HTML attributes to the `<img>` element via the `extraImgAttributes()` method. The attributes should be represented by an array, where the key is the attribute name and the value is the attribute value:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('logo')
    ->extraImgAttributes([
        'alt' => 'Logo',
        'loading' => 'lazy',
    ])
```

As well as allowing a static value, the `extraImgAttributes()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

By default, calling `extraImgAttributes()` multiple times will overwrite the previous attributes. If you wish to merge the attributes instead, you can pass `merge: true` to the method.
