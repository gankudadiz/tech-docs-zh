---
title: FlightPHP APM 文档
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/apm.md
status: 已翻译
---

# FlightPHP APM 文档

欢迎使用 FlightPHP APM——你应用的专属性能教练！本指南是你设置、使用和掌握 FlightPHP 应用性能监控 (APM) 的路线图。无论是排查慢请求还是研究延迟图表，我们都能满足你的需求。让应用更快、用户更满意、调试更轻松！

查看 Flight Docs 站点仪表板的[演示](https://flightphp-docs-apm.sky-9.com/apm/dashboard)。

![FlightPHP APM](/assets/flight/v3.x/apm.png)

## 为什么 APM 很重要

想象一下：你的应用是一家繁忙的餐厅。没有一种方法追踪订单需要多长时间或厨房哪里卡顿了，你只能猜测为什么顾客不满地离开。APM 就是你的副厨——它监视每一步，从传入的请求到数据库查询，并标记任何减慢你速度的东西。慢速页面会导致用户流失（研究表明，如果网站加载时间超过 3 秒，53% 的用户会跳出！），而 APM 帮助你在这些问题产生_影响之前_捕获它们。这是主动的安心——减少"为什么会坏？"的时刻，增加"看这运行得多流畅！"的胜利。

## 安装

通过 Composer 开始：

```bash
composer require flightphp/apm
```

你需要：
- **PHP 7.4+**：兼容 LTS Linux 发行版，同时支持现代 PHP。
- **[FlightPHP Core](https://github.com/flightphp/core) v3.15+**：我们要增强的轻量框架。

## 支持的数据库

FlightPHP APM 目前支持以下数据库用于存储指标：

- **SQLite3**：简单、基于文件，非常适合本地开发或小型应用。大多数设置中的默认选项。
- **MySQL/MariaDB**：适用于需要稳健、可扩展存储的大型项目或生产环境。

你可以在配置步骤中选择数据库类型（见下文）。确保你的 PHP 环境安装了必要的扩展（例如 `pdo_sqlite` 或 `pdo_mysql`）。

## 入门

以下是通往 APM 之美的分步指南：

### 1. 注册 APM

将此添加到 `index.php` 或 `services.php` 文件中以开始追踪：

```php
use flight\apm\logger\LoggerFactory;
use flight\database\PdoWrapper;
use flight\Apm;

$ApmLogger = LoggerFactory::create(__DIR__ . '/../../.runway-config.json');
$Apm = new Apm($ApmLogger);
$Apm->bindEventsToFlightInstance($app);

// 如果你要添加数据库连接
// 必须是 PdoWrapper 或来自 Tracy Extensions 的 PdoQueryCapture
$pdo = new PdoWrapper('mysql:host=localhost;dbname=example', 'user', 'pass', null, true); // <-- 需要 true 以启用 APM 追踪。
$Apm->addPdoConnection($pdo);
```

**这里发生了什么？**
- `LoggerFactory::create()` 获取你的配置（稍后详述）并设置一个日志记录器——默认使用 SQLite。
- `Apm` 是核心——它监听 Flight 的事件（请求、路由、错误等）并收集指标。
- `bindEventsToFlightInstance($app)` 将其与你的 Flight 应用绑定。

**专业提示：采样**
如果你的应用很忙，记录_每个_请求可能会过载。使用采样率（0.0 到 1.0）：

```php
$Apm = new Apm($ApmLogger, 0.1); // 记录 10% 的请求
```

这可以在保持性能的同时为你提供可靠的数据。

### 2. 配置

运行此命令以创建 `.runway-config.json`：

```bash
php vendor/bin/runway apm:init
```

**这会做什么？**
- 启动一个向导，询问原始指标来自哪里（源）以及处理后数据去哪里（目标）。
- 默认使用 SQLite——例如，`sqlite:/tmp/apm_metrics.sqlite` 用于源，另一个用于目标。
- 你将获得如下配置：
  ```json
  {
    "apm": {
      "source_type": "sqlite",
      "source_db_dsn": "sqlite:/tmp/apm_metrics.sqlite",
      "storage_type": "sqlite",
      "dest_db_dsn": "sqlite:/tmp/apm_metrics_processed.sqlite"
    }
  }
  ```

> 此过程还会询问你是否要为此设置运行迁移。如果你是第一次设置，答案是 yes。

**为什么是两个位置？**
原始指标积累很快（想象未过滤的日志）。Worker 将其处理为结构化目标以供仪表板使用。保持整洁！

### 3. 使用 Worker 处理指标

Worker 将原始指标转换为仪表板就绪的数据。运行一次：

```bash
php vendor/bin/runway apm:worker
```

**它在做什么？**
- 从你的源读取（例如 `apm_metrics.sqlite`）。
- 处理最多 100 个指标（默认批量大小）到目标中。
- 完成后或没有更多指标时停止。

**保持运行**
对于实际应用，你需要持续处理。以下是你的选项：

- **守护进程模式**：
  ```bash
  php vendor/bin/runway apm:worker --daemon
  ```
  永远运行，随时处理指标。非常适合开发或小型设置。

- **Crontab**：
  添加到你的 crontab (`crontab -e`)：
  ```bash
  * * * * * php /path/to/project/vendor/bin/runway apm:worker
  ```
  每分钟触发一次——非常适合生产环境。

- **Tmux/Screen**：
  启动一个可分离的会话：
  ```bash
  tmux new -s apm-worker
  php vendor/bin/runway apm:worker --daemon
  # Ctrl+B, 然后 D 分离; `tmux attach -t apm-worker` 重新连接
  ```
  即使你注销也能保持运行。

- **自定义调整**：
  ```bash
  php vendor/bin/runway apm:worker --batch_size 50 --max_messages 1000 --timeout 300
  ```
  - `--batch_size 50`：一次处理 50 个指标。
  - `--max_messages 1000`：处理 1000 个指标后停止。
  - `--timeout 300`：5 分钟后退出。

### 4. 启动仪表板

查看你应用的生命体征：

```bash
php vendor/bin/runway apm:dashboard
```

**这是什么？**
- 在 `http://localhost:8001/apm/dashboard` 启动一个 PHP 服务器。
- 显示请求日志、慢路由、错误率等。

**自定义**：
```bash
php vendor/bin/runway apm:dashboard --host 0.0.0.0 --port 8080 --php-path=/usr/local/bin/php
```

#### 生产模式

对于生产环境，由于可能存在防火墙和其他安全措施，你可能需要尝试几种技术来运行仪表板。以下是一些选择：

- **使用反向代理**：设置 Nginx 或 Apache 将请求转发到仪表板。
- **SSH 隧道**：如果可以 SSH 到服务器，使用 `ssh -L 8080:localhost:8001 youruser@yourserver` 将仪表板隧道传输到本地机器。
- **VPN**：如果服务器在 VPN 后面，连接到它并直接访问仪表板。
- **配置防火墙**：为你的 IP 或服务器网络打开端口 8001（或你设置的任何端口）。
- **配置 Apache/Nginx**：如果前面有 Web 服务器，可以将其配置到一个域或子域。

### 仪表板功能

仪表板是你的 APM 总部——以下是你将看到的内容：

- **请求日志**：每个请求带有时间戳、URL、响应代码和总时间。点击"详情"查看中间件、查询和错误。
- **最慢请求**：占用时间最多的前 5 个请求。
- **最慢路由**：按平均时间排序的前 5 个路由——非常适合发现模式。
- **错误率**：请求失败的百分比。
- **延迟百分位数**：95 分位 (p95) 和 99 分位 (p99) 响应时间——了解最坏情况。
- **响应代码图表**：可视化随时间变化的 200、404、500 等。
- **长查询/中间件**：最慢的 5 个数据库调用和中间件层。
- **缓存命中/未命中**：缓存为你节省了多少次数。

## 添加自定义事件

追踪任何事物——如 API 调用或支付流程：

```php
use flight\apm\CustomEvent;

$app->eventDispatcher()->trigger('apm.custom', new CustomEvent('api_call', [
    'endpoint' => 'https://api.example.com/users',
    'response_time' => 0.25,
    'status' => 200
]));
```

## 数据库监控

追踪 PDO 查询：

```php
use flight\database\PdoWrapper;

$pdo = new PdoWrapper('sqlite:/path/to/db.sqlite', null, null, null, true); // <-- 需要 true 以启用追踪。
$Apm->addPdoConnection($pdo);
```

## Worker 选项

调整 Worker 以适应你的需求：

- `--timeout 300`：5 分钟后停止。
- `--max_messages 500`：最多 500 个指标。
- `--batch_size 200`：一次处理 200 个。
- `--daemon`：不停运行。

## 请求 ID

每个请求有一个唯一的请求 ID 用于追踪。你可以在应用中使用此 ID 关联日志和指标。

```php
Flight::map('error', function($message) {
	$requestId = Flight::response()->getHeader('X-Flight-Request-Id');
	echo "Error: $message (Request ID: $requestId)";
});
```

## 升级、清理与故障排除

- 升级后运行 `php vendor/bin/runway apm:migrate` 来更新数据库结构
- 从 0.4.3 升级到 0.5.0 需要运行 `php vendor/bin/runway apm:config-migrate`
- 清理旧数据：`php vendor/bin/runway apm:purge --days 7`
- 常见问题：仪表板无数据→检查 Worker 是否运行；速度慢→降低采样率；数据库查询未追踪→确保使用 PdoWrapper 并将构造函数最后参数设为 `true`；错误未追踪→如果启用了 Tracy，需禁用它并设置 `flight.handle_errors = true`
