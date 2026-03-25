// ============================================================
// Canadian Federal & Provincial Tax Data — 2024 Tax Year
// ============================================================

export const FEDERAL_BRACKETS = [
  { min: 0,       max: 55867,   rate: 0.15   },
  { min: 55867,   max: 111733,  rate: 0.205  },
  { min: 111733,  max: 154906,  rate: 0.26   },
  { min: 154906,  max: 220000,  rate: 0.29   },
  { min: 220000,  max: Infinity, rate: 0.33  },
];

// Capital gains inclusion rate (50% for individuals, 2024)
// Note: The 2024 budget proposed 2/3 for gains over $250,000 but the
// implementation was paused. This calculator uses the 50% rate.
export const CAPITAL_GAINS_INCLUSION_RATE = 0.50;

// Federal donation tax credit rates
// First $200: 15%, Over $200: 29% (or 33% if marginal rate is 33%)
export const FEDERAL_DONATION_CREDIT_LOW  = 0.15;
export const FEDERAL_DONATION_CREDIT_HIGH = 0.29;
export const FEDERAL_DONATION_CREDIT_TOP  = 0.33; // for income >$220,000

// ============================================================
// Provincial / Territorial Tax Data
// Each province: name, income brackets, donation credit rates
// donationCreditLow  = rate on first $200
// donationCreditHigh = rate on donations over $200
// ============================================================
export const PROVINCES = {
  AB: {
    name: 'Alberta',
    brackets: [
      { min: 0,       max: 148269,  rate: 0.10  },
      { min: 148269,  max: 177922,  rate: 0.12  },
      { min: 177922,  max: 237230,  rate: 0.13  },
      { min: 237230,  max: 355845,  rate: 0.14  },
      { min: 355845,  max: Infinity, rate: 0.15 },
    ],
    donationCreditLow:  0.10,
    donationCreditHigh: 0.21,
  },
  BC: {
    name: 'British Columbia',
    brackets: [
      { min: 0,       max: 45654,   rate: 0.0506 },
      { min: 45654,   max: 91310,   rate: 0.077  },
      { min: 91310,   max: 104835,  rate: 0.105  },
      { min: 104835,  max: 127299,  rate: 0.1229 },
      { min: 127299,  max: 172602,  rate: 0.147  },
      { min: 172602,  max: 240716,  rate: 0.168  },
      { min: 240716,  max: Infinity, rate: 0.205 },
    ],
    donationCreditLow:  0.0506,
    donationCreditHigh: 0.168,
  },
  MB: {
    name: 'Manitoba',
    brackets: [
      { min: 0,       max: 36842,   rate: 0.108  },
      { min: 36842,   max: 79625,   rate: 0.1275 },
      { min: 79625,   max: Infinity, rate: 0.174 },
    ],
    donationCreditLow:  0.108,
    donationCreditHigh: 0.174,
  },
  NB: {
    name: 'New Brunswick',
    brackets: [
      { min: 0,       max: 47715,   rate: 0.094  },
      { min: 47715,   max: 95431,   rate: 0.1482 },
      { min: 95431,   max: 176756,  rate: 0.1652 },
      { min: 176756,  max: Infinity, rate: 0.195 },
    ],
    donationCreditLow:  0.094,
    donationCreditHigh: 0.195,
  },
  NL: {
    name: 'Newfoundland & Labrador',
    brackets: [
      { min: 0,       max: 43198,   rate: 0.087  },
      { min: 43198,   max: 86395,   rate: 0.145  },
      { min: 86395,   max: 154244,  rate: 0.158  },
      { min: 154244,  max: 215943,  rate: 0.178  },
      { min: 215943,  max: 275870,  rate: 0.198  },
      { min: 275870,  max: 551739,  rate: 0.208  },
      { min: 551739,  max: Infinity, rate: 0.213 },
    ],
    donationCreditLow:  0.087,
    donationCreditHigh: 0.213,
  },
  NS: {
    name: 'Nova Scotia',
    brackets: [
      { min: 0,       max: 29590,   rate: 0.0879 },
      { min: 29590,   max: 59180,   rate: 0.1495 },
      { min: 59180,   max: 93000,   rate: 0.1667 },
      { min: 93000,   max: 150000,  rate: 0.175  },
      { min: 150000,  max: Infinity, rate: 0.21  },
    ],
    donationCreditLow:  0.0879,
    donationCreditHigh: 0.21,
  },
  NT: {
    name: 'Northwest Territories',
    brackets: [
      { min: 0,       max: 50597,   rate: 0.059  },
      { min: 50597,   max: 101198,  rate: 0.086  },
      { min: 101198,  max: 164525,  rate: 0.122  },
      { min: 164525,  max: Infinity, rate: 0.1405},
    ],
    donationCreditLow:  0.059,
    donationCreditHigh: 0.1405,
  },
  NU: {
    name: 'Nunavut',
    brackets: [
      { min: 0,       max: 53268,   rate: 0.04  },
      { min: 53268,   max: 106537,  rate: 0.07  },
      { min: 106537,  max: 173205,  rate: 0.09  },
      { min: 173205,  max: Infinity, rate: 0.115},
    ],
    donationCreditLow:  0.04,
    donationCreditHigh: 0.115,
  },
  ON: {
    name: 'Ontario',
    brackets: [
      { min: 0,       max: 51446,   rate: 0.0505 },
      { min: 51446,   max: 102894,  rate: 0.0915 },
      { min: 102894,  max: 150000,  rate: 0.1116 },
      { min: 150000,  max: 220000,  rate: 0.1216 },
      { min: 220000,  max: Infinity, rate: 0.1316},
    ],
    donationCreditLow:  0.0505,
    donationCreditHigh: 0.1116,
  },
  PE: {
    name: 'Prince Edward Island',
    brackets: [
      { min: 0,       max: 32656,   rate: 0.0965  },
      { min: 32656,   max: 64313,   rate: 0.1363  },
      { min: 64313,   max: 105000,  rate: 0.1665  },
      { min: 105000,  max: 140000,  rate: 0.18    },
      { min: 140000,  max: Infinity, rate: 0.1875 },
    ],
    donationCreditLow:  0.0965,
    donationCreditHigh: 0.1875,
  },
  QC: {
    name: 'Quebec',
    // Note: QC has a federal tax abatement (16.5% of basic federal tax).
    // For simplicity we treat QC provincial rates as standalone. Users in QC
    // should consult a tax professional for exact figures.
    brackets: [
      { min: 0,       max: 51780,   rate: 0.14   },
      { min: 51780,   max: 103545,  rate: 0.19   },
      { min: 103545,  max: 126000,  rate: 0.24   },
      { min: 126000,  max: Infinity, rate: 0.2575},
    ],
    donationCreditLow:  0.20,
    donationCreditHigh: 0.24,
    hasAbatement: true, // federal abatement reduces federal tax by 16.5%
  },
  SK: {
    name: 'Saskatchewan',
    brackets: [
      { min: 0,       max: 49720,   rate: 0.105  },
      { min: 49720,   max: 142058,  rate: 0.125  },
      { min: 142058,  max: Infinity, rate: 0.145 },
    ],
    donationCreditLow:  0.105,
    donationCreditHigh: 0.145,
  },
  YT: {
    name: 'Yukon',
    brackets: [
      { min: 0,       max: 55867,   rate: 0.064  },
      { min: 55867,   max: 111733,  rate: 0.09   },
      { min: 111733,  max: 154906,  rate: 0.109  },
      { min: 154906,  max: 500000,  rate: 0.128  },
      { min: 500000,  max: Infinity, rate: 0.15  },
    ],
    donationCreditLow:  0.064,
    donationCreditHigh: 0.128,
  },
};

export const PROVINCE_LIST = Object.entries(PROVINCES)
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name));
