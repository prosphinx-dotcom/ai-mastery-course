const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Env check ─────────────────────────────────────────────────
const REQUIRED = ['SUPABASE_URL','SUPABASE_SERVICE_KEY','JWT_SECRET','STRIPE_SECRET_KEY','STRIPE_PAYMENT_LINK'];
const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length) console.error('❌ Missing env vars:', missing.join(', '));

// ── Stripe (safe init) ────────────────────────────────────────
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch(e) { console.error('Stripe init failed:', e.message); }

// ── Supabase ──────────────────────────────────────────────────
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

// Embedded HTML (avoids static file truncation issues)
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Mastery — 30-Day Interactive Course</title>
<meta name="description" content="Master AI tools in 30 days. Interactive lessons, quizzes, hands-on practice, streak tracking, and certificate. 15 minutes per day.">

<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@300,400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- PWA -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#060a14">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="AI Mastery">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">

<link rel="stylesheet" href="./base.css">
<link rel="stylesheet" href="./style.css">
</head>
<body>

<!-- ========== NAV ========== -->
<nav class="nav" role="navigation">
  <div class="container nav__inner">
    <a class="nav__logo" onclick="showView('hero')" aria-label="Home">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
        <circle cx="16" cy="14" r="5" stroke="#fff" stroke-width="1.5" fill="none"/>
        <circle cx="16" cy="14" r="1.5" fill="#fff"/>
        <path d="M10 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M8 14h3M21 14h3M16 7v3" stroke="rgba(56,216,224,0.6)" stroke-width="1" stroke-linecap="round"/>
      </svg>
      AI Mastery
    </a>
    <div class="nav__actions">
      <div class="nav__streak" id="navStreak" title="Daily streak">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <span id="streakCount">0</span>
      </div>
      <div class="nav__xp" title="Total XP">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
        <span id="xpCount">0</span> XP
      </div>
      <div id="nav-user"></div>
      <button class="btn-icon" data-theme-toggle aria-label="Toggle theme">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
  </div>
</nav>

<!-- ========== AUTH MODAL ========== -->
<div id="auth-modal" style="display:none;position:fixed;inset:0;z-index:1000;background:rgba(6,10,20,0.85);align-items:center;justify-content:center;padding:1rem;">
  <div style="background:var(--color-surface,#0c1220);border:1px solid rgba(26,143,255,0.25);border-radius:16px;padding:2rem;width:100%;max-width:400px;position:relative;">
    <button onclick="hideAuthModal()" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:var(--color-text-muted);cursor:pointer;font-size:1.5rem;line-height:1">&times;</button>
    <h2 id="auth-title" style="color:#fff;font-size:1.5rem;margin-bottom:0.5rem">Sign In</h2>
    <p style="color:rgba(200,210,220,0.6);font-size:0.9rem;margin-bottom:1.5rem">Access your AI Mastery course</p>
    <form onsubmit="submitAuth(event)">
      <input type="hidden" id="auth-mode" value="login">
      <div style="margin-bottom:1rem">
        <label style="display:block;color:rgba(200,210,220,0.8);font-size:0.85rem;margin-bottom:0.4rem">Email</label>
        <input id="auth-email" type="email" required placeholder="you@example.com"
          style="width:100%;padding:0.75rem 1rem;background:rgba(255,255,255,0.05);border:1px solid rgba(26,143,255,0.3);border-radius:8px;color:#fff;font-size:1rem;outline:none;">
      </div>
      <div style="margin-bottom:1.25rem">
        <label style="display:block;color:rgba(200,210,220,0.8);font-size:0.85rem;margin-bottom:0.4rem">Password</label>
        <input id="auth-password" type="password" required placeholder="Min 8 characters"
          style="width:100%;padding:0.75rem 1rem;background:rgba(255,255,255,0.05);border:1px solid rgba(26,143,255,0.3);border-radius:8px;color:#fff;font-size:1rem;outline:none;">
      </div>
      <p id="auth-error" style="color:#ff6b6b;font-size:0.85rem;margin-bottom:0.75rem;min-height:1.2em"></p>
      <button id="auth-submit" type="submit" class="btn btn--primary" style="width:100%;padding:0.85rem;font-size:1rem;">Sign In</button>
    </form>
    <p id="auth-switch-text" style="text-align:center;margin-top:1.25rem;font-size:0.85rem;color:rgba(200,210,220,0.6)">
      New here? <a href="#" onclick="switchAuthMode('register');return false;" style="color:#38d8e0">Create an account</a>
    </p>
  </div>
</div>

