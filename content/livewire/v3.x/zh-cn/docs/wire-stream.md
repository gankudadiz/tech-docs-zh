---
title: wire:stream
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-stream.md
source_version: v3.8.0
translation_status: draft
---

Livewire 允许你通过 `wire:stream` API 在请求完成之前将内容流式传输到网页。这对于 AI 聊天机器人等流式传输响应的功能非常有用。

:::warning[与 Laravel Octane 不兼容]
Livewire 目前不支持将 `wire:stream` 与 Laravel Octane 配合使用。
:::

为了演示 `wire:stream` 最基本的功能，下面是一个简单的 CountDown 组件，当按下按钮时，会向用户显示从"3"到"0"的倒计时：

```php
use Livewire\Component;

class CountDown extends Component
{
    public $start = 3;

    public function begin()
    {
        while ($this->start >= 0) {
            // 将当前计数流式传输到浏览器...
            $this->stream(  // [tl! highlight:4]
                to: 'count',
                content: $this->start,
                replace: true,
            );

            // 在每个数字之间暂停 1 秒...
            sleep(1);

            // 递减计数器...
            $this->start = $this->start - 1;
        };
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <button wire:click="begin">Start count-down</button>

            <h1>Count: <span wire:stream="count">{{ $start }}</span></h1> <!-- [tl! highlight] -->
        </div>
        HTML;
    }
}
```

以下是从用户角度按下"Start count-down"时发生的情况：
* 页面上显示"Count: 3"
* 用户按下"Start count-down"按钮
* 一秒钟后显示"Count: 2"
* 此过程持续直到显示"Count: 0"

上述所有操作都在单个网络请求到服务器的过程中完成。

以下是从系统角度按下按钮时发生的情况：
* 向 Livewire 发送请求调用 `begin()` 方法
* `begin()` 方法被调用，`while` 循环开始
* `$this->stream()` 被调用，立即向浏览器开始"流式响应"
* 浏览器收到流式响应，其中包含指令：在组件中找到具有 `wire:stream="count"` 的元素，并将其内容替换为接收到的数据（第一个流式数字为"3"）
* `sleep(1)` 方法使服务器暂停一秒
* `while` 循环重复，每秒流式传输一个新数字的过程持续，直到 `while` 条件为假
* 当 `begin()` 执行完毕并且所有计数都已流式传输到浏览器后，Livewire 完成其请求生命周期，渲染组件并将最终响应发送到浏览器

## 流式传输聊天机器人回复

`wire:stream` 的一个常见用途是在从支持流式响应的 API（例如 [OpenAI 的 ChatGPT](https://chat.openai.com/)）接收聊天机器人回复时进行流式传输。

以下是一个使用 `wire:stream` 实现类似 ChatGPT 界面的示例：

```php
use Livewire\Component;

class ChatBot extends Component
{
    public $prompt = '';

    public $question = '';

    public $answer = '';

    function submitPrompt()
    {
        $this->question = $this->prompt;

        $this->prompt = '';

        $this->js('$wire.ask()');
    }

    function ask()
    {
        $this->answer = OpenAI::ask($this->question, function ($partial) {
            $this->stream(to: 'answer', content: $partial); // [tl! highlight]
        });
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <section>
                <div>ChatBot</div>

                @if ($question)
                    <article>
                        <hgroup>
                            <h3>User</h3>
                            <p>{{ $question }}</p>
                        </hgroup>

                        <hgroup>
                            <h3>ChatBot</h3>
                            <p wire:stream="answer">{{ $answer }}</p> <!-- [tl! highlight] -->
                        </hgroup>
                    </article>
                @endif
            </section>

            <form wire:submit="submitPrompt">
                <input wire:model="prompt" type="text" placeholder="Send a message" autofocus>
            </form>
        </div>
        HTML;
    }
}
```

上述示例中的流程：
* 用户在标有"Send a message"的文本字段中输入内容，向聊天机器人提问。
* 用户按下 [Enter] 键。
* 网络请求发送到服务器，将消息设置为 `$question` 属性，并清除 `$prompt` 属性。
* 响应发送回浏览器，输入被清除。由于调用了 `$this->js('...')`，一个新的请求被触发到服务器，调用 `ask()` 方法。
* `ask()` 方法调用聊天机器人 API，并通过回调中的 `$partial` 参数接收流式响应片段。
* 每个 `$partial` 被流式传输到页面上的 `wire:stream="answer"` 元素，逐步向用户展示答案。
* 当收到完整响应时，Livewire 请求完成，用户收到完整的回复。

## 替换 vs. 追加

当使用 `$this->stream()` 将内容流式传输到元素时，你可以告诉 Livewire 是用流式内容替换目标元素的现有内容，还是将其追加到现有内容后。

替换或追加都可能是理想的，具体取决于场景。例如，流式传输聊天机器人的回复时，通常希望追加（因此这是默认行为）。然而，在显示倒计时之类的内容时，替换更合适。

你可以通过向 `$this->stream` 传递布尔值的 `replace:` 参数来配置：

```php
// 追加内容...
$this->stream(to: 'target', content: '...');

// 替换内容...
$this->stream(to: 'target', content: '...', replace: true);
```

追加/替换也可以在目标元素级别通过添加或移除 `.replace` 修饰符来指定：

```blade
// 追加内容...
<div wire:stream="target">

// 替换内容...
<div wire:stream.replace="target">
```
