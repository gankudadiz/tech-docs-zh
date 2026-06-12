# 准备热修复版本

- 创建一个 hotfix 分支：`git checkout -b hotfix-vX.Y.Z`
- 对代码进行修改和/或从其他分支 `cherry-pick` 提交并提交更改。
- 测试热修复和二进制文件。
- [发布](RELEASE.md) 新的 MarkText 版本。

**如何 cherry pick？**

你可以从另一个分支选取提交并应用到当前分支。

- `git checkout hotfix-vX.Y.Z`
- `git cherry-pick <完整提交哈希>`
- 如果需要，请解决所有冲突并 `git commit` 提交更改。