<!-- ========== HERO VIEW ========== -->
<div id="view-hero" class="view view--active">
  <section class="hero">
    <div class="hero__image-wrap">
      <img src="./hero-brain.jpg" alt="AI Neural Network Brain" class="hero__image" />
      <div class="hero__image-overlay"></div>
    </div>
    <div class="hero__content container">
      <div class="hero__badge">
        <span class="hero__badge-dot"></span>
        30 Days · Lifetime Access
      </div>
      <h1>Master AI Tools<br>in <span class="gradient-text">30 Days</span></h1>
      <p>15 minutes per day. Interactive lessons, hands-on practice, quizzes, streak tracking, and a certificate. Built from the best elements of the world's top AI courses.</p>
      <div class="hero__stats">
        <div class="hero__stat">
          <div class="hero__stat-value">30</div>
          <div class="hero__stat-label">Lessons</div>
        </div>
        <div class="hero__stat">
          <div class="hero__stat-value">20+</div>
          <div class="hero__stat-label">AI Tools</div>
        </div>
        <div class="hero__stat">
          <div class="hero__stat-value">15</div>
          <div class="hero__stat-label">Min / Day</div>
        </div>
        <div class="hero__stat">
          <div class="hero__stat-value">120</div>
          <div class="hero__stat-label">Quiz Q's</div>
        </div>
      </div>
      <div class="hero__buttons">
        <button class="btn btn--future btn--lg" onclick="showView('intro')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5,3 19,12 5,21"/></svg>
          Start Your Future Here
        </button>
        <button class="btn btn--future btn--master btn--lg" id="heroStartBtn" onclick="handleStartLearning()">
          Become the Master
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section class="pricing container container--narrow" id="pricing">
    <div class="pricing__card">
      <div class="pricing__header">
        <div class="pricing__tag">One-Time Payment</div>
        <div class="pricing__price">
          <span class="pricing__currency">£</span>
          <span class="pricing__amount">45</span>
        </div>
        <p class="pricing__sub">Lifetime access. No subscription. No hidden fees.</p>
      </div>
      <ul class="pricing__features">
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          30 structured daily lessons (15 min each)
        </li>
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          120+ interactive quiz questions
        </li>
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Copy-paste prompt templates for every tool
        </li>
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Hands-on practice with 20+ AI tools
        </li>
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Streak tracking and XP gamification
        </li>
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Certificate of completion
        </li>
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Lifetime access — learn at your own pace
        </li>
      </ul>
      <button class="btn btn--primary btn--lg" style="width:100%" onclick="handlePurchase()" id="buyBtn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        Get Instant Access — £45
      </button>
      <p class="pricing__guarantee">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Secure payment via Stripe
      </p>
    </div>
  </section>
</div>

