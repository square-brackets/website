# brackets.hr

Personal site of Stjepan Petrusa. One page, hand-written, **no build step**.

## How to work on it

Open `index.html` in a browser. That's it — there is nothing to install and
nothing to compile. For correct absolute asset paths (`/style.css`, `/fonts/…`),
serve the directory instead of opening the file directly:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

Edit, save, reload. Netlify publishes the repository root as-is (`netlify.toml`).

## Files

| Path                   | What it is                                                |
| ---------------------- | --------------------------------------------------------- |
| `index.html`           | The homepage. All of its content lives here.              |
| `style.css`            | All styles. Native CSS nesting + custom properties.       |
| `main.js`              | Theme toggle. The only script.                            |
| `fonts/`               | Inter, self-hosted variable woff2 (OFL 1.1).              |
| `cutlist/index.html`   | The opticut app. **Generated — see below, don't edit.**   |
| `_headers`             | Netlify: caching + security headers (CSP, HSTS, …).       |
| `_redirects`           | Netlify: 301s the old `stjepan-petrusa.from.hr` address.  |
| `netlify.toml`         | Netlify: publish the repo root, run no build.             |
| `og.png`               | Social share card, 1200×630.                              |
| `icon-*.png`, `*.svg`  | Favicon, PWA and Apple touch icons.                       |

## Why there's no build step

The previous version of this site used Rollup, a custom EJS templating plugin
and node-sass — 428 dev dependencies to emit one HTML file, one CSS file and
~20 lines of JavaScript. An audit of the stylesheets found the Sass features in
actual use were: 34 media-query shorthands, 33 nesting selectors, 4 `@extend`s,
zero variables of its own and zero loops or conditionals. All of that is native
CSS now, so the toolchain was buying nothing and cost a broken `npm install` on
any Node newer than 16.

No `package.json` means no lockfile, no dependabot noise, and no CVEs to patch.

## Things to know

- **Theme.** Follows `prefers-color-scheme`; an explicit choice is stored in
  `localStorage` and wins in both directions. An inline script in `<head>`
  applies it before first paint to avoid a flash.
- **CSP.** `_headers` sets `default-src 'none'` and pins the inline theme script
  by SHA-256 hash. **If you edit that inline script, regenerate the hash** — the
  command is in the comment above the policy in `_headers`. A stale hash means
  the script is blocked and the theme flashes on load.
- **Caching.** Fonts are immutable for a year. `index.html`, `style.css` and
  `main.js` must revalidate, because without a build step there are no content
  hashes in their filenames. They brotli to a few KB, so a 304 is cheap.
- **No third parties.** No CDN, no fonts.googleapis.com, no analytics, no
  cookies. Every byte is served from this origin, which is what lets the CSP be
  that strict and the footer claim be true.
- **Regenerating `og.png`** (only if the wording or palette changes): render an
  HTML card at 1200×630 in headless Chrome. The source card is not committed —
  it was a throwaway; rewrite it from `index.html`'s masthead styles.

## Fonts

**Inter**, SIL Open Font License 1.1, which permits self-hosting; the licence
text ships in `fonts/`. **One file, the `latin` subset only** (48 KB).

There used to be a second `latin-ext` file (85 KB) carried purely for the `š` in
*Petruša*. Once the name was spelled *Petrusa*, an audit of every rendered
codepoint found nothing left in that range, so it was dropped — more than half
the font payload for one character.

If you ever put a Croatian character back on the page (š č ć ž đ), **it will
silently render in a system font** rather than Inter. To fix that, re-add the
subset:

```sh
curl -o fonts/inter-var-latin-ext.woff2 \
  'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0Q5n-wU.woff2'
```

then restore its `@font-face` (same as the latin one, with
`unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF,
U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+2113, U+2C60-2C7F, U+A720-A7FF`)
and its `<link rel="preload">`.

One character already falls back this way on purpose: the `✳` in the ticker
(U+2733) is in no Inter subset, so it renders in a system symbol font. That is
pre-existing and looks fine.

Google serves Inter **variable-only**, so requesting individual static weights
returns the same file each time. The two files therefore cover the whole
100–900 axis, and the `@font-face` rules declare `font-weight: 100 900` with
`format('woff2-variations')`. `font-synthesis-weight: none` on `body` stops the
browser faking weights that the axis already provides.

The previous site self-hosted **Circular Std**, a commercial Lineto typeface,
in a public repository. It was removed for that reason. Do not add it back.

## Applications built elsewhere

Apps live in their own repositories and are published through this one. The
manifest is `tools/apps.tsv` — one row per app:

