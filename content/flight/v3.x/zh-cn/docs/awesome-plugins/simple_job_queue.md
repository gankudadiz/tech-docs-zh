---
title: Simple Job Queue
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/simple_job_queue.md
status: 已翻译
---

# Simple Job Queue

Simple Job Queue 是一个可用于异步处理任务的库。支持 beanstalkd、MySQL/MariaDB、SQLite 和 PostgreSQL。

## 安装

```bash
composer require n0nag0n/simple-job-queue
```

## 用法

### 添加到 Flight

```php
Flight::register('queue', n0nag0n\Job_Queue::class, ['mysql'], function($Job_Queue) {
	$Job_Queue->addQueueConnection(Flight::db());
	// 或 beanstalkd: $Job_Queue->addQueueConnection($pheanstalk);
});
```

### 添加任务

```php
Flight::queue()->selectPipeline('send_important_emails');
Flight::queue()->addJob(json_encode([ 'key' => 'value' ]));
```

### 运行 Worker

创建 worker 脚本，循环处理任务启动 Supervisord 守护进程确保持续运行：

```ini
[program:email_worker]
command=php /path/to/worker.php
autostart=true
autorestart=true
numprocs=2
```

管理命令：`sudo supervisorctl start/stop/restart/status email_worker:*`
