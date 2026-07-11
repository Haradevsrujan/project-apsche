import React, { useState } from 'react';
import { CountryData, HdiComputation } from '../types';
import { COUNTRIES, GLOBAL_AVERAGES } from '../data';
import { TrendingUp, Award, Layers, Globe, Activity } from 'lucide-react';

interface GlobalComparisonProps {
  lifeExpectancy: number;
  meanYearsSchooling: number;
  expectedYearsSchooling: number;
  gniPerCapita: number;
  simulatedHdi: HdiComputation;
  countries: CountryData[];
  onSelectCountryPreset: (country: CountryData) => void;
  selectedCountryName: string;
}

export default function GlobalComparison({
  lifeExpectancy,
  meanYearsSchooling,
  expectedYearsSchooling,
  gniPerCapita,
  simulatedHdi,
  countries,
  onSelectCountryPreset,
  selectedCountryName
}: GlobalComparisonProps) {

  const [activeCountry, setActiveCountry] = useState<CountryData>(countries[4]); // Defaults to India

  // Help calculate heights for SVG bar charts
  const maxLE = 95;
  const maxMYS = 18;
  const maxGNI = 85000;

  // Render classification highlight check
  const getClassificationHighlight = (score: number, range: string) => {
    if (score >= 0.800 && range === "very-high") return "bg-emerald-500/10 dark:bg-emerald-500/15 border-l-4 border-emerald-500 font-bold";
    if (score >= 0.700 && score < 0.800 && range === "high") return "bg-blue-500/10 dark:bg-blue-500/15 border-l-4 border-blue-500 font-bold";
    if (score >= 0.550 && score < 0.700 && range === "medium") return "bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500 font-bold";
    if (score < 0.550 && range === "low") return "bg-rose-500/10 dark:bg-rose-500/15 border-l-4 border-rose-500 font-bold";
    return "";
  };

  // Coordinates for country's historical trends line chart (SVG viewbox 300x120)
  // X values for years 2020, 2021, 2022, 2023 can be spaced out evenly at 40, 110, 180, 250
  // Y values mapped from min hdi 0.3 to max hdi 1.0 (height 120, offset padding 15)
  const mapHdiToY = (val: number) => {
    const minHdi = 0.3;
    const maxHdi = 1.0;
    const padding = 15;
    const chartHeight = 120 - padding * 2;
    return 120 - (padding + ((val - minHdi) / (maxHdi - minHdi)) * chartHeight);
  };

  const trendPoints = activeCountry.trends.map((val, idx) => {
    const x = 40 + idx * 70;
    const y = mapHdiToY(val);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-12 animate-fade-in" id="global-comparison-view">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-full">
          Benchmarking
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-display mt-3">
          Global Comparisons & Historical Index Trends
        </h2>
        <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
          Compare your custom prediction variables against global UN averages, inspect official HDI tiers, 
          and track historic developmental records across representative countries.
        </p>
      </div>

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COMPONENT 1: BAR CHART COMPARISONS (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-indigo-500" />
              Your Indicators vs. Global Average
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Visualizes how your simulated nation's metrics match global medians.
            </p>

            <div className="space-y-6">
              {/* LIFE EXPECTANCY */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Life Expectancy at Birth (Years)</span>
                  <span className="text-slate-400 dark:text-slate-500">
                    You: <strong className="text-slate-900 dark:text-white">{lifeExpectancy.toFixed(1)}</strong> vs World: {GLOBAL_AVERAGES.lifeExpectancy.toFixed(1)}
                  </span>
                </div>
                {/* Custom bar */}
                <div className="space-y-1">
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${(lifeExpectancy / maxLE) * 100}%` }} />
                  </div>
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800/40 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-300" style={{ width: `${(GLOBAL_AVERAGES.lifeExpectancy / maxLE) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* MEAN SCHOOLING */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Adult Mean Years of Schooling</span>
                  <span className="text-slate-400 dark:text-slate-500">
                    You: <strong className="text-slate-900 dark:text-white">{meanYearsSchooling.toFixed(1)}</strong> vs World: {GLOBAL_AVERAGES.meanYearsSchooling.toFixed(1)}
                  </span>
                </div>
                {/* Custom bar */}
                <div className="space-y-1">
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${(meanYearsSchooling / maxMYS) * 100}%` }} />
                  </div>
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800/40 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-300" style={{ width: `${(GLOBAL_AVERAGES.meanYearsSchooling / maxMYS) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* GNI PER CAPITA */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Gross National Income per Capita (GNI)</span>
                  <span className="text-slate-400 dark:text-slate-500">
                    You: <strong className="text-slate-900 dark:text-white">${gniPerCapita.toLocaleString()}</strong> vs World: ${GLOBAL_AVERAGES.gniPerCapita.toLocaleString()}
                  </span>
                </div>
                {/* Custom bar */}
                <div className="space-y-1">
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${Math.log(gniPerCapita) / Math.log(maxGNI) * 100}%` }} />
                  </div>
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800/40 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-300" style={{ width: `${Math.log(GLOBAL_AVERAGES.gniPerCapita) / Math.log(maxGNI) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full inline-block" /> Custom Simulation
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-2.5 bg-slate-400 rounded-full inline-block" /> World Average (UN Standard)
              </span>
            </div>

          </div>
        </div>

        {/* COMPONENT 2: HDI CLASSIFICATION TABLE (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 mb-1">
              <Layers className="h-5 w-5 text-indigo-500" />
              Sovereign HDI Classifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your nation's tier highlight shifts based on your inputs.
            </p>

            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="p-3">Score Bracket</th>
                    <th className="p-3">Classification Tier</th>
                    <th className="p-3">Global Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {/* VERY HIGH */}
                  <tr className={`transition ${getClassificationHighlight(simulatedHdi.hdi, "very-high")}`}>
                    <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">0.800+</td>
                    <td className="p-3 text-slate-900 dark:text-white">Very High Development</td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-sm bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                        Top-Tier
                      </span>
                    </td>
                  </tr>

                  {/* HIGH */}
                  <tr className={`transition ${getClassificationHighlight(simulatedHdi.hdi, "high")}`}>
                    <td className="p-3 font-mono text-blue-600 dark:text-blue-400">0.700 - 0.799</td>
                    <td className="p-3 text-slate-900 dark:text-white">High Development</td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-sm bg-blue-50 dark:bg-blue-950/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                        Strong
                      </span>
                    </td>
                  </tr>

                  {/* MEDIUM */}
                  <tr className={`transition ${getClassificationHighlight(simulatedHdi.hdi, "medium")}`}>
                    <td className="p-3 font-mono text-amber-600 dark:text-amber-400">0.550 - 0.699</td>
                    <td className="p-3 text-slate-900 dark:text-white">Medium Development</td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-sm bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
                        Developing
                      </span>
                    </td>
                  </tr>

                  {/* LOW */}
                  <tr className={`transition ${getClassificationHighlight(simulatedHdi.hdi, "low")}`}>
                    <td className="p-3 font-mono text-rose-600 dark:text-rose-400">Below 0.550</td>
                    <td className="p-3 text-slate-900 dark:text-white">Low Development</td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-sm bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                        Critical Aid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
              Your simulated nation's score of <strong>{simulatedHdi.hdi.toFixed(4)}</strong> puts you in the active highlighted bracket.
            </div>

          </div>
        </div>

      </div>

      {/* HISTORICAL TRENDS FOR SELECTED NATIONS */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Sovereign Historical Trend & Global Rank Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect verified developmental trajectory records from the UNDP dataset.
            </p>
          </div>

          {/* Quick Select for Trends */}
          <div className="flex gap-2 flex-wrap">
            {countries.map(c => (
              <button
                key={c.name}
                onClick={() => setActiveCountry(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeCountry.name === c.name 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Rank Card */}
          <div className="md:col-span-4 flex flex-col justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                UNDP World Ranking
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white font-display">
                  #{activeCountry.rank}
                </span>
                <span className="text-xs text-slate-400 font-semibold">of 193 Nations</span>
              </div>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-slate-200/50 dark:border-slate-800/60 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Region / Continent:</span>
                <span className="font-bold text-slate-800 dark:text-white">{activeCountry.continent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verified GNI per Capita:</span>
                <span className="font-bold text-slate-800 dark:text-white">${activeCountry.gniPerCapita.toLocaleString()} PPP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Longevity Expectancy:</span>
                <span className="font-bold text-slate-800 dark:text-white">{activeCountry.lifeExpectancy} Years</span>
              </div>
            </div>

            <button
              onClick={() => onSelectCountryPreset(activeCountry)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold py-2.5 hover:bg-slate-800 transition cursor-pointer"
            >
              <Activity className="h-3.5 w-3.5" />
              Adopt Country Metrics to Predictor
            </button>
          </div>

          {/* Line Chart */}
          <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              HDI Progress Curve (2020 - 2023)
            </h4>
            
            {/* SVG Trendline */}
            <div className="relative bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-900/50 p-4 h-48 flex items-center justify-center">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                {/* Horizontal gridlines */}
                <line x1="30" y1="15" x2="280" y2="15" className="stroke-slate-200 dark:stroke-slate-800/50" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="30" y1="50" x2="280" y2="50" className="stroke-slate-200 dark:stroke-slate-800/50" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="30" y1="85" x2="280" y2="85" className="stroke-slate-200 dark:stroke-slate-800/50" strokeWidth="0.5" strokeDasharray="2 2" />
                
                {/* Axis Labels */}
                <text x="25" y="18" textAnchor="end" fontSize="6" className="fill-slate-400 dark:fill-slate-500 font-mono">1.00</text>
                <text x="25" y="53" textAnchor="end" fontSize="6" className="fill-slate-400 dark:fill-slate-500 font-mono">0.65</text>
                <text x="25" y="88" textAnchor="end" fontSize="6" className="fill-slate-400 dark:fill-slate-500 font-mono">0.30</text>

                {/* Grid Vertical Years labels */}
                <text x="40" y="112" textAnchor="middle" fontSize="6.5" className="fill-slate-400 dark:fill-slate-500 font-bold">2020</text>
                <text x="110" y="112" textAnchor="middle" fontSize="6.5" className="fill-slate-400 dark:fill-slate-500 font-bold">2021</text>
                <text x="180" y="112" textAnchor="middle" fontSize="6.5" className="fill-slate-400 dark:fill-slate-500 font-bold">2022</text>
                <text x="250" y="112" textAnchor="middle" fontSize="6.5" className="fill-slate-400 dark:fill-slate-500 font-bold">2023</text>

                {/* SVG Trendline shadow */}
                <path
                  d={`M 40,105 L ${trendPoints} L 250,105 Z`}
                  fill="rgba(99, 102, 241, 0.05)"
                />

                {/* SVG Trendline Path */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  points={trendPoints}
                  className="transition-all duration-300"
                />

                {/* Nodes on points */}
                {activeCountry.trends.map((val, idx) => {
                  const x = 40 + idx * 70;
                  const y = mapHdiToY(val);
                  return (
                    <g key={idx} className="group">
                      <circle
                        cx={x}
                        cy={y}
                        r="3.5"
                        className="fill-white dark:fill-slate-900 stroke-indigo-600 cursor-pointer"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        fontSize="6"
                        className="fill-indigo-600 dark:fill-indigo-400 font-bold font-mono opacity-100"
                      >
                        {val.toFixed(3)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
              The graph above shows actual historic UNDP progress curves. It shows stable developmental growth curves across representative brackets.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
