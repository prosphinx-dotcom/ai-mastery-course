/* ===== DESIGN TOKENS ===== */
:root {
  /* Type Scale */
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);
  --text-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem);
  --text-3xl:  clamp(2.5rem,   1rem    + 4vw,    5rem);

  /* Spacing */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.25rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Fonts */
  --font-display: 'Cabinet Grotesk', 'Inter', sans-serif;
  --font-body: 'Satoshi', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.25rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-interactive: 180ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);

  /* Content widths */
  --content-narrow: 640px;
  --content-default: 960px;
  --content-wide: 1200px;
}

/* ===== AI COURSE PALETTE — Neural Circuit (dark-first) ===== */
/* Default = dark (matches the hero image) */
:root {
  --color-bg:             #060a14;
  --color-surface:        #0c1220;
  --color-surface-2:      #111828;
  --color-surface-offset: #0a1018;
  --color-surface-dynamic: #162030;
  --color-divider:        #1a2538;
  --color-border:         #223048;

  --color-text:           #e0e8f0;
  --color-text-muted:     #7a8ca4;
  --color-text-faint:     #455570;
  --color-text-inverse:   #060a14;

  --color-primary:        #1a8fff;
  --color-primary-hover:  #3da3ff;
  --color-primary-active: #0d7ae6;
  --color-primary-light:  #0a1a30;
  --color-primary-highlight: #0f2545;

  --color-accent:         #38d8e0;
  --color-accent-hover:   #5ee4ea;
  --color-accent-light:   #0a2228;

  --color-success:        #38d88a;
  --color-success-light:  #0a2818;
  --color-warning:        #e08838;
  --color-warning-light:  #28200a;
  --color-error:          #e05050;
  --color-error-light:    #280a0a;

  --color-streak:         #e07830;
  --color-xp:             #e0b838;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.5);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);
  --shadow-glow: 0 0 30px rgba(26,143,255,0.2);
}

[data-theme="light"] {
  --color-bg:             #f0f2f7;
  --color-surface:        #ffffff;
  --color-surface-2:      #f7f8fb;
  --color-surface-offset: #e8ecf4;
  --color-surface-dynamic: #dde2ec;
  --color-divider:        #cdd4e0;
  --color-border:         #b8c2d4;

  --color-text:           #0a1020;
  --color-text-muted:     #506080;
  --color-text-faint:     #8898b0;
  --color-text-inverse:   #f0f2f7;

  --color-primary:        #1070d8;
  --color-primary-hover:  #0d5eb8;
  --color-primary-active: #094da0;
  --color-primary-light:  #e0eeff;
  --color-primary-highlight: #c8e0ff;

  --color-accent:         #0aa8b0;
  --color-accent-hover:   #089098;
  --color-accent-light:   #e0f6f8;

  --color-success:        #1aaa60;
  --color-success-light:  #d8f5e8;
  --color-warning:        #c87020;
  --color-warning-light:  #fff0d8;
  --color-error:          #d03838;
  --color-error-light:    #fde8e8;

  --color-streak:         #d06820;
  --color-xp:             #c8a020;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.12);
  --shadow-glow: 0 0 20px rgba(16,112,216,0.12);
}

/* ===== LAYOUT ===== */
.container {
  width: 100%;
  max-width: var(--content-wide);
  margin-inline: auto;
  padding-inline: var(--space-4);
}

.container--narrow {
  max-width: var(--content-default);
}

/* ===== NAV ===== */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(26,143,255,0.1);
  padding: var(--space-3) 0;
  backdrop-filter: blur(16px);
  background: color-mix(in srgb, var(--color-bg) 80%, transparent);
}

[data-theme="light"] .nav {
  border-bottom-color: var(--color-divider);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text);
  text-decoration: none;
  cursor: pointer;
}

.nav__logo svg {
  flex-shrink: 0;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.nav__streak {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-streak);
  background: color-mix(in srgb, var(--color-streak) 10%, transparent);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.nav__xp {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-xp);
}

.btn-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
}
.btn-icon:hover {
  background: var(--color-surface-offset);
  color: var(--color-text);
}

/* ===== HERO ===== */
.hero {
  position: relative;
  overflow: hidden;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.hero__image-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
}