<!-- ========== FREE INTRO LESSON VIEW ========== -->
<div id="view-intro" class="view">

  <!-- Reading progress bar -->
  <div class="intro-progress-bar"><div class="intro-progress-bar__fill" id="introProgressFill"></div></div>

  <section class="intro-lesson container container--narrow">

    <!-- Back nav -->
    <a class="lesson-view__back" onclick="showView('hero')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Home
    </a>

    <!-- Lesson header -->
    <div class="intro-lesson__header">
      <div class="intro-lesson__badge">Free Introduction &bull; ~15 minutes</div>
      <h1 class="intro-lesson__title">Welcome to the Age of AI</h1>
      <p class="intro-lesson__subtitle">What artificial intelligence really is, why it matters right now, and how mastering it will change your life</p>
      <div class="intro-lesson__meta">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> 15 min read</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> No experience needed</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Free forever</span>
      </div>
    </div>

    <!-- Section 1: The moment everything changed -->
    <div class="intro-section">
      <div class="intro-section__number">01</div>
      <h2 class="intro-section__title">The Moment Everything Changed</h2>

      <p>In November 2022, a quiet company called OpenAI released a chatbot. Within five days, a million people had tried it. Within two months, <strong>100 million people</strong> had used it. No product in history had ever grown that fast.</p>

      <p>That chatbot was ChatGPT. And the world has never quite been the same since.</p>

      <div class="intro-highlight intro-highlight--blue">
        <div class="intro-highlight__icon">💡</div>
        <div>
          <strong>The shift is real.</strong> A 2024 McKinsey report found that AI adoption in the workplace doubled in a single year. Companies using AI tools report saving 2&ndash;4 hours per employee, per day. That's time for creative work, family, growth.
        </div>
      </div>

      <p>But here's what most people miss: AI isn't one thing. It's not just a chatbot. It's a collection of <strong>powerful tools</strong> — each designed to do something remarkable. There are tools that write, design, code, research, summarise, plan, and even make videos. And right now, most people have no idea they exist.</p>

      <p>That gap — between people who know these tools and people who don't — is growing every single day. This course is your chance to close it.</p>
    </div>

    <!-- Divider -->
    <div class="intro-divider"></div>

    <!-- Section 2: What AI actually is -->
    <div class="intro-section">
      <div class="intro-section__number">02</div>
      <h2 class="intro-section__title">What AI Actually Is (No Jargon, I Promise)</h2>

      <p>Forget everything you've seen in sci-fi films. AI isn't robots trying to take over. It's not magic. It's not dangerous. At its core, AI is a tool — a very, very clever tool — that has learned patterns from enormous amounts of human-created content.</p>

      <p>Think of it like this. Imagine you had a brilliant assistant who had read every book, article, website, and conversation ever written. They'd be able to help you draft emails, explain complex topics simply, write code, brainstorm ideas, summarise documents, and answer almost any question — instantly.</p>

      <div class="intro-highlight intro-highlight--cyan">
        <div class="intro-highlight__icon">🧠</div>
        <div>
          <strong>That's what modern AI does.</strong> It doesn't &ldquo;think&rdquo; the way you do. It predicts — incredibly well — what the most useful, accurate, and relevant response to your input should be. The result often looks like magic. It isn't. It's mathematics and scale.
        </div>
      </div>

      <p>And here's the exciting part: <strong>you don't need to understand the mathematics</strong> to use these tools brilliantly. Just as you don't need to understand internal combustion to drive a car, you don't need a computer science degree to get extraordinary results from AI.</p>

      <p>You just need to know how to ask the right questions — and that's exactly what this course teaches.</p>
    </div>

    <!-- Visual: AI Tools landscape -->
    <div class="intro-tools-grid">
      <div class="intro-tools-grid__title">20+ AI Tools You'll Master</div>
      <div class="intro-tools-grid__items">
        <div class="intro-tool-chip"><span>✍️</span> ChatGPT</div>
        <div class="intro-tool-chip"><span>🎨</span> Midjourney</div>
        <div class="intro-tool-chip"><span>💻</span> GitHub Copilot</div>
        <div class="intro-tool-chip"><span>🔍</span> Perplexity</div>
        <div class="intro-tool-chip"><span>🎵</span> Suno</div>
        <div class="intro-tool-chip"><span>🎬</span> RunwayML</div>
        <div class="intro-tool-chip"><span>📊</span> Claude</div>
        <div class="intro-tool-chip"><span>🤖</span> Gemini</div>
        <div class="intro-tool-chip"><span>📝</span> Notion AI</div>
        <div class="intro-tool-chip"><span>🗣️</span> ElevenLabs</div>
        <div class="intro-tool-chip"><span>📧</span> Copy.ai</div>
        <div class="intro-tool-chip"><span>⚡</span> Zapier AI</div>
      </div>
    </div>

    <div class="intro-divider"></div>

    <!-- Section 3: Why right now -->
    <div class="intro-section">
      <div class="intro-section__number">03</div>
      <h2 class="intro-section__title">Why Right Now Is the Perfect Moment</h2>

      <p>Here's an honest truth: we are living through a transition as significant as the internet itself. In 1995, the people who learned email and websites first got a 10-year head start on everyone else. The same is happening right now with AI.</p>

      <div class="intro-timeline">
        <div class="intro-timeline__item">
          <div class="intro-timeline__dot"></div>
          <div class="intro-timeline__content">
            <strong>2020</strong>
            <p>AI tools existed but required technical expertise to use</p>
          </div>
        </div>
        <div class="intro-timeline__item">
          <div class="intro-timeline__dot intro-timeline__dot--lit"></div>
          <div class="intro-timeline__content">
            <strong>Now (2026)</strong>
            <p>AI tools are accessible to everyone — but most people haven't learned them yet</p>
          </div>
        </div>
        <div class="intro-timeline__item">
          <div class="intro-timeline__dot intro-timeline__dot--future"></div>
          <div class="intro-timeline__content">
            <strong>2027&ndash;2030</strong>
            <p>AI fluency becomes a baseline expectation in almost every professional role</p>
          </div>
        </div>
      </div>

      <p>You are in the window — right now — where learning these tools puts you ahead. Not just slightly ahead. <strong>Significantly</strong> ahead of colleagues, competitors, and peers who are still waiting to &ldquo;see what happens.&rdquo;</p>

      <div class="intro-highlight intro-highlight--amber">
        <div class="intro-highlight__icon">🚀</div>
        <div>
          <strong>The early adopter advantage is real.</strong> Professionals who use AI tools effectively are being promoted faster, earning more, and building businesses that scale without proportionally increasing costs. This isn't hype — it's happening right now, in every industry.
        </div>
      </div>
    </div>

    <div class="intro-divider"></div>

    <!-- Section 4: What you'll actually be able to do -->
    <div class="intro-section">
      <div class="intro-section__number">04</div>
      <h2 class="intro-section__title">What You'll Actually Be Able to Do</h2>

      <p>Theory is only interesting if it leads somewhere real. So let's be concrete. After completing this course, here is what changes for you:</p>

      <div class="intro-outcomes">
        <div class="intro-outcome">
          <div class="intro-outcome__icon">⚡</div>
          <div>
            <strong>Save 2+ hours every day</strong>
            <p>Automate emails, summaries, research, and reports that used to take hours</p>
          </div>
        </div>
        <div class="intro-outcome">
          <div class="intro-outcome__icon">🎨</div>
          <div>
            <strong>Create professional content in minutes</strong>
            <p>Blog posts, social media, images, videos, presentations — all AI-assisted</p>
          </div>
        </div>
        <div class="intro-outcome">
          <div class="intro-outcome__icon">💻</div>
          <div>
            <strong>Build things you couldn't before</strong>
            <p>Write code, build apps, automate workflows — no technical background required</p>
          </div>
        </div>
        <div class="intro-outcome">
          <div class="intro-outcome__icon">📈</div>
          <div>
            <strong>Become the AI-fluent person in any room</strong>
            <p>The colleague, employee, or entrepreneur people turn to for AI solutions</p>
          </div>
        </div>
        <div class="intro-outcome">
          <div class="intro-outcome__icon">🌍</div>
          <div>
            <strong>Future-proof your career</strong>
            <p>Build skills that compound — the more AI evolves, the more valuable your knowledge becomes</p>
          </div>
        </div>
      </div>
    </div>

    <div class="intro-divider"></div>

    <!-- Section 5: How the course works -->
    <div class="intro-section">
      <div class="intro-section__number">05</div>
      <h2 class="intro-section__title">How This Course Works</h2>

      <p>This isn't a passive video course you watch and forget. Every lesson is interactive, practical, and designed to fit into your day — even a busy one.</p>

      <div class="intro-how-grid">
        <div class="intro-how-item">
          <div class="intro-how-item__num">15</div>
          <div class="intro-how-item__label">minutes per day</div>
          <p>Each lesson is precisely crafted to be completable in your lunch break, morning commute, or evening wind-down</p>
        </div>
        <div class="intro-how-item">
          <div class="intro-how-item__num">30</div>
          <div class="intro-how-item__label">structured days</div>
          <p>Four weeks of carefully sequenced content, building from foundations to advanced applications</p>
        </div>
        <div class="intro-how-item">
          <div class="intro-how-item__num">120+</div>
          <div class="intro-how-item__label">quiz questions</div>
          <p>Knowledge checks after every lesson, practice exercises, and real-world application challenges</p>
        </div>
      </div>

      <div class="intro-highlight intro-highlight--blue">
        <div class="intro-highlight__icon">🔥</div>
        <div>
          <strong>The streak system keeps you going.</strong> Complete a lesson each day and build your streak. Earn XP. Watch your progress. The course is gamified to make consistency feel rewarding — because it is.
        </div>
      </div>

      <p>At the end, you'll receive a <strong>Certificate of Completion</strong> — a tangible record of your achievement you can share on LinkedIn, in job applications, or just keep for yourself as proof of what you've built.</p>
    </div>

    <div class="intro-divider"></div>

    <!-- Section 6: A word from the course -->
    <div class="intro-section">
      <div class="intro-section__number">06</div>
      <h2 class="intro-section__title">A Message Before You Begin</h2>

      <div class="intro-quote">
        <div class="intro-quote__marks">&ldquo;</div>
        <p>The people who thrive in the next decade won't necessarily be the most experienced or the most qualified. They'll be the ones who stayed curious, stayed adaptable, and were willing to learn powerful new tools while others waited. You've already shown that curiosity by getting here. That matters more than you think.</p>
        <div class="intro-quote__author">— AI Mastery Course</div>
      </div>

      <p>You don't need to be technical. You don't need a computer science background. You don't need to have used a single AI tool before. All you need is the willingness to invest 15 minutes a day in yourself — and the courage to imagine a future where you are genuinely, powerfully skilled in the technology that is reshaping everything.</p>

      <p>That future starts with the next button you click.</p>
    </div>

    <!-- ===== END CTA ===== -->
    <div class="intro-cta">
      <div class="intro-cta__glow"></div>

      <div class="intro-cta__badge">Ready to Begin?</div>
      <h2 class="intro-cta__title">Your 30-Day AI Journey Starts Now</h2>
      <p class="intro-cta__sub">Join thousands of learners who are already mastering the tools reshaping every industry. One payment. Lifetime access. No excuses.</p>

      <div class="intro-cta__features">
        <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> 30 interactive lessons</span>
        <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> 120+ quiz questions</span>
        <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> 20+ AI tools covered</span>
        <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Certificate of completion</span>
        <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Lifetime access</span>
        <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> 15 min/day pace</span>
      </div>

      <div class="intro-cta__price">
        <span class="intro-cta__price-amount">&pound;45</span>
        <span class="intro-cta__price-label">one-time &bull; no subscription</span>
      </div>

      <button class="btn btn--future btn--xl" onclick="handlePurchase()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        Start Learning — Get Instant Access
      </button>

      <p class="intro-cta__secure">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Secure payment via Stripe &bull; Instant access after payment
      </p>
    </div>

  </section>
