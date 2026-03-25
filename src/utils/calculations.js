import {
  FEDERAL_BRACKETS,
  FEDERAL_DONATION_CREDIT_LOW,
  FEDERAL_DONATION_CREDIT_HIGH,
  FEDERAL_DONATION_CREDIT_TOP,
  FEDERAL_DONATION_CREDIT_TOP_THRESHOLD,
  CAPITAL_GAINS_INCLUSION_RATE,
  PROVINCES,
} from './taxData';

// ============================================================
// Core bracket helpers
// ============================================================

/**
 * Returns the marginal rate that applies to the last dollar of income.
 */
export function getMarginalRate(income, brackets) {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income > brackets[i].min) return brackets[i].rate;
  }
  return brackets[0].rate;
}

/**
 * Calculates total income tax owed against a bracket schedule.
 */
export function calcTaxFromBrackets(income, brackets) {
  let tax = 0;
  for (const { min, max, rate } of brackets) {
    if (income <= min) break;
    tax += (Math.min(income, max) - min) * rate;
  }
  return tax;
}

// ============================================================
// Marginal rates
// ============================================================

export function getFederalMarginalRate(income) {
  return getMarginalRate(income, FEDERAL_BRACKETS);
}

export function getProvincialMarginalRate(income, provinceCode) {
  const province = PROVINCES[provinceCode];
  if (!province) return 0;
  return getMarginalRate(income, province.brackets);
}

/**
 * Combined federal + provincial marginal rate.
 * For Quebec we apply the 16.5% federal abatement to the federal portion.
 */
export function getCombinedMarginalRate(income, provinceCode) {
  let fedRate = getFederalMarginalRate(income);
  if (provinceCode === 'QC') fedRate *= (1 - 0.165);
  const provRate = getProvincialMarginalRate(income, provinceCode);
  return fedRate + provRate;
}

// ============================================================
// Donation tax credits
// ============================================================

/**
 * Federal donation tax credit on a given donation amount.
 * @param {number} donationAmount  Total eligible donation
 * @param {number} income          Taxable income (determines top-rate threshold)
 * @returns {number} Federal credit amount
 */
export function getFederalDonationCredit(donationAmount, income) {
  if (donationAmount <= 0) return 0;
  const topRate = income > FEDERAL_DONATION_CREDIT_TOP_THRESHOLD ? FEDERAL_DONATION_CREDIT_TOP : FEDERAL_DONATION_CREDIT_HIGH;
  const creditLow  = Math.min(donationAmount, 200) * FEDERAL_DONATION_CREDIT_LOW;
  const creditHigh = Math.max(0, donationAmount - 200) * topRate;
  let credit = creditLow + creditHigh;
  // QC abatement reduces federal tax; donation credit is part of federal tax reduction
  return credit;
}

/**
 * Provincial donation tax credit on a given donation amount.
 */
export function getProvincialDonationCredit(donationAmount, provinceCode) {
  if (donationAmount <= 0) return 0;
  const province = PROVINCES[provinceCode];
  if (!province) return 0;
  const creditLow  = Math.min(donationAmount, 200) * province.donationCreditLow;
  const creditHigh = Math.max(0, donationAmount - 200) * province.donationCreditHigh;
  return creditLow + creditHigh;
}

/**
 * Total combined donation tax credit (federal + provincial).
 * For QC, the federal portion is reduced by 16.5% abatement.
 */
export function getTotalDonationCredit(donationAmount, income, provinceCode) {
  let fedCredit = getFederalDonationCredit(donationAmount, income);
  if (provinceCode === 'QC') fedCredit *= (1 - 0.165);
  const provCredit = getProvincialDonationCredit(donationAmount, provinceCode);
  return fedCredit + provCredit;
}

// ============================================================
// Main donation comparison calculation
// ============================================================

/**
 * Calculates the full cash vs securities donation comparison.
 *
 * @param {object} inputs
 *   income        {number}  Annual taxable income ($)
 *   provinceCode  {string}  Province/territory code
 *   donationFMV   {number}  Fair market value of donation / cash amount ($)
 *   acb           {number}  Adjusted cost base (only relevant for securities)
 *
 * @returns {object} Detailed breakdown
 */
