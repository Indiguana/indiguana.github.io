# Component catalog

Everything here is already styled by `assets/style.css`. Use these rather than
inventing new CSS — the site reads as one thing only because every page draws from
the same small set.

## Callouts

```html
<div class="box intuition"><span class="label">Intuition</span> …</div>
<div class="box analogy"><span class="label">Analogy</span> …</div>
<div class="box key"><span class="label">Key idea</span> …</div>
<div class="box defn"><span class="label">Definition</span> …</div>
<div class="box proof"><span class="label">Proof</span> …</div>
<div class="box warn"><span class="label">Common mistake</span> …</div>
<div class="box example"><span class="label">Example</span> …</div>
```

Each has a distinct accent color, so they're scannable. Keep the meanings honest:
`warn` is for a mistake the reader is likely to make, not for general emphasis. If
every paragraph is in a colored box, none of them stand out.

## Worked problem

The component that makes a page teach rather than tell: the reader attempts, then
checks, then continues. Use several per page.

```html
<div class="guided">
  <div class="g-head"><span class="tag">Try it</span>Compute the minimax value</div>
  <div class="g-body">
    <p>Problem statement. All the data lives here — a table or a drawn figure.</p>
  </div>
  <details class="step"><summary>Step 1 — What are we actually being asked?</summary>
    <div><p>…</p></div></details>
  <details class="step"><summary>Step 2 — …</summary><div><p>…</p></div></details>
  <details class="step"><summary>Answer &amp; the takeaway</summary><div><p>…</p></div></details>
</div>
```

What makes these work:

- **Self-contained.** Never "consider the tree from lecture". All the data is in the
  problem. The reader should be able to close the laptop and work it on paper.
- **Step 1 is always "what's actually being asked".** The most expensive mistakes
  happen before any arithmetic — answering a subtly different question.
- **Progressive reveals.** The reader attempts, then checks, then continues. A
  solution shown all at once feels like learning and isn't.
- **End by naming what it was testing.** A final step that says which
  misunderstanding the problem was built around. That's the transferable part; the
  numbers are just the delivery mechanism.
- **Numbers clean enough to work by hand, not so clean they're trivial.**

## Quiz

`data-answer` is the zero-based index of the correct option. The wiring is automatic.

```html
<div class="quiz" data-answer="2">
  <div class="q">Question text?</div>
  <button class="opt">Option A</button>
  <button class="opt">Option B</button>
  <button class="opt">Option C</button>
  <div class="why"><strong>Why:</strong> an explanation that teaches, not just "correct".</div>
</div>
```

Write distractors that correspond to specific misunderstandings, so picking one is
diagnostic. The `why` should explain why the wrong answers are tempting, not merely
restate the right one.

## Figure wrapper

```html
<div class="viz">
  <div class="viz-title">Gradient descent, step by step</div>
  <svg viewBox="0 0 640 320" role="img" aria-label="…"> … </svg>
  <div class="controls">
    <label>Learning rate α
      <input type="range" id="lr" min="0.05" max="2" step="0.05" value="0.25"
             data-out="lrv" data-dp="2">
      <span class="val" id="lrv"></span></label>
    <button class="btn primary" id="stepBtn">Step</button>
    <button class="btn" id="resetBtn">Reset</button>
  </div>
  <div class="caption">What to notice: …</div>
</div>
```

Sliders with `data-out` pointing at a `<span class="val">` get their live readout wired
automatically by the shell. `data-dp` sets decimal places; `data-fmt="int"` shows an
integer.

The caption should say **what to notice**, not describe what the figure is. And it must
describe what the figure actually does — see the caption rule in SKILL.md.

## Other pieces

- `<div data-toc></div>` — becomes the table of contents, built from `<h2 id>`s
- `.grid2`, `.grid3` — responsive columns, collapse to one on phones
- `.card` — linkable summary box; `a.card` gets a hover state
- `<span class="pill">going deeper</span>` — flag material that goes past the source
- `.scroll-x` — wrap a wide table so it scrolls instead of breaking the layout
- `<table class="tight center">` — compact, centered
- `.muted`, `.tiny`, `.center` — text utilities
- `<pre><code>` — pseudocode

## Math

KaTeX auto-renders `$…$` and `$$…$$`. Macros available: `\R \E \X \Y \H \D \1
\argmin \argmax`.

Outside math, escape `<` and `&` as `&lt;` and `&amp;`. Inside a JavaScript string that
builds math, remember the backslashes need escaping for both JS and KaTeX.
