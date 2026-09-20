"""Losslessly or conservatively optimize deployable storefront images in place."""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1] / "public" / "assets"
FORMATS = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG", ".webp": "WEBP"}
MINIMUM_SIZE = 64 * 1024


def maximum_dimension(path: Path) -> int:
    return 1920 if "reviews" in path.parts else 1600


def optimize(path: Path) -> tuple[int, int, bool]:
    original_size = path.stat().st_size
    suffix = path.suffix.lower()
    image_format = FORMATS.get(suffix)
    if not image_format:
        return original_size, original_size, False

    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        limit = maximum_dimension(path)
        resized = max(image.size) > limit
        if resized:
            image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        if original_size < MINIMUM_SIZE and not resized:
            return original_size, original_size, False

        temporary = path.with_name(f".{path.name}.optimizing")
        if image_format == "JPEG":
            if image.mode not in ("RGB", "L"):
                image = image.convert("RGB")
            image.save(temporary, format="JPEG", quality=84, optimize=True, progressive=True)
        elif image_format == "PNG":
            image.save(temporary, format="PNG", optimize=True, compress_level=9)
        else:
            image.save(temporary, format="WEBP", quality=84, method=6)

    optimized_size = temporary.stat().st_size
    if optimized_size < original_size:
        os.replace(temporary, path)
        return original_size, optimized_size, True
    temporary.unlink(missing_ok=True)
    return original_size, original_size, False


def main() -> None:
    before = 0
    after = 0
    changed = 0
    images = [path for path in ROOT.rglob("*") if path.is_file() and path.suffix.lower() in FORMATS]
    for image in images:
        original, optimized, updated = optimize(image)
        before += original
        after += optimized
        changed += int(updated)
        if updated:
            print(f"optimized {image.relative_to(ROOT)}: {original / 1024:.0f} KB -> {optimized / 1024:.0f} KB")
    saved = before - after
    print(f"Optimized {changed}/{len(images)} images; saved {saved / 1024 / 1024:.2f} MB ({saved / before:.1%}).")


if __name__ == "__main__":
    main()
