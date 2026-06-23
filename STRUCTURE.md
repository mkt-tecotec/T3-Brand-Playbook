# T3 Brand Playbook — Project Structure

## 1. Assumptions

| Attribute | Value |
|---|---|
| **Project type** | Static brand guidelines website (HTML + CSS + JS) |
| **Target users** | Marketing team, designers, engineers at TECOTEC Technologies |
| **Scale** | Production (team-internal + public) |
| **Tech stack** | Vanilla HTML5, CSS3 (custom properties), Vanilla JS |
| **Deployment** | GitHub Pages (auto from `main` branch) |
| **Assets source** | `/Users/tuyenpv16/Developer/T3-brand-tonevoice/assets/` |

## 2. Recommended Folder Tree

```
T3-Brand-Playbook/
├── index.html                      # Root: 15 sections of brand guidelines
├── og-image.svg                    # Open Graph preview image
├── README.md                       # Project overview & setup
├── CLAUDE.md                       # AI assistant instructions
├── .gitignore                      # macOS, editor, temp exclusions
│
├── styles/
│   └── (future: CSS module splits)
│
├── scripts/
│   └── (future: JS module splits)
│
├── logos/                          # Downloadable logo files (7 formats)
│   ├── logo-TECOTEC-Technologies.svg          # Original (color)
│   ├── logo-TECOTEC-Technologies-black.svg    # Monochrome black
│   ├── logo-TECOTEC-Technologies-white.svg    # Monochrome white
│   ├── logo-TECOTEC-Technologies.png          # PNG color
│   ├── logo-TECOTEC-Technologies-black.png    # PNG black
│   ├── logo-TECOTEC-Technologies-white.png    # PNG white
│   ├── Logo-TECOTEC-Technologies.webp          # WebP (legacy)
│   ├── Logo TECOTEC Technologies.pdf           # For print
│   └── Logo-TECOTEC-Technologies.ai            # For editing
│
├── assets/
│   ├── images/                               # Web-optimized images
│   │   ├── color/                            # Color swatch references
│   │   │   ├── color-swatch-info.webp
│   │   │   ├── color-1.webp ... color-7.webp
│   │   ├── pattern/                          # Brand patterns
│   │   │   ├── pattern-1.webp ... pattern-3.webp
│   │   ├── typo/                             # Typography examples
│   │   │   ├── typo-1.webp ... typo-5.webp
│   │   ├── logo-usage/                       # Logo usage examples
│   │   │   ├── logo-usage-2.webp ... logo-usage-6.webp
│   │   │   └── logo-usage-watermark.webp
│   │   ├── image-style/                      # Photography style guides
│   │   │   ├── img-style-3.webp
│   │   │   ├── img-style-logo-1.webp ...
│   │   │   └── img-style-watermark.webp
│   │   └── overview/                         # Overview/reference images
│   │       ├── overview-1.webp ...
│   │       └── overview-5.webp
│   │
│   └── source/                               # Downloadable source files
│       ├── Color.ai
│       ├── TYPO.ai
│       ├── Logo-usage.ai
│       ├── Image-style.ai
│       └── Overview.ai
│
├── docs/
│   ├── decisions/                             # Architecture Decision Records
│   └── image-optimization.md                  # Image pipeline guide
│
└── tests/
    ├── index.test.html                        # Visual test page
    └── links.txt                              # Link checker manifest
```

## 3. Folder-by-Folder Explanation

| Path | Purpose | Typical Contents | Required |
|---|---|---|---|
| `index.html` | Single-page brand playbook with all 15 sections | HTML5 semantic markup, inline SVG icons | **Yes** |
| `README.md` | Project overview, setup, commit conventions | Install/deploy instructions, feature list, tech stack | **Yes** |
| `CLAUDE.md` | AI assistant context — paths, brand tokens, conventions | Image format rules, brand colors, commit style | **Yes** |
| `.gitignore` | Exclude OS/editor/temp files from version control | `.DS_Store`, editor configs, `*.log`, `node_modules/` | **Yes** |
| `og-image.svg` | Social preview for GitHub/GitHub Pages | 1200×630 SVG with T3 wordmark | **Yes** |
| `logos/` | Downloadable logo files — 3 variants × multiple formats | SVG/PNG/WebP/PDF/AI files | **Yes** |
| `logos/*.svg` | Vector logos (color, black, white) for web/print use | SVG with embedded viewBox | **Yes** |
| `logos/*.png` | Raster logos with transparent BG for PPT/email | 300dpi, transparent BG | **Yes** |
| `assets/images/` | Web-optimized images embedded in HTML pages | WebP files at q80 | **Yes** |
| `assets/images/color/` | Color palette reference images | Swatch cards, gradient examples | **Yes** |
| `assets/images/pattern/` | Brand pattern textures for background fx | Repeating patterns, textures | Recommended |
| `assets/images/typo/` | Typography style examples | Font pairings, size demo images | **Yes** |
| `assets/images/logo-usage/` | Logo placement Do/Don't examples | Correct/incorrect usage screenshots | **Yes** |
| `assets/images/image-style/` | Photography & visual style guide | Sample photos, cropping examples | **Yes** |
| `assets/images/overview/` | Brand overview reference images | Mood board, style summary | Recommended |
| `assets/source/` | Editable design source files for download | `.ai` files for designers | Recommended |
| `docs/` | Project documentation beyond README | ADRs, image optimization, changelog | Recommended |
| `tests/` | Manual visual regression tests & link checks | HTML test pages, link lists | Optional |
| `styles.css` | (Current location) All CSS in root | Will be migrated to `styles/` | Legacy |

## 4. Naming Conventions

| Asset type | Naming pattern | Example |
|---|---|---|
| Logo SVG | `logo-TECOTEC-Technologies[-variant].svg` | `logo-TECOTEC-Technologies-black.svg` |
| Logo PNG | `logo-TECOTEC-Technologies[-variant].png` | `logo-TECOTEC-Technologies-white.png` |
| Web images | `{category}-{n}.webp` | `color-3.webp`, `logo-usage-2.webp` |
| Source files | `{Category}.ai` | `Color.ai`, `TYPO.ai` |

## 5. Implementation Notes

### Image pipeline
```bash
# All JPG → WebP before committing
cwebp -q 80 input.jpg -o output.webp
# Verify
webpinfo output.webp
```

### Logo references in HTML
```html
<!-- Preview (light card) -->
<img src="logos/logo-TECOTEC-Technologies.svg">
<!-- Download button -->
<a href="logos/logo-TECOTEC-Technologies.svg" download>Tải xuống</a>
```

### Color swatch structure
```html
<div class="swatch-card" data-hex="#FF9900">
  <div class="swatch-card__color" style="background:#FF9900"></div>
  <div class="swatch-card__info">
    <div class="swatch-card__name">Primary Orange</div>
    <div class="swatch-card__hex">#FF9900</div>
  </div>
  <span class="swatch-card__tooltip">Đã sao chép!</span>
</div>
```

### Folder stability
| Path | Stability | Notes |
|---|---|---|
| `index.html` | **Stable** | Single source of truth |
| `logos/` | **Stable** | Add new variants as SVG/PNG |
| `assets/images/` | **Growing** | New brand content = new image subfolders |
| `assets/source/` | **Stable** | Updated when design files revised |
| `tests/` | **Optional** | Add only if QA process requires |