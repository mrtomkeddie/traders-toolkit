import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Star,
  Check,
  Send,
  Zap,
  Globe,
  ExternalLink,
  Clock,
  Mic,
} from 'lucide-react';
import { Magnetic, Reveal, CountUp, TiltCard } from './animations';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

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

  const portfolio: { name: string; trade: string; location: string; tier: 'Starter' | 'Pro'; url: string | null; description: string; previewDesktop: string | null; previewMobile: string | null }[] = [
    {
      name: 'GLJ Plumbing',
      trade: 'Plumber & Bathroom Specialist',
      location: 'Llanelli, South Wales',
      tier: 'Pro',
      url: 'https://glj-plumbing-portfolio.netlify.app/',
      description: 'Family-run plumbers established 1993. Five-page build with dedicated Services, About and Areas pages, real Yell reviews, Plumber-specific schema, and a mobile-first sticky call bar.',
      previewDesktop: '/glj-preview-desktop.png',
      previewMobile: '/glj-preview-mobile.png',
    },
  ];

  return (
    <div className="min-h-screen font-sans text-brand-dark selection:bg-brand-orange selection:text-white">

      {/* Nav */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/Logo (black).svg" alt="Tradies Toolbox" className="h-9 w-auto" />
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#how-it-works" className="hover:text-brand-orange transition-colors">How It Works</a>
            <a href="#portfolio" className="hover:text-brand-orange transition-colors">Our Work</a>
            <a href="#pricing" className="hover:text-brand-orange transition-colors">Pricing</a>
            <a href="#start-build" className="bg-brand-dark text-white px-5 py-2.5 rounded-full hover:bg-brand-orange transition-colors font-semibold shadow-lg shadow-brand-dark/10">
              Start Your Build
            </a>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-display font-bold">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#portfolio" onClick={() => setMobileMenuOpen(false)}>Our Work</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#start-build" onClick={() => setMobileMenuOpen(false)} className="bg-brand-orange text-white px-6 py-4 rounded-xl mt-4 text-center">
                Start Your Build
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:22px_22px] opacity-40" />
        <div className="absolute top-0 right-0 -z-10 w-[900px] h-[900px] bg-brand-orange/[0.06] rounded-full blur-3xl translate-x-1/4 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 -z-10 w-[700px] h-[700px] bg-brand-dark/[0.04] rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand-dark font-semibold text-sm mb-6 border border-gray-200 shadow-sm">
              <Zap className="w-4 h-4 text-brand-orange" />
              For UK tradies
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-[2.5rem] sm:text-6xl lg:text-8xl font-bold leading-[1.02] tracking-[-0.03em] mb-6 max-w-5xl mx-auto"
            >
              Websites built
              <br />
              <span className="whitespace-nowrap">for the <span className="serif-accent text-brand-orange">trades</span>.</span>
              <br />
              <span className="text-brand-slate">Booked jobs, not busywork.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base lg:text-lg text-brand-slate mb-8 leading-relaxed max-w-2xl mx-auto">
              Ranked on Google. Built to turn visits into calls.
              <br />
              Delivered fully async — no meetings, no time off the tools.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Magnetic strength={0.12}>
                <a href="#start-build" className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-bold text-base hover:bg-[#e66000] transition-colors shadow-xl shadow-brand-orange/25 inline-flex items-center justify-center gap-2">
                  Start Your Build <ArrowRight className="w-5 h-5" />
                </a>
              </Magnetic>
              <Magnetic strength={0.08}>
                <a href="#pricing" className="bg-white text-brand-dark border border-gray-200 px-10 py-5 rounded-2xl font-bold text-base hover:border-brand-dark transition-colors inline-flex items-center justify-center gap-2 shadow-sm">
                  View Pricing
                </a>
              </Magnetic>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-brand-dark font-semibold justify-center">
              {['Trades only', 'You own the site', 'Fully async', 'AI-powered'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-[18px] h-[18px] text-brand-orange" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Numbers strip */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: 5, suffix: '', label: 'Day delivery' },
            { n: 100, suffix: '%', label: 'Bespoke builds' },
            { n: 3, suffix: '', label: 'Sites live' },
            { n: 0, suffix: '', label: 'Sales calls' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="text-5xl lg:text-6xl font-bold tracking-tight">
                <CountUp end={s.n} suffix={s.suffix} />
              </div>
              <div className="text-sm text-brand-slate mt-2 font-medium uppercase tracking-wider">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-5 tracking-[-0.025em]">
              How it <span className="serif-accent text-brand-orange">works</span>
            </h2>
            <p className="text-xl text-brand-slate leading-relaxed">The whole process runs by message. No calls, no meetings, no waiting around.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: '1',
                icon: <Globe className="w-6 h-6" />,
                title: 'Fill in the form',
                body: 'Tell us your trade, your area, and your current site if you have one. Takes 3 minutes.',
              },
              {
                n: '2',
                icon: <Wrench className="w-6 h-6" />,
                title: 'We research and build',
                body: "We analyse your competitors, extract your brand, and build a site designed to beat what's already out there.",
              },
              {
                n: '3',
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: 'Review and go live',
                body: "You get a preview link. Approve it or send feedback by message. We handle the rest — including going live on your domain.",
                highlight: true,
              },
            ].map(step => (
              <motion.div
                key={step.n}
                whileHover={{ y: -4 }}
                className={`rounded-3xl p-8 border ${step.highlight ? 'bg-brand-orange text-white border-brand-orange shadow-xl shadow-brand-orange/20' : 'bg-gray-50 border-gray-100'}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-6 font-display font-bold text-lg ${step.highlight ? 'bg-white text-brand-orange' : 'bg-brand-dark text-white'}`}>
                  {step.n}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className={`leading-relaxed text-sm ${step.highlight ? 'text-orange-50' : 'text-brand-slate'}`}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-32 lg:py-40 bg-brand-light border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-5 tracking-[-0.025em]">
              Our <span className="serif-accent text-brand-orange">work</span>
            </h2>
            <p className="text-xl text-brand-slate leading-relaxed">Every site is built from scratch — researched, designed, and optimised for local search.</p>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {portfolio.map((p, i) => {
              const tierClass = p.tier === 'Pro'
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
              return (
              <Reveal key={p.name} delay={i * 0.08}>
                <article className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-dark/5 border border-gray-100 flex flex-col h-full">
                  {/* Desktop preview with browser chrome */}
                  <div className="bg-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2 px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono truncate border border-gray-200">
                        {p.url ?? 'coming soon'}
                      </div>
                    </div>
                    <div className="bg-white">
                      {p.previewDesktop ? (
                        <img
                          src={p.previewDesktop}
                          alt={`${p.name} desktop website preview`}
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-brand-slate bg-gray-50 py-32">
                          <Globe className="w-8 h-8 opacity-30" />
                          <span className="text-xs font-medium opacity-50">Coming soon</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom row: phone mockup + body */}
                  <div className="grid sm:grid-cols-[auto_1fr] gap-8 p-8 flex-1">
                    {/* Phone mockup */}
                    <div className="flex sm:block justify-center">
                      <div className="relative bg-brand-dark rounded-[2rem] p-1.5 shadow-xl shadow-brand-dark/20" style={{ width: '160px' }}>
                        <div className="bg-white rounded-[1.5rem] overflow-hidden" style={{ aspectRatio: '600 / 1300' }}>
                          {p.previewMobile ? (
                            <img
                              src={p.previewMobile}
                              alt={`${p.name} mobile website preview`}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-slate bg-gray-50">
                              <Globe className="w-6 h-6 opacity-30" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-xl leading-tight">{p.name}</h3>
                          <p className="text-sm text-brand-slate mt-1">{p.trade} · {p.location}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${tierClass}`}>{p.tier}</span>
                      </div>
                      <p className="text-base text-brand-slate leading-relaxed mb-6 flex-1">{p.description}</p>
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange link-underline self-start"
                        >
                          View live site <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-slate opacity-50">
                          <Clock className="w-4 h-4" /> Deploying soon
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 lg:py-40 bg-brand-light border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-5 tracking-[-0.025em]">
              Simple <span className="serif-accent text-brand-orange">pricing</span>
            </h2>
            <p className="text-xl text-brand-slate leading-relaxed">
              One-off builds. You own the site outright.
              <br />
              Care Plan is optional — cancel any time, no lock-in.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Starter */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Starter</h3>
              <div className="text-4xl font-display font-bold mb-1">£497</div>
              <p className="text-sm text-brand-slate mb-6">One sharp single-page site, built to rank in your home town and turn visitors into calls. Live in 5 days.</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                {[
                  'Bespoke design — no templates',
                  'Ranks for your trade in your home town',
                  'Single-page site (everything on one scrolling home)',
                  'All your services on one section',
                  'Click-to-call, WhatsApp + contact form',
                  'Professional trade photography throughout',
                  'Conversion copy written for you',
                  'Simple logo included (if you don\'t have one)',
                  '1 round of revisions',
                  'Live in 5 days',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mb-4 p-3 rounded-xl bg-brand-light border border-dashed border-gray-300 text-xs">
                <span className="font-bold text-brand-dark">+ Care Plan £65/mo</span>
                <span className="text-brand-slate"> (recommended)</span>
                <div className="text-brand-slate mt-0.5">Hosting, unlimited edits & priority support.</div>
              </div>
              <a href="#start-build" className="block text-center bg-gray-100 text-brand-dark font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                Get Started
              </a>
            </div>

            {/* Pro */}
            <div className="bg-brand-dark text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <div className="text-4xl font-display font-bold mb-1">£797</div>
              <p className="text-sm text-gray-300 mb-6">Built to own every search term across every town you cover. The last website you'll ever need.</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-200">
                {[
                  'Everything in Starter',
                  'A dedicated page for every service you offer (6–10 pages)',
                  'A dedicated page for every town you cover',
                  'Interactive service area map',
                  'Google Business Profile starter kit — we write it, you paste it in',
                  'Print-ready review card — customers scan, leave a Google review in 10 seconds',
                  'Branded email signature',
                  'Branded invoice PDF template',
                  '10 ready-to-post social media posts',
                  'Recent Jobs page (if you have photos)',
                  'Guaranteed to load fast on mobile',
                  'First month of AI Receptionist free (launching soon)',
                  'First month of Care Plan free',
                  '2 rounds of revisions',
                  'Live in 7 days',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mb-4 p-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-xs">
                <span className="font-bold text-white">+ Care Plan £65/mo</span>
                <span className="text-gray-400"> (first month free, recommended)</span>
                <div className="text-gray-400 mt-0.5">Hosting, unlimited edits & priority support.</div>
              </div>
              <a href="#start-build" className="block text-center bg-brand-orange text-white font-bold py-3.5 rounded-xl hover:bg-[#e66000] transition-colors shadow-lg shadow-brand-orange/20 text-sm">
                Get Started
              </a>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-2xl">
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-brand-slate">Add-ons</h4>
            <div className="space-y-3">
              {[
                { label: 'AI Receptionist', desc: '24/7 call answering, books jobs, and auto-sends review requests after every job. Launching soon — Pro customers get their first month free at launch', price: '£97/mo' },
                { label: 'Rush Delivery', desc: '24–48hr turnaround. One rush slot per week, subject to availability.', price: '+£197' },
                { label: 'Care Plan', desc: 'Hosting, SSL & backups · Unlimited small edits · Monthly performance report · Same-day priority support', price: '£65/mo' },
              ].map(a => (
                <div key={a.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="font-bold text-sm">{a.label}</span>
                    <span className="text-brand-slate text-sm ml-2">{a.desc}</span>
                  </div>
                  <span className="font-bold text-brand-orange text-sm">{a.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="results" className="py-32 lg:py-40 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-5 tracking-[-0.025em]">
              Real <span className="serif-accent text-brand-orange">results</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">What trades businesses say after going live.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "Didn't have to sit through a single sales call. Filled in the form on my lunch break, had a preview site in 5 days. Best money I've spent on marketing.",
                name: 'Mike T.',
                role: 'Owner, Precision Plumbing',
              },
              {
                quote: "The site looks properly professional — way better than what I had on Wix. Already had 3 enquiries in the first week from Google.",
                name: 'Dave R.',
                role: 'Apex Roofing Solutions',
              },
            ].map(t => (
              <div key={t.name} className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="flex gap-1 text-brand-orange mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg font-medium mb-8 leading-relaxed text-gray-200">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Receptionist teaser */}
      <section className="py-20 lg:py-24 bg-brand-dark text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider mb-4">
                  <Mic className="w-3.5 h-3.5 text-brand-orange" />
                  Coming Soon
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold tracking-[-0.02em] mb-3">
                  AI Receptionist — never miss a job again.
                </h3>
                <p className="text-gray-300 leading-relaxed max-w-xl">
                  Answers your calls 24/7, qualifies leads, books jobs into your calendar, and sends review requests after every job. Pro customers get their first month free at launch.
                </p>
              </div>
              <a href="#start-build" className="shrink-0 inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-bold px-7 py-4 rounded-2xl hover:bg-[#e66000] transition-colors shadow-lg shadow-brand-orange/20">
                Join the Waitlist <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Get Started Form */}
      <section id="start-build" className="py-32 lg:py-40 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14">
            <h2 className="text-5xl lg:text-6xl font-bold mb-4 tracking-[-0.025em]">
              Start your <span className="serif-accent text-brand-orange">build</span>
            </h2>
            <p className="text-lg text-brand-slate">
              Pick your package, tell us about your business, and we'll get to work.
              <br />
              No calls, no back-and-forth.
            </p>
          </Reveal>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">You're in — we'll be in touch!</h3>
              <p className="text-brand-slate text-sm">We've received your order. We'll kick off your build within 1 working day.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-1.5">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Plumbing"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">Trade</label>
                  <select
                    required
                    value={formData.trade}
                    onChange={e => setFormData({ ...formData, trade: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all appearance-none text-sm"
                  >
                    <option value="">Select your trade...</option>
                    {['Plumber', 'Electrician', 'Roofer', 'HVAC / Heating Engineer', 'Carpenter', 'Builder', 'Landscaper', 'Other'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">Location / Service Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manchester & surrounding areas"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">Current Website <span className="font-normal text-brand-slate">(optional)</span></label>
                <input
                  type="url"
                  placeholder="https://www.yoursite.com"
                  value={formData.currentSite}
                  onChange={e => setFormData({ ...formData, currentSite: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">Package Interested In</label>
                <select
                  required
                  value={formData.package}
                  onChange={e => setFormData({ ...formData, package: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all appearance-none text-sm"
                >
                  <option value="">Select a package...</option>
                  <option>Starter — £497</option>
                  <option>Pro — £797</option>
                  <option>Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
              >
                {submitting ? 'Processing...' : <><Send className="w-4 h-4" /> Confirm My Order</>}
              </button>

              {submitError && (
                <p className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-2 px-3">{submitError}</p>
              )}
              <p className="text-xs text-center text-brand-slate">We'll be in touch within 1 working day to get started. No calls, no spam.</p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-gray-400 py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <img src="/Logo (white).svg" alt="Tradies Toolbox" className="h-7 w-auto" />
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Our Work</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <p className="text-xs">© 2026 Tradies Toolbox. tradiestoolbox.co.uk</p>
        </div>
      </footer>

    </div>
  );
}
