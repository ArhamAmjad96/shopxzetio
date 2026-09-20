"""Optimize oversized storefront MP4 files for browser streaming."""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

import imageio_ffmpeg


ROOT = Path(__file__).resolve().parents[1] / "public" / "assets"
MINIMUM_SIZE = 2 * 1024 * 1024


def optimize(path: Path, ffmpeg: str) -> tuple[int, int, bool]:
    original_size = path.stat().st_size
    if original_size < MINIMUM_SIZE:
        return original_size, original_size, False

    temporary = path.with_name(f".{path.stem}.optimized.mp4")
    command = [
        ffmpeg,
        "-hide_banner",
        "-loglevel", "error",
        "-y",
        "-i", str(path),
        "-map_metadata", "-1",
        "-vf", "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "27",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        str(temporary),
    ]
    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError:
        temporary.unlink(missing_ok=True)
        raise

    optimized_size = temporary.stat().st_size
    if optimized_size < original_size:
        os.replace(temporary, path)
        return original_size, optimized_size, True
    temporary.unlink(missing_ok=True)
    return original_size, original_size, False


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    videos = sorted(ROOT.rglob("*.mp4"))
    before = 0
    after = 0
    changed = 0
    for video in videos:
        original, optimized, updated = optimize(video, ffmpeg)
        before += original
        after += optimized
        changed += int(updated)
        if updated:
            print(f"optimized {video.relative_to(ROOT)}: {original / 1024 / 1024:.1f} MB -> {optimized / 1024 / 1024:.1f} MB", flush=True)
    saved = before - after
    print(f"Optimized {changed}/{len(videos)} videos; saved {saved / 1024 / 1024:.2f} MB ({saved / before:.1%}).")


if __name__ == "__main__":
    main()
