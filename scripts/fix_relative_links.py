#!/usr/bin/env python3
"""修复 Docusaurus 文档中错误的相对路径链接。

常见问题：
1. 连字符 slug vs 下划线文件名：Docusaurus 保留下划线，但链接用了连字符
2. 多余 `../`：同一目录下的文件链接错误使用了 `../xxx`
3. `../../` 过多：从一个子目录到兄弟子目录用了两层 `..`，实际只需一层

用法：
    # 预览模式
    python3 scripts/fix_relative_links.py site/docs/flight/v3.x/ --dry-run

    # 实际修复
    python3 scripts/fix_relative_links.py site/docs/flight/v3.x/

    # 修复 site/ 和 content/ 双目录
    python3 scripts/fix_relative_links.py \
        site/docs/flight/v3.x/ \
        content/flight/v3.x/zh-cn/docs/ \
        --map-from site/docs/flight/v3.x/
"""

import re
import sys
from pathlib import Path
from collections import OrderedDict


# ============================================================
# 第一部分：连字符 → 下划线 slug 修复
# ============================================================

def build_slug_map(root_dir: str) -> list[tuple[str, str]]:
    """扫描目录，找出所有带下划线的 .md 文件，生成连字符→下划线映射。
    排除父目录名与连字符版本相同的情况（如 awesome-plugins/awesome_plugins.md）。
    """
    root = Path(root_dir)
    slug_pairs = OrderedDict()

    for md_file in sorted(root.rglob("*.md")):
        name = md_file.stem
        if "_" in name:
            hyphen = name.replace("_", "-")
            if hyphen == name or hyphen in slug_pairs:
                continue
            # 排除：父目录名与连字符版本相同（视为正确的目录路由）
            parent_dir = md_file.parent
            if parent_dir.name == hyphen:
                continue
            slug_pairs[hyphen] = name

    return sorted(slug_pairs.items(), key=lambda x: -len(x[0]))


EXTERNAL_PREFIXES = ("http://", "https://", "mailto:", "tel:", "#")


def is_internal_url(url: str) -> bool:
    return not any(url.startswith(p) for p in EXTERNAL_PREFIXES)


def fix_slugs_in_text(content: str, slug_map: list[tuple[str, str]]) -> tuple[str, int]:
    """替换 Markdown 链接 URL 中的连字符 slug 为下划线 slug"""
    total = 0
    def repl(m):
        nonlocal total
        text, url = m.group(1), m.group(2)
        if not is_internal_url(url):
            return m.group(0)
        nu = url
        for old, new in slug_map:
            if old in nu:
                nu = nu.replace(old, new)
        if nu != url:
            total += 1
            return f"[{text}]({nu})"
        return m.group(0)
    return re.sub(r"\[([^\]]*)\]\(([^)]+)\)", repl, content), total


# ============================================================
# 第二部分：相对路径层级修复
# ============================================================

def get_section_from_path(path: Path, root: Path) -> str | None:
    """获取文件在站点根下的第一级子目录名（如 learn、awesome-plugins）。
    如果文件在根目录下（无子目录），返回 None。"""
    try:
        rel = path.relative_to(root)
    except ValueError:
        return None
    parts = rel.parts
    if len(parts) >= 2:
        return parts[-2] if parts[-1].endswith(".md") else parts[0]
    return None


