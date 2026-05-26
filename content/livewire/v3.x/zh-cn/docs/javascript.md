---
title: JavaScript
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/javascript.md
source_version: v3.8.0
translation_status: draft
---

## 在 Livewire 组件中使用 JavaScript

Livewire 和 Alpine 提供了大量用于直接在 HTML 中构建动态组件的工具，然而，有时跳出 HTML、为组件执行纯 JavaScript 会更加方便。Livewire 的 `@script` 和 `@assets` 指令让你可以以可预测、可维护的方式做到这一点。

### 执行脚本

要在 Livewire 组件中执行自定义 JavaScript，只需用 `@script` 和 `@endscript` 包裹一个 `<script>` 元素。这将告诉 Livewire 负责处理此 JavaScript 的执行。

由于 `@script` 内部的脚本由 Livewire 处理，它们在页面加载之后、Livewire 组件渲染之前的完美时机执行。这意味着你不再需要将脚本包裹在 `document.addEventListener('...')` 中来正确加载它们。

这也意味着懒加载或条件加载的 Livewire 组件仍然能够在页面初始化后执行 JavaScript。

```blade
<div>
    ...
</div>

@script
<script>
    // 此 JavaScript 将在每次该组件加载到页面上时执行...
</script>
@endscript
```

以下是一个更完整的示例，你可以注册一个在 Livewire 组件中使用的 JavaScript 操作。

```blade
<div>
    <button wire:click="$js.increment">+</button>
</div>

@script
<script>
    $js('increment', () => {
        console.log('increment')
    })
</script>
@endscript
```

