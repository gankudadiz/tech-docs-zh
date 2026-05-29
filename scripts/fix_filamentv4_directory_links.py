#!/usr/bin/env python3
"""修复 Filament v4 文档中指向目录而非具体文件的链接。

问题模式：
  ../schemas → ../schemas/overview
  ../actions → ../actions/overview
  ../plugins → ../plugins/getting-started (特殊情况)

用法：
    # 预览模式
    python3 scripts/fix_filamentv4_directory_links.py site/docs/filament/v4.x/ --dry-run

    # 实际修复
    python3 scripts/fix_filamentv4_directory_links.py site/docs/filament/v4.x/

    # 同步修复 content/ 目录
    python3 scripts/fix_filamentv4_directory_links.py \
        site/docs/filament/v4.x/ \
        content/filament/v4.x/zh-cn/docs/
"""

import re
import sys
from pathlib import Path


# Filament v4 需要修复的目录映射：目录名 → 目标文件名
# 大部分目录都有 overview.md，plugins 例外
DIR_TO_OVERVIEW = {
    "schemas": "overview",
    "actions": "overview",
    "tables": "overview",
    "forms": "overview",
    "notifications": "overview",
    "styling": "overview",
    "widgets": "overview",
    "plugins": "getting-started",  # plugins 没有 overview.md
    "infolists": "overview",
    "resources": "overview",
    "users": "overview",
    "navigation": "overview",
}

# 子目录映射：子目录名 → (父目录名, 目标文件名)
# 这些目录是其他目录的子目录，需要特殊处理
SUBDIR_TO_OVERVIEW = {
    "columns": ("tables", "overview"),  # tables/columns 子目录
    "filters": ("tables", "overview"),  # tables/filters 子目录
}

# 匹配 Markdown 链接的正则表达式
LINK_PATTERN = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')

EXTERNAL_PREFIXES = ("http://", "https://", "mailto:", "tel:", "#")


def is_internal_url(url: str) -> bool:
    """检查是否是内部链接"""
    return not any(url.startswith(p) for p in EXTERNAL_PREFIXES)


def get_relative_prefix(file_path: Path, root: Path) -> str:
    """计算从当前文件到文档根目录的相对路径前缀。

    Args:
        file_path: 当前文件路径
        root: 文档根目录

    Returns:
        相对路径前缀（如 "../" 或 "../../"）
    """
    try:
        rel = file_path.relative_to(root)
    except ValueError:
        return ""

    # 计算目录深度（文件本身不算）
    depth = len(rel.parts) - 1
    if depth <= 0:
        return ""

    return "../" * depth