def resolve_relative(url: str, section: str | None, root: Path) -> str | None:
    """尝试解析相对路径，找到正确的目标路径。

    从 {root}/{section}/ 的视角出发，尝试多种解析方式，
    返回能找到文件的最短路径，或 None。

    返回的路径是相对于 root 的路径（不含 root）。
    """
    # 去掉开头的 ./
    if url.startswith("./"):
        url = url[2:]

    # 去掉锚点
    url_no_anchor = url.split("#")[0]
    anchor = url[len(url_no_anchor):] if "#" in url else ""

    # 用于查找文件的候选目录
    all_dirs = [d for d in root.iterdir() if d.is_dir()]
    dir_names = sorted(d.name for d in all_dirs)

    # 纯文件名（不含目录前缀）
    pure_name = url_no_anchor.split("/")[-1].split("#")[0]

    def try_path(file_path: Path) -> Path | None:
        """尝试文件路径，加上 .md 扩展名"""
        p = file_path
        if p.suffix == "":
            p = p.with_suffix(".md")
        return p if p.exists() else None

    def find_in_section(section_name: str, filename: str) -> Path | None:
        """在指定 section 中查找文件"""
        return try_path(root / section_name / filename)

    # === 策略 1：直接按当前路径解析 ===
    candidate = try_path(root / url_no_anchor)
    if candidate:
        return url  # 保持原样

    # === 策略 2：有 section 时 ===
    if section:
        # 2a: ../xxx → 在 section/ 中查找 xxx.md
        if url.startswith("../"):
            rest = url[3:].split("#")[0]
            if "/" not in rest:
                # 纯文件名：检查 section 目录
                f = find_in_section(section, rest)
                if f:
                    return rest + anchor
            else:
                # ../subdir/xxx: 检查是否是有效的兄弟目录
                subdir = rest.split("/")[0]
                if subdir in dir_names:
                    # 已经是 ../subdir/xxx，保持（可能正确）
                    # 但如果 xxx 是子目录文件且不存在，尝试其他
                    pass

        # 2b: ../../xxx → 去掉一层 ../ 试试
        if url.startswith("../../"):
            rest = url[6:]
            candidate = try_path(root / rest)
            if candidate:
                return "../" + rest + anchor

        # 2c: ../../subdir/xxx → ../subdir/xxx（兄弟目录）
        if url.startswith("../../"):
            rest = url[6:]  # awesome-plugins/xxx
            if "/" in rest:
                subdir = rest.split("/")[0]
                if subdir in dir_names:
                    candidate = try_path(root / rest)
                    if candidate:
                        return "../" + rest + anchor

        # 2d: xxx 或 dir/xxx（无 ../ 前缀）→ 检查是否需要在前面加 ../
        if not url.startswith("../") and not url.startswith("/"):
            candidate = try_path(root / url_no_anchor)
            if not candidate and "/" in url_no_anchor:
                # 可能是一个子目录引用，但缺少了 ../ 前缀
                # 从 section/ 出发，sibling/xxx 需要 ../sibling/xxx
                first_dir = url_no_anchor.split("/")[0]
                if first_dir in dir_names:
                    candidate = try_path(root / url_no_anchor)
                    if candidate:
                        return "../" + url

        # 2e: 不带 / 的纯文件名 → 检查 section 目录
        if "/" not in url_no_anchor and not url.startswith("../"):
            f = find_in_section(section, url_no_anchor)
            if not f:
                # 不在当前 section，可能在兄弟 section
                for d in dir_names:
                    if d != section:
                        f = find_in_section(d, url_no_anchor)
                        if f:
                            return "../" + d + "/" + url_no_anchor + anchor

    # === 策略 3：从根（无 section）文件 ===
    if not section:
        # 3a: ../subdir/xxx → subdir/xxx（去掉多余的 ..）
        if url.startswith("../"):
            rest = url[3:]
            if "/" in rest:
                subdir = rest.split("/")[0]
                if subdir in dir_names:
                    candidate = try_path(root / rest)
                    if candidate:
                        return rest + anchor

    # === 策略 4：绝对路径 /xxx → 相对路径 ===
    if url.startswith("/"):
        # 去掉开头的 /
        rest = url[1:]
        # 检查是否包含版本号
        # 如 /awesome-plugins/runway → ../awesome-plugins/runway（从有 section 的文件出发）
        if section:
            candidate = try_path(root / rest)
            if candidate:
                return "../" + rest + anchor
        else:
            candidate = try_path(root / rest)
            if candidate:
                return rest + anchor

    # 所有策略都失败，返回 None
    return None