</div>

<!-- ========== PAYWALL MODAL ========== -->
<div id="paywall-modal" class="paywall-modal" style="display:none">
  <div class="paywall-modal__backdrop" onclick="closePaywall()"></div>
  <div class="paywall-modal__content">
    <button class="paywall-modal__close" onclick="closePaywall()" aria-label="Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <div class="paywall-modal__icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>
    <h3>Unlock the Full Course</h3>
    <p>Get lifetime access to all 30 lessons, quizzes, practice exercises, and your certificate of completion.</p>
    <div class="paywall-modal__price">
      <span class="pricing__currency">£</span><span class="pricing__amount" style="font-size:var(--text-xl)">45</span>
      <span style="color:var(--color-text-muted);font-size:var(--text-sm);margin-left:var(--space-2)">one-time</span>
    </div>
    <button class="btn btn--primary btn--lg" style="width:100%;margin-top:var(--space-4)" onclick="handlePurchase()" id="modalBuyBtn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      Get Instant Access
    </button>
    <p style="font-size:var(--text-xs);color:var(--color-text-faint);margin-top:var(--space-3)">Secure payment via Stripe. Lifetime access.</p>
  </div>
</div>

<!-- ========== DASHBOARD VIEW ========== -->
<div id="view-dashboard" class="view">
  <section class="dashboard container container--narrow">

    <div class="dashboard__header">
      <h2 class="dashboard__greeting">Welcome back <span id="userName">Learner</span></h2>
      <button class="btn btn--outline btn--sm" onclick="showView('certificate')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        Certificate
      </button>
    </div>

    <!-- Progress Card -->
    <div class="progress-card">
      <div class="progress-card__top">
        <div class="progress-card__info">
          <h3 id="currentWeekTitle">Week 1: AI Foundations</h3>
          <p id="progressText">0 of 30 lessons completed</p>
        </div>
        <div class="progress-card__badges">
          <span class="badge badge--streak" id="streakBadge">🔥 0-day streak</span>
          <span class="badge badge--xp" id="xpBadge">⭐ 0 XP</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-bar__fill" id="progressFill" style="width: 0%"></div>
      </div>
      <div class="progress-bar__label" id="progressPercent">0% complete</div>
    </div>

    <!-- Week Tabs -->
    <div class="week-tabs" id="weekTabs"></div>

    <!-- Lessons Grid -->
    <div class="lessons-grid" id="lessonsGrid"></div>

  </section>