.hero__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(6,10,20,0.3) 0%,
    rgba(6,10,20,0.55) 40%,
    rgba(6,10,20,0.85) 75%,
    rgba(6,10,20,1) 100%
  );
}

[data-theme="light"] .hero__image-overlay {
  background: linear-gradient(
    180deg,
    rgba(240,242,247,0.15) 0%,
    rgba(240,242,247,0.5) 40%,
    rgba(240,242,247,0.85) 75%,
    rgba(240,242,247,1) 100%
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: clamp(var(--space-16), 10vw, var(--space-24)) 0 clamp(var(--space-8), 5vw, var(--space-16));
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(26,143,255,0.12);
  border: 1px solid rgba(26,143,255,0.25);
  color: var(--color-accent);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
}

[data-theme="light"] .hero__badge {
  background: rgba(16,112,216,0.1);
  border-color: rgba(16,112,216,0.25);
  color: var(--color-primary);
}

.hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: pulse 2s ease-in-out infinite;
}

[data-theme="light"] .hero__badge-dot {
  background: var(--color-primary);
}

.hero h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: var(--space-6);
  color: #fff;
}

[data-theme="light"] .hero h1 {
  color: var(--color-text);
}

.hero h1 .gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: var(--text-lg);
  color: rgba(224,232,240,0.7);
  max-width: 580px;
  margin-inline: auto;
  margin-bottom: var(--space-4);
}

[data-theme="light"] .hero p {
  color: var(--color-text-muted);
}

.hero__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  flex-wrap: wrap;
  margin-top: var(--space-2);
  margin-bottom: var(--space-8);
}

.hero__stat {
  text-align: center;
}

.hero__stat-value {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-accent);
}

[data-theme="light"] .hero__stat-value {
  color: var(--color-primary);
}

.hero__stat-label {
  font-size: var(--text-xs);
  color: rgba(224,232,240,0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

[data-theme="light"] .hero__stat-label {
  color: var(--color-text-muted);
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-sm);
  text-decoration: none;
  cursor: pointer;
  border: none;
  position: relative;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, var(--color-accent)));
  color: #fff;
  box-shadow: var(--shadow-md), var(--shadow-glow);
}
.btn--primary:hover {
  background: linear-gradient(135deg, var(--color-primary-hover), color-mix(in srgb, var(--color-primary-hover) 70%, var(--color-accent)));
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg), 0 0 40px rgba(26,143,255,0.3);
}

.btn--outline {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn--outline:hover {
  background: var(--color-surface-offset);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-3);
}
.btn--ghost:hover {
  color: var(--color-text);
  background: var(--color-surface-offset);
}

.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
}

.btn--lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  border-radius: var(--radius-xl);
}

/* ===== DASHBOARD ===== */
.dashboard {
  padding: var(--space-8) 0;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.dashboard__greeting {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
}

.dashboard__greeting span {
  color: var(--color-primary);
}

/* Progress card */
.progress-card {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.progress-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.progress-card__info h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.progress-card__info p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.progress-card__badges {
  display: flex;
  gap: var(--space-2);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.badge--streak {
  background: color-mix(in srgb, var(--color-streak) 12%, transparent);
  color: var(--color-streak);
}

.badge--xp {
  background: color-mix(in srgb, var(--color-xp) 15%, transparent);
  color: var(--color-xp);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: var(--color-surface-dynamic);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.progress-bar__fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width var(--transition-slow);
}

.progress-bar__label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* Week tabs */
.week-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  -webkit-overflow-scrolling: touch;
}

.week-tab {
  flex-shrink: 0;
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  white-space: nowrap;
}

.week-tab:hover {
  color: var(--color-text);
  border-color: var(--color-border);
}

.week-tab--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

/* Lesson cards */
.lessons-grid {
  display: grid;
  gap: var(--space-4);
}

.lesson-card {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  cursor: pointer;
  transition: all var(--transition-interactive);
}

.lesson-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md), var(--shadow-glow);
  transform: translateY(-2px);
}

.lesson-card--completed {
  border-left: 3px solid var(--color-success);
}

.lesson-card--locked {
  opacity: 0.5;
  cursor: not-allowed;
}
.lesson-card--locked:hover {
  border-color: var(--color-divider);
  box-shadow: none;
  transform: none;
}

.lesson-card__number {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
}

