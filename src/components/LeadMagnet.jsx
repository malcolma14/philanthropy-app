import React, { useState } from 'react';
import { generatePDF } from '../utils/pdfGenerator';

const BENEFITS = [
  '📊 Full tax breakdown — cash vs. securities vs. sell-first',
  '📈 Your personalized DAF projection table (year-by-year)',
  '🏛️ Province-specific marginal rates and donation credits',
  '⚖️ Important disclosures and notes for your advisor',
];

export default function LeadMagnet({ inputs, results, dafReturnRate, dafYears }) {
  const [name,         setName]         = useState('');
  const [email,        setEmail]        = useState('');
  const [subscribe,    setSubscribe]    = useState(true);
  const [status,       setStatus]       = useState('idle'); // idle | generating | success | error
  const [errorMsg,     setErrorMsg]     = useState('');

  const canSubmit = email.includes('@') && results;

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('generating');
    setErrorMsg('');

    try {
      // Small delay so the UI updates before heavy PDF work
      await new Promise((r) => setTimeout(r, 50));

      const doc = generatePDF({
        name,
        email,
        inputs,
        results,
        dafReturnRate,
        dafYears,
      });

      const filename = `philanthropy-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);

      // ── Mailing list integration hook ──────────────────────
      // Replace this block with your actual API call, e.g.:
      //   await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ name, email }) })
      // or integrate Mailchimp, ConvertKit, Klaviyo, etc.
      if (subscribe && email) {
        console.info('[Lead Magnet] Would subscribe:', email, 'to mailing list.');
        // TODO: replace with real integration
      }

      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong generating your PDF. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-700 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 md:p-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            <span>✉️</span> Free Download
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
            Get Your Personalized<br />Philanthropy Tax Report
          </h2>
          <p className="text-navy-200 text-sm md:text-base mb-6 leading-relaxed">
            Receive a print-ready PDF summarizing your custom calculations — perfect for sharing
            with your financial advisor, accountant, or philanthropic advisor.
          </p>

          {/* Benefits */}
          <ul className="text-left mb-7 space-y-2 max-w-sm mx-auto">
            {BENEFITS.map((b) => (
              <li key={b} className="text-sm text-navy-100 flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">{b.slice(0, 2)}</span>
                <span>{b.slice(3)}</span>
              </li>
            ))}
          </ul>

          {status === 'success' ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-extrabold text-emerald-900 text-lg mb-1">Your report is downloading!</h3>
              <p className="text-emerald-700 text-sm">
                Check your downloads folder for your personalized philanthropy report.
                {subscribe && (
                  <> We'll be in touch with more charitable giving strategies and tax tips.</>
                )}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs text-emerald-600 underline"
              >
                Download again
              </button>
            </div>
          ) : (
            <form onSubmit={handleDownload} className="space-y-4 text-left max-w-sm mx-auto">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">
                  Your name <span className="text-navy-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-navy-600 text-white
                             placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400
                             focus:border-transparent text-sm transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-navy-600 text-white
                             placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400
                             focus:border-transparent text-sm transition-colors"
                />
              </div>

              {/* Subscribe checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={subscribe}
                    onChange={(e) => setSubscribe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded bg-navy-800 border-2 border-navy-500 peer-checked:bg-gold-500 peer-checked:border-gold-500 transition-colors flex items-center justify-center">
                    {subscribe && (
                      <svg className="w-3 h-3 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-navy-300 leading-relaxed">
                  Sign me up for charitable giving strategies, tax tips, and philanthropy insights.
                  Unsubscribe anytime.
                </span>
              </label>

              {!results && (
                <p className="text-amber-300 text-xs text-center">
                  Complete your donation details above first to generate a report.
                </p>
              )}

              {errorMsg && (
                <p className="text-red-400 text-xs text-center">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit || status === 'generating'}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all
                  ${canSubmit && status !== 'generating'
                    ? 'bg-gold-500 hover:bg-gold-400 text-navy-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-navy-600 text-navy-400 cursor-not-allowed'
                  }`}
              >
                {status === 'generating' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating your report…
                  </span>
                ) : (
                  '⬇ Download My Free Report'
                )}
              </button>

              <p className="text-xs text-navy-400 text-center">
                Your email is never sold or shared. One click to unsubscribe.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-navy-900 px-6 py-4 text-center">
        <p className="text-xs text-navy-400">
          This tool is for educational purposes. Always consult a qualified Canadian tax or financial
          advisor before making charitable giving decisions.
        </p>
      </div>
    </div>
  );
}
