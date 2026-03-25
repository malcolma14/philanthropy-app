import React, { useState, useMemo } from 'react';
import InputSection    from './components/InputSection';
import ResultsSection  from './components/ResultsSection';
import DAFProjection   from './components/DAFProjection';
import LeadMagnet      from './components/LeadMagnet';
import { calculateDonationComparison } from './utils/calculations';

const DEFAULT_INPUTS = {
  donationType: 'securities',
  income:       150000,
  provinceCode: 'ON',
  donationFMV:  50000,
  acb:          10000,
};

const NAV_LINKS = [
  { href: '#calculator', label: 'Calculator' },
  { href: '#daf',        label: 'DAF Projection' },
  { href: '#report',     label: 'Get Report' },
];

function Header() {
  return (
    <header className="bg-white sticky top-0 z-30 shadow border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo + brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}Logo_E_IG_WM_RGB.png`}
            alt="IG Wealth Management"
            className="h-8 w-auto"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div>
            <p className="font-extrabold text-sm leading-tight text-ig-dark">
              Adam Malcolm | Strategic Generosity Blueprint™
            </p>
            <p className="text-xs leading-tight text-ig-blue">
              IG Wealth Management
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-ig-dark hover:text-ig-blue text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#report"
          className="flex-shrink-0 bg-ig-blue hover:opacity-90 text-white text-xs font-bold px-3 py-2 rounded-lg transition-opacity shadow"
        >
          Get Report ⬇
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="text-white py-14 px-4" style={{ background: 'linear-gradient(135deg, #001E60 0%, #0072CE 100%)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
          <span>🇨🇦</span> Canadian Tax Calculator — 2026 Rates
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-3">
          Give More. Keep More.<br />
          <span className="text-ig-light">Donate Smarter.</span>
        </h1>
        <p className="text-white/80 text-base sm:text-lg font-semibold italic mb-5">
          Secure your family. Enjoy your money. Give the rest away.
        </p>
        <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
          Most donors don't realise how much the structure of their giving affects what they actually keep —
          and what the charity actually receives. This tool illustrates the difference between three common
          donation strategies, and shows how a Donor-Advised Fund can turn a one-time gift into a long-term
          philanthropic legacy. It's for illustration purposes only — but the numbers are real.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#calculator"
            className="text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg border-2 border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20"
          >
            Calculate My Savings →
          </a>
          <a
            href="#daf"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors border border-white/20"
          >
            Explore DAF Projections
          </a>
        </div>
        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-white/50">
          {[
            '✓ All 13 provinces & territories',
            '✓ 2026 federal & provincial rates',
            '✓ Securities vs cash comparison',
            '✓ Free — no signup required to calculate',
          ].map((b) => <span key={b}>{b}</span>)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: '📝', title: 'Enter your details', desc: 'Income, province, and donation amount — takes 30 seconds.' },
    { icon: '📊', title: 'See your tax savings', desc: 'Instant comparison of cash vs. donating securities directly.' },
    { icon: '🏦', title: 'Model your DAF', desc: 'See how a Donor-Advised Fund compounds your charitable impact over decades.' },
    { icon: '📄', title: 'Download your summary', desc: 'Get a PDF to share with your advisor — free, no spam.' },
  ];
  return (
    <section className="bg-white py-10 px-4 border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {steps.map(({ icon, title, desc }, i) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-sm border border-blue-100" style={{ backgroundColor: '#EBF5FF' }}>
                {icon}
              </div>
              <div className="text-xs font-bold uppercase tracking-wide mb-1 text-ig-blue">Step {i + 1}</div>
              <p className="font-bold text-ig-dark text-sm mb-1">{title}</p>
              <p className="text-navy-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ id, step, title, subtitle }) {
  return (
    <div id={id} className="flex items-start gap-3 mb-5 scroll-mt-20">
      <div className="w-9 h-9 rounded-xl text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow bg-ig-blue">
        {step}
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-ig-dark">{title}</h2>
        {subtitle && <p className="text-sm text-navy-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [dafReturnRate] = useState(0.06);
  const [dafYears]      = useState(20);

  const results = useMemo(() => {
    const { income, provinceCode, donationFMV, acb, donationType } = inputs;
    if (!income || !provinceCode || !donationFMV) return null;
    const effectiveAcb = donationType === 'cash' ? donationFMV : (acb || 0);
    try {
      return calculateDonationComparison({
        income:       Number(income),
        provinceCode,
        donationFMV:  Number(donationFMV),
        acb:          Number(effectiveAcb),
      });
    } catch {
      return null;
    }
  }, [inputs]);

  const dafInitialValue = inputs.donationFMV ? Number(inputs.donationFMV) : 50000;

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-14">

        {/* ── Step 1: Calculator ──────────────────────────── */}
        <section>
          <SectionHeading
            id="calculator"
            step="1"
            title="What each strategy costs you after tax"
            subtitle="Compare the after-tax cost of donating cash vs. appreciated securities."
          />
          <div className="space-y-6">
            <InputSection inputs={inputs} onChange={setInputs} />
            <ResultsSection results={results} donationType={inputs.donationType} />
          </div>
        </section>

        {/* ── Step 2: DAF Projection ──────────────────────── */}
        <section>
          <SectionHeading
            id="daf"
            step="2"
            title="What a Donor-Advised Fund could look like over time"
            subtitle="See how your charitable gift grows and distributes with a 5% annual payout."
          />
          <DAFProjection initialValue={dafInitialValue} />
        </section>

        {/* ── Step 3: Lead Magnet ─────────────────────────── */}
        <section>
          <SectionHeading
            id="report"
            step="3"
            title="Get your personalised summary"
            subtitle="Download a PDF of your results — perfect for sharing with your advisor."
          />
          <LeadMagnet
            inputs={inputs}
            results={results}
            dafReturnRate={dafReturnRate}
            dafYears={dafYears}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="text-white py-6 px-4 mt-10" style={{ backgroundColor: '#001E60' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
            {/* Left */}
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}Logo_E_IG_WM_RGB.png`}
                alt="IG Wealth Management"
                className="h-6 w-auto brightness-0 invert"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-white/60">IG Wealth Management</span>
            </div>
            {/* Centre */}
            <div className="text-center text-white/70">
              © 2026 Adam Malcolm | IG Wealth Management |{' '}
              <a
                href="https://successfultogenerous.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                successfultogenerous.com
              </a>
            </div>
            {/* Right */}
            <div className="text-white/50 sm:text-right">
              This tool is for educational purposes only and does not constitute financial or tax advice.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