.lesson-card__number--pending {
  background: var(--color-surface-offset);
  color: var(--color-text-muted);
}

.lesson-card__number--current {
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-glow);
}

.lesson-card__number--completed {
  background: var(--color-success-light);
  color: var(--color-success);
}

.lesson-card__content {
  flex: 1;
  min-width: 0;
}

.lesson-card__title {
  font-weight: 600;
  font-size: var(--text-base);
  margin-bottom: var(--space-1);
}

.lesson-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.lesson-card__tool {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.lesson-card__arrow {
  flex-shrink: 0;
  color: var(--color-text-faint);
}

/* ===== LESSON VIEW ===== */
.lesson-view {
  padding: var(--space-6) 0 var(--space-16);
}

.lesson-view__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-6);
  cursor: pointer;
  text-decoration: none;
}
.lesson-view__back:hover {
  color: var(--color-primary);
}

.lesson-view__header {
  margin-bottom: var(--space-8);
}

.lesson-view__day {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.lesson-view__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  margin-bottom: var(--space-3);
}

.lesson-view__meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  flex-wrap: wrap;
}

.lesson-view__meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* Lesson sections */
.lesson-section {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.lesson-section h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.lesson-section p {
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-4);
}

.lesson-section p:last-child {
  margin-bottom: 0;
}

.lesson-section ul {
  list-style: none;
  padding: 0;
  margin-bottom: var(--space-4);
}

.lesson-section ul li {
  position: relative;
  padding-left: var(--space-6);
  margin-bottom: var(--space-2);
  color: var(--color-text-muted);
}

.lesson-section ul li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 600;
}

/* Tip/warning boxes */
.callout {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}

.callout--tip {
  background: var(--color-accent-light);
  border-left: 3px solid var(--color-accent);
}

.callout--warning {
  background: var(--color-warning-light);
  border-left: 3px solid var(--color-warning);
}

.callout--limits {
  background: var(--color-error-light);
  border-left: 3px solid var(--color-error);
}

.callout__title {
  font-weight: 700;
  margin-bottom: var(--space-1);
  color: var(--color-text);
}

/* Prompt examples */
.prompt-box {
  background: var(--color-surface-offset);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text);
  position: relative;
}

.prompt-box__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
  display: block;
}

.prompt-box__copy {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}
.prompt-box__copy:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* ===== QUIZ ===== */
.quiz {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.quiz__question {
  font-weight: 600;
  font-size: var(--text-base);
  margin-bottom: var(--space-4);
  display: flex;
  gap: var(--space-2);
}

.quiz__question-num {
  color: var(--color-primary);
  font-family: var(--font-display);
}

.quiz__options {
  display: grid;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.quiz__option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-interactive);
}

.quiz__option:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.quiz__option--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.quiz__option--correct {
  border-color: var(--color-success);
  background: var(--color-success-light);
}

.quiz__option--wrong {
  border-color: var(--color-error);
  background: var(--color-error-light);
}

.quiz__radio {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-interactive);
}

.quiz__option--selected .quiz__radio {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.quiz__option--correct .quiz__radio {
  border-color: var(--color-success);
  background: var(--color-success);
}

.quiz__option--wrong .quiz__radio {
  border-color: var(--color-error);
  background: var(--color-error);
}

.quiz__feedback {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  display: none;
}

.quiz__feedback--correct {
  display: block;
  background: var(--color-success-light);
  color: var(--color-success);
}

.quiz__feedback--wrong {
  display: block;
  background: var(--color-error-light);
  color: var(--color-error);
}

/* Practice area */
.practice-area {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.practice-area h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.practice-area__desc {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.practice-area textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--space-4);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-lg);
  background: var(--color-surface-offset);
  resize: vertical;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.practice-area textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

/* Complete button */
.lesson-complete {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-xl);
  gap: var(--space-4);
  flex-wrap: wrap;
}

.lesson-complete__xp {
  font-size: var(--text-sm);
  color: var(--color-xp);
  font-weight: 600;
}

/* ===== CERTIFICATE ===== */
.cert-section {
  text-align: center;
  padding: var(--space-16) 0;
}

.cert-section h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  margin-bottom: var(--space-4);
}

