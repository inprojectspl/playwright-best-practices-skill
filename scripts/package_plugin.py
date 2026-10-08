"""Generate the focused plugin from the selected upstream skill only."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'playwright-best-practices'
PLUGIN = ROOT / "plugin"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    for boundary in (PLUGIN, SOURCE, ROOT / "LICENSE.md", *SOURCE.parents):
        if boundary.is_symlink():
            raise SystemExit(f"Unexpected symlink boundary: {boundary}")
    for base in (SOURCE, PLUGIN):
        for path in base.rglob("*"):
            if path.is_symlink():
                raise SystemExit(f"Unexpected symlink: {path}")
    manifest = json.loads((PLUGIN / ".claude-plugin/plugin.json").read_text())
    if set(manifest) - {"name", "version", "description", "author", "repository", "license", "skills", "keywords"}:
        raise SystemExit("Unexpected manifest extension in skill-only package")
    if manifest["skills"] != ["./skills/"]:
        raise SystemExit("Unexpected skills directory")
    outputs = {}
    for source in sorted(SOURCE.rglob("*.md")):
        if source.name == "GENERATION.md":
            continue
        if source.is_symlink():
            raise SystemExit(f"Unexpected symlink: {source}")
        outputs[PLUGIN / "skills" / 'playwright-best-practices' / source.relative_to(SOURCE)] = source.read_bytes()
    outputs[PLUGIN / "LICENSE"] = (ROOT / "LICENSE.md").read_bytes()
    metadata = {key: value for key, value in manifest.items() if key != "skills"}
    outputs[PLUGIN / ".codex-plugin/plugin.json"] = (json.dumps({**metadata, "skills": "./skills/"}, indent=2) + "\n").encode()
    outputs[PLUGIN / "plugin.json"] = (json.dumps({"$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", **metadata}, indent=2) + "\n").encode()
    authored = {PLUGIN / ".claude-plugin/plugin.json", PLUGIN / "CHANGELOG.md", PLUGIN / "README.md"}
    unexpected = {p for p in PLUGIN.rglob("*") if p.is_file()} - outputs.keys() - authored
    if unexpected:
        raise SystemExit("Unexpected distribution files: " + ", ".join(str(p.relative_to(PLUGIN)) for p in sorted(unexpected)))
    existing = {p for p in (PLUGIN / "skills").rglob("*") if p.is_file()}
    stale = existing - outputs.keys()
    changed = {p for p, data in outputs.items() if not p.exists() or p.read_bytes() != data}
    if args.check:
        for p in sorted(stale | changed):
            print(f"Stale package: {p.relative_to(ROOT)}")
        raise SystemExit(bool(stale or changed))
    for p in stale:
        p.unlink()
    for p, data in outputs.items():
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)
    print(f"Packaged {manifest['name']} {manifest['version']}")


if __name__ == "__main__":
    main()