```
slug | source repo | build command | artifact
```

```sh
tools/sync-apps.sh            # build, copy and stamp every app
tools/sync-apps.sh cutlist    # just one
tools/sync-apps.sh --check    # no build: is anything stale? exit 1 if so
```

**Adding an app is one line in the manifest.** The slug is the directory it is
published to, so `cutlist` becomes `brackets.hr/cutlist/`. If the artifact is a
single file it lands as `<slug>/index.html`; if it is a directory it is copied
wholesale.

The point is not the copying — it is that a copied file gives no way to tell
whether what is deployed matches its source. Each app gets a `<slug>/SOURCE`
recording the commit it was built from and a hash of what was published, so
`--check` catches both failure modes:

- the source repo moved on since the last sync (stale deploy)
- someone hand-edited the published file (it will be overwritten on next sync)

Sync refuses to run against a source repo with uncommitted changes, because
`SOURCE` would then name a commit that does not contain what shipped. Override
with `--allow-dirty` when you genuinely mean it.

`tools/` and the `SOURCE` files are repo furniture, 404'd in `_redirects` so
they are not served.

Run `tools/sync-apps.sh --check` before committing a deploy.

## `/cutlist/` — the opticut app

A second page: a cutting-plan optimiser for sheet goods, Rust compiled to
WebAssembly. It is a **generated artifact copied in from another repo** — do not
hand-edit `cutlist/index.html`, the changes will be lost on the next rebuild.

Source of truth lives in the opticut project:

```
~/dev/opticut/web/index.template.html   # the app: HTML/CSS/JS
~/dev/opticut/build-web.sh              # cargo wasm build + base64 inline
```

To update it, edit the template in opticut and then run the sync script here —
do not copy the file by hand:

```sh
tools/sync-apps.sh cutlist
```

It is one self-contained file (266 KB raw, ~92 KB brotli — the payload is an
inlined WebAssembly module). Single-file is deliberate: it also runs offline
from `file://`, e.g. off a USB stick in a workshop.

**It has its own CSP** — see `_headers`, which explains why. Two things that
will bite if you touch it: never add a CSP to `/*` (two CSP headers are enforced
as an intersection and would silently break this page), and never add analytics
or a third-party font to it, which would break the no-network property the CSP
enforces.

### It is deliberately not styled like the homepage

It is a tool, not a page of the portfolio, so it keeps its own denser layout.
It was nudged toward consistency, not made to match: the same bone/ink/vermilion
palette and token names (`--accent`, `--accent-ink`, `--on-accent` mean exactly
what they mean in `style.css`), squared corners, a 3px header rule, and the same
uppercase 0.14em micro-labels.

Two behaviours that look like bugs but are intentional:

- **It borrows Inter from this site** — `@font-face` points at
  `/fonts/inter-var-latin.woff2`. Same origin, and the homepage has already
  cached it, so it costs nothing here. Opened from `file://` or a USB stick the
  request just fails and the system font stack takes over. That is why the CSP
  needs `font-src 'self'`, and why the page is still self-contained for
  *function* even though it is no longer self-contained for *type*.
- **The `[ Brackets ]` back-link is `hidden` in the markup** and unhidden by
  script only when `location.protocol` is http(s). From `file://`, `/` is the
  filesystem root, so the link would be dead — better absent.

The pastel panel fills in the sheet drawings come from `fill_for()` in the Rust
`report::svg` module, not from CSS. They are functional (a stable colour per
panel name, so the same part reads the same across sheets) and were left alone.

Its `@media print` block matters — printing the plan for the workshop is a real
use case. Check printing still works after any restyle.

## Two things in the CSS that look wrong but aren't

- **`--accent` and `--accent-ink` are different colours in light mode.** The hot
  vermilion is 3.1:1 on the bone background — fine for poster-scale type, which
  only needs 3:1, but short of the 4.5:1 that 16px text needs. `--accent-ink`
  is the darker sibling used *only* for small accent text (the wordmark brackets
  and the section numerals). In dark mode both are the same value, because the
  accent already clears 4.5:1 on near-black. Don't collapse them.
- **`.hero__name` has `line-height: 0.84`.** It was `0.99` while the name was
  spelled *Petruša*: Inter's uppercase Š has an ink ascent of 0.954em at weight
  900 (measured with canvas `actualBoundingBoxAscent`, not guessed) and
  "STJEPAN" above it has no descenders, so anything tighter clipped the caron
  against the N. With a plain S the tallest ink on line two is cap height
  (0.737em) and the lines can close up. **Restore ~0.99 if the caron returns.**