.cert-preview {
  background: var(--color-surface);
  border: 2px solid var(--color-primary-highlight);
  border-radius: var(--radius-2xl);
  padding: var(--space-12) var(--space-8);
  max-width: 700px;
  margin: var(--space-8) auto;
  position: relative;
  overflow: hidden;
}

.cert-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
}

.cert-preview__logo {
  margin-bottom: var(--space-6);
}

.cert-preview h3 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  margin-bottom: var(--space-2);
  color: var(--color-text);
}

.cert-preview__name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: var(--space-4) 0;
}

.cert-preview__detail {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.cert-form {
  margin-top: var(--space-6);
}

.cert-form input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-lg);
  background: var(--color-surface-offset);
  width: 100%;
  max-width: 320px;
  margin-bottom: var(--space-3);
  text-align: center;
}
.cert-form input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

/* ===== VIEWS ===== */
.view { display: none; }
.view--active { display: block; }

/* ===== FOOTER ===== */
.footer {
  padding: var(--space-8) 0;
  border-top: 1px solid var(--color-divider);
  text-align: center;
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}
.footer .container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer a {
  color: var(--color-text-muted);
  text-decoration: none;
}
.footer a:hover {
  color: var(--color-primary);
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-in {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.animate-in:nth-child(2) { animation-delay: 0.05s; }
.animate-in:nth-child(3) { animation-delay: 0.1s; }
.animate-in:nth-child(4) { animation-delay: 0.15s; }
.animate-in:nth-child(5) { animation-delay: 0.2s; }
.animate-in:nth-child(6) { animation-delay: 0.25s; }
.animate-in:nth-child(7) { animation-delay: 0.3s; }

/* ===== TOAST ===== */
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  transform: translateY(120%);
  transition: transform var(--transition-slow);
}

.toast--visible {
  transform: translateY(0);
}

.toast__icon {
  font-size: var(--text-xl);
}

.toast__text {
  font-size: var(--text-sm);
  font-weight: 600;
}

.toast__sub {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 400;
}

/* ===== PRICING SECTION ===== */
.pricing {
  padding: var(--space-8) 0 var(--space-16);
}

.pricing__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  max-width: 480px;
  margin-inline: auto;
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  position: relative;
  overflow: hidden;
}

.pricing__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
}

.pricing__header {
  text-align: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-divider);
}

.pricing__tag {
  display: inline-block;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-4);
}

.pricing__price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.pricing__currency {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
}

.pricing__amount {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}

.pricing__sub {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.pricing__features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6) 0;
  display: grid;
  gap: var(--space-3);
}

.pricing__features li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text);
}

.pricing__features li svg {
  flex-shrink: 0;
}

.pricing__guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

/* ===== PAYWALL MODAL ===== */
.paywall-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.paywall-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.paywall-modal__content {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.paywall-modal__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
}

.paywall-modal__close:hover {
  color: var(--color-text);
  background: var(--color-surface-offset);
}

.paywall-modal__icon {
  margin-bottom: var(--space-4);
}

.paywall-modal__content h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.paywall-modal__content p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.paywall-modal__price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .hero { min-height: 60vh; }
  .hero__image { object-position: center center; }
  .hero__stats { gap: var(--space-4); }
  .lesson-card { flex-direction: column; align-items: flex-start; text-align: left; }
  .lesson-card__arrow { display: none; }
  .nav__xp { display: none; }
  .lesson-complete { flex-direction: column; text-align: center; }
  .cert-preview { padding: var(--space-8) var(--space-4); }
  .cert-preview__name { font-size: var(--text-xl); }
  .pricing__card { padding: var(--space-6); }
}

/* =============================================
   FREE INTRO LESSON
   ============================================= */

/* Hero buttons row */
.hero__buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  justify-content: center;
}
@media (min-width: 500px) {
  .hero__buttons { flex-direction: row; align-items: center; justify-content: center; }
}

