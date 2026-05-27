---
title: 单元测试与 SOLID 原则
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/unit_testing_and_solid_principles.md
status: 已翻译
---

# 单元测试与 SOLID 原则

> _本文最初于 2015 年发表在 [Airpair](https://web.archive.org/web/20220204014708/https://www.airpair.com/php/posts/best-practices-for-modern-php-development#5-unit-testing) 上。所有荣誉归于 Airpair 和最初撰写本文的 Brian Fenton，尽管该网站已不再可用，文章仅存在于 [Wayback Machine](https://web.archive.org/web/20220204014708/https://www.airpair.com/php/posts/best-practices-for-modern-php-development#5-unit-testing) 中。本文已添加到本站以供整个 PHP 社区学习和教育使用。_

## 1. 设置和配置

### 1.1 保持更新

从一开始就需要指出——在生产环境中，令人沮丧的是只有极少数 PHP 安装版本是当前的，或被保持更新。无论是由于共享主机的限制、没人想到要更改的默认设置，还是没有时间/预算进行升级测试，PHP 二进制文件常常被遗落在旧版本上。因此，一个需要更多强调的明确最佳实践是始终使用 PHP 的当前版本（截至本文撰写时为 5.6.x）。此外，定期安排 PHP 本身以及任何你可能使用的扩展或供应商库的升级也很重要。升级可以让你获得新的语言特性、更高的速度、更低的内存占用以及安全更新。升级越频繁，这个过程就越不痛苦。

### 1.2 设置合理的默认值

PHP 通过其 _php.ini.development_ 和 _php.ini.production_ 文件在开箱即用的默认设置方面做得不错，但我们可以做得更好。首先，它们没有为我们设置日期/时区。从发行版的角度来看这是合理的，但如果没有设置，PHP 在每次调用日期/时间相关函数时都会抛出 E\_WARNING 错误。以下是一些推荐的设置：

- date.timezone - 从[支持的时区列表](http://php.net/manual/en/timezones.php)中选择
- session.save\_path - 如果我们使用文件存储会话而非其他保存处理器，将其设置为 _/tmp_ 之外的路径。将其保留为 _/tmp_ 在共享主机环境中可能存在风险，因为 _/tmp_ 通常在权限方面是开放访问的。即使设置了粘滞位，任何有权列出此目录内容的人都可以了解你所有的活跃会话 ID。
- session.cookie\_secure - 简单明了，如果你通过 HTTPS 提供 PHP 代码，请启用此选项。
- session.cookie\_httponly - 设置此项以防止 PHP 会话 cookie 通过 JavaScript 访问
- 更多... 使用类似 [iniscan](https://github.com/psecio/iniscan) 的工具来测试你的配置是否存在常见漏洞

### 1.3 扩展

禁用（或至少不启用）你不会使用的扩展也是一个好主意，比如数据库驱动。要查看已启用的内容，运行 `phpinfo()` 命令或进入命令行运行以下命令。

```bash
$ php -i
```

信息是相同的，但 phpinfo() 有 HTML 格式化。CLI 版本更容易通过管道传递给 grep 来查找特定信息。例如：

```bash
$ php -i | grep error_log
```

不过这种方法有一个注意事项：面向 Web 的版本和 CLI 版本可能应用不同的 PHP 设置。

## 2. 使用 Composer

这可能令人惊讶，但编写现代 PHP 的最佳实践之一就是少写 PHP 代码。虽然确实，提高编程能力的最佳方法之一就是动手实践，但在 PHP 领域中已经有大量问题被解决，例如路由、基本输入验证库、单位转换、数据库抽象层等。只需去 [Packagist](https://www.packagist.org/) 浏览一下即可。你很可能会发现你要解决的问题的很大部分已经被编写和测试过。

虽然把代码全写一遍非常诱人（将编写自己的框架或库作为学习经验也完全没问题），但你应该抵制"非我发明"的心态，给自己省下大量时间和头痛。遵循 PIE 原则——Proudly Invented Elsewhere（自豪地来自别处发明）。此外，如果你确实选择编写自己的什么东西，除非它比现有产品有显著不同或更好，否则不要发布。

[Composer](https://www.getcomposer.org/) 是 PHP 的包管理器，类似于 Python 中的 pip、Ruby 中的 gem 和 Node 中的 npm。它允许你定义一个 JSON 文件来列出代码的依赖项，并将通过下载和安装必要的代码包来尝试为你解析这些依赖。

### 2.1 安装 Composer

我们假设这是一个本地项目，因此让我们仅安装一个当前项目专用的 Composer 实例。进入你的项目目录并运行：

```bash
$ curl -sS https://getcomposer.org/installer | php
```

请记住，将任何下载内容直接管道传递给脚本解释器（sh、ruby、php 等）是一个安全风险，因此请在运行此类命令之前阅读安装代码并确保你对其感到放心。

为了方便起见（如果你更喜欢输入 `composer install` 而不是 `php composer.phar install`），你可以使用以下命令全局安装一个 Composer 副本：

```bash
$ mv composer.phar /usr/local/bin/composer
$ chmod +x composer
```

根据你的文件权限，你可能需要使用 `sudo` 运行这些命令。

### 2.2 使用 Composer

Composer 有两类主要的依赖关系可以管理："require" 和 "require-dev"。列为 "require" 的依赖项会在任何地方安装，但 "require-dev" 依赖项仅在明确请求时才安装。通常这些是代码处于活跃开发状态时使用的工具，例如 [PHP\_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)。下面这行代码展示了如何安装 [Guzzle](http://docs.guzzlephp.org/en/latest/)，一个流行的 HTTP 库。

```bash
$ php composer.phar require guzzle/guzzle
```

要仅为开发目的安装工具，添加 `--dev` 标志：

```bash
$ php composer.phar require --dev 'sebastian/phpcpd'
```

这将安装 [PHP Copy-Paste Detector](https://github.com/sebastianbergmann/phpcpd)，另一个仅作为开发依赖的代码质量工具。

### 2.3 Install vs Update

当我们第一次运行 `composer install` 时，它将根据 _composer.json_ 文件安装我们需要的任何库及其依赖项。完成后，composer 会创建一个锁文件，命名为 _composer.lock_。此文件包含 composer 找到的依赖项列表及其精确版本和哈希值。以后任何时候我们再运行 `composer install`，它都会查看锁文件并安装那些精确版本。

`composer update` 则有所不同。它将忽略 _composer.lock_ 文件（如果存在），并尝试找到每个依赖项的最新版本，同时仍然满足 _composer.json_ 中的约束。完成后它会写入一个新的 _composer.lock_ 文件。

### 2.4 自动加载

`composer install` 和 `composer update` 都会为我们生成一个[自动加载器](https://getcomposer.org/doc/04-schema.md#autoload)，告诉 PHP 在哪里找到我们安装的库所需的所有文件。要使用它，只需添加这一行（通常放在每个请求都会执行的引导文件中）：

```php
require 'vendor/autoload.php';
```

## 3. 遵循良好的设计原则

### 3.1 SOLID

SOLID 是一个助记符，用于提醒我们良好面向对象软件设计中的五个关键原则。

#### 3.1.1 S — 单一职责原则

该原则指出类应该只有一个职责，或者换句话说，它们应该只有一个变更的理由。这与 Unix 哲学（许多小工具，每个做好一件事）非常契合。只做一件事的类更容易测试和调试，也不太可能让你意外。你不希望一个 Validator 类的方法调用会更新数据库记录。以下是一个 SRP 违规的例子，这种写法在基于 [ActiveRecord 模式](http://en.wikipedia.org/wiki/Active_record_pattern)的应用中很常见。

```php
class Person extends Model
{
    public $name;
    public $birthDate;
    protected $preferences;
    public function getPreferences() {}
    public function save() {}
}
```

这是一个相当基本的[实体](http://lostechies.com/jimmybogard/2008/05/21/entities-value-objects-aggregates-and-roots/)模型。但这里有一个东西不应该放在这里。实体模型的唯一职责应该是与它代表的实体相关的行为，它不应该负责持久化自己。

```php
class Person extends Model
{
    public $name;
    public $birthDate;
    protected $preferences;
    public function getPreferences() {}
}
class DataStore
{
    public function save(Model $model) {}
}
```

这样好多了。Person 模型又恢复为只做一件事，而保存行为被移到了一个持久化对象中。另请注意我只对 Model 做了类型提示，而不是 Person。当我们讨论 SOLID 的 L 和 D 部分时会再回到这个话题。

#### 3.1.2 O — 开闭原则

有一个很好的测试可以很好地总结这个原则的含义：想一个要实现的功能，可能是你最近做的或正在做的一个。你能否仅通过添加新类而不改变系统中任何现有类来在你的现有代码库中实现该功能？你的配置和连接代码可以稍微放松要求，但在大多数系统中这异常困难。你必须在很大程度上依赖多态分发，而大多数代码库根本没有为此设置。如果你对此感兴趣，YouTube 上有一个很棒的 Google 演讲，关于[多态和编写没有 If 的代码](https://www.youtube.com/watch?v=4F72VULWFvc)，深入探讨了这个问题。额外说明，这个演讲由 [Miško Hevery](http://misko.hevery.com/) 主讲，许多人可能知道他是 [AngularJs](https://angularjs.org/) 的创建者。

#### 3.1.3 L — 里氏替换原则

这个原则以 [Barbara Liskov](http://en.wikipedia.org/wiki/Barbara_Liskov) 命名，原始表述如下：

> "程序中的对象应该可以被其子类型的实例替换，而不影响程序的正确性。"

这听起来很好，但通过一个例子可以更清楚地说明。

```php
abstract class Shape
{
    public function getHeight();
    public function setHeight($height);
    public function getLength();
    public function setLength($length);
}
```

这将代表我们基本的四边形形状。没什么花哨的。

```php
class Square extends Shape
{
    protected $size;
    public function getHeight() {
        return $this->size;
    }
    public function setHeight($height) {
        $this->size = $height;
    }
    public function getLength() {
        return $this->size;
    }
    public function setLength($length) {
        $this->size = $length;
    }
}
```

这是我们的第一个形状，正方形。很直观的形状，对吧？你可以假设有一个构造函数用于设置尺寸，但从这个实现中可以看到，长度和高度始终是相同的。正方形就是这样的。

```php
class Rectangle extends Shape
{
    protected $height;
    protected $length;
    public function getHeight() {
        return $this->height;
    }
    public function setHeight($height) {
        $this->height = $height;
    }
    public function getLength() {
        return $this->length;
    }
    public function setLength($length) {
        $this->length = $length;
    }
}
```

现在我们有了一个不同的形状。仍然有相同的方法签名，仍然是四边形，但如果我们开始尝试将它们相互替换会怎样？突然之间，如果我们改变 Shape 的高度，我们不再能假设形状的长度会匹配。当我们向用户提供 Square 时，我们违反了与用户的约定。

这是一个违反 LSP 的教科书示例，我们需要这样的原则来充分利用类型系统。即使是[鸭子类型](http://en.wikipedia.org/wiki/Duck_typing)也无法告诉我们底层行为是否不同，而由于我们无法在不看到它出问题的情况下知道这一点，最好的做法是首先确保它没有不同。

#### 3.1.4 I — 接口隔离原则

这个原则主张使用许多小而精细的接口，而不是一个大接口。接口应该基于行为而不是"它是这些类之一"。想想 PHP 自带的接口。Traversable、Countable、Serializable 等等。它们宣传的是对象具备的能力，而不是它继承了什么。因此，保持你的接口小巧。你不希望一个接口上有 30 个方法，3 个是一个更好的目标。

#### 3.1.5 D — 依赖反转原则

你可能在其他讨论[依赖注入](http://en.wikipedia.org/wiki/Dependency_injection)的地方听说过这个，但依赖反转和依赖注入并不完全是同一回事。依赖反转实质上是在说你应该依赖于系统中的抽象，而不是其细节。那么这在日常工作中对你意味着什么？

> 不要直接在代码中到处使用 mysqli\_query()，而是使用类似 DataStore->query() 的东西。

这个原则的核心其实是关于抽象。它更多是在说"使用一个数据库适配器"，而不是依赖于对 mysqli\_query 等函数的直接调用。如果你在一半的类中直接使用 mysqli\_query，那么你就是在把所有东西直接绑定到你的数据库上。这里不是对 MySQL 有什么意见，但如果你使用 mysqli\_query，这种低级别的细节应该只在一个地方隐藏，然后通过一个通用包装器暴露该功能。

我知道如果你仔细想想，这个例子有点老套，因为你在产品上线后完全更改数据库引擎的次数非常非常少。我选择它是因为我觉得人们会从自己的代码中熟悉这个概念。此外，即使你有一个你确定要使用的数据库，那个抽象包装器对象也允许你修复 bug、改变行为或实现你希望所选数据库具有的功能。它也使单元测试成为可能，而低级别的直接调用则不行。

## 4. 面向对象体操

这不是对这些原则的全面深入探讨，但前两条容易记住，提供很好的价值，并且可以立即应用于几乎任何代码库。

### 4.1 每个方法不超过一级缩进

这是一种有用的思考方式，可以将方法分解为更小的块，使代码更清晰、更具自文档性。缩进级别越多，方法做的事情就越多，你在处理它时需要跟踪的状态也就越多。

我知道马上会有人反对这一点，但这只是一个指导方针/启发式方法，不是硬性规则。我不期望任何人强制执行 PHP\_CodeSniffer 规则（尽管[有人尝试过](https://github.com/object-calisthenics/phpcs-calisthenics-rules)）。

让我们看一个快速示例：

```php
public function transformToCsv($data)
{
    $csvLines = array();
    $csvLines[] = implode(',', array_keys($data[0]));
    foreach ($data as $row) {
        if (!$row) {
            continue;
        }
        $csvLines[] = implode(',', $row);
    }
    return $csvLines;
}
```

虽然这段代码不算糟糕（技术上正确、可测试等），我们可以做更多来使其清晰。我们如何减少这里的嵌套层级呢？

我们知道需要大幅简化 foreach 循环的内容（或完全去掉它），所以从这里开始。

```php
if (!$row) {
    continue;
}
```

这一部分很简单。这只是忽略空行。我们甚至可以在进入循环之前使用一个内置 PHP 函数来简化整个过程。

```php
$data = array_filter($data);
foreach ($data as $row) {
    $csvLines[] = implode(',', $row);
}
```

现在我们有了单一级别的嵌套。但看看这个，我们只是在对数组中的每一项应用一个函数。我们甚至不需要 foreach 循环来做这件事。

```php
$data = array_filter($data);
$csvLines = array_map(function($row) {
    return implode(',', $row);
}, $data);
```

现在我们完全没有嵌套了，而且代码可能会更快，因为所有循环都是用原生 C 函数而不是 PHP 来完成的。不过我们需要使用一点技巧来将逗号传递给 `implode`，所以你也可以认为停在上一步更容易理解。

### 4.2 尽量避免使用 `else`

这实际上涉及两个主要思想。第一个是方法中的多个 return 语句。如果你有足够的信息来决定方法的结果，那就做出决定并返回。第二个是称为[卫语句](http://c2.com/cgi/wiki?GuardClause)的概念。这些基本上是验证检查与早期返回的组合，通常放在方法顶部。让我展示一下我的意思。

```php
public function addThreeInts($first, $second, $third) {
    if (is_int($first)) {
        if (is_int($second)) {
            if (is_int($third)) {
                $sum = $first + $second + $third;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
    return $sum;
}
```

这也很直观，它将 3 个整数相加并返回结果，如果任何参数不是整数则返回 `null`。忽略我们可以将所有这些检查合并到一行用 AND 运算符的事实，我想你可以看到嵌套的 if/else 结构如何使代码更难追踪。现在看看这个示例：

```php
public function addThreeInts($first, $second, $third) {
    if (!is_int($first)) {
        return null;
    }
    if (!is_int($second)) {
        return null;
    }
    if (!is_int($third)) {
        return null;
    }
    return $first + $second + $third;
}
```

对我来说，这个示例更容易理解。这里我们使用卫语句来验证关于传入参数的初始断言，如果未通过就立即退出方法。我们也不再需要一个中间变量来在整个方法中跟踪和。在这种情况下，我们已经验证了我们处于"快乐路径"上，可以只管做我们该做的事情。同样，我们可以把那三个检查放到一个 `if` 中，但原则应该很清楚了。

## 5. 单元测试

单元测试是编写小型测试来验证代码行为的实践。它们几乎总是用与代码相同的语言编写（本例中是 PHP），并且设计为运行速度快，可以随时运行。它们作为改进代码的工具非常有价值。除了确保代码按你的预期工作这一明显好处外，单元测试还能提供非常有用的设计反馈。如果一段代码难以测试，通常说明存在设计问题。它们还为你提供了防止回归的安全网，让你可以更频繁地重构并将代码演进为更干净的设计。

### 5.1 工具

PHP 中有几个单元测试工具可用，但远远最常用的是 [PHPUnit](https://phpunit.de/)。你可以通过[直接](https://phar.phpunit.de/phpunit.phar)下载 [PHAR](http://php.net/manual/en/intro.phar.php) 文件来安装，或使用 composer 安装。由于我们在其他方面都使用 composer，我们将展示那种方法。此外，由于 PHPUnit 不太可能部署到生产环境，我们可以使用以下命令将其作为开发依赖安装：

```bash
composer require --dev phpunit/phpunit
```

### 5.2 测试就是规格说明

单元测试在代码中最重要的作用是提供代码应该做什么的可执行规格说明。即使测试代码有误，或者代码有 bug，系统_应该_做什么的知识也是无价的。

### 5.3 先写测试

如果你有机会看到一组在代码之前写的测试和一组在代码完成后写的测试，它们会有显著的不同。后写的测试更关注类的实现细节并确保具有好的行覆盖率，而先写的测试更关注验证期望的外部行为。这才是我们真正关心的单元测试——确保类呈现出正确的行为。以实现为中心的测试实际上让重构变得更困难，因为如果类的内部结构改变它们就会失败，而你刚刚失去了 OOP 的信息隐藏优势。

### 5.4 什么是好的单元测试

好的单元测试通常具有以下特征：

- 快速 — 应该在毫秒内运行。
- 无网络访问 — 应该能够关闭无线/拔掉网线，所有测试仍然通过。
- 有限的文件系统访问 — 这增加了速度和在部署代码到其他环境时的灵活性。
- 无数据库访问 — 避免昂贵的设置和拆除活动。
- 一次只测试一件事 — 一个单元测试应该只有一个失败原因。
- 命名良好 — 见上文 5.2。
- 大部分是假对象 — 单元测试中唯一的"真实"对象应该是我们正在测试的对象和简单的值对象。其余应该是某种形式的[测试替身](https://phpunit.de/manual/current/en/test-doubles.html)

有些情况下你可能需要违背其中一些规则，但作为通用指南，它们会很好地服务于你。

### 5.5 当测试变得痛苦时

> 单元测试让你提前感受到糟糕设计带来的痛苦 — Michael Feathers

当你在编写单元测试时，你是在强迫自己实际使用类来完成任务。如果你最后才写测试，或者更糟，直接把代码扔给 QA 或其他人来写测试，你就无法获得关于类实际行为的任何反馈。如果我们在写测试，而类真的很难使用，我们会在编写时发现，而这是修复成本最低的时候。

如果一个类难以测试，那一定存在设计缺陷。不过，不同的缺陷以不同的方式表现出来。如果你需要大量的模拟，你的类可能有太多依赖，或者你的方法做了太多事情。每个测试需要的设置越多，就越可能说明你的方法做了太多事情。如果你必须编写非常绕弯的测试场景来触发行为，这个类的方法可能做得太多了。如果你必须深入一堆私有方法和状态来测试东西，可能还有另一个类要浮现出来。单元测试非常擅长暴露"冰山类"——类 80% 的功能隐藏在受保护或私有代码中。我曾经是尽可能将东西设为 protected 的忠实粉丝，但我现在意识到我只是让各个类承担了太多责任，而真正的解决方案是将类分解为更小的部分。

> **作者：Brian Fenton** — Brian Fenton 在中西部和湾区做了 8 年 PHP 开发者，现就职于 Thismoment。他专注于代码工艺和设计原则。博客：www.brianfenton.us，Twitter：@brianfenton。不做爸爸的时候，他喜欢美食、啤酒、游戏和学习。