def fix_directory_links(content: str, file_path: Path, root: Path) -> tuple[str, int]:
    """修复指向目录的链接，使其指向具体的 overview 文件。

    Args:
        content: 文件内容
        file_path: 当前文件路径
        root: 文档根目录

    Returns:
        (新内容, 修复数量)
    """
    total = 0
    rel_prefix = get_relative_prefix(file_path, root)

    def repl(m):
        nonlocal total
        text, url = m.group(1), m.group(2)

        # 跳过外部链接
        if not is_internal_url(url):
            return m.group(0)

        # 跳过已经有具体文件名的链接（如 ../schemas/overview）
        # 检查 URL 的最后一部分是否是文件名（包含 / 或 .md）
        url_parts = url.rstrip('/').split('/')
        last_part = url_parts[-1]

        # 如果最后一部分是文件名（有 .md 扩展名或者是已知的文件名），跳过
        # 但注意：dir_name/overview 形式的链接需要检查是否需要添加 ../ 前缀
        if last_part.endswith('.md') or last_part in ['overview', 'getting-started',
                                                       'layouts', 'sections', 'tabs',
                                                       'primes', 'wizards', 'callouts',
                                                       'empty-states', 'custom-components',
                                                       'modals', 'grouping-actions',
                                                       'button-action', 'icon-button',
                                                       'link-action', 'action-group',
                                                       'groups',
                                                       'layout', 'selection', 'sorting',
                                                       'summaries', 'bulk-actions',
                                                       'custom-data',
                                                       'toggle-buttons', 'checkbox-list',
                                                       'repeater', 'builder', 'select',
                                                       'validation', 'placeholder',
                                                       'hidden', 'radio', 'tags',
                                                       'textarea', 'text-input',
                                                       'date-time', 'file-upload',
                                                       'key-value', 'markdown-editor',
                                                       'rich-editor', 'color-picker',
                                                       'colors', 'icons', 'spacing',
                                                       'typography', 'css-hooks',
                                                       'testing-schemas', 'testing-forms',
                                                       'testing-tables', 'testing-actions',
                                                       'testing-notifications',
                                                       'charts', 'stats-overview',
                                                       'custom-pages', 'clusters',
                                                       'user-menu', 'groups', 'items',
                                                       'panel-configuration',
                                                       'global-search',
                                                       'database-notifications',
                                                       'broadcast-notifications',
                                                       'customizing-notifications',
                                                       'custom-fields',
                                                       'panel-plugins',
                                                       'building-pages', 'building-resources',
                                                       'building-columns', 'building-fields',
                                                       'building-actions', 'building-widgets',
                                                       'repeatable-entry', 'text-entry',
                                                       'image-entry', 'icon-entry',
                                                       'key-value-entry',
                                                       'creating-records', 'editing-records',
                                                       'viewing-records', 'listing-records',
                                                       'managing-relationships', 'singular',
                                                       'tenancy', 'authentication', 'avatars',
                                                       'multi-tenancy',
                                                       'enums', 'render-hooks',
                                                       'assets']:
            # 检查是否是 dir_name/overview 形式的链接，且需要添加 ../ 前缀
            # 例如：notifications/overview 应该是 ../notifications/overview
            if len(url_parts) == 2 and url_parts[1] in ['overview', 'getting-started']:
                dir_name = url_parts[0]
                if dir_name in DIR_TO_OVERVIEW:
                    # 检查是否需要添加 ../ 前缀
                    # 如果链接没有 ../ 前缀，且当前文件不在根目录，则需要添加
                    if not url.startswith('../') and rel_prefix:
                        new_url = f'{rel_prefix}{dir_name}/{url_parts[1]}'
                        total += 1
                        return f'[{text}]({new_url})'
            return m.group(0)

        # 检查是否是指向目录的链接
        # 处理相对路径：../schemas 或 ../../schemas 或 schemas
        new_url = url
        changed = False

        # 先处理子目录（如 columns、filters）
        for dir_name, (parent_dir, target_file) in SUBDIR_TO_OVERVIEW.items():
            # 检查当前文件是否在父目录中
            try:
                rel = file_path.relative_to(root)
                current_dir = rel.parts[0] if len(rel.parts) > 1 else ""
            except ValueError:
                current_dir = ""

            # 匹配模式：dir_name、../dir_name 或 ../../dir_name
            patterns = [
                (f'{dir_name}$', f'{dir_name}/{target_file}'),
                (f'{dir_name}/$', f'{dir_name}/{target_file}'),
                (f'../{dir_name}$', f'../{parent_dir}/{dir_name}/{target_file}'),
                (f'../{dir_name}/$', f'../{parent_dir}/{dir_name}/{target_file}'),
                (f'../../{dir_name}$', f'../../{parent_dir}/{dir_name}/{target_file}'),
                (f'../../{dir_name}/$', f'../../{parent_dir}/{dir_name}/{target_file}'),
            ]

            for pattern, replacement in patterns:
                if url == pattern.rstrip('$').rstrip('/'):
                    # 如果当前文件在父目录中，使用相对路径
                    if current_dir == parent_dir:
                        new_url = f'{dir_name}/{target_file}'
                    else:
                        new_url = replacement
                    changed = True
                    break
                # 也处理带锚点的情况
                if url.startswith(pattern.rstrip('$').rstrip('/') + '#'):
                    anchor = url[len(pattern.rstrip('$').rstrip('/')):]
                    if current_dir == parent_dir:
                        new_url = f'{dir_name}/{target_file}{anchor}'
                    else:
                        new_url = replacement + anchor
                    changed = True
                    break

            if changed:
                break

        # 如果没有匹配子目录，处理顶级目录
        if not changed:
            for dir_name, target_file in DIR_TO_OVERVIEW.items():
                # 匹配模式：dir_name、../dir_name 或 ../../dir_name（不在后面跟 / 或其他路径）
                # 使用 word boundary 确保精确匹配
                patterns = [
                    (f'{dir_name}$', f'{rel_prefix}{dir_name}/{target_file}'),
                    (f'{dir_name}/$', f'{rel_prefix}{dir_name}/{target_file}'),
                    (f'../{dir_name}$', f'../{dir_name}/{target_file}'),
                    (f'../{dir_name}/$', f'../{dir_name}/{target_file}'),
                    (f'../../{dir_name}$', f'../../{dir_name}/{target_file}'),
                    (f'../../{dir_name}/$', f'../../{dir_name}/{target_file}'),
                    (f'../../../{dir_name}$', f'../../../{dir_name}/{target_file}'),
                    (f'../../../{dir_name}/$', f'../../../{dir_name}/{target_file}'),
                ]

                for pattern, replacement in patterns:
                    if url == pattern.rstrip('$').rstrip('/'):
                        new_url = replacement
                        changed = True
                        break
                    # 也处理带锚点的情况：../schemas#xxx → ../schemas/overview#xxx
                    if url.startswith(pattern.rstrip('$').rstrip('/') + '#'):
                        anchor = url[len(pattern.rstrip('$').rstrip('/')):]
                        new_url = replacement + anchor
                        changed = True
                        break

                if changed:
                    break

        # 如果没有匹配子目录，处理顶级目录
        if not changed:
            for dir_name, target_file in DIR_TO_OVERVIEW.items():
                # 匹配模式：dir_name、../dir_name 或 ../../dir_name（不在后面跟 / 或其他路径）
                # 使用 word boundary 确保精确匹配
                patterns = [
                    (f'{dir_name}$', f'{rel_prefix}{dir_name}/{target_file}'),
                    (f'{dir_name}/$', f'{rel_prefix}{dir_name}/{target_file}'),
                    (f'../{dir_name}$', f'../{dir_name}/{target_file}'),
                    (f'../{dir_name}/$', f'../{dir_name}/{target_file}'),
                    (f'../../{dir_name}$', f'../../{dir_name}/{target_file}'),
                    (f'../../{dir_name}/$', f'../../{dir_name}/{target_file}'),
                    (f'../../../{dir_name}$', f'../../../{dir_name}/{target_file}'),
                    (f'../../../{dir_name}/$', f'../../../{dir_name}/{target_file}'),
                ]

                for pattern, replacement in patterns:
                    if url == pattern.rstrip('$').rstrip('/'):
                        new_url = replacement
                        changed = True
                        break
                    # 也处理带锚点的情况：../schemas#xxx → ../schemas/overview#xxx
                    if url.startswith(pattern.rstrip('$').rstrip('/') + '#'):
                        anchor = url[len(pattern.rstrip('$').rstrip('/')):]
                        new_url = replacement + anchor
                        changed = True
                        break

                if changed:
                    break

        if changed:
            total += 1
            return f'[{text}]({new_url})'

        return m.group(0)

    new_content = LINK_PATTERN.sub(repl, content)
    return new_content, total


