# Exercise animation pack

Drop Lottie JSON files here named by exercise slug, e.g. `squat.json`,
`push-up.json`. They are picked up at build time and take priority over the
built-in cartoon renderer automatically — no code changes needed.

Expectations for a pack:

- One seamless loop = one rep (the player loops it).
- Square artboard; the figure is scaled to fit (`xMidYMid meet`).
- Transparent background — the app draws its own stage behind it.
- No expressions (the bundled player is `lottie_light`, which skips them).
