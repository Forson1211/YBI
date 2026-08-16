# YBI Repository Asset Library and Contributor Guide

The Young Beginners Inspiration logo and all public-site images are stored directly in `client/public/ybi-assets/`. A standard clone therefore contains the images and the application renders them through the same `/ybi-assets/...` paths used in the codebase. The files are optimized copies intended for source control and web delivery; retain high-resolution originals outside the repository.

> Keep image paths absolute from the website root, for example: `/ybi-assets/homepage/ybi-hero.jpg`. Use the published image in markup and add the matching accessible description from the inventory below.

## Accessible Asset Inventory

| Repository path | Site role | Approved accessible alt text |
| --- | --- | --- |
| `/ybi-assets/brand/ybi-logo.png` | Primary public and admin logo. | Young Beginners Inspiration logo. |
| `/ybi-assets/brand/ybi-mark.png` | Compact YBI brand mark and favicon source. | YBI brand mark in red, yellow, orange, and deep blue. |
| `/ybi-assets/homepage/ybi-hero.jpg` | Homepage and gallery hero. | Young woman speaking into a microphone at a youth leadership gathering. |
| `/ybi-assets/programs/ybi-public-speaking.jpg` | Public-speaking program page. | Young speaker addressing an audience during a YBI public-speaking session. |
| `/ybi-assets/programs/ybi-entrepreneurship.jpg` | Entrepreneurship program page. | Young entrepreneurs collaborating on a business idea. |
| `/ybi-assets/community/ybi-community.jpg` | Community and intergenerational content. | Young and older adults participating in a YBI community conversation. |
| `/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg` | Homepage moving image wall. | Young leaders participating in a YBI group activity. |
| `/ybi-assets/image-wall/ybi-wall-intergenerational-mentoring.jpg` | Homepage moving image wall. | An older mentor sharing guidance with young adults. |
| `/ybi-assets/image-wall/ybi-wall-entrepreneurship.jpg` | Homepage moving image wall. | Young adult planning an entrepreneurship project with a notebook. |
| `/ybi-assets/image-wall/ybi-wall-public-speaking.jpg` | Homepage moving image wall. | Young woman addressing a community audience with a microphone. |
| `/ybi-assets/image-wall/ybi-wall-community-circle.jpg` | Homepage moving image wall. | Participants seated together in a YBI community circle. |

## Replacing or Adding an Image

First, keep the high-resolution original outside this repository. Install the existing Pillow dependency if your local environment does not already have it, then use the repository script to create an optimized web copy. The script enforces a destination inside `client/public/ybi-assets/`, requires alt text, preserves PNG transparency, and makes an appropriately sized JPEG or WebP output.

```bash
python3 scripts/optimize-ybi-image.py /path/to/original-photo.jpg \
  --output client/public/ybi-assets/programs/ybi-new-workshop.jpg \
  --alt "Young adults collaborating during a YBI entrepreneurship workshop."
```

Use a specific filename that describes the program or moment. Set `--max-edge` only when the default 1600-pixel limit does not suit the layout, and use `--quality` between 70 and 85 for normal photographs. Keep optimized repository files under **1 MB** so source control and publishing remain dependable.

After creating the file, complete the following sequence.

1. Add its public path, site role, and approved alt text to the inventory table above.
2. Replace the relevant `/ybi-assets/...` reference in the page or media-data file; do not introduce a managed-storage path for these core public assets.
3. Ensure the rendered `<img>` uses the inventory alt text, unless the image is purely decorative. Decorative images should use `alt=""` rather than duplicate surrounding content.
4. Run `pnpm test`, `pnpm exec tsc --noEmit`, and `pnpm build` from the repository root. Check the affected phone and desktop layout before committing.

## Folder Structure

| Folder | Content |
| --- | --- |
| `brand/` | Official YBI logo and compact brand mark. |
| `homepage/` | Homepage and gallery hero photograph. |
| `programs/` | Public-speaking and entrepreneurship program photographs. |
| `community/` | Intergenerational community photograph. |
| `image-wall/` | Five photographs used in the animated homepage image wall. |
