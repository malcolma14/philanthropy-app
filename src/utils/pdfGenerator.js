import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatPercent, calculateDAFProjection } from './calculations';
import { PROVINCES, LAST_VERIFIED } from './taxData';

const IG_DARK  = [0, 30, 96];      // #001E60
const IG_BLUE  = [0, 114, 206];    // #0072CE
const IG_LIGHT = [141, 208, 239];  // #8DD0EF
const LIGHT    = [235, 245, 255];  // light blue bg
const WHITE    = [255, 255, 255];
const TEXT     = [44, 62, 80];
const GRAY     = [100, 116, 139];

const HEADER_TEXT   = 'Adam Malcolm, CFP, MFA-P  |  IG Wealth Management  |  Strategic Generosity Blueprint\u2122';
const FOOTER_DISC   = 'This report is for educational and illustrative purposes only and does not constitute financial or tax advice. Consult a qualified advisor for your specific situation.  |  successfultogenerous.com';
const FOOTER_RATES  = `Tax rates sourced from the Canada Revenue Agency (canada.ca/en/revenue-agency). Last verified: ${LAST_VERIFIED}. Rates are updated annually \u2014 confirm current-year rates with your advisor.`;

function addHeader(doc, pageWidth) {
  doc.setFillColor(...IG_DARK);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(HEADER_TEXT, pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...IG_LIGHT);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 19);

  doc.setTextColor(...IG_LIGHT);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Based on 2026 federal & provincial tax rates', pageWidth - 15, 19, { align: 'right' });
}

function addFooter(doc, pageNumber, pageWidth, pageHeight) {
  const footerY = pageHeight - 16;

  doc.setFillColor(245, 248, 252);
  doc.rect(0, footerY - 4, pageWidth, 20, 'F');

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text(FOOTER_DISC, pageWidth / 2, footerY + 1, { align: 'center', maxWidth: pageWidth - 30 });
  doc.text(FOOTER_RATES, pageWidth / 2, footerY + 6, { align: 'center', maxWidth: pageWidth - 30 });
  doc.text(`Page ${pageNumber}`, pageWidth - 15, footerY + 1, { align: 'right' });
}

function sectionTitle(doc, text, y) {
  doc.setFillColor(...IG_BLUE);
  doc.rect(15, y, 5, 6, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...IG_DARK);
  doc.text(text, 22, y + 5);
  return y + 12;
}

