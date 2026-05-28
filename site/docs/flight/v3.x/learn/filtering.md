---
title: 方法过滤
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/filtering.md
status: 已翻译
---

# 方法过滤

## 概述

Flight 允许你在[映射方法](extending)被调用之前和之后进行过滤。

## 理解

没有需要记忆的预定义钩子。你可以过滤任何默认框架方法以及你映射的任何自定义方法。

过滤器函数如下所示：

```php
/**
 * @param array $params 传递给被过滤方法的参数。
 * @param string $output (仅 v2 输出缓冲) 被过滤方法的输出。
 * @return bool 返回 true/void 或不返回以继续执行链，返回 false 以中断执行链。
 */
function (array &$params, string &$output): bool {
  // 过滤代码
}
```

使用传入的变量，你可以操作输入参数和/或输出。

你可以让过滤器在方法之前运行：

```php
Flight::before('start', function (array &$params, string &$output): bool {
  // 执行某些操作
});
```

你可以让过滤器在方法之后运行：

```php
Flight::after('start', function (array &$params, string &$output): bool {
  // 执行某些操作
});
```

你可以为任何方法添加任意数量的过滤器。它们将按照声明的顺序被调用。

以下是一个过滤过程的示例：

```php
// 映射一个自定义方法
Flight::map('hello', function (string $name) {
  return "Hello, $name!";
});

// 添加一个 before 过滤器
Flight::before('hello', function (array &$params, string &$output): bool {
  // 操作参数
  $params[0] = 'Fred';
  return true;
});

// 添加一个 after 过滤器
Flight::after('hello', function (array &$params, string &$output): bool {
  // 操作输出
  $output .= " Have a nice day!";
  return true;
});

// 调用自定义方法
echo Flight::hello('Bob');
```

这将显示：

```
Hello Fred! Have a nice day!
```

如果你定义了多个过滤器，可以在任何过滤器函数中通过返回 `false` 来中断调用链：

```php
Flight::before('start', function (array &$params, string &$output): bool {
  echo 'one';
  return true;
});

Flight::before('start', function (array &$params, string &$output): bool {
  echo 'two';

  // 这将中断调用链
  return false;
});

// 这个将不会被调用
Flight::before('start', function (array &$params, string &$output): bool {
  echo 'three';
  return true;
});
```

> **注意**：核心方法如 `map` 和 `register` 不能被过滤，因为它们是直接调用的，不是动态调用的。更多信息见[扩展 Flight](extending)。

## 参见

- [扩展 Flight](extending)

## 故障排除

- 如果你想中断调用链，请确保从过滤器函数中返回 `false`。如果你不返回任何内容，调用链将继续。

## 更新日志

- v2.0 - 初始发布。