</div>

<!-- ========== LESSON VIEW ========== -->
<div id="view-lesson" class="view">
  <section class="lesson-view container container--narrow">
    <a class="lesson-view__back" onclick="showView('dashboard')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Dashboard
    </a>
    <div id="lessonContent"></div>
  </section>
</div>

<!-- ========== CERTIFICATE VIEW ========== -->
<div id="view-certificate" class="view">
  <section class="cert-section container container--narrow">
    <h2>Your Certificate</h2>
    <p style="color: var(--color-text-muted); margin-bottom: var(--space-4);" id="certStatus">
      Complete all 30 lessons to unlock your certificate.
    </p>
    <div class="cert-preview" id="certPreview">
      <div class="cert-preview__logo">
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style="margin:0 auto;">
          <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
          <circle cx="16" cy="14" r="5" stroke="#fff" stroke-width="1.5" fill="none"/>
          <circle cx="16" cy="14" r="1.5" fill="#fff"/>
          <path d="M10 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
      <h3>Certificate of Completion</h3>
      <p style="color: var(--color-text-muted); font-size: var(--text-sm);">This certifies that</p>
      <div class="cert-preview__name" id="certName">Your Name</div>
      <p class="cert-preview__detail">Has successfully completed the</p>
      <p style="font-weight:700; font-size: var(--text-lg); margin-bottom: var(--space-2);">30-Day AI Tools Mastery Program</p>
      <p class="cert-preview__detail">Covering 20+ AI tools across prompting, content creation, research, automation, and deployment.</p>
      <p class="cert-preview__detail" id="certDate"></p>
    </div>
    <div class="cert-form" id="certForm">
      <input type="text" id="certNameInput" placeholder="Enter your full name">
      <br>
      <button class="btn btn--primary" id="certBtn" onclick="generateCert()" disabled>
        Generate Certificate
      </button>
    </div>
    <button class="btn btn--ghost" onclick="showView('dashboard')" style="margin-top: var(--space-4);">
      ← Back to Dashboard
    </button>
  </section>
