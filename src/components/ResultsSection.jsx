import React from 'react';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { PROVINCES } from '../utils/taxData';

function StatRow({ label, value, highlight, indent }) {
  return (
    <div className={`flex justify-between items-center py-2 ${indent ? 'pl-4' : ''} ${highlight ? 'font-semibold' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-navy-900' : 'text-navy-600'}`}>{label}</span>
      <span className={`text-sm tabular-nums ${highlight ? 'text-navy-900 font-bold' : 'text-navy-800'}`}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-navy-100 my-1" />;
}

function ScenarioCard({ title, badge, badgeColor, icon, rows, footerLabel, footerValue, footerColor, highlight }) {
  return (
    <div className={`rounded-2xl border-2 p-5 flex flex-col gap-1 ${highlight ? 'border-navy-700 shadow-md' : 'border-navy-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-bold text-navy-900 leading-tight">{title}</p>
          {badge && (
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="divide-y divide-navy-100">
        {rows.map((row, i) =>
          row.divider ? (
            <Divider key={i} />
          ) : (
            <StatRow key={i} {...row} />
          )
        )}
      </div>
      {footerLabel && (
        <div className={`mt-3 pt-3 border-t-2 border-dashed border-navy-200 flex justify-between items-center`}>
          <span className="text-sm font-bold text-navy-800">{footerLabel}</span>
          <span className={`text-base font-extrabold ${footerColor || 'text-navy-900'}`}>{footerValue}</span>
        </div>
      )}
    </div>
  );
}

export default function ResultsSection({ results, donationType }) {
  if (!results) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-8 text-center">
        <div className="text-5xl mb-4">🍁</div>
        <p className="text-navy-500 text-sm">
          Fill in your details above to see your personalized tax savings analysis.
        </p>
      </div>
    );
  }

  const {
    income, provinceCode,
    donationFMV, acb, capitalGain,
    federalMarginalRate, provincialMarginalRate, combinedMarginalRate,
    cashDonationCredit, cashAfterTaxCost, cashEffectiveCost,
    secDonationCredit, capitalGainsTaxSaved, secAfterTaxCost, secEffectiveCost,
    capGainsTaxIfSold, netCashAfterSale, sellFirstCredit, sellFirstAfterTax,
    savingsVsCash, savingsVsSellFirst,
  } = results;

  const provinceName = PROVINCES[provinceCode]?.name || provinceCode;
  const showSecurities = donationType === 'securities' && capitalGain > 0;

  const cashRows = [
    { label: 'Donation amount',          value: formatCurrency(donationFMV) },
    { label: 'Federal donation credit',  value: `(${formatCurrency(cashDonationCredit * (federalMarginalRate / combinedMarginalRate), 0)})`, indent: true },
    { label: 'Provincial donation credit', value: `(${formatCurrency(cashDonationCredit * (provincialMarginalRate / combinedMarginalRate), 0)})`, indent: true },
    { divider: true },
    { label: 'Total donation tax credit', value: `(${formatCurrency(cashDonationCredit)})`, highlight: true },
  ];

  const secRows = [
    { label: 'FMV donated (receipt value)', value: formatCurrency(donationFMV) },
    { label: 'Adjusted cost base',          value: formatCurrency(acb) },
    { label: 'Capital gain',                value: formatCurrency(capitalGain) },
    { divider: true },
    { label: 'Donation tax credit',         value: `(${formatCurrency(secDonationCredit)})` },
    { label: 'Capital gains tax saved',     value: `(${formatCurrency(capitalGainsTaxSaved)})`, highlight: true },
  ];

  const sellRows = [
    { label: 'Proceeds from sale',          value: formatCurrency(donationFMV) },
    { label: 'Capital gains tax payable',   value: `(${formatCurrency(capGainsTaxIfSold)})` },
    { label: 'Net cash available to donate', value: formatCurrency(netCashAfterSale) },
    { divider: true },
    { label: 'Donation tax credit',         value: `(${formatCurrency(sellFirstCredit)})` },
  ];

  return (
    <div className="space-y-6">
      {/* Marginal Rate Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-5 md:p-6">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Your Tax Profile</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Federal marginal rate',   value: formatPercent(federalMarginalRate) },
            { label: `${provinceName} marginal rate`, value: formatPercent(provincialMarginalRate) },
            { label: 'Combined marginal rate',  value: formatPercent(combinedMarginalRate) },
            { label: 'Effective donation credit', value: formatPercent(cashDonationCredit / donationFMV) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-navy-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-navy-800">{value}</p>
              <p className="text-xs text-navy-500 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Cards */}
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-4">Donation Comparison</h2>
        <div className={`grid gap-4 ${showSecurities ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 max-w-2xl'}`}>

          {/* Cash */}
          <ScenarioCard
            title="Cash Donation"
            icon="💵"
            highlight={!showSecurities}
            rows={cashRows}
            footerLabel="Your after-tax cost"
            footerValue={formatCurrency(cashAfterTaxCost)}
          />

          {/* Securities */}
          {showSecurities && (
            <ScenarioCard
              title="Donate Securities"
              badge="Best option"
              badgeColor="bg-emerald-100 text-emerald-800"
              icon="📈"
              highlight={true}
              rows={secRows}
              footerLabel="Your after-tax cost"
              footerValue={formatCurrency(secAfterTaxCost)}
              footerColor="text-emerald-700"
            />
          )}

          {/* Sell first, then donate */}
          {showSecurities && (
            <ScenarioCard
              title="Sell Securities, Then Donate Cash"
              icon="🔄"
              rows={sellRows}
              footerLabel="Your after-tax cost"
              footerValue={formatCurrency(sellFirstAfterTax)}
            />
          )}
        </div>
      </div>

      {/* Savings Callout */}
      {showSecurities && savingsVsCash > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div className="flex-1">
              <p className="font-extrabold text-emerald-900 text-lg">
                You save {formatCurrency(savingsVsCash)} by donating securities instead of cash
              </p>
              <p className="text-emerald-700 text-sm mt-1">
                Donating appreciated securities directly to charity eliminates capital gains tax entirely —
                a strategy unavailable with cash donations.
              </p>
            </div>
            <div className="bg-emerald-600 text-white rounded-xl p-4 text-center min-w-[120px]">
              <p className="text-3xl font-black">{formatPercent(savingsVsCash / donationFMV)}</p>
              <p className="text-xs font-semibold mt-1 opacity-90">of gift value saved</p>
            </div>
          </div>

          {savingsVsSellFirst > 0 && (
            <div className="mt-4 pt-4 border-t border-emerald-200 text-sm text-emerald-800">
              <strong>vs. sell-first strategy:</strong> You save an additional {formatCurrency(savingsVsSellFirst)} because
              your donation receipt is based on the full FMV rather than the after-tax proceeds.
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-navy-400 text-center leading-relaxed">
        For illustrative purposes only. Based on 2024 federal and provincial tax rates. Does not account for
        surtaxes, alternative minimum tax, or other credits. Consult a qualified tax professional before making
        financial decisions.
      </p>
    </div>
  );
}
