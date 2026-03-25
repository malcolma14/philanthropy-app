import React from 'react';
import { PROVINCE_LIST } from '../utils/taxData';

const DONATION_TYPES = [
  {
    id: 'securities',
    label: 'Appreciated Securities',
    description: 'Stocks, mutual funds, or ETFs with unrealized gains',
    icon: '📈',
  },
  {
    id: 'cash',
    label: 'Cash',
    description: 'A direct cash gift from your bank account',
    icon: '💵',
  },
];

function CurrencyInput({ id, label, value, onChange, helpText, min = 0 }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    onChange(raw === '' ? '' : parseFloat(raw) || 0);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-800 mb-1">
        {label}
      </label>
      {helpText && <p className="text-xs text-navy-500 mb-2">{helpText}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500 font-medium">$</span>
        <input
          id={id}
          type="number"
          min={min}
          value={value}
          onChange={handleChange}
          className="w-full pl-7 pr-4 py-3 border border-navy-200 rounded-lg text-navy-900 placeholder-navy-400
                     focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent
                     transition-colors"
          placeholder="0"
        />
      </div>
    </div>
  );
}

export default function InputSection({ inputs, onChange }) {
  const { donationType, income, provinceCode, donationFMV, acb } = inputs;

  const set = (key) => (val) => onChange({ ...inputs, [key]: val });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-navy-900 mb-1">Your Donation Details</h2>
      <p className="text-sm text-navy-500 mb-6">
        Enter your information to calculate the after-tax value of your charitable gift.
      </p>

      {/* Donation Type Toggle */}
      <div className="mb-6">
        <p className="block text-sm font-semibold text-navy-800 mb-3">What are you donating?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DONATION_TYPES.map(({ id, label, description, icon }) => (
            <button
              key={id}
              onClick={() => set('donationType')(id)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                donationType === id
                  ? 'border-navy-700 bg-navy-50'
                  : 'border-navy-200 bg-white hover:border-navy-400'
              }`}
            >
              <span className="text-2xl mt-0.5">{icon}</span>
              <div>
                <p className={`font-semibold text-sm ${donationType === id ? 'text-navy-800' : 'text-navy-700'}`}>
                  {label}
                </p>
                <p className="text-xs text-navy-500 mt-0.5">{description}</p>
              </div>
              {donationType === id && (
                <span className="ml-auto text-navy-700 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Province */}
        <div>
          <label htmlFor="province" className="block text-sm font-semibold text-navy-800 mb-1">
            Province / Territory
          </label>
          <p className="text-xs text-navy-500 mb-2">Where you file your tax return</p>
          <select
            id="province"
            value={provinceCode}
            onChange={(e) => set('provinceCode')(e.target.value)}
            className="w-full px-3 py-3 border border-navy-200 rounded-lg text-navy-900 bg-white
                       focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent
                       transition-colors"
          >
            <option value="">Select province…</option>
            {PROVINCE_LIST.map(({ code, name }) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        {/* Income */}
        <CurrencyInput
          id="income"
          label="Annual Taxable Income"
          helpText="Your net income before donation deductions"
          value={income}
          onChange={set('income')}
        />

        {/* FMV */}
        <CurrencyInput
          id="donationFMV"
          label={donationType === 'securities' ? 'Current Market Value (FMV)' : 'Cash Donation Amount'}
          helpText={
            donationType === 'securities'
              ? 'Fair market value of the securities you wish to donate'
              : 'Total cash amount you plan to donate'
          }
          value={donationFMV}
          onChange={set('donationFMV')}
        />

        {/* ACB — only for securities */}
        {donationType === 'securities' && (
          <CurrencyInput
            id="acb"
            label="Adjusted Cost Base (ACB)"
            helpText="Original purchase price plus any reinvested distributions"
            value={acb}
            onChange={set('acb')}
            min={0}
          />
        )}
      </div>

      {/* QC note */}
      {provinceCode === 'QC' && (
        <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <strong>Quebec note:</strong> Quebec has a unique federal tax abatement of 16.5%. This calculator
          applies that abatement to your federal donation credit and marginal rate. For precise figures,
          please consult a tax professional.
        </div>
      )}

      {/* Capital gains note */}
      {donationType === 'securities' && (
        <div className="mt-4 p-3 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-700">
          <strong>Capital gains inclusion rate:</strong> This calculator uses the 50% inclusion rate for
          individuals (2024). The 2024 federal budget proposed an increase to 2/3 for gains over $250,000,
          but implementation was paused — consult a tax advisor for current rules.
        </div>
      )}
    </div>
  );
}