</div>

<!-- ========== TOAST ========== -->
<div class="toast" id="toast">
  <div class="toast__icon" id="toastIcon">🔥</div>
  <div>
    <div class="toast__text" id="toastText">Streak updated!</div>
    <div class="toast__sub" id="toastSub">Keep it going!</div>
  </div>
</div>

<!-- ========== FOOTER ========== -->
<footer class="footer">
  <div class="container">
    <p>&copy; 2026 Pro Sphinx. All rights reserved.</p>
    <p style="margin-top:0.5rem;font-size:0.8em;opacity:0.6;">&copy; 2026 Pro Sphinx &middot; <a href="mailto:pro.sphinx@proton.me">Contact</a> &middot; <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a></p>
  </div>
</footer>

<script>
// ===== AUTH + ACCESS GATE =====
var hasAccess = false;
var currentUser = null;

function safeShowView(view) {
  if (typeof showView === 'function') {
    showView(view);
  } else {
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('view--active'); });
    var el = document.getElementById('view-' + view);
    if (el) { el.classList.add('view--active'); window.scrollTo(0, 0); }
    window.addEventListener('load', function() { if (typeof showView === 'function') showView(view); });
  }
}

function closePaywall() {
  var modal = document.getElementById('paywall-modal');
  if (modal) modal.style.display = 'none';
}

// ── Auth Modal ──────────────────────────────────────────────
function showAuthModal(mode) {
  var modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  switchAuthMode(mode || 'login');
}

function hideAuthModal() {
  var modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
  document.getElementById('auth-error').textContent = '';
}

function switchAuthMode(mode) {
  document.getElementById('auth-mode').value = mode;
  document.getElementById('auth-title').textContent = mode === 'login' ? 'Sign In' : 'Create Account';
  document.getElementById('auth-submit').textContent = mode === 'login' ? 'Sign In' : 'Create Account';
  document.getElementById('auth-switch-text').innerHTML = mode === 'login'
    ? 'New here? <a href="#" onclick="switchAuthMode(\\'register\\');return false;">Create an account</a>'
    : 'Already have an account? <a href="#" onclick="switchAuthMode(\\'login\\');return false;">Sign in</a>';
  document.getElementById('auth-error').textContent = '';
}

