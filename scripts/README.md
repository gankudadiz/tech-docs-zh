# scripts

用于保存采集、转换、校验等工具脚本。

## 现有脚本

### `fix_relative_links.py`

修复 Docusaurus 文档中错误的相对路径链接。自动检测并修复两类问题：

**问题 1：连字符 `-` → 下划线 `_` slug 错误**  
Docusaurus 路由保留文件名中的下划线（`dependency_injection_container`），但翻译后链接常错误使用连字符（`dependency-injection-container`）。

**问题 2：相对路径 `../` 层级错误**  
从 `learn/` 目录下链接同目录文件时用了 `../routing`（应为 `routing`），
或链接兄弟目录时用了 `../../awesome-plugins/runway`（应为 `../awesome-plugins/runway`）。

**用法**：

```bash
# 预览模式（不改文件，先看看有哪些问题）
python3 scripts/fix_relative_links.py site/docs/flight/v3.x/ --dry-run

# 实际修复单个目录
python3 scripts/fix_relative_links.py site/docs/flight/v3.x/

# 同时修复 site/ 和 content/（双目录同步，推荐）
python3 scripts/fix_relative_links.py \
    site/docs/flight/v3.x/ \
    content/flight/v3.x/zh-cn/docs/ \
    --map-from site/docs/flight/v3.x/
```

**工作原理**：
1. 扫描目录，找出所有带下划线的 `.md` 文件名 → 构建 slug 映射表
2. 对每个文件，用 `resolve_relative()` 智能分析每个内部链接：
   - 尝试多种路径解析策略（同目录、兄弟目录、子目录、根目录）
   - 只有当解析后的文件确实存在时才替换
3. 跳过外部链接（`http://`、`https://`、`mailto:`、`tel:`）

**注意事项**：
- 运行前建议先 `git stash` 或提交当前修改，方便对比回滚
- 用 `--dry-run` 预览后再执行实际修复
- 修复后运行 `npm run build` 验证

---

## 其他工具

- `filament-v4-full-sidebar.mjs` — Filament v4.x 文档侧边栏配置

