# scripts

用于保存采集、转换、校验等工具脚本。

## 现有脚本

### `fix_underscore_links.py`

修复 Docusaurus 文档中连字符 `-` → 下划线 `_` 的内部链接。

**适用场景**：翻译后，文档内链接常错误使用连字符 slug（如 `dependency-injection-container`），但 Docusaurus 路由保留文件名中的下划线（`dependency_injection_container`）。本脚本自动扫描目录，找出所有不匹配的链接并批量修复。

**用法**：

```bash
# 预览模式（不改文件，先看看有哪些问题）
python3 scripts/fix_underscore_links.py site/docs/flight/v3.x/ --dry-run

# 实际修复单个目录
python3 scripts/fix_underscore_links.py site/docs/flight/v3.x/

# 同时修复 site/ 和 content/（双目录同步，推荐）
python3 scripts/fix_underscore_links.py site/docs/flight/v3.x/ content/flight/v3.x/zh-cn/docs/
```

**工作原理**：
1. 扫描目录，找出所有带下划线的 `.md` 文件名
2. 生成连字符→下划线的 slug 映射
3. 遍历所有 markdown 文件，替换内部链接 URL 中的错误 slug
4. 跳过外部链接（`http://`、`https://`、`mailto:`、`tel:`）

**注意事项**：
- 运行前建议先 `git stash` 或提交当前修改，方便对比回滚
- 用 `--dry-run` 预览后再执行实际修复
- 修复后运行 `npm run build` 验证

---

## 其他工具

- `filament-v4-full-sidebar.mjs` — Filament v4.x 文档侧边栏配置

