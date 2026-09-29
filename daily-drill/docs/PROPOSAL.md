# Daily Drill: architecture and design system proposal

Status: **checkpoint 1, awaiting approval.** This PR has the design tokens, the
`ExerciseDemo` component with both backends, and one cartoon exercise (squat)
on a review screen. Nothing else gets built until this direction is approved.

Run it: `cd daily-drill && npm install && npm run dev`.

---

## 1. Architecture

### Stack
React 19 · TypeScript (strict) · Vite 8 · Tailwind 4 (CSS-first `@theme` tokens) · Framer Motion · Capacitor 8 (Android).
Fonts are bundled through `@fontsource`, so the app makes no network calls, not even to Google Fonts.

### Folder layout (target)
```
src/
  app/            shell, router (tab bar: Today · Plan · Kitchen · Progress), providers
  domain/         pure TS, no React: programme generator, progression rules, streak maths, basket builder
  data/           static content: exercises.ts (27), programme.ts (7-day rotation), recipes.ts (14), aisles.ts
  store/          persistence adapter + zustand slices (history, water, settings, shopping ticks)
  features/
    workout/      session player, interval timer, rep logging
    kitchen/      recipes, weekly basket, aisle-sorted list
    water/        tracker + ring
    progress/     streak calendar, rep-history charts
    reminders/    notification scheduling
  components/     design-system primitives (Button, Card, Ring, Stat, Sheet) + ExerciseDemo
  platform/       thin wrappers over Capacitor plugins (notifications, haptics, keep-awake, audio)
  assets/exercises/   drop-in Lottie pack (<slug>.json)
```
Rule: `domain/` has no React or Capacitor imports, so the progression and streak logic can be unit-tested with Vitest on plain Node.

### ExerciseDemo: pluggable renderer (built in this PR)
```
ExerciseDemo(slug)  ──► resolveBackend(slug)
                          ├─ src/assets/exercises/<slug>.json exists?  → LottieRenderer  (lazy: lottie_light + JSON chunk)
                          └─ otherwise                                   → CartoonRenderer (FK rig; idle loop if no keyframes)
Both implement DemoRendererProps { slug, playing, speed }. ExerciseDemo owns the square stage, spotlight and controls.
```
* `import.meta.glob` finds the Lottie files at **build time**. If you drop in `push-up.json` and rebuild, it wins over the cartoon, with no code changes.
* The Lottie player is `lottie_light`, which has the SVG renderer and no `eval` of expressions. It is code-split (~47 kB gzip), so it only loads when a Lottie demo is on screen.
* The cartoon rig is a 12-segment forward-kinematics skeleton. Each exercise is a list of keyframed segment angles plus an anchor (`feet` | `hands`) that pins the planted contact point to the floor. Adding an exercise means writing keyframes only; no drawing code changes.
* Slow-mo runs at 0.4×. If the OS asks for reduced motion, playback starts paused.

### Persistence (all local, no accounts)
| Data | Store | Why |
|---|---|---|
| Settings, water today, shopping ticks | `@capacitor/preferences` (Android SharedPreferences) | Small key-value data, survives WebView cache clears |
| Session + rep history | IndexedDB via Dexie, versioned schema | Queryable history, grows over months |
| Backup | JSON export/import through the Android share sheet | The only protection against uninstall or a lost phone, since there's no cloud |

⚠ Risk: without accounts, uninstalling the app deletes the whole history. I'd ship the export in v1, not later.

### Interval timer + audio
* Timing uses the wall clock (`performance.now()` deltas against the session start), not `setInterval` counting. That way a throttled WebView can't drift the timer.
* Audio cues use Web Audio API synthesised tones: 3-2-1 pips, then a long tone at the switch. There are no audio files, and they play with zero latency. Optional voice cues can be added later through the native TTS plugin.
* `@capacitor-community/keep-awake` keeps the screen on during a session, and `@capacitor/haptics` adds a tick on each interval change.
* Known limitation: if you lock the phone mid-session, the JS timer pauses. I'd rather be honest about that than build a foreground service in v1. On resume, the timer re-syncs from the wall clock and skips ahead to the correct interval.

### Reminders (fire with the app closed)
`@capacitor/local-notifications` schedules through Android `AlarmManager`, using `schedule: { on: { hour, minute }, allowWhileIdle: true }` for a daily repeat.
* Android 13+: request `POST_NOTIFICATIONS` at runtime, and ask in context (on the reminders screen), not at launch.
* Android 12+: exact alarms need `SCHEDULE_EXACT_ALARM`, and on Android 14 that permission is **denied by default** for new installs ([Android docs](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms)). A workout nudge doesn't need to-the-second precision. I propose inexact `allowWhileIdle` alarms (±a few minutes) so we avoid a scary permission screen and a Play policy declaration.
* I'll verify on a device that reminders survive a reboot. The plugin ships a boot receiver, but OEM battery killers (Xiaomi, Samsung) are the real risk.