要了解更多关于 JavaScript 操作的信息，请[访问 actions 文档页面](/docs/livewire/v3.x/actions#javascript-actions)。

### 从脚本中使用 `$wire`

使用 `@script` 编写 JavaScript 的另一个有用特性是，你可以自动访问 Livewire 组件的 `$wire` 对象。

以下是一个使用简单 `setInterval` 每 2 秒刷新组件的示例（你当然可以使用 [`wire:poll`](/docs/livewire/v3.x/wire-poll) 轻松做到这一点，但这是演示该功能的简单方式）：

你可以在 [`$wire` 文档](#wire-对象)中了解更多关于 `$wire` 的信息。

```blade
@script
<script>
    setInterval(() => {
        $wire.$refresh()
    }, 2000)
</script>
@endscript
```

### 执行一次性 JavaScript 表达式

除了将整个方法指定为 JavaScript 执行之外，你还可以使用 `js()` 方法在后端评估较小的、单独的表达式。

这通常用于在服务端操作执行后执行某种客户端后续操作。

例如，以下是一个 `CreatePost` 组件示例，在文章保存到数据库后触发客户端 alert 对话框：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = '';

    public function save()
    {
        // ...

        $this->js("alert('Post saved!')"); // [tl! highlight:6]
    }
}
```

JavaScript 表达式 `alert('Post saved!')` 现在会在文章保存到服务器数据库后在客户端执行。

你可以在表达式中访问当前组件的 `$wire` 对象。

### 加载资源

`@script` 指令对于在每次 Livewire 组件加载时执行一段 JavaScript 很有用，然而，有时你可能希望随组件一起将完整的脚本和样式资源加载到页面上。

以下是使用 `@assets` 加载名为 [Pikaday](https://github.com/Pikaday/Pikaday) 的日期选择器库，并使用 `@script` 在组件中初始化它的示例：

```blade
<div>
    <input type="text" data-picker>
</div>

@assets
<script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js" defer></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endassets

@script
<script>
    new Pikaday({ field: $wire.$el.querySelector('[data-picker]') });
</script>
@endscript
```

当此组件加载时，Livewire 会确保所有 `@assets` 在评估 `@script` 之前已加载到页面上。此外，它还会确保提供的 `@assets` 每页只加载一次，无论此组件有多少个实例——这与 `@script` 不同，`@script` 会为页面上的每个组件实例分别执行。

## 全局 Livewire 事件

Livewire 提供两个有用的浏览器事件，供你从外部脚本注册任何自定义扩展点：

```html
<script>
    document.addEventListener('livewire:init', () => {
        // 在 Livewire 加载之后但在页面初始化之前运行...
    })

    document.addEventListener('livewire:initialized', () => {
        // 在 Livewire 完成页面初始化后立即运行...
    })
</script>
```

:::info[建议在 livewire:init 中注册扩展]
在 `livewire:init` 内部注册任何[自定义指令](#注册自定义指令)或[生命周期钩子](#javascript-钩子)通常是有益的，这样它们就可以在 Livewire 开始在页面上初始化之前可用。
:::

## `Livewire` 全局对象

Livewire 的全局对象是从外部脚本与 Livewire 交互的最佳起点。

你可以从客户端代码的任何位置通过 `window` 访问全局的 `Livewire` JavaScript 对象。

在 `livewire:init` 事件监听器中使用 `window.Livewire` 通常很有帮助。

### 访问组件

你可以使用以下方法访问当前页面上加载的特定 Livewire 组件：

```js
// 获取页面上第一个组件的 $wire 对象...
let component = Livewire.first()

// 通过组件 ID 获取其 $wire 对象...
let component = Livewire.find(id)

// 通过名称获取组件 $wire 对象的数组...
let components = Livewire.getByName(name)

// 获取页面上每个组件的 $wire 对象...
let components = Livewire.all()
```

:::info[每个方法返回 $wire 对象]
每个方法都返回一个表示 Livewire 中组件状态的 `$wire` 对象。

你可以在 [`$wire` 文档](#wire-对象)中了解更多关于这些对象的信息。
:::

### 与事件交互

除了在 PHP 中从单个组件分派和监听事件外，全局 `Livewire` 对象允许你从应用中的任何位置与 [Livewire 的事件系统](/docs/livewire/v3.x/events)进行交互：

```js
// 向任何正在监听的 Livewire 组件分派事件...
Livewire.dispatch('post-created', { postId: 2 })

// 向指定的 Livewire 组件按名称分派事件...
Livewire.dispatchTo('dashboard', 'post-created', { postId: 2 })

// 监听从 Livewire 组件分派的事件...
Livewire.on('post-created', ({ postId }) => {
    // ...
})
```

在某些场景下，你可能需要取消注册全局 Livewire 事件。例如，当使用 Alpine 组件和 `wire:navigate` 时，由于在页面之间导航时会调用 `init`，可能会注册多个监听器。要解决这个问题，可以利用 Alpine 自动调用的 `destroy` 函数。在此函数中遍历所有监听器取消注册它们，防止不需要的累积。

```js
Alpine.data('MyComponent', () => ({
    listeners: [],
    init() {
        this.listeners.push(
            Livewire.on('post-created', (options) => {
                // 做些什么...
            })
        );
    },
    destroy() {
        this.listeners.forEach((listener) => {
            listener();
        });
    }
}));
```

### 使用生命周期钩子

Livewire 允许你使用 `Livewire.hook()` 挂钩到其全局生命周期的各个部分：

```js
// 注册一个在指定 Livewire 内部钩子上执行的回调...
Livewire.hook('component.init', ({ component, cleanup }) => {
    // ...
})
```

更多关于 Livewire 的 JavaScript 钩子的信息可以在[下方找到](#javascript-钩子)。

### 注册自定义指令

Livewire 允许你使用 `Livewire.directive()` 注册自定义指令。

以下是一个自定义 `wire:confirm` 指令的示例，它使用 JavaScript 的 `confirm()` 对话框在操作发送到服务器之前确认或取消：

```html
<button wire:confirm="Are you sure?" wire:click="delete">Delete post</button>
```

以下是使用 `Livewire.directive()` 实现 `wire:confirm` 的代码：

```js
Livewire.directive('confirm', ({ el, directive, component, cleanup }) => {
    let content =  directive.expression

    // "directive" 对象让你可以访问解析后的指令。
    // 例如，以下是 wire:click.prevent="deletePost(1)" 的值：
    //
    // directive.raw = wire:click.prevent
    // directive.value = "click"
    // directive.modifiers = ['prevent']
    // directive.expression = "deletePost(1)"

    let onClick = e => {
        if (! confirm(content)) {
            e.preventDefault()
            e.stopImmediatePropagation()
        }
    }

    el.addEventListener('click', onClick, { capture: true })

    // 在 Livewire 组件从 DOM 中移除而页面仍处于活跃状态时，
    // 通过 cleanup() 注册清理代码。
    cleanup(() => {
        el.removeEventListener('click', onClick)
    })
})
```

## 对象模式

在扩展 Livewire 的 JavaScript 系统时，理解你可能遇到的不同对象非常重要。

以下是 Livewire 每个相关内部属性的详尽参考。

请注意，普通 Livewire 用户可能永远不会与这些交互。大多数这些对象是为 Livewire 的内部系统或高级用户准备的。

### `$wire` 对象

给定以下通用的 `Counter` 组件：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

Livewire 以对象的形 式暴露服务端组件的 JavaScript 表示形式，通常称为 `$wire`：

```js
let $wire = {
    // 所有组件公共属性都可以直接在 $wire 上访问...
    count: 0,

    // 所有公共方法都在 $wire 上暴露并可调用...
    increment() { ... },

    // 访问父组件的 $wire 对象（如果存在）...
    $parent,

    // 访问 Livewire 组件的根 DOM 元素...
    $el,

    // 访问当前 Livewire 组件的 ID...
    $id,

    // 通过名称获取属性值...
    // 用法：$wire.$get('count')
    $get(name) { ... },

    // 通过名称设置组件的属性...
    // 用法：$wire.$set('count', 5)
    $set(name, value, live = true) { ... },

    // 切换布尔属性的值...
    $toggle(name, live = true) { ... },

    // 调用方法...
    // 用法：$wire.$call('increment')
    $call(method, ...params) { ... },

    // 定义 JavaScript 操作...
    // 用法：$wire.$js('increment', () => { ... })
    $js(name, callback) { ... },

    // 将 Livewire 属性值与不同的、任意的 Alpine 属性绑定...
    // 用法：<div x-data="{ count: $wire.$entangle('count') }">
    $entangle(name, live = false) { ... },

    // 监听属性值的变化...
    // 用法：Alpine.$watch('count', (value, old) => { ... })
    $watch(name, callback) { ... },

    // 刷新组件：向服务器发送 commit 以重新渲染 HTML 并交换到页面中...
    $refresh() { ... },

    // 与上面 $refresh 相同，只是技术名称不同...
    $commit() { ... },

    // 监听从此组件或其子组件分派的事件...
    // 用法：$wire.$on('post-created', () => { ... })
    $on(event, callback) { ... },

    // 监听从此组件或请求触发的生命周期钩子...
    // 用法：$wire.$hook('commit', () => { ... })
    $hook(name, callback) { ... },

    // 从此组件分派事件...
    // 用法：$wire.$dispatch('post-created', { postId: 2 })
    $dispatch(event, params = {}) { ... },

    // 向另一个组件分派事件...
    // 用法：$wire.$dispatchTo('dashboard', 'post-created', { postId: 2 })
    $dispatchTo(otherComponentName, event, params = {}) { ... },

    // 仅向此组件自身分派事件，不影响其他组件...
    $dispatchSelf(event, params = {}) { ... },

    // 文件上传 JS API，直接上传到组件，而不是通过 wire:model...
    $upload(
        name, // 属性名
        file, // 文件 JavaScript 对象
        finish = () => { ... }, // 上传完成时运行...
        error = () => { ... }, // 上传过程中触发错误时运行...
        progress = (event) => { // 上传进行中运行...
            event.detail.progress // 1-100 的整数...
        },
    ) { ... },

    // 同时上传多个文件的 API...
    $uploadMultiple(name, files, finish, error, progress) { },

    // 删除已临时上传但未保存的文件...
    $removeUpload(name, tmpFilename, finish, error) { ... },

    // 获取底层的 "component" 对象...
    __instance() { ... },
}
```

你可以在 [Livewire 关于在 JavaScript 中访问属性的文档](/docs/livewire/v3.x/properties#accessing-properties-from-javascript)中了解更多关于 `$wire` 的信息。

### `snapshot` 对象

在每次网络请求之间，Livewire 将 PHP 组件序列化为一个可以在 JavaScript 中使用的对象。此快照用于将组件反序列化回 PHP 对象，因此内置了防止篡改的机制：

```js
let snapshot = {
    // 组件的序列化状态（公共属性）...
    data: { count: 0 },

    // 组件的长期信息...
    memo: {
        // 组件的唯一 ID...
        id: '0qCY3ri9pzSSMIXPGg8F',

        // 组件名称。例如：<livewire:[name] />
        name: 'counter',

        // 组件最初加载时所在网页的 URI、方法和区域设置。
        // 用于将原始请求的任何中间件重新应用于后续组件更新请求（commits）...
        path: '/',
        method: 'GET',
        locale: 'en',

        // 任何嵌套"子"组件的列表。按内部模板 ID 为键，
        // 以组件 ID 为值...
        children: [],

        // 此组件是否是"懒加载"的...
        lazyLoaded: false,

        // 上次请求中抛出的验证错误列表...
        errors: [],
    },

    // 此快照的安全加密哈希。这样，如果恶意用户篡改快照
    // 以访问服务器上不拥有的资源，校验和验证将失败并抛出错误...
    checksum: '1bc274eea17a434e33d26bcaba4a247a4a7768bd286456a83ea6e9be2d18c1e7',
}
```

### `component` 对象

页面上的每个组件在幕后都有一个对应的 component 对象，跟踪其状态并暴露其底层功能。这比 `$wire` 更深一层，仅供高级使用。

以下是上述 `Counter` 组件的实际 component 对象，并用 JS 注释描述相关属性：

```js
let component = {
    // 组件的根 HTML 元素...
    el: HTMLElement,

    // 组件的唯一 ID...
    id: '0qCY3ri9pzSSMIXPGg8F',

    // 组件的 "name" (<livewire:[name] />)...
    name: 'counter',

    // 最新的 "effects" 对象。effects 是服务器往返的"副作用"，
    // 包括重定向、文件下载等...
    effects: {},

    // 组件上一次已知的服务端状态...
    canonical: { count: 0 },

    // 组件表示其活跃客户端状态的可变 data 对象...
    ephemeral: { count: 0 },

    // this.ephemeral 的响应式版本。对此对象的更改
    // 将被 AlpineJS 表达式捕获...
    reactive: Proxy,

    // 通常在 Alpine 表达式中作为 $wire 使用的 Proxy 对象。
    // 旨在为 Livewire 组件提供友好的 JS 对象接口...
    $wire: Proxy,

    // 任何嵌套"子"组件的列表。按内部模板 ID 为键，
    // 以组件 ID 为值...
    children: [],

    // 此组件上一次已知的 "snapshot" 表示形式。
    // 快照从服务端组件获取，用于在后端重新创建 PHP 对象...
    snapshot: {...},

    // 上述快照的未解析版本。用于在下一次往返中发送回服务器，
    // 因为 JS 解析会干扰 PHP 编码，通常导致校验和不匹配。
    snapshotEncoded: '{"data":{"count":0},"memo":{"id":"0qCY3ri9pzSSMIXPGg8F","name":"counter","path":"\/","method":"GET","children":[],"lazyLoaded":true,"errors":[],"locale":"en"},"checksum":"1bc274eea17a434e33d26bcaba4a247a4a7768bd286456a83ea6e9be2d18c1e7"}',
}
```

### `commit` 负载

当在浏览器中对 Livewire 组件执行操作时，会触发网络请求。该网络请求包含一个或多个组件以及发送给服务器的各种指令。在内部，这些组件网络负载被称为"commits"。

术语 "commit" 有助于理解 Livewire 在前端和后端之间的关系。组件在前端渲染和操作，直到执行一个需要"提交"其状态和更新到后端的操作。

你将在浏览器 DevTools 网络标签页的负载或 [Livewire 的 JavaScript 钩子](#javascript-钩子)中识别出此模式：

```js
let commit = {
    // Snapshot 对象...
    snapshot: { ... },

    // 要在服务器上更新的属性的键值对列表...
    updates: {},

    // 要在服务端调用的方法（及其参数）数组...
    calls: [
        { method: 'increment', params: [] },
    ],
}
```

## JavaScript 钩子

对于高级用户，Livewire 暴露了其内部客户端的"钩子"系统。你可以使用以下钩子来扩展 Livewire 的功能或获取关于 Livewire 应用的更多信息。

### 组件初始化

每当 Livewire 发现一个新组件时——无论是在初始页面加载时还是在之后——都会触发 `component.init` 事件。你可以挂入 `component.init` 来拦截或初始化与新组件相关的任何内容：

```js
Livewire.hook('component.init', ({ component, cleanup }) => {
    //
})
```

更多信息请参考[关于 component 对象的文档](#component-对象)。

### DOM 元素初始化

除了在新组件初始化时触发事件外，Livewire 还会为给定 Livewire 组件内的每个 DOM 元素触发事件。

这可用于在你的应用中提供自定义的 Livewire HTML 属性：

```js
Livewire.hook('element.init', ({ component, el }) => {
    //
})
```

### DOM 形态变换钩子

在 DOM 形态变换阶段——即 Livewire 完成网络往返后——Livewire 会为每个被变更的元素触发一系列事件。

```js
Livewire.hook('morph.updating',  ({ el, component, toEl, skip, childrenOnly }) => {
	//
})

Livewire.hook('morph.updated', ({ el, component }) => {
	//
})

Livewire.hook('morph.removing', ({ el, component, skip }) => {
	//
})

Livewire.hook('morph.removed', ({ el, component }) => {
	//
})

Livewire.hook('morph.adding',  ({ el, component }) => {
	//
})

Livewire.hook('morph.added',  ({ el }) => {
	//
})
```

除了每个元素触发的事件外，还会为每个 Livewire 组件触发 `morph` 和 `morphed` 事件：

```js
Livewire.hook('morph',  ({ el, component }) => {
	// 在 component 中的子元素即将被 morph 之前运行
})

Livewire.hook('morphed',  ({ el, component }) => {
    // 在 component 中的所有子元素都 morph 完成后运行
})
```

### Commit 钩子

由于 Livewire 请求包含多个组件，用_请求_来指代单个组件的请求和响应负载太宽泛了。因此，在内部，Livewire 将组件更新称为 _commits_——指的是将组件状态_提交_到服务器。

这些钩子暴露 `commit` 对象。你可以通过阅读[commit 对象文档](#commit-负载)了解更多关于其模式的信息。

#### 准备 commits

`commit.prepare` 钩子将在请求即将发送到服务器之前触发。这让你有机会为即将发出的请求添加任何最后的更新或操作：

```js
Livewire.hook('commit.prepare', ({ component }) => {
    // 在 commit 负载被收集并发送到服务器之前运行...
})
```

#### 拦截 commits

每当 Livewire 组件被发送到服务器时，就会产生一个 _commit_。要挂入单个 commit 的生命周期和内容，Livewire 暴露了 `commit` 钩子。

这个钩子非常强大，因为它提供了挂入 Livewire commit 的请求和响应的方法：

```js
Livewire.hook('commit', ({ component, commit, respond, succeed, fail }) => {
    // 在 commit 负载即将发送到服务器之前立即运行...

    respond(() => {
        // 在收到响应之后、处理之前运行...
    })

    succeed(({ snapshot, effects }) => {
        // 在成功响应被接收并处理后运行，
        // 带有新的 snapshot 和 effects 列表...
    })

    fail(() => {
        // 如果请求某部分失败时运行...
    })
})
```

## 请求钩子

如果你希望挂入整个 HTTP 请求的发送和返回过程，可以使用 `request` 钩子：

```js
Livewire.hook('request', ({ url, options, payload, respond, succeed, fail }) => {
    // 在 commit 负载编译完成后、网络请求发送之前运行...

    respond(({ status, response }) => {
        // 当收到响应时运行...
        // "response" 是原始 HTTP 响应对象，在 await response.text() 之前...
    })

    succeed(({ status, json }) => {
        // 当收到响应时运行...
        // "json" 是 JSON 响应对象...
    })

    fail(({ status, content, preventDefault }) => {
        // 当响应带有错误状态码时运行...
        // "preventDefault" 允许你禁用 Livewire 的默认错误处理...
        // "content" 是原始响应内容...
    })
})
```

### 自定义页面过期行为

如果默认的页面过期对话框不适合你的应用，你可以使用 `request` 钩子实现自定义解决方案：

```html
<script>
    document.addEventListener('livewire:init', () => {
        Livewire.hook('request', ({ fail }) => {
            fail(({ status, preventDefault }) => {
                if (status === 419) {
                    confirm('你的自定义页面过期行为...')

                    preventDefault()
                }
            })
        })
    })
</script>
```

在应用中添加上面的代码后，用户在会话过期时将收到自定义对话框。
