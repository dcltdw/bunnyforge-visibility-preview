# Bunnyforge Visibility Preview

Colours [bunnyforge](https://pypi.org/project/bunnyforge/) campaign front
matter in VS Code's **built-in** markdown preview. No replacement renderer,
no extension-host code: one preview script classifies what the preview
already renders, one stylesheet colours it.

## What it does

VS Code renders YAML front matter as a table at the top of the preview
(`markdown.preview.frontMatter`, default `table`). This extension adds the
bunnyforge colour language on top:

| surface | treatment |
|---|---|
| `visibility` row | reverse video — red `gm-only`, green `player-visible`, cyan `mixed` |
| `reveal_when` row | dim italic |
| `## GM notes` heading | red, in any file |
| everything below `## GM notes` | subtle red tint + red left bar |

Dark and light themes each get their own palette half automatically.
Under high-contrast themes the extension does nothing, deliberately.
If front matter is hidden (`markdown.preview.frontMatter: "hide"`), the
heading and tint still work; there is just no table to colour.

## Requirements

None beyond VS Code. If the front-matter table should always be present,
pin it in your workspace:

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

```css
/* visibility-overrides.css — e.g. the bunnyforge "subtle" level */
:root {
  --vis-gm: #513333;      --vis-gm-fg: #e6d6d6;
  --vis-player: #31463a;  --vis-player-fg: #d8e4dc;
  --vis-mixed: #2f4a4e;   --vis-mixed-fg: #d5e4e6;
}
body.vscode-light {
  --vis-gm: rgba(185, 28, 28, 0.14);     --vis-gm-fg: #000000;
  --vis-player: rgba(21, 128, 61, 0.12); --vis-player-fg: #000000;
  --vis-mixed: rgba(14, 116, 144, 0.12); --vis-mixed-fg: #000000;
}
```

(The preview keeps this extension's solid-row *structure*; overrides swap
colours within it.)

## Decorating more fields later

The preview script stamps **every** front-matter row with normalized
`data-key` / `data-value` attributes (scalar values only) and stamps
`data-visibility` on `<body>`. Decorating another field — `status`,
`canon`, anything — is therefore a pure CSS rule, which you can even ship
workspace-side via `markdown.styles` without touching this extension:

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
