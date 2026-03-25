import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { calculateDAFProjection, formatCurrency } from '../utils/calculations';

const DISTRIBUTION_RATE = 0.05; // 5% mandatory annual distribution

function SliderInput({ label, value, min, max, step, onChange, format }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-ig-dark">{label}</label>
        <span className="text-sm font-bold text-navy-900 tabular-nums bg-navy-100 px-2 py-0.5 rounded-md">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-ig-blue"
      />
      <div className="flex justify-between text-xs text-navy-400 mt-1">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-navy-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-bold text-navy-900 mb-2">Year {label}</p>
      {payload.map(({ name, value, color }) => (
        <p key={name} style={{ color }} className="flex justify-between gap-4">
          <span>{name}</span>
          <span className="font-semibold tabular-nums">{formatCurrency(value)}</span>
        </p>
      ))}
    </div>
  );
};

export default function DAFProjection({ initialValue: propInitialValue }) {
  const [initialValue, setInitialValue] = useState(propInitialValue || 50000);
  const [returnRate, setReturnRate] = useState(0.06);
  const [years, setYears] = useState(20);

  // Sync slider if parent prop changes (e.g. user fills in donation FMV)
  React.useEffect(() => {
    if (propInitialValue > 0) setInitialValue(propInitialValue);
  }, [propInitialValue]);

  const projection = useMemo(
    () => calculateDAFProjection(initialValue, returnRate, years, DISTRIBUTION_RATE),
    [initialValue, returnRate, years]
  );

  const lastRow = projection[projection.length - 1];
  const totalDistributed = lastRow?.cumulativeDistributions || 0;
  const finalFundValue   = lastRow?.endingValue || 0;
  const totalImpact      = totalDistributed + finalFundValue;
  const returnBeatsDist  = returnRate > DISTRIBUTION_RATE;

  // Conservative and optimistic lines for comparison
  const conservativeProjection = useMemo(
    () => calculateDAFProjection(initialValue, 0.04, years, DISTRIBUTION_RATE),
    [initialValue, years]
  );
  const optimisticProjection = useMemo(
    () => calculateDAFProjection(initialValue, 0.07, years, DISTRIBUTION_RATE),
    [initialValue, years]
  );

  // Merge datasets for the band chart
  const chartData = projection.map((row, i) => ({
    year: row.year,
    fundValue:    row.endingValue,
    distribution: row.distribution,
    cumulative:   row.cumulativeDistributions,
    conservative: conservativeProjection[i]?.endingValue ?? 0,
    optimistic:   optimisticProjection[i]?.endingValue ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-ig-dark">What a Donor-Advised Fund could look like over time</h2>
            <p className="text-sm text-navy-500 mt-1">
              How your gift keeps giving — year after year, decade after decade.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs font-semibold text-amber-800 whitespace-nowrap">
            <span>⚖️</span>
            <span>5% mandatory distribution</span>
          </div>
        </div>

        {/* DAF callout */}
        <div className="mb-6 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-ig-dark font-medium">
          A DAF lets you give now, receive the tax receipt now, and distribute to charities on your own
          schedule — sometimes over decades.
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <SliderInput
            label="Initial DAF Contribution"
            value={initialValue}
            min={10000}
            max={1000000}
            step={5000}
            onChange={setInitialValue}
            format={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <SliderInput
            label="Annual Investment Return"
            value={returnRate}
            min={0.04}
            max={0.07}
            step={0.005}
            onChange={setReturnRate}
            format={(v) => `${(v * 100).toFixed(1)}%`}
          />
          <SliderInput
            label="Time Horizon"
            value={years}
            min={5}
            max={30}
            step={5}
            onChange={setYears}
            format={(v) => `${v} years`}
          />
        </div>

        {/* Return rate context banner */}
        <div className={`mb-6 p-3 rounded-xl text-xs font-medium flex gap-2 items-start ${
          returnBeatsDist
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border border-amber-200 text-amber-800'
        }`}>
          <span className="mt-0.5">{returnBeatsDist ? '📈' : '📉'}</span>
          <span>
            At <strong>{(returnRate * 100).toFixed(1)}%</strong> return with a <strong>5%</strong> mandatory
            distribution, the fund{' '}
            {returnBeatsDist
              ? `grows by ~${((returnRate - DISTRIBUTION_RATE) * 100).toFixed(1)}% per year — your legacy compounds over time.`
              : `shrinks by ~${((DISTRIBUTION_RATE - returnRate) * 100).toFixed(1)}% per year — it still delivers ${formatCurrency(totalDistributed)} total over ${years} years before depleting.`
            }
          </span>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Initial gift',             value: formatCurrency(initialValue),    icon: '🎁' },
            { label: `Total distributed (${years}y)`, value: formatCurrency(totalDistributed), icon: '💝', highlight: true },
            { label: 'Remaining fund value',     value: formatCurrency(finalFundValue),  icon: '🏦' },
            { label: 'Total philanthropic impact',value: formatCurrency(totalImpact),    icon: '🌟', highlight: true },
          ].map(({ label, value, icon, highlight }) => (
            <div key={label} className={`rounded-xl p-3 text-center ${highlight ? 'text-white' : 'bg-navy-50'}`}
              style={highlight ? { backgroundColor: '#001E60' } : {}}>
              <p className="text-lg mb-1">{icon}</p>
              <p className={`text-xl font-extrabold tabular-nums ${highlight ? 'text-white' : 'text-navy-800'}`}>{value}</p>
              <p className={`text-xs mt-1 ${highlight ? 'text-white/70' : 'text-navy-500'}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Fund Value Chart */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-navy-700 mb-4">
            Fund Value Over Time — Return Range: 4% (conservative) to 7% (optimistic)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="optimisticGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0072CE" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0072CE" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#001E60" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#001E60" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}k`}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="optimistic" name="Optimistic (7%)" stroke="#8DD0EF" strokeWidth={1} strokeDasharray="4 2" fill="url(#optimisticGrad)" />
              <Area type="monotone" dataKey="fundValue"  name={`Selected (${(returnRate*100).toFixed(1)}%)`} stroke="#001E60" strokeWidth={2.5} fill="url(#fundGrad)" />
              <Area type="monotone" dataKey="conservative" name="Conservative (4%)" stroke="#9fb3c8" strokeWidth={1} strokeDasharray="4 2" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Annual Distribution Chart */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-navy-700 mb-4">
            Annual Distributions + Cumulative Impact
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}k`}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="distribution" name="Annual distribution (5%)" fill="#0072CE" radius={[3, 3, 0, 0]} />
              <Bar dataKey="cumulative"   name="Cumulative distributions" fill="#8DD0EF" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Year-by-Year Table (collapsible) */}
        <details className="group">
          <summary className="text-sm font-semibold text-navy-700 cursor-pointer list-none flex items-center gap-2 select-none">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            View year-by-year breakdown
          </summary>
          <div className="mt-4 overflow-x-auto rounded-xl border border-navy-200">
            <table className="w-full text-xs text-navy-700 min-w-[520px]">
              <thead className="text-white" style={{ backgroundColor: '#001E60' }}>
                <tr>
                  {['Year', 'Starting Value', 'Investment Gain', 'Annual Distribution (5%)', 'Ending Value', 'Cumulative Distributed'].map(h => (
                    <th key={h} className="px-3 py-2 text-right first:text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projection.map((row, i) => (
                  <tr key={row.year} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50'}>
                    <td className="px-3 py-2 font-medium">{row.year}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.startingValue)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-emerald-700">{formatCurrency(row.investmentGain)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-amber-700">{formatCurrency(row.distribution)}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold">{formatCurrency(row.endingValue)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-navy-600">{formatCurrency(row.cumulativeDistributions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 text-sm text-navy-700">
        <h3 className="font-bold text-ig-dark mb-2">What is a Donor-Advised Fund (DAF)?</h3>
        <p className="mb-2">
          A DAF is a registered charitable giving account managed by a sponsoring organization (e.g., Fidelity
          Charitable, a community foundation, or a bank-affiliated foundation). You make an irrevocable contribution,
          receive an immediate tax receipt, and then recommend grants to your chosen charities over time.
        </p>
        <ul className="list-disc list-inside space-y-1 text-navy-600">
          <li>Immediate tax deduction in the year of contribution</li>
          <li>Securities donated in-kind — no capital gains triggered</li>
          <li>Funds invested and grow tax-free until granted</li>
          <li>Canadian DAFs typically require <strong>5% annual distribution</strong> to qualified charities</li>
          <li>Strategic timing: front-load giving in high-income years</li>
        </ul>
      </div>
    </div>
  );
}
