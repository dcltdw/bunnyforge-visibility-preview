# Bunnyforge Visibility Preview

Colours [bunnyforge](https://pypi.org/project/bunnyforge/) campaign front
matter in VS Code's **built-in** markdown preview. No replacement renderer,
no extension-host code: one preview script classifies what the preview
already renders, one stylesheet colours it.

## What it does

On VS Code 1.121 and later, VS Code renders YAML front matter as a table
at the top of the preview (`markdown.preview.frontMatter`, default
`table`). This extension adds the bunnyforge colour language on top:

| surface | treatment |
|---|---|
| `visibility` row | reverse video — red `gm-only`, green `player-visible`, cyan `mixed` |
| `reveal_when` row | dim italic |
| `## GM notes` heading | reverse video — red, in any file |
| everything below `## GM notes` | subtle red tint + red left bar |

Dark and light themes each get their own palette half automatically, and
so do the two high-contrast themes — the shipped palette is already
maximal contrast, so high-contrast themes are decorated rather than
skipped.
On VS Code versions before 1.121 there is no front-matter table to
colour, so only the `## GM notes` heading and the below-separator tint
apply; the same is true if front matter is hidden
(`markdown.preview.frontMatter: "hide"`).

## Install

Not on the VS Code Marketplace: publishing there now requires an Azure
subscription, which this project deliberately does not take on. Download
the `.vsix` from the [latest
release](https://github.com/dcltdw/bunnyforge-visibility-preview/releases/latest)
and install it:

```bash
code --install-extension bunnyforge-visibility-preview-0.1.0.vsix
```

Or in VS Code: Extensions view → `…` menu → **Install from VSIX…**.

Extensions installed from a `.vsix` do not auto-update, so watch the
releases page if you want newer versions.

## Requirements

VS Code 1.100 or later to install. The front-matter table treatment
needs VS Code 1.121 or later; on earlier versions the heading and tint
still apply, just with no table to colour. If the front-matter table
should always be present, pin it in your workspace:

```jsonc
"markdown.preview.frontMatter": "table"
```

## Recolouring and contrast levels — no fork needed

Every colour is a CSS custom property declared once in
`media/visibility.css` (`--vis-gm`, `--vis-player`, `--vis-mixed`, their
`-fg` foregrounds, `--vis-dim`, `--vis-gm-tint`). Nothing else in the
extension names a colour. To recolour, override the properties from your
own workspace — create a CSS file and point `markdown.styles` at it:

```jsonc
// .vscode/settings.json
"markdown.styles": ["visibility-overrides.css"]
```

The bunnyforge palette defines two contrast levels beyond the `high`
level this extension ships; both are reproduced here in full — all
eight custom properties, both theme halves.

```css
/* visibility-overrides.css — the bunnyforge "subtle" level */
:root {
  --vis-gm: #513333;      --vis-gm-fg: #e6d6d6;
  --vis-player: #31463a;  --vis-player-fg: #d8e4dc;
  --vis-mixed: #2f4a4e;   --vis-mixed-fg: #d5e4e6;
  --vis-dim: #8a8a8a;
  --vis-gm-tint: #513333;
}
body.vscode-light {
  --vis-gm: rgba(185, 28, 28, 0.14);     --vis-gm-fg: #000000;
  --vis-player: rgba(21, 128, 61, 0.12); --vis-player-fg: #000000;
  --vis-mixed: rgba(14, 116, 144, 0.12); --vis-mixed-fg: #000000;
  --vis-dim: #777777;
  --vis-gm-tint: rgba(185, 28, 28, 0.14);
}
```

```css
/* visibility-overrides.css — the bunnyforge "saturated" level */
:root {
  --vis-gm: #ef4444;      --vis-gm-fg: #000000;
  --vis-player: #22c55e;  --vis-player-fg: #000000;
  --vis-mixed: #06b6d4;   --vis-mixed-fg: #000000;
  --vis-dim: #8a8a8a;
  --vis-gm-tint: #ef4444;
}
body.vscode-light {
  --vis-gm: #fca5a5;      --vis-gm-fg: #000000;
  --vis-player: #86efac;  --vis-player-fg: #000000;
  --vis-mixed: #67e8f9;   --vis-mixed-fg: #000000;
  --vis-dim: #777777;
  --vis-gm-tint: #fca5a5;
}
```

(The preview keeps this extension's solid-row *structure*; overrides swap
colours within it. The parent bunnyforge palette also distinguishes a
band *background* from a *bar* colour at each level — e.g. `subtle`
light's band is `rgba(185, 28, 28, 0.14)` against a `rgba(185, 28, 28,
0.8)` bar — but this extension drives both the reverse-video band and
the 3px below-separator bar from the single `--vis-gm`, so the values
above use the band colour for both, and under `subtle` the bar reads as
near-invisible.)

## Decorating more fields later

The preview script stamps **every** front-matter row with normalized
`data-key` / `data-value` attributes (scalar values only) and stamps
`data-visibility` on `<body>`. Decorating another field — `status`,
`canon`, anything — is therefore a pure CSS rule, which you can even ship
workspace-side via `markdown.styles` without touching this extension.

Normalization: both `data-key` and `data-value` are lowercased and have
their whitespace collapsed, so match the normalized form —
`[data-value="retired"]`, not `[data-value="Retired"]`. Non-scalar values
(lists, nested maps) get a `data-key` but no `data-value`.

```css
table.frontmatter tr[data-key="status"][data-value="retired"] td {
  color: #8a8a8a;
  text-decoration: line-through;
}
```

## Development

`npm install && npm test` — jsdom-based tests over fixture HTML captured
from the real preview. Manual check: open the files in `test/manual/` and
eyeball the preview in dark and light themes.

## License

GPL-3.0 — same as bunnyforge.
