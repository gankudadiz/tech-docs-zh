---
title: Flight 与 Laravel 对比
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/flight_vs_laravel.md
status: 已翻译
---

# Flight 与 Laravel 对比

## 什么是 Laravel？
[Laravel](https://laravel.com) 是一个全功能框架，拥有各种华丽的功能和一个出色的以开发者为中心的生态系统，但代价是性能和复杂性。Laravel 的目标是让开发者达到最高的生产力水平，使常见任务变得简单。Laravel 是希望构建全功能企业级 Web 应用的开发者的绝佳选择。这伴随着一些权衡，特别是在性能和复杂性方面。学习 Laravel 的基础可能很容易，但要精通该框架可能需要一些时间。

此外，Laravel 有太多的模块，开发者常常觉得解决问题的唯一途径就是通过这些模块，而实际上你可以使用其他库或自己编写代码。

## 与 Flight 相比的优势

- Laravel 拥有**庞大的开发者生态系统**和模块，可用于解决常见问题。
- Laravel 拥有功能齐全的 ORM，可用于与数据库交互。
- Laravel 拥有_海量_的文档和教程，可用于学习框架。这有助于深入了解细节，但也可能因为内容太多而感到困扰。
- Laravel 拥有内置的身份验证系统，可用于保护应用安全。
- Laravel 拥有播客、会议、聚会、视频和其他资源，可用于学习框架。
- Laravel 面向经验丰富的开发者，适合构建全功能企业级 Web 应用程序。

## 与 Flight 相比的劣势

- Laravel 的内部机制比 Flight 复杂得多。这带来了**显著**的性能代价。更多信息请参见 [TechEmpower 基准测试](https://www.techempower.com/benchmarks/#hw=ph&test=fortune&section=data-r22&l=zik073-cn3)。
- Flight 面向希望构建轻量、快速、易于使用的 Web 应用程序的开发者。
- Flight 专注于简洁和易用性。
- Flight 的核心特性之一是尽力保持向后兼容性。Laravel 在主版本之间频繁引入破坏性变更，导致了[大量不满](https://www.google.com/search?q=laravel+breaking+changes+major+version+complaints)。
- Flight 适合首次接触框架的开发者。
- Flight 没有依赖，而 [Laravel 有着惊人数量的依赖](https://github.com/laravel/framework/blob/12.x/composer.json)
- Flight 也可以用于企业级应用，但它没有 Laravel 那样多的样板代码。这也要求开发者更自律，以保持代码组织良好和结构清晰。
- Flight 给开发者更大的控制权，而 Laravel 背后有大量的"魔法"，可能会令人沮丧。
