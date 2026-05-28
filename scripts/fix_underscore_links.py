#!/usr/bin/env python3
"""修复 Docusaurus 文档中连字符 → 下划线的内部链接。

Docusaurus 路由 slug 保留文件名中的下划线 `_`（不会自动转为连字符 `-`），
但翻译后链接常错误使用连字符代替下划线。本脚本自动扫描目录，找出所有
"把下划线文件名写成连字符 slug" 的错误链接并批量修复。

用法:
    # 修复单个目录（只替换，不写文件，预览模式）
    python3 fix_underscore_links.py site/docs/flight/v3.x/ --dry-run

    # 实际修复
    python3 fix_underscore_links.py site/docs/flight/v3.x/

    # 同时修复 site/ 和 content/（双目录同步）
    python3 fix_underscore_links.py site/docs/flight/v3.x/ content/flight/v3.x/zh-cn/docs/

注意：
    - 只修改内部链接（不修改 http/https/mailto/tel 开头的链接）
    - 长字符串优先替换（如 "unit-testing-and-solid-principles" 优先于 "unit-testing"）
    - 只替换链接 URL 中的 slug，不影响链接显示文本
"""

import re
import sys
from pathlib import Path
from collections import OrderedDict


def build_slug_map(root_dir: str) -> list[tuple[str, str]]:
    """扫描目录，找出所有带下划线的 .md 文件，生成连字符→下划线映射。

    返回按字符串长度降序排列的映射列表，确保长 slug 优先替换。

    排除规则：如果文件的连字符版本与其父目录名相同（如
    awesome-plugins/awesome_plugins.md 的连字符版本 "awesome-plugins"
    与父目录 "awesome-plugins" 相同），则跳过该映射，因为连字符版本
    本身就是正确的 Docusaurus 目录路由。
    """
    root = Path(root_dir)
    slug_pairs = OrderedDict()

    for md_file in sorted(root.rglob("*.md")):
        name = md_file.stem  # 不含目录和扩展名的文件名
        if "_" in name:
            # 连字符版本：把所有下划线换成连字符
            hyphen_version = name.replace("_", "-")
            if hyphen_version == name:
                continue
            if hyphen_version in slug_pairs:
                continue
            # 排除：父目录名与连字符版本相同（如 awesome-plugins/awesome_plugins.md）
            parent_dir = md_file.parent
            relative_parent = parent_dir.relative_to(root)
            if relative_parent.name == hyphen_version or str(relative_parent) == hyphen_version:
                continue
            slug_pairs[hyphen_version] = name

    # 按字符串长度降序排列（长字符串优先替换，避免短串误伤长串）
    result = sorted(slug_pairs.items(), key=lambda x: -len(x[0]))
    return result


# 不修改的外部链接前缀
EXTERNAL_PREFIXES = ("http://", "https://", "mailto:", "tel:", "#")


def is_internal_url(url: str) -> bool:
    """判断 URL 是否为内部链接（非外部协议、非当前页锚点）"""
    for prefix in EXTERNAL_PREFIXES:
        if url.startswith(prefix):
            return False
    return True


def fix_slugs_in_text(content: str, slug_map: list[tuple[str, str]]) -> tuple[str, int]:
    """替换文本中 Markdown 链接 URL 里的连字符 slug 为下划线 slug"""
    total_changes = 0

    def replace_link(match):
        nonlocal total_changes
        link_text = match.group(1)
        url = match.group(2)

        if not is_internal_url(url):
            return match.group(0)

        new_url = url
        for old, new in slug_map:
            if old in new_url:
                new_url = new_url.replace(old, new)

        if new_url != url:
            total_changes += 1
            return f"[{link_text}]({new_url})"

        return match.group(0)

    # 匹配 Markdown 链接: [text](url)
    pattern = r"\[([^\]]*)\]\(([^)]+)\)"
    new_content = re.sub(pattern, replace_link, content)
    return new_content, total_changes


def process_directory(root_dir: str, slug_map: list[tuple[str, str]], dry_run: bool = False):
    """处理目录下所有 markdown 文件"""
    root = Path(root_dir)
    md_files = sorted(root.rglob("*.md"))

    total_files = 0
    total_changes = 0

    for md_file in md_files:
        content = md_file.read_text(encoding="utf-8")
        new_content, changes = fix_slugs_in_text(content, slug_map)

        if changes > 0:
            if dry_run:
                print(f"  [预览] {md_file.relative_to(root)}: {changes} 处待修复")
            else:
                md_file.write_text(new_content, encoding="utf-8")
                print(f"  ✓ {md_file.relative_to(root)}: {changes} 处修复")
            total_files += 1
            total_changes += changes

    if dry_run:
        print(f"\n预览：将修改 {total_files} 个文件，{total_changes} 处链接（未实际写入）")
    else:
        print(f"\n共修改 {total_files} 个文件，{total_changes} 处链接")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="修复 Docusaurus 文档中连字符→下划线的内部链接",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 预览模式（不改文件）
  python3 fix_underscore_links.py site/docs/flight/v3.x/ --dry-run

  # 实际修复单个目录
  python3 fix_underscore_links.py site/docs/flight/v3.x/

  # 同时修复 site/ 和 content/（双目录同步）
  python3 fix_underscore_links.py site/docs/flight/v3.x/ content/flight/v3.x/zh-cn/docs/
        """,
    )
    parser.add_argument(
        "directories",
        nargs="+",
        help="要处理的目录路径（可指定多个，如 site/ 和 content/ 双目录同步修复）",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="预览模式，只显示将要修改的内容，不实际写入文件",
    )
    parser.add_argument(
        "--map-from",
        help="从哪个目录提取文件名来构建 slug 映射（默认从第一个目录提取）",
    )

    args = parser.parse_args()
    map_source = args.map_from or args.directories[0]

    if not Path(map_source).exists():
        print(f"错误：目录不存在: {map_source}")
        sys.exit(1)

    print(f"从 '{map_source}' 扫描带下划线的文件名...")
    slug_map = build_slug_map(map_source)

    if not slug_map:
        print("未发现需要映射的 slug，无需处理。")
        sys.exit(0)

    print(f"已生成 {len(slug_map)} 组 slug 映射:")
    for old, new in slug_map:
        print(f"  {old} → {new}")
    print()

    mode = "预览模式" if args.dry_run else "修复模式"
    for directory in args.directories:
        if not Path(directory).exists():
            print(f"警告：目录不存在，跳过: {directory}")
            continue
        print(f"{'=' * 60}")
        print(f"[{mode}] 处理目录: {directory}")
        process_directory(directory, slug_map, dry_run=args.dry_run)