/* "Start Your Future Here" — glowing cyan-to-blue gradient button */
.btn--future {
  background: linear-gradient(135deg, #1a8fff 0%, #38d8e0 100%);
  color: #060a14;
  font-weight: 700;
  border: none;
  box-shadow: 0 0 32px rgba(56, 216, 224, 0.35), 0 4px 20px rgba(26, 143, 255, 0.3);
  transition: box-shadow 0.3s, transform 0.2s, filter 0.2s;
  position: relative;
  overflow: hidden;
}
.btn--future::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%);
  pointer-events: none;
}
.btn--future:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 48px rgba(56, 216, 224, 0.5), 0 6px 28px rgba(26, 143, 255, 0.45);
  transform: translateY(-2px);
}
.btn--master {
  background: linear-gradient(135deg, #e07830 0%, #e0a030 100%);
  box-shadow: 0 0 32px rgba(224, 120, 48, 0.45), 0 4px 20px rgba(224, 160, 48, 0.3);
}
.btn--master:hover {
  box-shadow: 0 0 52px rgba(224, 120, 48, 0.65), 0 6px 28px rgba(224, 160, 48, 0.5);
}
.btn--xl {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
  border-radius: 14px;
  gap: var(--space-3);
}

/* Reading progress bar */
.intro-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.07);
  z-index: 200;
}
.intro-progress-bar__fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #1a8fff, #38d8e0);
  transition: width 0.1s linear;
}

/* Intro lesson layout */
.intro-lesson {
  padding: var(--space-8) var(--space-4);
  max-width: 720px;
}

/* Lesson header */
.intro-lesson__header {
  padding: var(--space-10) 0 var(--space-8);
}
.intro-lesson__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: linear-gradient(135deg, rgba(26,143,255,0.18), rgba(56,216,224,0.12));
  border: 1px solid rgba(56,216,224,0.3);
  border-radius: 100px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: #38d8e0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-5);
}
.intro-lesson__title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.15;
  color: var(--color-text);
  margin-bottom: var(--space-4);
}
.intro-lesson__subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-5);
  max-width: 560px;
}
.intro-lesson__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-faint);
}
.intro-lesson__meta span {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* Sections */
.intro-section {
  margin: var(--space-8) 0;
  position: relative;
}
.intro-section__number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #1a8fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}
.intro-section__title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-5);
  line-height: 1.25;
}
.intro-section p {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}
.intro-section strong {
  color: var(--color-text);
  font-weight: 600;
}

/* Divider */
.intro-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(26,143,255,0.2), transparent);
  margin: var(--space-8) 0;
}

/* Highlight boxes */
.intro-highlight {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-5);
  border-radius: 12px;
  margin: var(--space-5) 0;
  font-size: var(--text-sm);
  line-height: 1.7;
}
.intro-highlight__icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.intro-highlight strong { color: var(--color-text); font-weight: 600; display: block; margin-bottom: 4px; }
.intro-highlight--blue  { background: rgba(26,143,255,0.1);  border: 1px solid rgba(26,143,255,0.25);  color: var(--color-text-muted); }
.intro-highlight--cyan  { background: rgba(56,216,224,0.08); border: 1px solid rgba(56,216,224,0.2);   color: var(--color-text-muted); }
.intro-highlight--amber { background: rgba(224,120,48,0.09); border: 1px solid rgba(224,120,48,0.22);  color: var(--color-text-muted); }

/* Tools grid */
.intro-tools-grid {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--space-6);
  margin: var(--space-6) 0;
}
.intro-tools-grid__title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-4);
}
.intro-tools-grid__items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.intro-tool-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(26,143,255,0.08);
  border: 1px solid rgba(26,143,255,0.18);
  border-radius: 100px;
  font-size: var(--text-sm);
  color: var(--color-text);
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s;
}
.intro-tool-chip:hover {
  background: rgba(26,143,255,0.15);
  border-color: rgba(56,216,224,0.35);
}

/* Timeline */
.intro-timeline {
  position: relative;
  margin: var(--space-6) 0;
  padding-left: var(--space-6);
}
.intro-timeline::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: linear-gradient(to bottom, #1a8fff, #38d8e0, rgba(26,143,255,0.3));
}
.intro-timeline__item {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  position: relative;
}
.intro-timeline__dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 2px solid rgba(26,143,255,0.4);
  flex-shrink: 0;
  margin-top: 3px;
  position: absolute;
  left: calc(-1 * var(--space-6) + 1px);
}
.intro-timeline__dot--lit {
  background: #1a8fff;
  border-color: #38d8e0;
  box-shadow: 0 0 12px rgba(56,216,224,0.6);
}
.intro-timeline__dot--future {
  background: transparent;
  border-color: rgba(56,216,224,0.25);
  border-style: dashed;
}
.intro-timeline__content strong {
  color: var(--color-text);
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
  font-size: var(--text-base);
}
.intro-timeline__content p {
  font-size: var(--text-sm) !important;
  color: var(--color-text-faint) !important;
  margin: 0 !important;
}

