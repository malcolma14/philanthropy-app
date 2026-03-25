// ============================================================
// Canadian Federal & Provincial / Territorial Tax Data
// ============================================================
//
// SOURCE: https://www.canada.ca/en/revenue-agency/services/tax/individuals/
//         frequently-asked-questions-individuals/canadian-income-tax-rates-
//         individuals-current-previous-years.html
//         Also verified against EY Canada 2026 Personal Tax Calculator
//         (eytaxcalculators.com, rates as of January 15, 2026), KPMG Canada
//         2026 tax rate tables, and provincial government sources.
//
// LAST VERIFIED: March 2026
//
// UPDATE CADENCE: CRA typically updates federal rates each February following
//                 the federal budget. Provincial rates change with each
//                 provincial budget (typically Feb–May). Verify and update
//                 this file annually.
//
// TAX YEAR: 2026
//
// CHANGES FROM PRIOR VERSION (2024 file with errors):
//   Federal:  Lowest rate reduced to 14% (full year 2026; was 14.5% blended
//             in 2025 and 15% in 2024). All bracket thresholds corrected and
//             updated to 2026 indexed values. Prior file had incorrect 3rd/4th
//             bracket thresholds ($154,906 / $220,000 — were pre-2024 values).
//   Alberta:  New 8% first bracket introduced Jan 1, 2025, indexed to ~$61,200
//             for 2026. donationCreditLow changed from 10% to 8%.
//   BC:       Lowest rate increased from 5.06% to 5.60% per BC Budget 2026.
//             All bracket thresholds indexed 2.2% for 2026.
//   Manitoba: Bracket thresholds corrected to current values (prior file had
//             2022-era thresholds). 2026 = 2025 (frozen indexation per MB budget).
//   NB:       Thresholds indexed 2% for 2026.
//   NL:       New 8th bracket (21.8% on income >$1,128,858) added.
//             donationCreditHigh updated from 21.3% to 21.8%.
//   NT/NU:    Thresholds updated to 2026 indexed values.
//   ON:       Thresholds updated to 2026 (1.9% indexation applied).
//   PE:       Top rate confirmed at 19% (increased from 18.75%).
//             Thresholds indexed ~1.8% for 2026.
//   QC:       Thresholds indexed 2.05% for 2026.
//   SK:       Thresholds indexed 2% for 2026.
//   YT:       Thresholds corrected to mirror 2026 federal bracket thresholds.
// ============================================================

export const TAX_YEAR = 2026;
export const LAST_VERIFIED = 'March 2026';

// 2026 federal income tax brackets
export const FEDERAL_BRACKETS = [
  { min: 0,       max: 58523,    rate: 0.14   },
  { min: 58523,   max: 117045,   rate: 0.205  },
  { min: 117045,  max: 181440,   rate: 0.26   },
  { min: 181440,  max: 258482,   rate: 0.29   },
  { min: 258482,  max: Infinity, rate: 0.33   },
];

// Capital gains inclusion rate (50% for individuals, 2026)
// Note: The 2024 federal budget proposed 2/3 for gains over $250,000 but
// implementation was paused. This calculator uses the 50% rate.
export const CAPITAL_GAINS_INCLUSION_RATE = 0.50;

// Federal donation tax credit rates (2026)
// First $200 at the lowest bracket rate (14%), over $200 at 29%
// (or 33% if the taxpayer's marginal federal rate is 33%)
export const FEDERAL_DONATION_CREDIT_LOW  = 0.14;
export const FEDERAL_DONATION_CREDIT_HIGH = 0.29;
export const FEDERAL_DONATION_CREDIT_TOP  = 0.33; // for income > $258,482

// Used in calculations.js to determine when the 33% top credit rate applies
export const FEDERAL_DONATION_CREDIT_TOP_THRESHOLD = 258482;