export function calculateDonationComparison({ income, provinceCode, donationFMV, acb }) {
  const capitalGain     = Math.max(0, donationFMV - acb);
  const marginalRate    = getCombinedMarginalRate(income, provinceCode);

  // ── Cash donation ──────────────────────────────────────────
  const cashDonationCredit = getTotalDonationCredit(donationFMV, income, provinceCode);
  const cashAfterTaxCost   = donationFMV - cashDonationCredit;

  // ── Securities donation ────────────────────────────────────
  // Receipt is for FMV; no capital gains triggered
  const secDonationCredit   = getTotalDonationCredit(donationFMV, income, provinceCode);
  const capitalGainsTaxSaved = capitalGain * CAPITAL_GAINS_INCLUSION_RATE * marginalRate;
  const secAfterTaxCost      = donationFMV - secDonationCredit - capitalGainsTaxSaved;

  // ── "Sell first, then donate" scenario ────────────────────
  // Sell securities → pay cap gains tax → donate net proceeds as cash
  const capGainsTaxIfSold  = capitalGain * CAPITAL_GAINS_INCLUSION_RATE * marginalRate;
  const netCashAfterSale   = donationFMV - capGainsTaxIfSold;
  const sellFirstCredit    = getTotalDonationCredit(netCashAfterSale, income, provinceCode);
  const sellFirstAfterTax  = netCashAfterSale - sellFirstCredit;

  // ── Rates for display ──────────────────────────────────────
  const federalMarginalRate   = getFederalMarginalRate(income);
  const provincialMarginalRate = getProvincialMarginalRate(income, provinceCode);
  const effectiveDonationRate = donationFMV > 0 ? cashDonationCredit / donationFMV : 0;

  return {
    // Inputs echoed
    income,
    provinceCode,
    donationFMV,
    acb,
    capitalGain,

    // Rates
    federalMarginalRate,
    provincialMarginalRate,
    combinedMarginalRate: marginalRate,

    // Cash scenario
    cashDonationCredit,
    cashAfterTaxCost,
    cashEffectiveCost: donationFMV > 0 ? cashAfterTaxCost / donationFMV : 0,

    // Securities scenario
    secDonationCredit,
    capitalGainsTaxSaved,
    secAfterTaxCost,
    secEffectiveCost: donationFMV > 0 ? secAfterTaxCost / donationFMV : 0,

    // Sell-first scenario
    capGainsTaxIfSold,
    netCashAfterSale,
    sellFirstCredit,
    sellFirstAfterTax,

    // Summary
    savingsVsCash: cashAfterTaxCost - secAfterTaxCost,
    savingsVsSellFirst: sellFirstAfterTax - secAfterTaxCost,
    effectiveDonationRate,
    donationCreditRate: donationFMV > 0 ? cashDonationCredit / donationFMV : 0,
  };
}

// ============================================================
// DAF Projection
// ============================================================

/**
 * Projects a Donor-Advised Fund over time.
 *
 * @param {number} initialValue   Starting fund value ($)
 * @param {number} returnRate     Annual gross investment return (decimal, e.g. 0.06)
 * @param {number} years          Projection horizon
 * @param {number} distributionRate  Annual mandatory distribution rate (default 0.05)
 *
 * @returns {Array} Year-by-year projection objects
 */
export function calculateDAFProjection(
  initialValue,
  returnRate,
  years,
  distributionRate = 0.05
) {
  const rows = [];
  let fundValue = initialValue;
  let cumulativeDistributions = 0;

  for (let year = 1; year <= years; year++) {
    const investmentGain  = fundValue * returnRate;
    const distribution    = fundValue * distributionRate;
    const endingValue     = fundValue + investmentGain - distribution;
    cumulativeDistributions += distribution;

    rows.push({
      year,
      startingValue:           Math.round(fundValue),
      investmentGain:          Math.round(investmentGain),
      distribution:            Math.round(distribution),
      endingValue:             Math.round(Math.max(0, endingValue)),
      cumulativeDistributions: Math.round(cumulativeDistributions),
    });

    fundValue = Math.max(0, endingValue);
    if (fundValue === 0) break;
  }
  return rows;
}

// ============================================================
// Formatting helpers
// ============================================================

export function formatCurrency(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return `${(value * 100).toFixed(decimals)}%`;
}