/* Outcomes list */
.intro-outcomes {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin: var(--space-5) 0;
}
.intro-outcome {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s, background 0.2s;
}
.intro-outcome:hover {
  border-color: rgba(26,143,255,0.3);
  background: rgba(26,143,255,0.04);
}
.intro-outcome__icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26,143,255,0.1);
  border-radius: 10px;
}
.intro-outcome strong {
  color: var(--color-text);
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
  font-size: var(--text-base);
}
.intro-outcome p {
  font-size: var(--text-sm) !important;
  color: var(--color-text-faint) !important;
  margin: 0 !important;
  line-height: 1.5 !important;
}

/* How grid */
.intro-how-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin: var(--space-5) 0;
}
@media (max-width: 600px) { .intro-how-grid { grid-template-columns: 1fr; } }
.intro-how-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--space-5);
  text-align: center;
}
.intro-how-item__num {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1a8fff, #38d8e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 4px;
}
.intro-how-item__label {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: var(--space-3);
}
.intro-how-item p {
  font-size: var(--text-sm) !important;
  color: var(--color-text-faint) !important;
  margin: 0 !important;
  line-height: 1.6 !important;
}

/* Quote */
.intro-quote {
  position: relative;
  background: linear-gradient(135deg, rgba(26,143,255,0.06), rgba(56,216,224,0.04));
  border: 1px solid rgba(56,216,224,0.18);
  border-radius: 16px;
  padding: var(--space-6) var(--space-6) var(--space-5);
  margin: var(--space-5) 0;
}
.intro-quote__marks {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 5rem;
  line-height: 0.6;
  color: #38d8e0;
  opacity: 0.35;
  margin-bottom: var(--space-3);
}
.intro-quote p {
  font-size: var(--text-base) !important;
  font-style: italic;
  color: var(--color-text-muted) !important;
  line-height: 1.75 !important;
  margin-bottom: var(--space-3) !important;
}
.intro-quote__author {
  font-size: var(--text-sm);
  color: #38d8e0;
  font-weight: 600;
}

/* End CTA section */
.intro-cta {
  position: relative;
  text-align: center;
  background: var(--color-surface);
  border: 1px solid rgba(26,143,255,0.25);
  border-radius: 24px;
  padding: var(--space-10) var(--space-8);
  margin: var(--space-10) 0 var(--space-6);
  overflow: hidden;
}
.intro-cta__glow {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(26,143,255,0.18) 0%, transparent 70%);
  pointer-events: none;
}
.intro-cta__badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(56,216,224,0.1);
  border: 1px solid rgba(56,216,224,0.25);
  border-radius: 100px;
  font-size: var(--text-xs);
  font-weight: 700;
  color: #38d8e0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-4);
}
.intro-cta__title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  margin-bottom: var(--space-4);
}
.intro-cta__sub {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  max-width: 480px;
  margin: 0 auto var(--space-6);
  line-height: 1.6;
}
.intro-cta__features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2) var(--space-5);
  margin-bottom: var(--space-6);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.intro-cta__features span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.intro-cta__price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}
.intro-cta__price-amount {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}
.intro-cta__price-label {
  font-size: var(--text-sm);
  color: var(--color-text-faint);
}
.intro-cta .btn--future {
  margin: 0 auto;
  display: inline-flex;
}
.intro-cta__secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  margin-top: var(--space-4);
}

/* Light mode overrides for intro */
[data-theme="light"] .intro-highlight--blue  { background: rgba(26,143,255,0.06);  }
[data-theme="light"] .intro-highlight--cyan  { background: rgba(56,216,224,0.06); }
[data-theme="light"] .intro-highlight--amber { background: rgba(224,120,48,0.06); }
[data-theme="light"] .intro-tool-chip { background: rgba(26,143,255,0.06); }
[data-theme="light"] .intro-quote { background: linear-gradient(135deg, rgba(26,143,255,0.04), rgba(56,216,224,0.03)); }
[data-theme="light"] .intro-cta { background: var(--color-surface); }
