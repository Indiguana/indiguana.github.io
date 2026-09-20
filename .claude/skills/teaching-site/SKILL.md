---
name: teaching-site
description: "Build and launch a local website that explains something properly — with diagrams, worked examples, interactive figures and a polished UI — then serve it on localhost and hand over the URL. Use this whenever someone wants a topic explained well, wants to actually understand something rather than get a quick answer, asks for a study guide, an explainer, a walkthrough or a visual explanation, or points at material (slides, notes, docs, a paper, a codebase) and wants it taught. Prefer this over a long chat answer whenever the explanation deserves diagrams or would be worth keeping — a page they can return to, scroll and search beats an answer that scrolls away."
---

# Teaching site

Make a local website that explains a topic well, then launch it and give the
person the URL.

Not a wall of text with headings. The thing that makes this worth building instead
of writing a long reply is that a page can *show* — a diagram of the actual
mechanism, a worked example computed all the way through, a slider the reader drags
to watch a parameter break something. Aim for that on every page.

## The shape of the job

1. **Work out what to explain.** If there's source material — slides, notes, docs, a
   paper, a codebase — read all of it first, completely. Not skimmed. You can't tell
   what matters, or which notation is used, until you've seen it all, and sources
   often contradict each other in exactly the places that confuse people most. If
   there's no source material, use what you know and research the gaps.
2. **Split it into pages**, one per coherent idea, ordered so nothing depends on
   something later. Write the split down before drafting.
3. **Draft each page** using the sequence below.
4. **Validate**, then **launch and hand over the URL**.

## Explaining well

For each idea, roughly in this order. The order is the whole point — a definition
that arrives before its motivation is exactly the failure this is correcting.

- **Motivate it.** What breaks without this? What question does it answer? Start
  concrete. Never open with notation or a definition.
- **Give an analogy or the intuition.** One vivid, honest one. Say where it breaks if
  it breaks — an unflagged leaky analogy does more damage than none.
- **Then state it precisely**, and name every symbol in words right after. If
  something reads as `x^(i)`, say plainly that the superscript is an index, not a
  power.
- **Work a small example all the way through**, arithmetic shown.
- **Derive it** when there's something to derive, each step justified. Never "it can
  be shown" — that sentence is why people give up.
- **Show where people go wrong**, including the edge cases the source raises and
  leaves hanging.
- **Let them check themselves** — a problem to try, or a quiz question.

If the source poses a question and walks away — an unanswered poll, a proof step
marked TODO, a "think about this" — answer it. That's often the single most useful
thing on the page, because it's precisely where the reader was abandoned.

Give each page real depth. A thin page fails the reader the same way the original
material did.

## Diagrams and examples

These carry the explanation; budget several per page and at least one interactive.

A diagram earns its place by showing the **mechanism** — the actual data structure
mid-algorithm, the surface with the path drawn on it, the curve with the interesting
point marked. A labelled box with a word in it is decoration.

An interactive figure earns its place by letting the reader **break something**. A
learning-rate slider that reaches the value where the thing diverges teaches the
stability condition better than the inequality does. Pick ranges that include the
instructive failure, not just the well-behaved middle.

Inline SVG or `<canvas>` only — no image files, no charting libraries. Colors come
from CSS variables so both themes work. Details and helpers in
`references/figures.md`.

## The UI

`assets/style.css` and `assets/site.js` are a complete, working shell — sidebar
navigation, table of contents, light/dark themes, math rendering, responsive down to
phone width. Copy both into the site's `assets/` unchanged.

`site.js` injects the chrome into every page, so **pages write only `<main>`**. That
is what keeps a site written across many sessions looking like one thing. Edit one
thing in it: the `CHAPTERS` array at the top.

Copy `assets/page-template.html` for each page. Two invariants the shell relies on:
`data-page` on `<body>` matches the filename without `.html`, and every `<h2>` has a
kebab-case `id` (the table of contents is built from them). Page scripts go inside
`document.addEventListener("shellready", …)`.

The component catalog — callouts, worked problems with progressive reveals, quizzes,
figure wrappers — is in `references/components.md`. Use those rather than inventing
CSS; the site looks coherent because every page draws from the same small set.

## Three rules worth following

**Verify every number before writing it.** Run the arithmetic in `python3` — don't
estimate and don't trust mental math. On a real build, re-checking after drafting
caught three wrong values already sitting in finished prose.

**Never write a caption describing results that no code produced.** It's tempting to
describe what a figure will show before building it. Those numbers are invented and
they will ship. Build the figure, run it, read the numbers off it, then write the
caption. If a caption cites a number, something must have computed it.

**Finish the file.** Write pages in a few large passes, not many small edits. When a
long generation gets cut short, what's lost is always the last thing — the closing
tags and the widget script — leaving a file that looks done and is quietly broken.

If you rebuild a diagram whose original you couldn't read, say so in the caption, so
the reader knows which parts to double-check.

## Validate, then launch

```bash
python3 scripts/check_pages.py <site-directory>
```

Catches unterminated files, broken links, missing ids, hard-coded colors that break
dark mode, and orphaned widgets — interactive markup with no script driving it, which
renders as a blank box. Fix everything it reports.

Then serve it and hand over the URL:

```bash
cd <site-directory> && python3 -m http.server 4280 --bind 127.0.0.1
```

Run it in the background so it survives, confirm it responds, and tell the person the
address plainly: **http://localhost:4280**. Launching it is part of the job — a
finished site nobody can open isn't finished.

## When there's a lot to build

One agent per page works well, each given this skill plus a specific brief listing
what that page must cover. Name the items explicitly — a brief that just names a
topic produces a page that reads like the material you're replacing. Tell each to
write in large passes and run the validator. Have one read an already-finished page
first so the voice matches.
