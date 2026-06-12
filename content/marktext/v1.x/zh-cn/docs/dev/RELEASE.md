# 发布 MarkText

发布流水线通过推送 `v*` 标签触发。`Release MarkText` 工作流（`.github/workflows/release.yml`）然后执行 **验证 → 构建（4 平台矩阵）→ 发布**，并创建一个包含安装程序和 `SHA256SUMS.txt` 的 GitHub Release。

以下流程涵盖候选发布版和稳定版发布——步骤相同，只是版本字符串不同。

## 前提条件

- 对 `marktext/marktext` 有推送权限
- `gh` CLI 已认证（`gh auth status`）
- 最新 `develop` 分支的干净检出

## 1. 切出发布分支（仅限第一个 RC）

```bash
git checkout develop
git pull --ff-only
git checkout -b release/vX.Y.0     # 例如 release/v0.19.0
```

对该次版本的所有 RC（`rc.1`、`rc.2` 等）**以及**最终稳定版标签都复用同一分支。对于后续版本，只需 `git checkout release/vX.Y.0` 然后跳到步骤 2。

## 2. 更新 `package.json`

编辑 `version` 字段——这是唯一需要修改的文件。

| 阶段 | 版本字符串 |
|---|---|
| 候选发布版 | `0.19.0-rc.1`、`0.19.0-rc.2` 等 |
| 稳定版 | `0.19.0` |

## 3. 提交并推送分支

```bash
git add package.json
git commit -m "chore(release): vX.Y.Z[-rc.N]"
git push -u origin release/vX.Y.0
```

## 4. 打标签并推送

```bash
git tag -a vX.Y.Z-rc.N -m "vX.Y.Z-rc.N"
git push origin vX.Y.Z-rc.N
```

标签中的 `-`（例如 `v0.19.0-rc.1`）会使工作流自动将 GitHub Release 标记为**预发布版**。普通的 `vX.Y.Z` 标签则发布为稳定版。

## 5. 创建跟踪 PR（仅限 RC）

从 `release/vX.Y.0` → `develop` 创建一个**草稿** PR 以便跟踪。在匹配的稳定版标签推送之前**不要**合并它——合并 RC 提交会使 `develop` 冻结在 RC 版本。

```bash
gh pr create --draft --base develop --head release/vX.Y.0 \
  --title "chore(release): vX.Y.0 发布分支（稳定版发布前请勿合并）" \
  --body "vX.Y.0 的跟踪分支。请在稳定版标签发布后合并。"
```

## 6. 监控工作流

```bash
gh run list --workflow=release.yml --limit 3
gh run watch <run-id> --exit-status
```

预计时间：验证 ~30 秒 · 构建矩阵 ~15–30 分钟（4 个平台并行）· 发布 ~1 分钟。

## 7. 验证已发布的 Release

```bash
gh release view vX.Y.Z-rc.N
```

确认：

- Release 页面上的 `Pre-release` 徽章（仅 RC）
- **24 个资产**：
  - **Linux**（5）：`AppImage`、`deb`、`rpm`、`snap`、`tar.gz`
  - **macOS arm64**（4）：`dmg`、`dmg.blockmap`、`zip`、`zip.blockmap`
  - **macOS x64**（4）：`dmg`、`dmg.blockmap`、`zip`、`zip.blockmap`
  - **Windows x64**（3）：`setup.exe`、`setup.exe.blockmap`、`zip`
  - **Windows arm64**（3）：`setup.exe`、`setup.exe.blockmap`、`zip`
  - **自动更新元数据**（4）：`latest.yml`、`latest-mac.yml`、`latest-linux.yml`、`builder-debug.yml`
  - **校验和**（1）：`SHA256SUMS.txt`
- 自动生成的发布说明列出了自上一个标签以来合并的 PR

## 8. 稳定版发布后的清理（在稳定版 `vX.Y.0` 发布后）

1. 将步骤 5 中的跟踪 PR 标记为可审查并合并到 `develop`
2. 创建一个后续 PR，将 `develop` 的 `package.json` 版本号更新为下一个开发版本（例如 `0.20.0-dev`）

---

对于基于之前已发布标签的热修复，请参见 [RELEASE_HOTFIX.md](RELEASE_HOTFIX.md)。热修复分支就绪后，上述步骤 2–7 同样适用。
