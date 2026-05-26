---
title: wire:model
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-model.md
source_version: v3.8.0
translation_status: draft
---

Livewire 通过 `wire:model` 可以轻松地将组件属性值与表单输入进行绑定。

以下是一个在"创建文章"组件中使用 `wire:model` 将 `$title` 和 `$content` 属性与表单输入绑定的简单示例：

```php
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title = '';

    public $content = '';

    public function save()
    {
		$post = Post::create([
			'title' => $this->title
			'content' => $this->content
		]);

        // ...
    }
}
```

```blade
<form wire:submit="save">
    <label>
        <span>Title</span>

        <input type="text" wire:model="title"> <!-- [tl! highlight] -->
    </label>

    <label>
        <span>Content</span>

        <textarea wire:model="content"></textarea> <!-- [tl! highlight] -->
    </label>

	<button type="submit">Save</button>
</form>
```

因为两个输入都使用了 `wire:model`，当按下"Save"按钮时，它们的值将与服务器端的属性同步。

:::warning["为什么我的组件没有随着输入实时更新？"]
如果你在浏览器中尝试后发现标题没有自动更新，请不要困惑——这是因为 Livewire 只在提交"动作"（比如按下提交按钮）时更新组件，而不是在用户输入字段时更新。这减少了网络请求，提高了性能。要启用用户输入时的"实时"更新，可以使用 `wire:model.live` 代替。[了解更多关于数据绑定的信息](/docs/livewire/v3.x/properties#data-binding)。
:::

## 自定义更新时机

默认情况下，Livewire 只会在执行动作时（如 `wire:click` 或 `wire:submit`）发送网络请求，而**不会**在 `wire:model` 输入更新时发送。

这通过减少网络请求大幅提升了 Livewire 的性能，为用户提供了更流畅的体验。

不过，有时你可能希望更频繁地更新服务器，例如实现实时验证。

### 实时更新

要在用户输入时向服务器发送属性更新，可以为 `wire:model` 附加 `.live` 修饰符：

```html
<input type="text" wire:model.live="title">
```

#### 自定义防抖

默认情况下，使用 `wire:model.live` 时，Livewire 会为服务器更新添加 150 毫秒的防抖。这意味着如果用户持续输入，Livewire 会等到用户停止输入 150 毫秒后再发送请求。

你可以通过附加 `.debounce.Xms` 来自定义此时间。以下是将防抖改为 250 毫秒的示例：

```html
<input type="text" wire:model.live.debounce.250ms="title">
```

### 在"失焦"事件时更新

通过附加 `.blur` 修饰符，Livewire 只会在用户点击离开输入框或按下 Tab 键移动到下一个输入时发送属性更新的网络请求。

添加 `.blur` 适用于希望更频繁更新服务器，但不需要在用户输入时更新的场景。例如，实时验证是 `.blur` 常见的应用场景。

```html
<input type="text" wire:model.blur="title">
```

### 在"变更"事件时更新

有时 `.blur` 的行为不完全符合需求，此时 `.change` 更合适。

例如，如果希望在每次选择框变更时运行验证，通过添加 `.change`，Livewire 会在用户选择新选项后立即发送网络请求并验证属性。而 `.blur` 只会在用户 Tab 离开选择框后才更新服务器。

```html
<select wire:model.change="title">
    <!-- ... -->
</select>
```

对文本输入所做的任何更改都会自动与 Livewire 组件中的 `$title` 属性同步。

## 所有可用修饰符

| 修饰符 | 说明 |
|--------|------|
| `.live` | 在用户输入时发送更新 |
| `.blur` | 仅在 `blur` 事件时发送更新 |
| `.change` | 仅在 `change` 事件时发送更新 |
| `.lazy` | `.change` 的别名 |
| `.debounce.[?]ms` | 按指定的毫秒延迟防抖更新发送 |
| `.throttle.[?]ms` | 按指定的毫秒间隔节流网络请求更新 |
| `.number` | 将输入的文本值在服务器端转换为 `int` |
| `.boolean` | 将输入的文本值在服务器端转换为 `bool` |
| `.fill` | 在页面加载时使用 HTML `value` 属性提供的初始值 |

## 输入字段

Livewire 原生支持大多数浏览器原生输入元素。这意味着你只需在任意输入元素上添加 `wire:model`，即可轻松地将属性与它们绑定。

以下是不同可用输入类型及其在 Livewire 中使用方式的完整列表。

### 文本输入

首先，文本输入是大多数表单的基础。以下是将名为"title"的属性绑定到文本输入的方式：

```blade
<input type="text" wire:model="title">
```

### 文本域输入

文本域元素的使用同样直接。只需在 textarea 上添加 `wire:model`，值就会被绑定：

```blade
<textarea type="text" wire:model="content"></textarea>
```

如果"content"值初始化为字符串，Livewire 会自动填充该 textarea——无需像下面这样做：

```blade
<!-- 警告：以下代码片段演示了不要做什么... -->

<textarea type="text" wire:model="content">{{ $content }}</textarea>
```

### 复选框

复选框可用于单个值，例如切换布尔属性。或者，复选框也可用于在一组相关值中切换单个值。下面讨论两种情况：

#### 单个复选框

在注册表单的末尾，你可能有一个允许用户选择接收邮件更新的复选框。你可以将此属性命名为 `$receiveUpdates`。通过 `wire:model` 可以轻松地将此值与复选框绑定：

```blade
<input type="checkbox" wire:model="receiveUpdates">
```

现在当 `$receiveUpdates` 为 `false` 时，复选框为未选中状态。当然，当值为 `true` 时，复选框为选中状态。

#### 多个复选框

现在，假设除了允许用户决定是否接收更新外，你的类中还有一个数组属性 `$updateTypes`，允许用户从多种更新类型中选择：

```php
public $updateTypes = [];
```

通过将多个复选框绑定到 `$updateTypes` 属性，用户可以选择多个更新类型，它们将被添加到 `$updateTypes` 数组属性中：

```blade
<input type="checkbox" value="email" wire:model="updateTypes">
<input type="checkbox" value="sms" wire:model="updateTypes">
<input type="checkbox" value="notification" wire:model="updateTypes">
```

例如，如果用户勾选了前两个框但没有勾选第三个，`$updateTypes` 的值将为：`["email", "sms"]`

### 单选按钮

要在单个属性的两个不同值之间切换，可以使用单选按钮：

```blade
<input type="radio" value="yes" wire:model="receiveUpdates">
<input type="radio" value="no" wire:model="receiveUpdates">
```

### 选择下拉框

Livewire 让 `<select>` 下拉框的使用变得简单。在下拉框中添加 `wire:model` 后，当前选中的值将绑定到指定的属性名，反之亦然。

此外，无需手动为将被选中的选项添加 `selected`——Livewire 会自动为你处理。

以下是一个使用静态州列表填充的下拉列表示例：

```blade
<select wire:model="state">
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

当选中某个特定的州时（例如"Alaska"），组件上的 `$state` 属性将被设置为 `AK`。如果你希望值设置为"Alaska"而不是"AK"，可以完全省略 `<option>` 元素上的 `value=""` 属性。

通常，你可能会使用 Blade 动态构建下拉选项：

```blade
<select wire:model="state">
    @foreach (\App\Models\State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>
```

如果默认没有选中特定选项，你可能希望默认显示一个灰色的占位选项，例如"请选择一个州"：

```blade
<select wire:model="state">
    <option disabled value="">请选择一个州...</option>

    @foreach (\App\Models\State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>
```

如你所见，选择菜单没有像文本输入那样的 `placeholder` 属性。相反，你需要在列表中添加一个 `disabled` 选项元素作为第一个选项。

### 依赖选择下拉框

有时你可能希望一个选择菜单依赖于另一个。例如，城市列表根据选中的州而变化。

大多数情况下，这按预期工作，但有一个重要的注意事项：你必须在变化的 select 上添加 `wire:key`，以便 Livewire 在选项变化时正确刷新其值。

以下是一个包含州选择和城市选择两个下拉框的示例。当州选择变化时，城市选择中的选项将正确变化：

```blade
<!-- 州选择菜单... -->
<select wire:model.live="selectedState">
    @foreach (State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>

<!-- 城市依赖选择菜单... -->
<select wire:model.live="selectedCity" wire:key="{{ $selectedState }}"> <!-- [tl! highlight] -->
    @foreach (City::whereStateId($selectedState->id)->get() as $city)
        <option value="{{ $city->id }}">{{ $city->label }}</option>
    @endforeach
</select>
```

再次强调，这里唯一的非标准操作是在第二个 select 上添加了 `wire:key`。这确保了当州变化时，"selectedCity"的值会被正确重置。

### 多选下拉框

如果你使用的是"multiple"选择菜单，Livewire 也能按预期工作。在此示例中，选中时州将被添加到 `$states` 数组属性中，取消选中时则被移除：

```blade
<select wire:model="states" multiple>
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

## 深入了解

关于在 HTML 表单上下文中使用 `wire:model` 的更多完整文档，请访问 [Livewire 表单文档页面](/docs/livewire/v3.x/forms)。