### Programme model
* **7-day rotation:** Lower · Upper push · Core · Posterior chain · Upper pull/back · Full-body conditioning · Mobility/recovery.
* **Sessions:** 2 min warm-up, then 5 exercises × 3 rounds of intervals, then 2 min cool-down, for 17–19 min in total.
* **4-week block.** Progression comes from density (work:rest), with an easier variation swapped in where there's room:

| Week | Work / Rest | Notes |
|---|---|---|
| 1 | 40s / 20s | Base |
| 2 | 45s / 15s | +12% work |
| 3 | 50s / 10s | Peak |
| 4 **deload** | 30s / 30s, 2 rounds | Roughly −50% volume |

* The user logs reps per interval (one big +/− stepper after each work block). Rep history per exercise drives the charts and a "beat last time" target.
* ⚠ Blind spot: bodyweight **pulling** with no equipment is weak. I'd use prone Y-T-W raises, superman pulls, and table rows (flagged as "only if you have a sturdy table"). Worth deciding now whether a door-frame towel row is acceptable.

### Kitchen
* 14 recipes (7 days × lunch + dinner), each with at most 6 ingredients. Salt, pepper, oil and water are staples and don't count toward the 6.
* The recipes are designed backwards from one **fixed ~15-item basket** that repeats every week. Every recipe reuses the basket ingredients, which is what keeps the shop small and cheap.
* The list is aisle-sorted in UK supermarket order: Fruit & Veg → Bakery → Meat & Fish → Dairy & Eggs → Tins & Jars → Dry goods → Frozen. Checked items persist until you reset them.

---

## 2. Design system

**Direction:** dark, high contrast, athletic. The loud condensed type and single-hue accent come from NTC. The coloured rings and generous card spacing come from Fitness+.

| Token | Value | Use |
|---|---|---|
| `ink-950` | `#0A0A0B` | App background (not pure black, which avoids OLED smear on scroll) |
| `ink-900 / 850 / 800 / 700` | stepped greys | Cards, sheets, inputs, hairlines |
| `fg` / `fg-muted` / `fg-faint` | `#F5F5F7` / `#A1A1AA` / `#6B6B74` | Text at 18.6:1 / 7.9:1 / captions |
| `volt` | `#C8FF3D` | The one "do it now" colour: primary CTA, active state, streak |
| `heat` | `#FF5B36` | Work interval, final 3-second countdown |
| `cool` | `#3DDCFF` | Rest interval |
| `hydro` | `#4D8DFF` | Water |
| `deload` | `#B58CFF` | Deload week badge |

* **Type:** Archivo variable, condensed via the `wdth` axis to 72, weight 800, uppercase, for headlines and numbers. Inter handles UI text at ≥17 px body. Timer digits use tabular numerals so they don't jitter.
* **Touch targets:** 48 px minimum, 56 px for primary controls, and a 64 px full-width CTA pinned to the bottom within thumb reach.
* **Spacing:** 4-pt scale, 20 px screen gutters, 24 px card radius, 12–16 px gaps.
* **Motion:** `cubic-bezier(.22,1,.36,1)` for everything, 60 ms stagger on screen entry, and a 0.92–0.97 press scale. All of it respects reduced motion.
* **Colour discipline:** only one saturated hue per screen state. On the timer screen, the whole background tints heat (work) or cool (rest), so the state is readable from 2 metres away on the floor.

### Cartoon figure style
Filled tapered capsules with a three-tone gradient (highlight / base / shadow) that always faces the light. Far limbs use a darker, cooler palette and sit 3.5 units back, and near limbs cast a soft drop shadow, so depth reads even in silhouette. The volt shirt and white shoes keep the figure legible on the dark stage. The stage is a CSS spotlight shared with the Lottie backend, so both backends look the same.

---

## 3. Open questions for you
1. **Pull exercises:** is prone-only OK, or do you allow a table or towel row?
2. **Timer when the phone is locked:** accept the pause-and-resync for v1, or build an Android foreground service now (+1–2 days)?
3. **Exact vs inexact reminders:** OK with ±few-minutes accuracy to avoid the exact-alarm permission?
4. **Figure:** is one character fine, or do you want a light/dark skin-tone option in settings? The palette is already tokenised, so this is cheap.
5. **Dietary baseline** for the 14 recipes: omnivore, or vegetarian-first?
