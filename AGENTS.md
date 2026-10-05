# AI Course — rules for agents and people

This repo is one website with three modules. Every lesson shares one look and one slide engine.
Published with GitHub Pages from `main`: https://echore.github.io/ai-course/

## Layout

```
index.html                  site index: lists the three modules (rarely changes)
shared/theme.css            the only stylesheet for the whole site
shared/deck.js              the only slide engine for the whole site
_template/lesson/           copy this to start a new lesson
basic/  agent/  fde/        one folder per module, one owner per module
  index.html                the module's lesson list, maintained by its owner
  01-some-topic/index.html  one lesson = one folder = one HTML file with all its slides
```

## Rules

1. **Only edit your own module folder.** `basic/`, `agent/` and `fde/` each have one owner.
2. **Never copy `theme.css` or `deck.js` into a lesson.** Link them with `../../shared/...`.
3. **No new colours or fonts in lessons.** Use the theme variables (`var(--primary)`, `var(--text)`, `var(--text-muted)`, `var(--border)`, ...) and the existing classes (`slide-header`, `slide-content`, `card`, `tag`, `lede`, `split-body`, `timeline-track`, `layout-cover`, `layout-closing`, ...).
4. **Lesson-specific layout goes in the `<style>` block at the top of that lesson's `#deck`.** It must not change how shared classes look across the site.
5. **Changes to `shared/` go through a pull request** on a branch, reviewed by the other two owners, because they change every lesson.
6. **Don't add navigation markup to lessons.** `deck.js` builds the counter, progress bar and arrow buttons.
7. **Each lesson stands alone.** Write for a student who opens this one file having forgotten every other lesson: explain each term where it first appears, and set up each example inside the lesson. Pointing forward to a later lesson is fine.

## Adding a lesson

1. `git pull`
2. Copy `_template/lesson/` to `<module>/NN-short-topic/` (two-digit number, lowercase, hyphens).
3. Write slides as `<section class="slide">` elements inside `<div id="deck">`. `data-step="N"` hides an element until the Nth click.
4. Add one `<li>` for the lesson to `<module>/index.html` (copy the pattern from `agent/index.html`), and remove the "No lessons yet" line if it is still there.
5. Open the lesson file directly in a browser to check it — no server needed.
6. Commit and push to `main`. The site updates about a minute later.

## Links

Use `index.html` explicitly in links (`agent/index.html`, not `agent/`) so pages also work when opened as local files.
Inside a lesson, `#5` jumps to slide 5 and `?all` shows every build step at once.
