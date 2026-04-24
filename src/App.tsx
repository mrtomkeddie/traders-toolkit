import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './design.css';

/* =========================================================
   Trade picker colours (hero variant B)
   ========================================================= */
const tradeColors: Record<string, string> = {
  plumbers: '#2BA6E8',
  electricians: '#FFD400',
  builders: '#FF7A1A',
  roofers: '#8B5CF6',
  decorators: '#E84D8A',
  landscapers: '#4CAF50',
};

/* =========================================================
   App
   ========================================================= */
export default function App() {
  /* ---- form state ---- */
  const [formData, setFormData] = useState({
    businessName: '',
    trade: '',
    location: '',
    currentSite: '',
    package: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ---- tweaks panel state ---- */
  const [heroVariant, setHeroVariant] = useState<'editorial' | 'blocks' | 'ticker'>('ticker');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [fonts, setFonts] = useState<'display-sans' | 'condensed-serif' | 'mono-grotesk'>('display-sans');
  const [tweaksOpen, setTweaksOpen] = useState(false);

  /* ---- process step ---- */
  const [activeStep, setActiveStep] = useState(0);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- faq open item ---- */
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* ---- Apply theme/fonts to body ---- */
  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.dataset.fonts = fonts;
  }, [theme, fonts]);

  /* ---- Process auto-advance ---- */
  useEffect(() => {
    stepTimerRef.current = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 4000);
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  /* ---- Tweaks panel: listen for editmode messages ---- */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (_) {}
    return () => window.removeEventListener('message', handler);
  }, []);

  /* ---- Scroll spy ---- */
  useEffect(() => {
    const sectionIds = ['services', 'process', 'pricing', 'faq'];
    const sections = sectionIds.map(id => document.getElementById(id));
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a[data-link]');

    function spy() {
      let activeId: string | null = null;
      const y = window.scrollY + 100;
      sections.forEach(s => { if (s && s.offsetTop <= y) activeId = s.id; });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
      });
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();
    return () => window.removeEventListener('scroll', spy);
  }, []);

  /* ---- Process fill line width ---- */
  const processFillWidth = `${((activeStep + 1) / 3) * 100}%`;

  /* ---- handleSubmit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/submit-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- setKey helper (tweaks) ---- */
  function setKey(key: string, val: string) {
    if (key === 'hero') setHeroVariant(val as typeof heroVariant);
    if (key === 'theme') setTheme(val as typeof theme);
    if (key === 'fonts') setFonts(val as typeof fonts);
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*'); } catch (_) {}
  }

  return (
    <>
      {/* ============ TAPE ============ */}
      <div className="tape">
        <div className="tape-track">
          <span>UK trades · websites that book jobs · est. 2026 · no contracts · hosting included · built in britain · fixed pricing</span>
          <span>UK trades · websites that book jobs · est. 2026 · no contracts · hosting included · built in britain · fixed pricing</span>
        </div>
      </div>

      {/* ============ NAV ============ */}
      <nav className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand">
            <span className="brand-mark"></span>
            TRADIES TOOLBOX
          </a>
          <div className="nav-links">
            <a href="#services" data-link="">Services</a>
            <a href="#process" data-link="">Process</a>
            <a href="#pricing" data-link="">Pricing</a>
            <a href="#faq" data-link="">FAQ</a>
          </div>
          <button className="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Toggle dark mode">{theme === 'light' ? (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>) : (<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>)}</button>
          <a href="#contact" className="btn btn-primary btn-sm nav-cta">Start your site <span className="btn-arrow"></span></a>
        </div>
      </nav>

      <main id="top">

        {/* ============ HERO ============ */}
        <section className="hero" data-variant={heroVariant}>
          <div className="hero-grid-bg"></div>
          <div className="container">

            {/* Variant A: Editorial split */}
            <div className="hero-editorial">
              <div className="hero-copy">
                <div className="hero-eyebrow-row">
                  <span className="dot"></span>
                  <span>Booking new projects · Spring 2026</span>
                </div>
                <h1 className="hero-title">
                  Websites<br />
                  <span className="hi">built</span><br />
                  <span className="stroke">for the trades.</span>
                </h1>
                <p className="hero-sub">
                  Proper websites for plumbers, sparks, builders &amp; everyone on the tools. Fast, findable, and built to bring jobs in while you're out fixing things.
                </p>
                <div className="hero-cta">
                  <a href="#contact" className="btn btn-primary">Start your site <span className="btn-arrow"></span></a>
                  <a href="#pricing" className="btn btn-ghost">See pricing</a>
                </div>
                <div className="hero-meta">
                  <div><span className="num">5-7d</span><span className="lbl">Go live</span></div>
                </div>
              </div>
              <div className="mockup-wrap">
                <div className="hero-float-badge b1">booking form ✓</div>
                <div className="hero-float-badge b2">#1 in local search</div>
                <div className="site-mockup">
                  <div className="mockup-bar">
                    <div className="dots"><span></span><span></span><span></span></div>
                    <div className="url">moorland-plumbing.co.uk</div>
                  </div>
                  <div className="mockup-body">
                    <div className="mock-hero">
                      <div className="mock-hero-kicker">Moorland Plumbing · Sheffield</div>
                      <div className="mock-hero-title">Emergency plumbers,<br />on call 24/7.</div>
                      <div className="mock-hero-sub">Gas Safe registered. Boilers, leaks, full refits.</div>
                    </div>
                    <div className="mock-grid">
                      <div className="mock-card"><span className="mock-icon"></span><strong>Boilers</strong></div>
                      <div className="mock-card"><span className="mock-icon"></span><strong>Bathrooms</strong></div>
                      <div className="mock-card"><span className="mock-icon"></span><strong>Leaks</strong></div>
                    </div>
                    <div className="mock-lines"><span></span><span></span><span></span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Variant B: Blocks / trade picker */}
            <div className="hero-blocks">
              <div className="hero-eyebrow-row">
                <span className="dot"></span>
                <span>Pick your trade · We build sites tuned to it</span>
              </div>
              <div className="hero-blocks-top">
                <h1 className="hero-title">
                  Your trade<br />
                  deserves a <span className="hi">proper</span><br />
                  <span className="stroke">website.</span>
                </h1>
                <p className="hero-sub">
                  Not a drag-and-drop mess. A site tuned to your trade and engineered around how your customers actually find and hire you.
                </p>
              </div>

              <div className="trade-picker">
                {Object.entries({
                  plumbers: { label: 'Plumbers', n: '01 / 06', svg: <svg viewBox="0 0 24 24"><path d="M5 4v6a4 4 0 0 0 4 4h2v6M13 4h6v6M19 10l-6 6" /></svg> },
                  electricians: { label: 'Electricians', n: '02 / 06', svg: <svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-2 8 9-12h-7z" /></svg> },
                  builders: { label: 'Builders', n: '03 / 06', svg: <svg viewBox="0 0 24 24"><path d="M3 21V9l9-6 9 6v12M9 21v-8h6v8" /></svg> },
                  roofers: { label: 'Roofers', n: '04 / 06', svg: <svg viewBox="0 0 24 24"><path d="M2 12 12 4l10 8M5 10v10h14V10" /></svg> },
                  decorators: { label: 'Decorators', n: '05 / 06', svg: <svg viewBox="0 0 24 24"><path d="M3 8h14v4H3zM7 12v8h6v-8M17 10V6a2 2 0 0 1 2-2h2" /></svg> },
                  landscapers: { label: 'Landscapers', n: '06 / 06', svg: <svg viewBox="0 0 24 24"><path d="M12 22V8M5 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7M3 22h18" /></svg> },
                }).map(([key, val]) => (
                  <button
                    key={key}
                    className="trade-pill"
                    onClick={() => {
                      document.querySelectorAll('.trade-picker .trade-pill').forEach(x => x.classList.remove('active'));
                      (document.querySelector(`.trade-pill[data-trade="${key}"]`) as HTMLElement)?.classList.add('active');
                      const c = tradeColors[key];
                      if (c) document.documentElement.style.setProperty('--hi', c);
                    }}
                    data-trade={key}
                  >
                    <span className="pill-ico">{val.svg}</span>
                    <span>{val.label}</span>
                    <span className="num">{val.n}</span>
                  </button>
                ))}
              </div>

              <div className="hero-blocks-cta">
                <div className="hero-cta">
                  <a href="#contact" className="btn btn-primary">Start your site <span className="btn-arrow"></span></a>
                  <a href="#pricing" className="btn btn-ghost">See pricing</a>
                </div>
                <div className="hero-meta">
                  <div><span className="num">5-7d</span><span className="lbl">Build time</span></div>
                </div>
              </div>
            </div>

            {/* Variant C: Ticker */}
            <div className="hero-ticker">
              <div className="hero-eyebrow-row">
                <span className="dot"></span>
                <span>Websites built for the trades · UK-wide</span>
              </div>
              <div className="ticker-row">
                <span>PLUMBERS</span>
                <span className="ticker-divider">◆</span>
                <span className="stroke">SPARKS</span>
                <span className="ticker-divider">◆</span>
                <span className="hi">BUILDERS</span>
                <span className="ticker-divider">◆</span>
                <span>ROOFERS</span>
              </div>
              <div className="ticker-row reverse">
                <span className="stroke">DECORATORS</span>
                <span className="ticker-divider">◆</span>
                <span className="hi">GAS ENGINEERS</span>
                <span className="ticker-divider">◆</span>
                <span>JOINERS</span>
                <span className="ticker-divider">◆</span>
                <span className="stroke">LANDSCAPERS</span>
              </div>
              <div className="ticker-row">
                <span className="hi">TILERS</span>
                <span className="ticker-divider">◆</span>
                <span>PLASTERERS</span>
                <span className="ticker-divider">◆</span>
                <span className="stroke">HANDYMEN</span>
                <span className="ticker-divider">◆</span>
                <span className="hi">PAVERS</span>
              </div>
              <div className="ticker-bottom">
                <p className="hero-sub">
                  Every trade gets its own tuned site — same toolbox, different tools.<br />Built in the UK, made to book jobs.
                </p>
                <div className="hero-meta">
                  <div><span className="num">5-7d</span><span className="lbl">Go live</span></div>
                  <div><span className="num">0</span><span className="lbl">Contracts</span></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ============ TRUST ============ */}
        <section className="trust">
          <div className="container trust-inner">
            <div className="trust-lbl">Trusted by trades across the UK</div>
            <div className="trust-logos">
              <div className="trust-logo"><span className="glyph"></span>GLJ PLUMBING</div>
              <div className="trust-logo"><span className="glyph circle"></span>ANDY JOHN</div>
              <div className="trust-logo"><span className="glyph diamond"></span>PARAGON</div>
              <div className="trust-logo"><span className="glyph tri"></span>GJ ISITT</div>
            </div>
          </div>
        </section>

        {/* ============ SERVICES ============ */}
        <section id="services" className="services">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">What we build · 01</div>
                <h2 className="section-title">Everything your trade needs online.</h2>
              </div>
              <p className="section-lede">
                Every package includes design, copy, and professional imagery. Pro adds the full local-SEO stack, branded kit, and growth tools.
              </p>
            </div>

            <div className="services-grid">
              <article className="svc">
                <div className="svc-num">01 / Design <span className="tick"></span></div>
                <h3>Tuned to your trade.</h3>
                <p>Hero, copy, photography and logo. Done for you, built to convert — not a template dropped into your name.</p>
                <div className="svc-tag">Included · Starter &amp; Pro</div>
              </article>

              <article className="svc is-featured">
                <div className="svc-num">02 / Local SEO <span className="tick"></span></div>
                <h3>Own every town you cover.</h3>
                <p>A dedicated page for every service and every town in your patch. Built to rank for every search that matters.</p>
                <div className="svc-tag">Pro package</div>
              </article>

              <article className="svc">
                <div className="svc-num">03 / Lead capture <span className="tick"></span></div>
                <h3>Turn visitors into calls.</h3>
                <p>Click-to-call, WhatsApp tap, contact form. Every page wired to bring the phone in — no dead ends.</p>
                <div className="svc-tag">Included · Starter &amp; Pro</div>
              </article>

              <article className="svc">
                <div className="svc-num">04 / Reviews engine <span className="tick"></span></div>
                <h3>More 5-stars, less nagging.</h3>
                <p>A print-ready card you leave on the job. Customers scan and leave a Google review in 10 seconds.</p>
                <div className="svc-tag">Pro package</div>
              </article>

              <article className="svc">
                <div className="svc-num">05 / Branded kit <span className="tick"></span></div>
                <h3>Look the part off-site too.</h3>
                <p>Branded email signature, invoice template, and 10 ready-to-post social media posts. Consistent everywhere.</p>
                <div className="svc-tag">Pro package</div>
              </article>

              <article className="svc">
                <div className="svc-num">06 / Care Plan <span className="tick"></span></div>
                <h3>Hosting, edits &amp; support.</h3>
                <p>We host it, keep it safe, and make unlimited edits for you. Cancel any time, no lock-in.</p>
                <div className="svc-tag">Add-on · £65/mo</div>
              </article>
            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section id="process" className="process">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">How it works · 02</div>
                <h2 className="section-title">Three steps. No faff.</h2>
              </div>
              <p className="section-lede">
                The whole process runs by message. No calls, no meetings, no waiting around. Most sites go from form to live in 5-7 days.
              </p>
            </div>

            <div className="process-timeline">
              <div className="process-line">
                <div className="process-line-fill" style={{ width: processFillWidth }}></div>
              </div>
              <div className="process-grid">
                {[
                  { n: '01', lbl: 'Start', h3: 'Fill in the form.', p: 'Tell us your trade, your area, and your current site if you have one. Takes 3 minutes. No follow-up call required.', dur: 'Day 1 · 3 mins' },
                  { n: '02', lbl: 'Work', h3: 'We research and build.', p: 'We analyse your competitors, extract your brand, and build a site designed to beat what\'s already out there.', dur: 'Day 2-6 · async' },
                  { n: '03', lbl: 'Launch', h3: 'Review and go live.', p: 'You get a preview link. Approve it or send feedback by message. We handle the rest — including going live on your domain.', dur: 'Day 7 · done' },
                ].map((step, i) => (
                  <article
                    key={step.n}
                    className={`step${activeStep === i ? ' active' : ''}`}
                    onClick={() => {
                      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
                      setActiveStep(i);
                      stepTimerRef.current = setInterval(() => {
                        setActiveStep(prev => (prev + 1) % 3);
                      }, 4000);
                    }}
                  >
                    <div className="step-head">
                      <div className="step-num">{step.n}</div>
                      <div className="step-lbl">{step.lbl}</div>
                    </div>
                    <h3>{step.h3}</h3>
                    <p>{step.p}</p>
                    <div className="step-dur">{step.dur}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section id="pricing" className="pricing">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">Pricing · 03</div>
                <h2 className="section-title">Simple pricing.</h2>
              </div>
              <p className="section-lede">
                One-off builds. You own the site outright. Care Plan is optional — cancel any time, no lock-in.
              </p>
            </div>

            <div className="tiers tiers-2">
              <div className="tier">
                <div className="tier-head">
                  <div>
                    <div className="tier-name">Starter</div>
                  </div>
                </div>
                <div className="tier-price">
                  <span className="cur">£</span><span className="num">497</span>
                </div>
                <p className="tier-blurb">One sharp single-page site, built to rank in your home town and turn visitors into calls. Live in 5 days.</p>
                <ul className="tier-features">
                  {[
                    'Hero pattern tuned to your trade',
                    'Ranks for your trade in your home town',
                    'Single-page site (everything on one scrolling home)',
                    'All your services on one section',
                    'Click-to-call, WhatsApp + contact form',
                    'Professional trade photography throughout',
                    'Conversion copy written for you',
                    "Simple logo included (if you don't have one)",
                    '1 round of revisions',
                    'Live in 5 days',
                  ].map(f => <li key={f}>{f}</li>)}
                </ul>
                <div className="tier-spacer"></div>
                <div className="care-addon">
                  <div className="care-title">+ Care Plan <span className="care-price">£65/mo</span> <span className="care-rec">(recommended)</span></div>
                  <div className="care-sub">Hosting, unlimited edits &amp; priority support.</div>
                </div>
                <a href="#contact" className="btn btn-ghost btn-full">Get Started <span className="btn-arrow"></span></a>
              </div>

              <div className="tier featured">
                <div className="tier-ribbon">Most Popular</div>
                <div className="tier-head">
                  <div>
                    <div className="tier-name">Pro</div>
                  </div>
                </div>
                <div className="tier-price">
                  <span className="cur">£</span><span className="num">797</span>
                </div>
                <p className="tier-blurb">Built to own every search term across every town you cover. The last website you'll ever need.</p>
                <ul className="tier-features">
                  {[
                    'Everything in Starter',
                    'A dedicated page for every service you offer (6-10 pages)',
                    'A dedicated page for every town you cover',
                    'Interactive service area map',
                    'Google Business Profile starter kit — we write it, you paste it in',
                    'Print-ready review card — customers scan, leave a Google review in 10 seconds',
                    'Branded email signature',
                    'Branded invoice PDF template',
                    '10 ready-to-post social media posts',
                    'Recent Jobs page (if you have photos)',
                    'Guaranteed to load fast on mobile',
                    'First month of AI Receptionist free when it launches',
                    'First month of Care Plan free',
                    '2 rounds of revisions',
                    'Live in 7 days',
                  ].map(f => <li key={f}>{f}</li>)}
                </ul>
                <div className="care-addon">
                  <div className="care-title">+ Care Plan <span className="care-price">£65/mo</span> <span className="care-rec">(first month free, recommended)</span></div>
                  <div className="care-sub">Hosting, unlimited edits &amp; priority support.</div>
                </div>
                <a href="#contact" className="btn btn-primary btn-full">Get Started <span className="btn-arrow"></span></a>
              </div>
            </div>

            <div className="addons">
              <div className="addons-label">Add-ons</div>
              <div className="addon-row">
                <div className="addon-name" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>AI Receptionist <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--border)', color: 'var(--muted)', borderRadius: 4, padding: '2px 6px', alignSelf: 'flex-start' }}>Coming soon</span></div>
                <div className="addon-desc">24/7 call answering, books jobs, and auto-sends review requests after every job. Pro customers get their first month free at launch.</div>
                <div className="addon-price" style={{ opacity: 0.5 }}>£97/mo</div>
              </div>
              <div className="addon-row">
                <div className="addon-name">Rush Delivery</div>
                <div className="addon-desc">24-48hr turnaround. One rush slot per week, subject to availability.</div>
                <div className="addon-price">+£197</div>
              </div>
              <div className="addon-row">
                <div className="addon-name">Care Plan</div>
                <div className="addon-desc">Hosting, SSL &amp; backups · Unlimited small edits · Monthly performance report · Same-day priority support</div>
                <div className="addon-price">£65/mo</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" className="faq">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">FAQ · 04</div>
                <h2 className="section-title">Fair questions, straight answers.</h2>
              </div>
              <p className="section-lede">
                The stuff trades actually ask us. Nothing missing? Drop us a message and we'll answer honestly — even if the honest answer is "we're not right for you."
              </p>
            </div>

            <div className="faq-grid">
              <div className="faq-side">
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Still stuck?</p>
                <h3 style={{ fontSize: 32, letterSpacing: '-0.02em', marginBottom: 24 }}>Drop us a message.</h3>
                <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28, maxWidth: '40ch' }}>
                  We reply fast, answer honestly, and won't palm you off to a chatbot.
                </p>
                <a href="#contact" className="btn btn-dark">Get in touch</a>
              </div>

              <div className="faq-list">
                {[
                  { n: '01', q: 'How long does a website take to build?', a: 'Most trade sites go from form submission to live in 5-7 days. The whole thing runs by message, so there\'s no call to book or meeting to attend — as soon as you send the form we start researching and building.' },
                  { n: '02', q: 'What do I actually need to give you?', a: 'The basics: your logo (or we\'ll make one), contact details, a rough list of services, and the areas you cover. We\'ll guide you through the rest — copy, photos, accreditations. No forms, no homework.' },
                  { n: '03', q: 'Will it actually bring in jobs?', a: 'Yes — if your trade has local demand online, a proper site puts you in front of people actively searching for your services. Most trades are losing jobs to competitors with better-looking sites, not because they\'re worse at the trade. A site that ranks and converts fixes that.' },
                  { n: '04', q: 'Do I own the website?', a: 'Yes. The domain is yours, the content is yours, and if you ever leave we\'ll hand over an export so you can move it anywhere. No lock-in, no hostage situations.' },
                  { n: '05', q: 'What if I already have a website?', a: "We'll take a look and tell you honestly whether it needs replacing or just a tune-up. Sometimes the existing site is fine and you just need SEO. We'll say so and save you money." },
                  { n: '06', q: 'Is there a long contract?', a: "The site build is a one-off payment — you own it outright. Care Plan is month-to-month, cancel any time. No auto-renew traps." },
                ].map((item, i) => (
                  <div key={item.n} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                    <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span><span className="q-num">{item.n}</span>{item.q}</span>
                      <span className="q-toggle">+</span>
                    </button>
                    <div className="faq-a">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="contact">
          <div className="container contact-grid">
            <div className="contact-left">
              <div className="eyebrow">Let's go · 05</div>
              <h2>Start your build.</h2>
              <p>Pick your package, tell us about your business, and we'll get to work. No calls, no back-and-forth.</p>
              <div className="contact-deets">
                <div className="row"><span className="lbl">Email</span><span className="val">hello@tradiestoolbox.co.uk</span></div>
                <div className="row"><span className="lbl">Based</span><span className="val">South Wales · serving UK-wide</span></div>
              </div>
            </div>

            {submitted ? (
              <div className="contact-form" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, padding: '40px 0' }}>
                  Cheers — we'll be in touch within 1 working day to get started.
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field-row">
                  <div className="field">
                    <label>Business name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Plumbing"
                      required
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Trade</label>
                    <select
                      required
                      value={formData.trade}
                      onChange={e => setFormData({ ...formData, trade: e.target.value })}
                    >
                      <option value="" disabled>Select your trade…</option>
                      <option>Plumber</option>
                      <option>Electrician</option>
                      <option>Builder</option>
                      <option>Roofer</option>
                      <option>Decorator</option>
                      <option>Landscaper</option>
                      <option>Gas Engineer</option>
                      <option>Joiner / Carpenter</option>
                      <option>Tiler</option>
                      <option>Plasterer</option>
                      <option>Handyman</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Location / service area</label>
                  <input
                    type="text"
                    placeholder="e.g. Manchester &amp; surrounding areas"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Current website <span className="field-opt">(optional)</span></label>
                  <input
                    type="url"
                    placeholder="https://www.yoursite.com"
                    value={formData.currentSite}
                    onChange={e => setFormData({ ...formData, currentSite: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Package interested in</label>
                  <select
                    required
                    value={formData.package}
                    onChange={e => setFormData({ ...formData, package: e.target.value })}
                  >
                    <option value="" disabled>Select a package…</option>
                    <option>Starter — £497</option>
                    <option>Pro — £797</option>
                    <option>Not sure — help me decide</option>
                  </select>
                </div>
                <div className="field">
                  <label>Your email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-dark btn-full btn-submit" disabled={submitting}>
                  <span className="submit-ico">➤</span> {submitting ? 'Sending…' : 'Confirm my order'}
                </button>
                {submitError && (
                  <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0, textAlign: 'center' }}>{submitError}</p>
                )}
                <p className="form-foot">
                  We'll be in touch within 1 working day to get started. No calls, no spam.{' '}
                  <Link to="/privacy">Privacy policy</Link>.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <a href="#top" className="brand">
                  <span className="brand-mark"></span>
                  TRADIES TOOLBOX
                </a>
                <p>Websites, SEO &amp; branding for UK trades. South Wales–based, working nationwide. Built to win more jobs.</p>
              </div>
              <div className="footer-col">
                <h5>Services</h5>
                <ul>
                  <li><a href="#services">Websites</a></li>
                  <li><a href="#services">Local SEO</a></li>
                  <li><a href="#services">Branding</a></li>
                  <li><a href="#services">Photography</a></li>
                  <li><a href="#services">Hosting</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Trades we serve</h5>
                <ul>
                  <li><a href="#services">Plumbers</a></li>
                  <li><a href="#services">Electricians</a></li>
                  <li><a href="#services">Builders</a></li>
                  <li><a href="#services">Roofers</a></li>
                  <li><a href="#services">Landscapers</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Company</h5>
                <ul>
                  <li><a href="#process">How it works</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li><Link to="/privacy">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <div>© 2026 Tradies Toolbox Ltd · South Wales, UK</div>
              <div>Built on the tools</div>
            </div>
          </div>
        </footer>

      </main>

      {/* ============ TWEAKS PANEL ============ */}
      <div className={`tweaks${tweaksOpen ? ' open' : ''}`}>
        <div className="tweaks-head">
          <span>Tweaks</span>
          <button className="tweaks-close" onClick={() => setTweaksOpen(false)}>×</button>
        </div>
        <div className="tweaks-row">
          <label>Hero layout</label>
          <div className="tweaks-chips">
            {(['editorial', 'blocks', 'ticker'] as const).map(v => (
              <button key={v} className={heroVariant === v ? 'active' : ''} onClick={() => setKey('hero', v)}>
                {v === 'editorial' ? 'Editorial' : v === 'blocks' ? 'Trade picker' : 'Ticker'}
              </button>
            ))}
          </div>
        </div>
        <div className="tweaks-row">
          <label>Theme</label>
          <div className="tweaks-chips">
            {(['light', 'dark'] as const).map(v => (
              <button key={v} className={theme === v ? 'active' : ''} onClick={() => setKey('theme', v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="tweaks-row">
          <label>Font pairing</label>
          <div className="tweaks-chips">
            {([
              ['display-sans', 'Archivo / Inter'],
              ['condensed-serif', 'Narrow / Fraunces'],
              ['mono-grotesk', 'Grotesk / Plex Mono'],
            ] as const).map(([v, label]) => (
              <button key={v} className={fonts === v ? 'active' : ''} onClick={() => setKey('fonts', v)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
