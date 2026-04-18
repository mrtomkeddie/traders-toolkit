import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans text-brand-dark bg-brand-light">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/">
            <img src="/Logo (black).svg" alt="Tradies Toolbox" className="h-8 w-auto" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-brand-slate hover:text-brand-dark transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-[-0.025em] mb-4">Privacy Policy</h1>
        <p className="text-brand-slate text-sm mb-12">Last updated: 18 April 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-brand-dark/80">
          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Who we are</h2>
            <p>
              Tradies Toolbox is a web design service for UK trades businesses. We build websites, provide hosting, and offer related digital services. This policy explains how we handle your data when you use our website at tradiestoolbox.co.uk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">What we collect</h2>
            <p className="mb-3">We collect the following information when you submit our enquiry form:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Business name</li>
              <li>Trade</li>
              <li>Location / service area</li>
              <li>Current website URL (if provided)</li>
              <li>Package preference</li>
              <li>Email address</li>
            </ul>
            <p className="mt-3">
              We also collect basic analytics data (page views, referral source, country) through Vercel Analytics. This data is anonymous and cannot identify you personally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">How we use it</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your enquiry and deliver the service you've requested</li>
              <li>To communicate with you about your project via email or WhatsApp</li>
              <li>To improve our website based on anonymous usage data</li>
            </ul>
            <p className="mt-3">We do not sell, share, or pass your data to third parties for marketing purposes. Ever.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Where your data is stored</h2>
            <p>
              Form submissions are processed through our API and stored in Airtable (hosted in the US, GDPR-compliant under their Data Processing Agreement). Our website is hosted on Vercel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">How long we keep it</h2>
            <p>
              We keep your enquiry data for as long as we have a business relationship with you, or until you ask us to delete it. If we don't end up working together, we'll delete your data within 12 months of your enquiry.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Cookies</h2>
            <p>
              We do not use marketing cookies, tracking pixels, or third-party advertising scripts. Vercel Analytics is cookie-free and privacy-compliant by default.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Your rights</h2>
            <p className="mb-3">Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the data we hold about you</li>
              <li>Ask us to correct or delete your data</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the ICO (ico.org.uk)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Contact</h2>
            <p>
              To request access to your data or ask us to delete it, email{' '}
              <a href="mailto:hello@tradiestoolbox.co.uk" className="text-brand-orange font-medium hover:underline">
                hello@tradiestoolbox.co.uk
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-gray-400 py-10 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/">
            <img src="/Logo (white).svg" alt="Tradies Toolbox" className="h-7 w-auto" />
          </Link>
          <p className="text-xs">&copy; 2026 Tradies Toolbox. tradiestoolbox.co.uk</p>
        </div>
      </footer>
    </div>
  );
}
