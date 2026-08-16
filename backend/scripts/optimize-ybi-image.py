#!/usr/bin/env python3
"""Create a web-ready YBI image for client/public/ybi-assets.

Example:
  python3 scripts/optimize-ybi-image.py /path/to/photo.jpg \
    --output client/public/ybi-assets/programs/ybi-new-program.jpg \
    --alt "Young adults collaborating during a YBI entrepreneurship workshop."
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ASSET_ROOT = REPOSITORY_ROOT / "client" / "public" / "ybi-assets"
SUPPORTED_OUTPUTS = {".jpg", ".jpeg", ".png", ".webp"}


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Optimize one image for the repository-local YBI asset library."
    )
    parser.add_argument("source", type=Path, help="Original local image file.")
    parser.add_argument(
        "--output",
        required=True,
        type=Path,
        help="Repository-local destination under client/public/ybi-assets/.",
    )
    parser.add_argument(
        "--alt",
        required=True,
        help="Accessible alt text to add to ybi-source-assets/README.md.",
    )
    parser.add_argument(
        "--max-edge",
        type=int,
        default=1600,
        help="Maximum output width or height in pixels (default: 1600).",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=82,
        help="JPEG/WebP quality from 1 to 95 (default: 82).",
    )
    return parser.parse_args()


def validate_arguments(args: argparse.Namespace) -> Path:
    source = args.source.expanduser().resolve()
    output = args.output.expanduser().resolve()

    if not source.is_file():
        raise SystemExit(f"Source image was not found: {source}")
    if not str(output).startswith(f"{PUBLIC_ASSET_ROOT}{Path('/')}" ):
        raise SystemExit(
            "Output must be inside client/public/ybi-assets so the cloned site can serve it."
        )
    if output.suffix.lower() not in SUPPORTED_OUTPUTS:
        choices = ", ".join(sorted(SUPPORTED_OUTPUTS))
        raise SystemExit(f"Output must use one of: {choices}")
    if not args.alt.strip():
        raise SystemExit("Accessible alt text cannot be empty.")
    if args.max_edge < 320:
        raise SystemExit("--max-edge must be at least 320 pixels.")
    if not 1 <= args.quality <= 95:
        raise SystemExit("--quality must be between 1 and 95.")
    return output


def optimize_image(source: Path, output: Path, max_edge: int, quality: int) -> tuple[int, int]:
    output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        suffix = output.suffix.lower()

        if suffix == ".png":
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA")
            image.save(output, "PNG", optimize=True)
        else:
            if image.mode != "RGB":
                image = image.convert("RGB")
            image_format = "WEBP" if suffix == ".webp" else "JPEG"
            image.save(
                output,
                image_format,
                quality=quality,
                optimize=True,
                progressive=image_format == "JPEG",
            )

        return image.size


def main() -> None:
    args = parse_arguments()
    output = validate_arguments(args)
    source = args.source.expanduser().resolve()
    width, height = optimize_image(source, output, args.max_edge, args.quality)
    public_path = f"/ybi-assets/{output.relative_to(PUBLIC_ASSET_ROOT).as_posix()}"

    print(f"Created {public_path} at {width}×{height}.")
    print("Add this accessible description to ybi-source-assets/README.md:")
    print(f"| `{public_path}` | Describe the file's site role. | {args.alt.strip()} |")


if __name__ == "__main__":
    main()
