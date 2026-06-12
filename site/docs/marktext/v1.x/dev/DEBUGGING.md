# 调试

## 使用 Visual Studio Code

最简单的方式是使用 `Debug MarkText` 配置进行调试。你可以设置断点并使用 `debugger` 语句。

**前提条件：**

- VS Code 内置的 JavaScript 调试器（无需扩展——VS Code 1.47 及以上版本自带）

## 使用 Chrome 开发者工具

你可以在调试模式下通过 `View -> Toggle Developer Tools` 使用内置开发者工具，或者在通过 `pnpm run dev` 启动时通过 `chrome://inspect` 连接，主进程使用端口 `5858`，渲染进程使用端口 `8315`。

### 调试构建后的应用

你可以使用默认的 Electron 命令行参数来启用上述调试模式。

```shell
$ marktext --inspect=5858 --remote-debugging-port=8315
```

## 调试启动性能缓慢问题

无论你使用的是构建版本还是开发版本，都可以使用 [node-profiler](https://github.com/fxha/node-profiler) 来分析启动问题。请按照该工具的说明进行设置。然后，并行启动以下命令（例如使用三个终端窗口，最后启动 MarkText）。

```shell
$ node-profiler main
$ node-profiler renderer
$ marktext --inspect=5858 --remote-debugging-port=8315
```

MarkText 成功启动后，在两个 `node-profiler` 实例上按 `Ctrl+C`。工具会生成两个文件，名为 `main.cpuprofile` 和 `renderer.cpuprofile`。你现在可以通过 *Chrome 开发者工具* 或 *Visual Studio Code* 来分析这些文件。
