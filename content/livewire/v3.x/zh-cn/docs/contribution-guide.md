---
title: 贡献指南
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/contribution-guide.md
source_version: v3.8.0
translation_status: draft
---

你好，欢迎阅读 Livewire 贡献指南。在本指南中，我们将介绍如何通过提交新功能、修复失败的测试或解决 bug 来为 Livewire 做出贡献。

## 在本地设置 Livewire 和 Alpine

要参与贡献，最简单的方法是确保 Livewire 和 Alpine 仓库已设置在你的本地机器上。这将让你能够轻松地进行更改并运行测试套件。

### Fork 并克隆仓库

开始的第一步是 fork 并克隆这些仓库。最简单的方法是使用 [GitHub CLI](https://cli.github.com/)，但你也可以在 GitHub [仓库页面](https://github.com/livewire/livewire)上点击 "Fork" 按钮手动执行这些步骤。

```shell
# Fork 并克隆 Livewire
gh repo fork livewire/livewire --default-branch-only --clone=true --remote=false -- livewire

# 切换工作目录到 livewire
cd livewire

# 安装所有 composer 依赖
composer install

# 确保 Dusk 正确配置
vendor/bin/dusk-updater detect --no-interaction
```

要设置 Alpine，请确保已安装 [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)，然后运行以下命令。如果你更喜欢手动 fork，可以访问[仓库页面](https://github.com/alpinejs/alpine)。

```shell
# Fork 并克隆 Alpine
gh repo fork alpinejs/alpine --default-branch-only --clone=true --remote=false -- alpine

# 切换工作目录到 alpine
cd alpine

# 安装所有 npm 依赖
npm install

# 构建所有 Alpine 包
npm run build

# 本地链接所有 Alpine 包
cd packages/alpinejs && npm link && cd ../../
cd packages/anchor && npm link && cd ../../
cd packages/collapse && npm link && cd ../../
cd packages/csp && npm link && cd ../../
cd packages/docs && npm link && cd ../../
cd packages/focus && npm link && cd ../../
cd packages/history && npm link && cd ../../
cd packages/intersect && npm link && cd ../../
cd packages/mask && npm link && cd ../../
cd packages/morph && npm link && cd ../../
cd packages/navigate && npm link && cd ../../
cd packages/persist && npm link && cd ../../
cd packages/sort && npm link && cd ../../
cd packages/ui && npm link && cd ../../

# 切换工作目录回到 livewire
cd ../livewire

# 链接所有包
npm link alpinejs @alpinejs/anchor @alpinejs/collapse @alpinejs/csp @alpinejs/docs @alpinejs/focus @alpinejs/history @alpinejs/intersect @alpinejs/mask @alpinejs/morph @alpinejs/navigate @alpinejs/persist @alpinejs/sort @alpinejs/ui

# 构建 Livewire
npm run build
```

## 提交一个失败的测试

如果你遇到了一个 bug，但不确定如何解决它——尤其是考虑到 Livewire 核心的复杂性——你可能会想知道从哪里开始。在这种情况下，最简单的方法是提交一个失败的测试。这样，有更多经验的人可以帮助识别和修复 bug。不过，我们仍然建议你探索核心代码，以更好地了解 Livewire 的工作原理。

让我们逐步来看。

#### 1. 确定在哪里添加测试

Livewire 核心被划分为不同的文件夹，每个文件夹对应特定的 Livewire 功能。例如：

```shell
src/Features/SupportAccessingParent
src/Features/SupportAttributes
src/Features/SupportAutoInjectedAssets
src/Features/SupportBladeAttributes
src/Features/SupportChecksumErrorDebugging
src/Features/SupportComputed
src/Features/SupportConsoleCommands
src/Features/SupportDataBinding
//...
```

尝试找到一个与你遇到的 bug 相关的功能。如果你找不到合适的文件夹，或者不确定选择哪一个，你可以简单地选择一个，并在你的 Pull Request 中提到你需要帮助将测试放在正确的功能集中。

#### 2. 确定测试类型

Livewire 测试套件包含两种类型的测试：

1. **单元测试**：这些测试专注于 Livewire 的 PHP 实现。
2. **浏览器测试**：这些测试在真实浏览器中运行一系列步骤并断言正确的结果。它们主要专注于 Livewire 的 Javascript 实现。

如果你不确定选择哪种类型的测试，或者不熟悉为 Livewire 编写测试，你可以从浏览器测试开始。实现在你的应用和浏览器中复现 bug 的步骤。

单元测试应添加到 `UnitTest.php` 文件中，浏览器测试应添加到 `BrowserTest.php` 中。如果其中一个或两个文件不存在，你可以自己创建它们。

**单元测试**

```php
use Tests\TestCase;

class UnitTest extends TestCase
{
    public function test_livewire_can_run_action(): void
    {
       // ...
    }
}
```

**浏览器测试**

```php
use Tests\BrowserTestCase;

class BrowserTest extends BrowserTestCase
{
    public function test_livewire_can_run_action()
    {
        // ...
    }
}
```

:::tip[不确定如何编写测试？]
你可以通过探索现有的单元测试和浏览器测试来学习测试的编写方式。即使复制和粘贴现有的测试，也是编写你自己测试的一个很好的起点。
:::

#### 3. 准备你的 Pull Request 分支

一旦你完成了功能或失败的测试，就该将你的 Pull Request（PR）提交到 Livewire 仓库了。首先，确保你将更改提交到一个独立的分支（不要使用 `main`）。要创建一个新分支，可以使用 `git` 命令：

```shell
git checkout -b my-feature
```

你可以任意命名你的分支，但为了将来参考，建议使用能反映你的功能或失败测试的描述性名称。

接下来，将你的更改提交到分支。你可以使用 `git add .` 暂存所有更改，然后使用 `git commit -m "Add my feature"` 提交所有更改，并附上描述性的提交信息。

然而，你的分支目前只在你本地的机器上。要创建一个 Pull Request，你需要使用 `git push` 将分支推送到你 fork 的 Livewire 仓库。

```shell
git push origin my-feature

Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 8 threads
Compressing objects: 100% (6/6), done.

To github.com:Username/livewire.git
 * [new branch]        my-feature -> my-feature
```

#### 4. 提交你的 Pull Request

快完成了！打开你的 Web 浏览器，导航到你 fork 的 Livewire 仓库（`https://github.com/<your-username>/livewire`）。在屏幕中央，你会看到一个新的通知："**my-feature had recent pushes 1 minute ago**"，以及一个"**Compare & pull request**"按钮。点击该按钮打开 Pull Request 表单。

在表单中，提供一个描述你 Pull Request 的标题，然后进入描述部分。文本区域已经包含一个预定义的模板。尝试回答每个问题：

```
Review the contribution guide first at: https://livewire.laravel.com/docs/contribution-guide

1️⃣ Is this something that is wanted/needed? Did you create a discussion about it first?
Yes, you can find the discussion here: https://github.com/livewire/livewire/discussions/999999

2️⃣ Did you create a branch for your fix/feature? (Main branch PR's will be closed)
Yes, the branch is named `my-feature`

3️⃣ Does it contain multiple, unrelated changes? Please separate the PRs out.
No, the changes are only related to my feature.

4️⃣ Does it include tests? (Required)
Yes

5️⃣ Please include a thorough description (including small code snippets if possible) of the improvement and reasons why it's useful.

These changes will improve memory usage. You can see the benchmark results here:

// ...

```

一切就绪？点击 **Create pull request** 🚀 恭喜！你已经成功创建了你的第一个贡献 🎉

维护者将审查你的 PR，并可能提供反馈或请求更改。请尽快处理任何反馈。

感谢你为 Livewire 做出贡献！
