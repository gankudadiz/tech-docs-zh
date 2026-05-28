---
title: 安装指南
source: https://github.com/flightphp/docs/blob/master/content/v3/en/install/install.md
status: 已翻译
---

# 安装指南

在安装 Flight 之前，需要满足一些基本前置条件：

1. [在系统上安装 PHP](#安装-php)
2. [安装 Composer](https://getcomposer.org) 以获得最佳开发体验。

## 基本安装

如果你使用 [Composer](https://getcomposer.org)，可以运行以下命令：

```bash
composer require flightphp/core
```

这只会将 Flight 核心文件放到你的系统上。你需要自行定义项目结构、[布局](../learn/templates)、[依赖项](../learn/dependency-injection-container)、[配置](../learn/configuration)、[自动加载](../learn/autoloading)等。这种方式确保除 Flight 外不会安装其他依赖。

你也可以直接[下载文件](https://github.com/flightphp/core/archive/master.zip)并解压到你的 Web 目录。

## 推荐安装

强烈建议使用 [flightphp/skeleton](https://github.com/flightphp/skeleton) 应用作为新项目的起点。安装非常简单。

```bash
composer create-project flightphp/skeleton my-project/
```

这将为你设置好项目结构、配置带命名空间的自动加载、设置配置文件，并提供其他工具，如 [Tracy](/awesome-plugins/tracy)、[Tracy Extensions](/awesome-plugins/tracy-extensions) 和 [Runway](/awesome-plugins/runway)。

## 配置 Web 服务器

### PHP 内置开发服务器

这是最简单快捷的启动方式。你可以使用内置服务器运行应用，甚至可以使用 SQLite 作为数据库（只要系统安装了 sqlite3），几乎不需要任何额外配置！安装 PHP 后，只需运行以下命令：

```bash
php -S localhost:8000
# 或使用 skeleton 应用
composer start
```

然后在浏览器中打开 `http://localhost:8000`。

如果你希望将项目的文档根目录设为另一个目录（例如：项目位于 `~/myproject`，但文档根目录是 `~/myproject/public/`），可以在 `~/myproject` 目录下运行：

```bash
php -S localhost:8000 -t public/
# skeleton 应用已默认配置此项
composer start
```

然后在浏览器中打开 `http://localhost:8000`。

### Apache

确保 Apache 已安装在系统上。如果没有，请搜索如何在你的系统上安装 Apache。

对于 Apache，编辑 `.htaccess` 文件，添加以下内容：

```apacheconf
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

> **注意**：如果你需要在子目录中使用 Flight，请在 `RewriteEngine On` 之后添加一行 `RewriteBase /subdir/`。

> **注意**：如果你想保护所有服务器文件，如数据库或环境文件，请在 `.htaccess` 中添加：

```apacheconf
RewriteEngine On
RewriteRule ^(.*)$ index.php
```

### Nginx

确保 Nginx 已安装在系统上。如果没有，请搜索如何在你的系统上安装 Nginx。

对于 Nginx，在你的 server 声明中添加以下内容：

```nginx
server {
  location / {
    try_files $uri $uri/ /index.php;
  }
}
```

## 创建 `index.php` 文件

如果你使用的是基本安装方式，需要编写一些代码来开始。

```php
<?php

// 如果使用 Composer，引入自动加载器。
require 'vendor/autoload.php';
// 如果不使用 Composer，直接加载框架
// require 'flight/Flight.php';

// 然后定义一个路由并分配一个函数来处理请求。
Flight::route('/', function () {
  echo 'hello world!';
});

// 最后，启动框架。
Flight::start();
```

使用 skeleton 应用时，这些已经配置好，路由在 `app/config/routes.php` 文件中处理，服务在 `app/config/services.php` 中配置。

## 安装 PHP

如果你的系统已经安装了 `php`，可以跳过本节，直接进入[下载文件](#基本安装)部分。

### **macOS**

#### **使用 Homebrew 安装 PHP**

1. **安装 Homebrew**（如果尚未安装）：
   - 打开终端并运行：
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

2. **安装 PHP**：
   - 安装最新版本：
     ```bash
     brew install php
     ```
   - 安装特定版本，例如 PHP 8.1：
     ```bash
     brew tap shivammathur/php
     brew install shivammathur/php/php@8.1
     ```

3. **切换 PHP 版本**：
   - 取消链接当前版本并链接期望的版本：
     ```bash
     brew unlink php
     brew link --overwrite --force php@8.1
     ```
   - 验证已安装的版本：
     ```bash
     php -v
     ```

### **Windows 10/11**

#### **手动安装 PHP**

1. **下载 PHP**：
   - 访问 [PHP for Windows](https://windows.php.net/download/) 并下载最新版本或特定版本（例如 7.4、8.0）的非线程安全 zip 文件。

2. **解压 PHP**：
   - 将下载的 zip 文件解压到 `C:\php`。

3. **将 PHP 添加到系统 PATH**：
   - 进入 **系统属性** > **环境变量**。
   - 在 **系统变量** 下，找到 **Path** 并点击 **编辑**。
   - 添加路径 `C:\php`（或你解压 PHP 的路径）。
   - 点击 **确定** 关闭所有窗口。

4. **配置 PHP**：
   - 将 `php.ini-development` 复制为 `php.ini`。
   - 编辑 `php.ini` 以根据需要配置 PHP（例如设置 `extension_dir`、启用扩展）。

5. **验证 PHP 安装**：
   - 打开命令提示符并运行：
     ```cmd
     php -v
     ```

#### **安装多个 PHP 版本**

1. 对每个版本**重复上述步骤**，将每个版本放在单独的目录中（例如 `C:\php7`、`C:\php8`）。

2. 通过调整系统 PATH 变量指向所需的版本目录来**切换版本**。

### **Ubuntu（20.04、22.04 等）**

#### **使用 apt 安装 PHP**

1. **更新软件包列表**：
   - 打开终端并运行：
     ```bash
     sudo apt update
     ```

2. **安装 PHP**：
   - 安装最新版本：
     ```bash
     sudo apt install php
     ```
   - 安装特定版本，例如 PHP 8.1：
     ```bash
     sudo apt install php8.1
     ```

3. **安装附加模块**（可选）：
   - 例如，安装 MySQL 支持：
     ```bash
     sudo apt install php8.1-mysql
     ```

4. **切换 PHP 版本**：
   - 使用 `update-alternatives`：
     ```bash
     sudo update-alternatives --set php /usr/bin/php8.1
     ```

5. **验证已安装的版本**：
   - 运行：
     ```bash
     php -v
     ```

### **Rocky Linux**

#### **使用 yum/dnf 安装 PHP**

1. **启用 EPEL 仓库**：
   - 打开终端并运行：
     ```bash
     sudo dnf install epel-release
     ```

2. **安装 Remi 仓库**：
   - 运行：
     ```bash
     sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-8.rpm
     sudo dnf module reset php
     ```

3. **安装 PHP**：
   - 安装默认版本：
     ```bash
     sudo dnf install php
     ```
   - 安装特定版本，例如 PHP 7.4：
     ```bash
     sudo dnf module install php:remi-7.4
     ```

4. **切换 PHP 版本**：
   - 使用 `dnf` module 命令：
     ```bash
     sudo dnf module reset php
     sudo dnf module enable php:remi-8.0
     sudo dnf install php
     ```

5. **验证已安装的版本**：
   - 运行：
     ```bash
     php -v
     ```

### **通用说明**

- 对于开发环境，根据项目需求配置 PHP 设置非常重要。
- 切换 PHP 版本时，确保为要使用的特定版本安装了所有相关的 PHP 扩展。
- 切换 PHP 版本或更新配置后，请重启 Web 服务器（Apache、Nginx 等）以使更改生效。
