"""Release inventory: source/runtime code, references, and deliberate small fixtures."""
from pathlib import Path

ROOT_FILES = {
    'README.md', 'LICENSE', 'NOTICE.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
    'SECURITY.md', 'package.json', 'package-lock.json', 'plugin.json',
    'tsconfig.json', 'tsconfig.renderer.json', '.gitignore',
}
TREES = {
    '.agents', '.claude-plugin', '.codex-plugin', '.github', 'adapters', 'dist',
    'docs', 'examples', 'motion', 'python', 'renderer', 'scripts', 'skills',
    'sources', 'src', 'templates', 'tests',
}
SOURCE_SUFFIXES = {'.ts', '.tsx', '.js', '.mjs', '.py', '.json', '.md', '.yaml', '.yml', '.toml', '.lock', '.txt', '.svg'}
FIXTURES = {
    'examples/assets/ambient.wav', 'examples/assets/sample-recording.mp4',
    'examples/assets/speaker-prop.glb', 'templates/short/public/SpaceGrotesk.ttf',
}
SKIP = {'node_modules', '.venv', '.cache', '.git', '__pycache__', 'runs', 'composition-bundle', 'release-assets'}


def included(relative: Path) -> bool:
    parts = relative.parts
    if any(p in SKIP or p.startswith('.env') for p in parts):
        return False
    name = relative.as_posix()
    if len(parts) == 1:
        return name in ROOT_FILES
    if name == 'demos/README.md':
        return True
    return parts[0] in TREES and (relative.suffix in SOURCE_SUFFIXES or name in FIXTURES)


def collect_files(root: Path):
    """Prune excluded trees before walking; never traverse dependency/browser caches."""
    import os
    files = []
    for current, dirs, names in os.walk(root):
        current = Path(current)
        dirs[:] = sorted(d for d in dirs if d not in SKIP and not (current / d).is_symlink()
                         and (current != root or d in TREES or d == 'demos'))
        for name in names:
            file = current / name
            if not file.is_symlink() and included(file.relative_to(root)):
                files.append(file)
    return sorted(files)
