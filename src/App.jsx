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
    <header className="bg-navy-900 sticky top-0 z-30 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-2xl">🍁</span>
          <div>
            <p className="text-white font-extrabold text-sm leading-tight">Philanthropy Calculator</p>
            <p className="text-navy-400 text-xs leading-tight">Canadian Charitable Giving Tax Tool</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-navy-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-navy-700 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#report"
          className="flex-shrink-0 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow"
        >
          Free Report ⬇
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white py-14 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-navy-700 border border-navy-600 text-navy-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
          <span>🇨🇦</span> Canadian Tax Calculator — 2024 Rates
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
          Give More. Keep More.<br />
          <span className="text-gold-400">Donate Smarter.</span>
        </h1>
        <p className="text-navy-200 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Discover how donating appreciated securities instead of cash can slash your after-tax
          cost — and how a Donor-Advised Fund turns your gift into a lasting legacy.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#calculator"
            className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg"
          >
            Calculate My Savings →
          </a>
          <a
            href="#daf"
            className="bg-navy-700 hover:bg-navy-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors border border-navy-600"
          >
            Explore DAF Projections
          </a>
        </div>
        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-navy-400">
          {[
            '✓ All 13 provinces & territories',
            '✓ 2024 federal & provincial rates',
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
    { icon: '📄', title: 'Download your report', desc: 'Get a PDF to share with your advisor — free, no spam.' },
  ];
  return (
    <section className="bg-white py-10 px-4 border-b border-navy-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {steps.map(({ icon, title, desc }, i) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-3 text-2xl shadow-sm border border-navy-100">
                {icon}
              </div>
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wide mb-1">Step {i + 1}</div>
              <p className="font-bold text-navy-900 text-sm mb-1">{title}</p>
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
      <div className="w-9 h-9 rounded-xl bg-navy-800 text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow">
        {step}
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-navy-900">{title}</h2>
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
            title="Calculate Your Tax Savings"
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
            title="Model Your Donor-Advised Fund"
            subtitle="See how your charitable gift grows and distributes over time with a 5% annual payout."
          />
          <DAFProjection initialValue={dafInitialValue} />
        </section>

        {/* ── Step 3: Lead Magnet ─────────────────────────── */}
        <section>
          <SectionHeading
            id="report"
            step="3"
            title="Get Your Free Philanthropy Report"
            subtitle="Download a personalized PDF — perfect for sharing with your tax advisor or estate planner."
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
      <footer className="bg-navy-900 text-navy-400 py-8 px-4 mt-10">
        <div className="max-w-5xl mx-auto text-center text-xs space-y-2">
          <p className="font-semibold text-navy-300">Canadian Philanthropy Tax Calculator</p>
          <p>
            Based on 2024 federal and provincial tax rates. For illustrative purposes only.
            Not tax, legal, or investment advice.
          </p>
          <p>Always consult a qualified Canadian tax professional before making charitable giving decisions.</p>
        </div>
      </footer>
    </div>
  );
}