def process_directory(root_dir: str, dry_run: bool = False) -> tuple[int, int]:
    """处理单个目录，修复目录→overview 链接。

    Args:
        root_dir: 要处理的目录
        dry_run: 是否是预览模式

    Returns:
        (修改文件数, 修复链接数)
    """
    root = Path(root_dir)
    md_files = sorted(root.rglob("*.md"))

    total_files = 0
    total_changes = 0

    for md_file in md_files:
        content = md_file.read_text(encoding="utf-8")
        new_content, changes = fix_directory_links(content, md_file, root)

        if changes > 0:
            if dry_run:
                print(f"  [预览] {md_file.relative_to(root)}: {changes} 处待修复")
                # 显示具体修复内容
                old_lines = content.split('\n')
                new_lines = new_content.split('\n')
                for i, (old_line, new_line) in enumerate(zip(old_lines, new_lines), 1):
                    if old_line != new_line:
                        print(f"    第{i}行: {old_line.strip()}")
                        print(f"      → {new_line.strip()}")
            else:
                md_file.write_text(new_content, encoding="utf-8")
                print(f"  ✓ {md_file.relative_to(root)}: {changes} 处修复")
            total_files += 1
            total_changes += changes

    return total_files, total_changes


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="修复 Filament v4 文档中指向目录而非具体文件的链接",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 预览模式（不改文件）
  python3 scripts/fix_filamentv4_directory_links.py site/docs/filament/v4.x/ --dry-run

  # 实际修复
  python3 scripts/fix_filamentv4_directory_links.py site/docs/filament/v4.x/

  # 同步修复 site/ 和 content/ 目录
  python3 scripts/fix_filamentv4_directory_links.py \\
      site/docs/filament/v4.x/ \\
      content/filament/v4.x/zh-cn/docs/
        """,
    )
    parser.add_argument("directories", nargs="+",
                        help="要处理的目录（可多个，如 site/ 和 content/ 同步修复）")
    parser.add_argument("--dry-run", action="store_true",
                        help="预览模式，只显示不修改")

    args = parser.parse_args()

    mode = "预览" if args.dry_run else "修复"

    for directory in args.directories:
        if not Path(directory).exists():
            print(f"警告：目录不存在，跳过: {directory}")
            continue
        print(f"{'=' * 60}")
        print(f"[{mode}] 处理目录: {directory}")
        total_files, total_changes = process_directory(directory, dry_run=args.dry_run)
        print(f"\n共修改 {total_files} 个文件，{total_changes} 处链接")
        print()