// ============================================================
// Provincial / Territorial Tax Data — 2026
// Each province: name, income brackets, donation credit rates
// donationCreditLow  = rate on first $200 of donations
// donationCreditHigh = rate on donations over $200
// ============================================================
export const PROVINCES = {
  AB: {
    name: 'Alberta',
    // New 8% first bracket introduced Jan 2025; indexed 2% to ~$61,200 for 2026
    brackets: [
      { min: 0,       max: 61200,    rate: 0.08  },
      { min: 61200,   max: 151234,   rate: 0.10  },
      { min: 151234,  max: 181480,   rate: 0.12  },
      { min: 181480,  max: 241975,   rate: 0.13  },
      { min: 241975,  max: 362962,   rate: 0.14  },
      { min: 362962,  max: Infinity, rate: 0.15  },
    ],
    donationCreditLow:  0.08,  // lowest bracket rate (changed from 10% with new bracket)
    donationCreditHigh: 0.21,
  },
  BC: {
    name: 'British Columbia',
    // Lowest rate increased 5.06% → 5.60% per BC Budget 2026 (effective Jan 1, 2026)
    // All thresholds indexed 2.2% from 2025
    brackets: [
      { min: 0,       max: 50363,    rate: 0.056  },
      { min: 50363,   max: 100769,   rate: 0.077  },
      { min: 100769,  max: 115687,   rate: 0.105  },
      { min: 115687,  max: 140430,   rate: 0.1229 },
      { min: 140430,  max: 190385,   rate: 0.147  },
      { min: 190385,  max: 265545,   rate: 0.168  },
      { min: 265545,  max: Infinity, rate: 0.205  },
    ],
    donationCreditLow:  0.056,  // updated with new lowest rate
    donationCreditHigh: 0.168,
  },
  MB: {
    name: 'Manitoba',
    // 2026 = 2025 (indexation frozen per Manitoba budget; 2025 values corrected
    // from prior file which had old 2022-era thresholds)
    brackets: [
      { min: 0,       max: 47564,    rate: 0.108  },
      { min: 47564,   max: 101200,   rate: 0.1275 },
      { min: 101200,  max: Infinity, rate: 0.174  },
    ],
    donationCreditLow:  0.108,
    donationCreditHigh: 0.174,
  },
  NB: {
    name: 'New Brunswick',
    // Indexed 2% for 2026
    brackets: [
      { min: 0,       max: 48669,    rate: 0.094  },
      { min: 48669,   max: 97340,    rate: 0.1482 },
      { min: 97340,   max: 180291,   rate: 0.1652 },
      { min: 180291,  max: Infinity, rate: 0.195  },
    ],
    donationCreditLow:  0.094,
    donationCreditHigh: 0.195,
  },
  NL: {
    name: 'Newfoundland & Labrador',
    // 8th bracket added (21.8% on income > $1,128,858); thresholds indexed 1.1% for 2026
    brackets: [
      { min: 0,        max: 44192,    rate: 0.087  },
      { min: 44192,    max: 88382,    rate: 0.145  },
      { min: 88382,    max: 157792,   rate: 0.158  },
      { min: 157792,   max: 220910,   rate: 0.178  },
      { min: 220910,   max: 282214,   rate: 0.198  },
      { min: 282214,   max: 564429,   rate: 0.208  },
      { min: 564429,   max: 1128858,  rate: 0.213  },
      { min: 1128858,  max: Infinity, rate: 0.218  },
    ],
    donationCreditLow:  0.087,
    donationCreditHigh: 0.218,  // updated: new top bracket is 21.8%
  },
  NS: {
    name: 'Nova Scotia',
    // Rates unchanged; brackets not significantly indexed (NS uses own schedule)
    brackets: [
      { min: 0,       max: 29590,    rate: 0.0879 },
      { min: 29590,   max: 59180,    rate: 0.1495 },
      { min: 59180,   max: 93000,    rate: 0.1667 },
      { min: 93000,   max: 150000,   rate: 0.175  },
      { min: 150000,  max: Infinity, rate: 0.21   },
    ],
    donationCreditLow:  0.0879,
    donationCreditHigh: 0.21,
  },
  NT: {
    name: 'Northwest Territories',
    // Indexed 2% for 2026
    brackets: [
      { min: 0,       max: 53003,    rate: 0.059  },
      { min: 53003,   max: 106009,   rate: 0.086  },
      { min: 106009,  max: 172346,   rate: 0.122  },
      { min: 172346,  max: Infinity, rate: 0.1405 },
    ],
    donationCreditLow:  0.059,
    donationCreditHigh: 0.1405,
  },
  NU: {
    name: 'Nunavut',
    // Indexed 2.7% for 2026
    brackets: [
      { min: 0,       max: 56181,    rate: 0.04  },
      { min: 56181,   max: 112367,   rate: 0.07  },
      { min: 112367,  max: 182683,   rate: 0.09  },
      { min: 182683,  max: Infinity, rate: 0.115 },
    ],
    donationCreditLow:  0.04,
    donationCreditHigh: 0.115,
  },
  ON: {
    name: 'Ontario',
    // Indexed 1.9% for 2026; $150,000 and $220,000 thresholds not indexed
    brackets: [
      { min: 0,       max: 53890,    rate: 0.0505 },
      { min: 53890,   max: 107782,   rate: 0.0915 },
      { min: 107782,  max: 150000,   rate: 0.1116 },
      { min: 150000,  max: 220000,   rate: 0.1216 },
      { min: 220000,  max: Infinity, rate: 0.1316 },
    ],
    donationCreditLow:  0.0505,
    donationCreditHigh: 0.1116,
  },
  PE: {
    name: 'Prince Edward Island',
    // Top rate confirmed at 19% (increased from 18.75%); thresholds indexed ~1.8% for 2026
    brackets: [
      { min: 0,       max: 33928,    rate: 0.0965  },
      { min: 33928,   max: 65497,    rate: 0.1363  },
      { min: 65497,   max: 105000,   rate: 0.1665  },
      { min: 105000,  max: 140000,   rate: 0.18    },
      { min: 140000,  max: Infinity, rate: 0.19    },
    ],
    donationCreditLow:  0.0965,
    donationCreditHigh: 0.19,   // updated: top rate now 19%
  },
  QC: {
    name: 'Quebec',
    // Note: QC has a federal tax abatement (16.5% of basic federal tax).
    // For simplicity we treat QC provincial rates as standalone. Users in QC
    // should consult a tax professional for exact figures.
    // Thresholds indexed 2.05% for 2026
    brackets: [
      { min: 0,       max: 54345,    rate: 0.14   },
      { min: 54345,   max: 108690,   rate: 0.19   },
      { min: 108690,  max: 132245,   rate: 0.24   },
      { min: 132245,  max: Infinity, rate: 0.2575 },
    ],
    donationCreditLow:  0.20,
    donationCreditHigh: 0.24,
    hasAbatement: true, // federal abatement reduces federal tax by 16.5%
  },
  SK: {
    name: 'Saskatchewan',
    // Indexed 2% for 2026
    brackets: [
      { min: 0,       max: 54532,    rate: 0.105  },
      { min: 54532,   max: 155805,   rate: 0.125  },
      { min: 155805,  max: Infinity, rate: 0.145  },
    ],
    donationCreditLow:  0.105,
    donationCreditHigh: 0.145,
  },
  YT: {
    name: 'Yukon',
    // Yukon bracket thresholds mirror federal — updated to 2026 federal thresholds
    brackets: [
      { min: 0,       max: 58523,    rate: 0.064  },
      { min: 58523,   max: 117045,   rate: 0.09   },
      { min: 117045,  max: 181440,   rate: 0.109  },
      { min: 181440,  max: 500000,   rate: 0.128  },
      { min: 500000,  max: Infinity, rate: 0.15   },
    ],
    donationCreditLow:  0.064,
    donationCreditHigh: 0.128,
  },
};

export const PROVINCE_LIST = Object.entries(PROVINCES)
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name));
