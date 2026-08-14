import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = process.cwd();

const requiredAssetPaths = [
  "/ybi-assets/brand/ybi-logo.png",
  "/ybi-assets/brand/ybi-mark.png",
  "/ybi-assets/homepage/ybi-hero.jpg",
  "/ybi-assets/community/ybi-community.jpg",
  "/ybi-assets/programs/ybi-public-speaking.jpg",
  "/ybi-assets/programs/ybi-entrepreneurship.jpg",
  "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg",
  "/ybi-assets/image-wall/ybi-wall-intergenerational-mentoring.jpg",
  "/ybi-assets/image-wall/ybi-wall-entrepreneurship.jpg",
  "/ybi-assets/image-wall/ybi-wall-public-speaking.jpg",
  "/ybi-assets/image-wall/ybi-wall-community-circle.jpg",
];

describe("repository-local YBI site assets", () => {
  it("keeps every required public image inside the repository", () => {
    for (const assetPath of requiredAssetPaths) {
      const filePath = join(repositoryRoot, "client", "public", assetPath);
      expect(existsSync(filePath), `${assetPath} should be committed with the repository`).toBe(true);
    }
  });

  it("does not retain YBI runtime image references to managed storage", () => {
    const runtimeFiles = [
      "client/src/components/DashboardLayout.tsx",
      "client/src/components/PublicSiteChrome.tsx",
      "client/src/pages/Home.tsx",
      "client/src/pages/Gallery.tsx",
      "client/src/pages/About.tsx",
      "client/src/pages/Programs.tsx",
      "client/src/pages/Subpage.tsx",
      "client/src/pages/Team.tsx",
      "client/src/lib/aboutMedia.ts",
      "client/src/lib/homeUpdates.ts",
    ];

    for (const relativePath of runtimeFiles) {
      const source = readFileSync(join(repositoryRoot, relativePath), "utf8");
      expect(source).not.toContain("/manus-storage/ybi");
      expect(source).toMatch(/\/ybi-assets\//);
    }
  });

  it("documents accessible alt text and the optimization workflow for every required asset", () => {
    const assetGuide = readFileSync(
      join(repositoryRoot, "ybi-source-assets", "README.md"),
      "utf8",
    );
    const optimizer = readFileSync(
      join(repositoryRoot, "scripts", "optimize-ybi-image.py"),
      "utf8",
    );

    expect(assetGuide).toContain("## Accessible Asset Inventory");
    expect(assetGuide).toContain("## Replacing or Adding an Image");
    expect(assetGuide).toContain("Approved accessible alt text");
    expect(assetGuide).toContain("python3 scripts/optimize-ybi-image.py");
    expect(optimizer).toContain("--alt");
    expect(optimizer).toContain("PUBLIC_ASSET_ROOT");

    for (const assetPath of requiredAssetPaths) {
      expect(assetGuide).toContain(`\`${assetPath}\``);
    }
  });
});
