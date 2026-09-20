# Figures

A figure earns its place by showing the **mechanism** — the frontier of a search with
its priorities annotated, the loss surface with the iterates plotted on it, entropy
against p. A labelled box with a word in it is decoration, not a figure.

Budget roughly three or more per chapter, at least one of them interactive.

## Hard constraints

**Inline SVG or `<canvas>` only.** No external images, no image URLs, no charting
libraries. KaTeX is the only external dependency the site has, and keeping it that way
is what makes the site work offline, load instantly, and survive being copied
somewhere else.

**Never hard-code a color.** The site has a light and a dark theme, and a `#333` that
looks right in one is invisible in the other. Use `currentColor`, or the CSS variables:

```
--accent  --accent-2  --accent-3  --gold  --rose
--ink  --ink-soft  --ink-mute
--line  --line-2  --panel  --bg-soft
```

In SVG these work directly: `fill="var(--accent)"`, `stroke="var(--ink-mute)"`.

Canvas can't read CSS variables, so fetch them and redraw when the theme changes:

```js
const ink = SG.css("--ink-mute");        // reads the custom property
document.addEventListener("themechange", render);
```

Forgetting the `themechange` listener is the usual canvas bug: the figure looks right
until someone toggles the theme, then goes invisible.

**Always give an SVG a `viewBox` and no fixed `width`/`height`**, so it scales on a
phone. A figure that overflows horizontally makes the whole page scroll sideways.

## Interactive figures

The page script runs inside the shell's ready event:

```js
document.addEventListener("shellready", () => {
  // build and wire figures here
});
```

Two things worth the effort:

**Make it genuinely run.** A slider that doesn't move anything is worse than a static
picture, because it invites the reader to fiddle and learn nothing. If you can't
finish the widget, ship a static figure instead — and remove the controls markup, or
the validator will (correctly) flag it as an orphan.

**Let the reader break it.** The best interactive figures have a setting that fails
visibly. A gradient-descent demo whose learning-rate slider reaches 2.0 lets the
reader watch it explode, which teaches the stability condition better than the
inequality does. Pick ranges that include the instructive failure, not just the
well-behaved middle.

## Caption discipline

Build the figure, run it, read the numbers off it, **then** write the caption.

Writing the caption first — describing what the figure will show — produces confident
sentences like "UCS expands 369 squares while A* expands 193" for a figure that
doesn't exist yet. Those numbers are invented and they ship. On a real build exactly
this happened and the figure had to be deleted rather than corrected, because nothing
backed any of it.

If a caption cites a number, something must have computed that number.

## Helpers available

`window.SG` from the shell:

```js
SG.css("--accent")          // read a CSS custom property
SG.el("circle", {cx:1, r:4})// create an SVG element with attributes
SG.lerp(a, b, t)
SG.clamp(v, lo, hi)
```

## Reconstructed figures

Source PDFs routinely lose their images to text extraction. Rebuild what the figure
showed so the idea still lands, then say in the caption that it's a reconstruction, so
the reader checks the original before trusting exact values. Silently inventing a
plausible-looking figure and presenting it as the source's is the one thing that makes
a study guide untrustworthy as a whole.
