# Canadian Philanthropy Tax Calculator

A single-page web app that helps Canadian donors understand the tax implications of charitable giving — comparing cash donations vs. donating appreciated securities, modelling multi-year Donor-Advised Fund (DAF) projections, and generating downloadable PDF reports.

**Live:** https://malcolma14.github.io/philanthropy-app/

---

## What It Does

The core insight: donating appreciated securities directly to a Canadian charity is often far more tax-efficient than donating cash or selling first, because the donor avoids capital gains tax while still receiving a full donation tax credit.

The app walks users through three steps:

1. **Calculate Tax Savings** — compare after-tax cost across three donation strategies
2. **Model a DAF Projection** — simulate how a Donor-Advised Fund grows and distributes over time
3. **Get a Report** — enter name/email to download a personalized PDF summary

---

## Features

### Tax Calculator (`#calculator`)

- Toggle between **Appreciated Securities** or **Cash** donation type
- Select any of the **13 Canadian provinces/territories**
- Enter annual taxable income, donation FMV, and ACB (for securities)
- Displays three side-by-side scenarios:
  - **Cash Donation** — federal + provincial donation credit breakdown
  - **Donate Securities** — credits + capital gains tax avoided (marked "Best option" when superior)
  - **Sell First, Then Donate** — net cash after sale, then credit
- Shows marginal tax rates, effective donation credit rate, and dollar savings

Special handling for **Quebec's 16.5% federal abatement** and the **2024 capital gains inclusion rate** (50%; proposed 2/3 for gains >$250k noted but paused).

### DAF Projection (`#daf`)

Interactive sliders for:
- Initial contribution ($10k–$1M)
- Annual investment return (4%–7%)
- Time horizon (5–30 years)

Displays:
- **Area chart** — fund value over time with conservative (4%), selected, and optimistic (7%) scenarios
- **Bar chart** — annual 5% mandatory distributions and cumulative impact
- **Summary stats** — total distributed, remaining fund value, total philanthropic impact
- **Collapsible year-by-year table**

### PDF Report (`#report`)

- Optional name + required email input
- Generates a 3-page PDF via jsPDF:
  - Page 1: Tax profile + 3-scenario comparison table + savings callout
  - Page 2: DAF year-by-year projection table + summary
  - Page 3: Disclaimers (educational use, tax rate caveats, Quebec notes)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Styling |
| Recharts 2 | Charts (AreaChart, BarChart) |
| jsPDF + jspdf-autotable | PDF generation |

---

## Project Structure

```
src/
├── App.jsx                  # Layout, section order, shared input state
├── main.jsx                 # React entry point
├── components/
│   ├── InputSection.jsx     # Donation form inputs
│   ├── ResultsSection.jsx   # Tax comparison display
│   ├── DAFProjection.jsx    # Fund projection charts & table
│   └── LeadMagnet.jsx       # PDF download form
└── utils/
    ├── calculations.js      # Tax logic & DAF math
    ├── taxData.js           # 2024 federal/provincial brackets & credits
    └── pdfGenerator.js      # 3-page PDF generation
```

---

## Core Calculations

### Donation Comparison (`calculations.js`)

`calculateDonationComparison(inputs)` returns:

- **Tax rates**: federal, provincial, combined marginal rates
- **Cash scenario**: donation credit, after-tax cost
- **Securities scenario**: donation credit + capital gains tax saved, after-tax cost
- **Sell-first scenario**: capital gains tax on sale, net cash, then credit, after-tax cost
- **Savings**: dollar and percentage difference between strategies

### DAF Projection

`calculateDAFProjection(initialValue, returnRate, years)` returns a year-by-year array:

```js
{ year, startingValue, investmentGain, distribution, endingValue, cumulativeDistributions }
```

Assumes **5% mandatory annual distribution** (Canadian DAF requirement).

### Tax Data (`taxData.js`)

- 2024 federal brackets: 5 tiers, 15%–33%
- Federal donation credits: 15% on first $200, 29%–33% above
- All 13 provinces/territories: income brackets + provincial donation credit rates

---

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `claude/donation-tax-calculator-02YvK`.

Workflow: `.github/workflows/deploy.yml`
- Builds with `npm run build`
- Uploads `dist/` as a Pages artifact
- Deploys via `actions/deploy-pages`

Vite is configured with `base: '/philanthropy-app/'` for correct asset paths on GitHub Pages.

---

## Disclaimer

This tool is for **educational and illustrative purposes only**. It does not constitute financial or tax advice. Users should consult a qualified tax professional for their specific situation.