export function generatePDF({ name, email, inputs, results, dafReturnRate = 0.06, dafYears = 20 }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 34;

  addHeader(doc, pageWidth);

  // ── Recipient Info ─────────────────────────────────────────
  if (name || email) {
    doc.setFillColor(...LIGHT);
    doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT);
    if (name)  doc.text(`Prepared for: ${name}`,  20, y + 6);
    if (email) doc.text(`Email: ${email}`, 20, y + 12);
    y += 22;
  }

  // ── Tax Profile ────────────────────────────────────────────
  y = sectionTitle(doc, '1. Your Tax Profile', y);

  const provinceName = PROVINCES[inputs.provinceCode]?.name || inputs.provinceCode;

  doc.autoTable({
    startY: y,
    margin: { left: 15, right: 15 },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: IG_DARK, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: LIGHT },
    head: [['Parameter', 'Value']],
    body: [
      ['Annual Taxable Income', formatCurrency(inputs.income)],
      ['Province / Territory', provinceName],
      ['Federal Marginal Rate', formatPercent(results.federalMarginalRate)],
      [`${provinceName} Marginal Rate`, formatPercent(results.provincialMarginalRate)],
      ['Combined Marginal Rate', formatPercent(results.combinedMarginalRate)],
    ],
  });
  y = doc.lastAutoTable.finalY + 8;

  // ── Donation Comparison ────────────────────────────────────
  y = sectionTitle(doc, '2. Donation Comparison', y);

  const comparisonBody = [
    ['Donation / FMV', formatCurrency(inputs.donationFMV), formatCurrency(inputs.donationFMV), formatCurrency(inputs.donationFMV)],
    ['Adjusted Cost Base (ACB)', '—', formatCurrency(inputs.acb), formatCurrency(inputs.acb)],
    ['Capital Gain', '—', formatCurrency(results.capitalGain), formatCurrency(results.capitalGain)],
    ['Capital Gains Tax Avoided', '—', formatCurrency(results.capitalGainsTaxSaved), '—'],
    ['Capital Gains Tax Paid', '—', '—', `(${formatCurrency(results.capGainsTaxIfSold)})`],
    ['Donation Tax Credit', `(${formatCurrency(results.cashDonationCredit)})`, `(${formatCurrency(results.secDonationCredit)})`, `(${formatCurrency(results.sellFirstCredit)})`],
    ['After-Tax Cost', formatCurrency(results.cashAfterTaxCost), formatCurrency(results.secAfterTaxCost), formatCurrency(results.sellFirstAfterTax)],
    ['Effective Cost as % of Gift', formatPercent(results.cashEffectiveCost), formatPercent(results.secEffectiveCost), formatPercent(results.sellFirstAfterTax / inputs.donationFMV)],
  ];

  doc.autoTable({
    startY: y,
    margin: { left: 15, right: 15 },
    styles: { fontSize: 8.5, cellPadding: 3 },
    headStyles: { fillColor: IG_DARK, textColor: WHITE, fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fillColor: [232, 245, 233], fontStyle: 'bold' },
    },
    alternateRowStyles: { fillColor: LIGHT },
    head: [['', 'Cash Donation', 'Donate Securities \u2713 Best', 'Sell First, Donate Cash']],
    body: comparisonBody,
  });
  y = doc.lastAutoTable.finalY + 8;

  // Savings callout box
  if (results.savingsVsCash > 0) {
    doc.setFillColor(232, 245, 233);
    doc.roundedRect(15, y, pageWidth - 30, 14, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 94, 32);
    doc.text(
      `\uD83D\uDCA1 By donating securities instead of cash, you save ${formatCurrency(results.savingsVsCash)} \u2014 ${formatPercent(results.savingsVsCash / inputs.donationFMV)} of your gift value.`,
      pageWidth / 2, y + 9, { align: 'center' }
    );
    y += 20;
  }

  // ── New page for DAF ───────────────────────────────────────
  doc.addPage();
  addHeader(doc, pageWidth);
  addFooter(doc, 2, pageWidth, pageHeight);
  y = 34;

  y = sectionTitle(doc, '3. Donor-Advised Fund (DAF) Projection', y);

  // Config summary
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT);
  doc.text(
    `Initial contribution: ${formatCurrency(inputs.donationFMV)} | Annual return: ${formatPercent(dafReturnRate)} | Mandatory distribution: 5% | Horizon: ${dafYears} years`,
    15, y
  );
  y += 8;

  // DAF projection table
  const projection = calculateDAFProjection(inputs.donationFMV, dafReturnRate, dafYears, 0.05);
  const lastRow = projection[projection.length - 1];

  const projectionBody = projection.map((row) => [
    row.year,
    formatCurrency(row.startingValue),
    formatCurrency(row.investmentGain),
    formatCurrency(row.distribution),
    formatCurrency(row.endingValue),
    formatCurrency(row.cumulativeDistributions),
  ]);

  doc.autoTable({
    startY: y,
    margin: { left: 15, right: 15 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: IG_DARK, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: LIGHT },
    head: [['Year', 'Starting Value', 'Investment Gain', 'Distribution (5%)', 'Ending Value', 'Cumulative Distributed']],
    body: projectionBody,
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'right' },
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // DAF Summary
  const summaryData = [
    ['Initial gift', formatCurrency(inputs.donationFMV)],
    [`Total distributed over ${dafYears} years`, formatCurrency(lastRow?.cumulativeDistributions)],
    ['Remaining fund value', formatCurrency(lastRow?.endingValue)],
    ['Total philanthropic impact', formatCurrency((lastRow?.cumulativeDistributions || 0) + (lastRow?.endingValue || 0))],
  ];

  doc.autoTable({
    startY: y,
    margin: { left: 15, right: 15 },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: IG_BLUE, textColor: WHITE, fontStyle: 'bold' },
    head: [['DAF Summary', 'Amount']],
    body: summaryData,
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
  });

  // Footer page 1
  addFooter(doc, 1, pageWidth, pageHeight);

  // ── Disclaimer page ────────────────────────────────────────
  doc.addPage();
  addHeader(doc, pageWidth);
  addFooter(doc, 3, pageWidth, pageHeight);
  y = 34;

  y = sectionTitle(doc, 'Important Disclosures', y);

  const disclaimerText = [
    'This report is for illustrative and educational purposes only. It is not tax, legal, or investment advice.',
    '',
    'Tax calculations are based on 2026 federal and provincial/territorial income tax rates and donation tax credit',
    'schedules. Actual results may differ due to alternative minimum tax, surtaxes, income-tested benefit',
    'clawbacks, carry-forward amounts, other credits, and other factors not reflected here.',
    '',
    'Capital gains calculations use a 50% inclusion rate for individuals, which applies in 2026. The 2024 federal',
    'budget proposed a 2/3 inclusion rate for gains over $250,000 per individual, but implementation was paused.',
    'Consult a tax professional for the most current rules.',
    '',
    'Donor-Advised Fund projections are hypothetical and assume a constant annual return and distribution rate.',
    'Actual investment returns will vary. The 5% annual distribution is a common minimum but specific terms',
    'depend on the sponsoring foundation.',
    '',
    'Quebec residents: The federal tax calculations apply the 16.5% Quebec abatement. However, Quebec residents',
    'file separate provincial returns and the interaction of federal and provincial credits is more complex.',
    '',
    'Always consult a qualified Canadian tax professional, financial advisor, or estate planner before making',
    'charitable giving or investment decisions.',
    '',
    'Strategic Generosity is a planning approach that integrates tax strategy, investment planning, estate',
    'planning, and philanthropy into a single, values-aligned financial plan. To explore how these strategies',
    'apply to your situation, visit successfultogenerous.com or contact Adam Malcolm directly.',
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT);
  disclaimerText.forEach((line) => {
    doc.text(line, 15, y);
    y += 5.5;
  });

  return doc;
}