def fix_relative_paths_in_text(content: str, section: str | None, root: Path,
                               slug_map: list[tuple[str, str]]) -> tuple[str, int]:
    """修复相对路径层级错误。使用 resolve_relative 智能解析每个链接。"""
    total = 0

    def repl(m):
        nonlocal total
        text, url = m.group(1), m.group(2)

        if not is_internal_url(url):
            return m.group(0)

        resolved = resolve_relative(url, section, root)

        if resolved is not None and resolved != url:
            total += 1
            return f"[{text}]({resolved})"

        return m.group(0)

    new_content = re.sub(r"\[([^\]]*)\]\(([^)]+)\)", repl, content)
    return new_content, total


def process_directory(root_dir: str, slug_map: list[tuple[str, str]],
                      dry_run: bool = False):
    """处理单个目录，修复 slug 映射 + 相对路径层级"""
    root = Path(root_dir)
    md_files = sorted(root.rglob("*.md"))

    total_files = 0
    total_changes = 0

    for md_file in md_files:
        # 确定文件所在的 section（learn/、awesome-plugins/ 等）
        section = get_section_from_path(md_file, root)

        content = md_file.read_text(encoding="utf-8")
        new_content, slug_changes = fix_slugs_in_text(content, slug_map)

        # 修复相对路径层级
        if section:
            new_content2, path_changes = fix_relative_paths_in_text(
                new_content, section, root, slug_map)
        else:
            new_content2, path_changes = new_content, 0

        total_chg = slug_changes + path_changes

        if total_chg > 0:
            if dry_run:
                print(f"  [预览] {md_file.relative_to(root)}: {total_chg} 处待修复"
                      f" (slug={slug_changes}, path={path_changes})")
            else:
                md_file.write_text(new_content2, encoding="utf-8")
                print(f"  ✓ {md_file.relative_to(root)}: {total_chg} 处修复"
                      f" (slug={slug_changes}, path={path_changes})")
            total_files += 1
            total_changes += total_chg

    if dry_run:
        print(f"\n预览：将修改 {total_files} 个文件，{total_changes} 处链接")
    else:
        print(f"\n共修改 {total_files} 个文件，{total_changes} 处链接")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="修复 Docusaurus 文档中错误的相对路径链接",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 预览模式（不改文件）
  python3 scripts/fix_relative_links.py site/docs/flight/v3.x/ --dry-run

  # 实际修复
  python3 scripts/fix_relative_links.py site/docs/flight/v3.x/

  # 修复 site/ 和 content/ 双目录
  python3 scripts/fix_relative_links.py \
      site/docs/flight/v3.x/ \
      content/flight/v3.x/zh-cn/docs/ \
      --map-from site/docs/flight/v3.x/
        """,
    )
    parser.add_argument("directories", nargs="+",
                        help="要处理的目录（可多个，如 site/ 和 content/ 同步修复）")
    parser.add_argument("--dry-run", action="store_true",
                        help="预览模式，只显示不修改")
    parser.add_argument("--map-from",
                        help="从哪个目录提取 slug 映射（默认从第一个目录）")

    args = parser.parse_args()

    map_source = args.map_from or args.directories[0]
    if not Path(map_source).exists():
        print(f"错误：目录不存在: {map_source}")
        sys.exit(1)

    print(f"阶段一：从 '{map_source}' 生成 slug 映射...")
    slug_map = build_slug_map(map_source)
    print(f"已生成 {len(slug_map)} 组 slug 映射:")
    for old, new in slug_map:
        print(f"  {old} → {new}")
    print()

    mode = "预览" if args.dry_run else "修复"
    for directory in args.directories:
        if not Path(directory).exists():
            print(f"警告：目录不存在，跳过: {directory}")
            continue
        print(f"{'=' * 60}")
        print(f"[{mode}] 处理目录: {directory}")
        process_directory(directory, slug_map, dry_run=args.dry_run)