async function submitAuth(e) {
  e.preventDefault();
  var mode = document.getElementById('auth-mode').value;
  var email = document.getElementById('auth-email').value.trim();
  var password = document.getElementById('auth-password').value;
  var btn = document.getElementById('auth-submit');
  var errEl = document.getElementById('auth-error');

  btn.disabled = true;
  btn.textContent = 'Please wait...';
  errEl.textContent = '';

  try {
    var res = await fetch('/api/auth/' + mode, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    var data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');

    currentUser = data.user;
    hasAccess = data.user.has_access;
    hideAuthModal();
    updateNavUser();

    if (hasAccess) {
      closePaywall();
      safeShowView('dashboard');
    } else {
      // Registered but not paid yet — go to pricing
      var pricing = document.getElementById('pricing');
      if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
    }
  } catch(err) {
    errEl.textContent = err.message;
    btn.disabled = false;
    btn.textContent = mode === 'login' ? 'Sign In' : 'Create Account';
  }
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  currentUser = null;
  hasAccess = false;
  updateNavUser();
  safeShowView('hero');
}

function updateNavUser() {
  var navUser = document.getElementById('nav-user');
  if (!navUser) return;
  if (currentUser) {
    navUser.innerHTML = '<span style="font-size:0.8rem;opacity:0.7;margin-right:8px">' + currentUser.email + '</span>'
      + '<button class="btn btn--sm" onclick="logout()" style="font-size:0.75rem;padding:4px 10px">Sign Out</button>';
  } else {
    navUser.innerHTML = '<button class="btn btn--sm btn--outline" onclick="showAuthModal(\\'login\\')" style="font-size:0.8rem;padding:5px 14px">Sign In</button>';
  }
}

// ── Page Init ───────────────────────────────────────────────
async function initApp() {
  try {
    var res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      var data = await res.json();
      currentUser = data.user;
      hasAccess = data.user.has_access;
      if (data.stats && typeof updateStats === 'function') updateStats(data.stats);
    }
  } catch(e) {}
  updateNavUser();

  // Check if returning from Stripe payment
  var params = new URLSearchParams(window.location.search);
  if (params.get('payment') === 'success') {
    window.history.replaceState({}, '', window.location.pathname);
    if (hasAccess) {
      safeShowView('dashboard');
    } else {
      // Webhook may not have fired yet — poll until access granted (max 30s)
      showPaymentProcessing();
      var attempts = 0;
      var poll = setInterval(async function() {
        attempts++;
        try {
          var r = await fetch('/api/auth/me', { credentials: 'include' });
          var d = await r.json();
          if (d.user && d.user.has_access) {
            clearInterval(poll);
            currentUser = d.user;
            hasAccess = true;
            hidePaymentProcessing();
            safeShowView('dashboard');
          }
        } catch(e) {}
        if (attempts >= 15) {
          clearInterval(poll);
          hidePaymentProcessing();
          alert('Payment received! Please sign out and sign back in to access the course.');
        }
      }, 2000);
    }
  }
}

function showPaymentProcessing() {
  var el = document.createElement('div');
  el.id = 'payment-processing';
  el.style.cssText = 'position:fixed;inset:0;background:rgba(6,10,20,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;color:#fff;font-family:inherit';
  el.innerHTML = '<div style="font-size:2rem;margin-bottom:16px">🎉</div><div style="font-size:1.2rem;font-weight:700;margin-bottom:8px">Payment confirmed!</div><div style="opacity:0.7;font-size:0.9rem">Activating your account...</div><div style="margin-top:24px;width:40px;height:40px;border:3px solid #1a8fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
  document.body.appendChild(el);
}

function hidePaymentProcessing() {
  var el = document.getElementById('payment-processing');
  if (el) el.remove();
}

window.addEventListener('load', initApp);

// ── Button handlers ─────────────────────────────────────────
function handleStartLearning() {
  if (currentUser && hasAccess) {
    safeShowView('dashboard');
  } else if (currentUser && !hasAccess) {
    var el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else {
    showAuthModal('register');
  }
}

async function handlePurchase() {
  if (!currentUser) {
    showAuthModal('register');
    return;
  }
  try {
    var res = await fetch('/api/checkout', { method: 'POST', credentials: 'include' });
    var data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Payment setup failed. Please try again.');
    }
  } catch(e) {
    alert('Payment failed. Please try again.');
  }
}

// ===== THEME TOGGLE =====
(function() {
  var toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  toggle.addEventListener('click', function() {
    var html = document.documentElement;
    var isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', 'light');
    }
  });
})();


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(function() {});
}
</script>
<script src="./app.js"></script>
</body>
</html>
`;


// ── CORS ──────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// ── Stripe webhook MUST come before express.json() ───────────
// Stripe needs raw body to verify the signature
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (secret && stripe) {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch(e) {
    console.error('Webhook error:', e.message);
    return res.status(400).send('Webhook Error: ' + e.message);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const email = session.customer_details?.email || session.customer_email;
    const paymentId = session.payment_intent || session.id;

    console.log(`Payment complete — userId: ${userId}, email: ${email}`);

    if (userId) {
      const { error } = await supabase.from('profiles')
        .update({ has_access: true, stripe_payment_id: paymentId })
        .eq('id', userId);
      if (error) console.error('Supabase update error:', error);
      else console.log('✅ Access granted to user:', userId);
    } else if (email) {
      const { error } = await supabase.from('profiles')
        .update({ has_access: true, stripe_payment_id: paymentId })
        .eq('email', email.toLowerCase());
      if (error) console.error('Supabase email update error:', error);
      else console.log('✅ Access granted to email:', email);
    }
  }

  res.json({ received: true });
});

// ── JSON body parser (after webhook) ─────────────────────────
app.use(express.json());

// ── Auth helpers ──────────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.cookies.aim_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) {
    res.status(401).json({ error: 'Session expired — please sign in again' });
  }
}

function getAuthUser(req) {
  try {
    const token = req.cookies.aim_token;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch { return null; }
}

function setAuthCookie(res, token) {
  res.cookie('aim_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
}

// ── Health ────────────────────────────────────────────────────
app.get('/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ── Register ──────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    // Check if email exists
    const { data: existing } = await supabase
      .from('profiles').select('id').eq('email', email.toLowerCase()).maybeSingle();
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('profiles')
      .insert({ email: email.toLowerCase(), password_hash })
      .select('id, email, has_access')
      .single();

    if (error) {
      console.error('Register insert error:', error);
      return res.status(500).json({ error: 'Registration failed: ' + error.message });
    }

    // Create stats row
    await supabase.from('user_stats').insert({ user_id: user.id });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, token);
    res.json({ success: true, user });
  } catch(e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── Login ─────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const { data: user, error } = await supabase
      .from('profiles').select('*').eq('email', email.toLowerCase()).maybeSingle();

    if (error || !user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, token);
    res.json({ success: true, user: { id: user.id, email: user.email, has_access: user.has_access } });
  } catch(e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── Logout ────────────────────────────────────────────────────
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('aim_token');
  res.json({ success: true });
});

// ── Me ────────────────────────────────────────────────────────
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('profiles').select('id, email, has_access, created_at')
      .eq('id', req.user.id).single();

    const { data: stats } = await supabase
      .from('user_stats').select('xp, streak, last_activity')
      .eq('user_id', req.user.id).single();

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user, stats: stats || { xp: 0, streak: 0 } });
  } catch(e) {
    res.status(500).json({ error: 'Failed to load user' });
  }
});

// ── Progress ──────────────────────────────────────────────────
app.get('/api/progress', requireAuth, async (req, res) => {
  const { data } = await supabase.from('progress').select('*').eq('user_id', req.user.id);
  res.json(data || []);
});

app.post('/api/progress', requireAuth, async (req, res) => {
  const { lesson_day, completed, score } = req.body;
  try {
    const { data, error } = await supabase.from('progress').upsert({
      user_id: req.user.id, lesson_day, completed,
      score: score || 0,
      completed_at: completed ? new Date().toISOString() : null
    }, { onConflict: 'user_id,lesson_day' }).select().single();

    if (error) throw error;

    if (completed) {
      const today = new Date().toISOString().split('T')[0];
      const { data: stats } = await supabase.from('user_stats').select('*')
        .eq('user_id', req.user.id).single();
      const xpGain = 10 + (score || 0);
      const lastActivity = stats?.last_activity;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = (lastActivity === yesterday || lastActivity === today)
        ? (stats?.streak || 0) + (lastActivity !== today ? 1 : 0) : 1;
      await supabase.from('user_stats').upsert({
        user_id: req.user.id,
        xp: (stats?.xp || 0) + xpGain,
        streak: newStreak,
        last_activity: today
      }, { onConflict: 'user_id' });
    }
    res.json({ success: true, progress: data });
  } catch(e) {
    console.error('Progress error:', e);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// ── Checkout ──────────────────────────────────────────────────
app.post('/api/checkout', requireAuth, (req, res) => {
  const link = process.env.STRIPE_PAYMENT_LINK;
  if (!link) return res.status(500).json({ error: 'Payment not configured. Contact support.' });
  res.json({ url: `${link}?client_reference_id=${req.user.id}` });
});

// ── Gate app.js ───────────────────────────────────────────────
app.get('/app.js', async (req, res, next) => {
  const user = getAuthUser(req);
  if (!user) return serveStub(res);
  try {
    const { data } = await supabase.from('profiles')
      .select('has_access').eq('id', user.id).single();
    if (data?.has_access) return next();
    serveStub(res);
  } catch { serveStub(res); }
});

function serveStub(res) {
  res.type('application/javascript');
  res.send(`
(function(){
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('view--active');});
  var h=document.getElementById('view-hero'); if(h) h.classList.add('view--active');
})();
function showView(v){
  if(v!=='hero'){var m=document.getElementById('paywall-modal');if(m)m.style.display='flex';return;}
  document.querySelectorAll('.view').forEach(function(e){e.classList.remove('view--active');});
  var h=document.getElementById('view-hero');if(h)h.classList.add('view--active');
}
function renderDashboard(){}
function generateCert(){}
function updateStats(){}
  `);
}

// ── Static files ──────────────────────────────────────────────
// Serve correct HTML from embedded string (bypasses static file issues)
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(INDEX_HTML);
});

app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(INDEX_HTML);
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Mastery running on port ${PORT}`);
  if (missing.length) console.warn('⚠️  Missing:', missing.join(', '));
  else console.log('✅ All environment variables present');
});
