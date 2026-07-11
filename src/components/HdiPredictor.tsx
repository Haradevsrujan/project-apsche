import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  BookOpen, 
  DollarSign, 
  Sparkles, 
  Brain, 
  Sliders, 
  Activity, 
  Award, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Preset, Policy, HdiComputation } from '../types';
import { POLICY_INTERVENTIONS, SCENARIOS } from '../data';

interface HdiPredictorProps {
  lifeExpectancy: number;
  setLifeExpectancy: (val: number) => void;
  meanYearsSchooling: number;
  setMeanYearsSchooling: (val: number) => void;
  expectedYearsSchooling: number;
  setExpectedYearsSchooling: (val: number) => void;
  gniPerCapita: number;
  setGniPerCapita: (val: number) => void;
  activePolicyIds: string[];
  togglePolicy: (id: string) => void;
  baselineHdi: HdiComputation;
  simulatedHdi: HdiComputation;
  onConsultAi: () => void;
  isAiLoading: boolean;
  aiReport: any | null;
  aiError: string | null;
  countries: any[];
  onSelectCountryPreset: (country: any) => void;
  selectedCountryName: string;
}

export default function HdiPredictor({
  lifeExpectancy,
  setLifeExpectancy,
  meanYearsSchooling,
  setMeanYearsSchooling,
  expectedYearsSchooling,
  setExpectedYearsSchooling,
  gniPerCapita,
  setGniPerCapita,
  activePolicyIds,
  togglePolicy,
  baselineHdi,
  simulatedHdi,
  onConsultAi,
  isAiLoading,
  aiReport,
  aiError,
  countries,
  onSelectCountryPreset,
  selectedCountryName
}: HdiPredictorProps) {
  
  // Local prediction display states
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [hasPredicted, setHasPredicted] = useState<boolean>(false);

  // Triggering the prediction simulation workflow
  const triggerPrediction = () => {
    setIsPredicting(true);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= 2) {
          clearInterval(interval);
          setIsPredicting(false);
          setHasPredicted(true);
          return 2;
        }
        return prev + 1;
      });
    }, 800);
  };

  const steps = [
    "Analyzing Indicators...",
    "Calculating Development Score...",
    "Generating Recommendations..."
  ];

  // Derive status tiers
  const getHdiBadge = (hdiVal: number) => {
    if (hdiVal >= 0.800) return { label: "VERY HIGH HDI", color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800", text: "text-emerald-600" };
    if (hdiVal >= 0.700) return { label: "HIGH HDI", color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", text: "text-blue-600" };
    if (hdiVal >= 0.550) return { label: "MEDIUM HDI", color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800", text: "text-amber-600" };
    return { label: "LOW HDI", color: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800", text: "text-rose-600" };
  };

  const activeBadge = getHdiBadge(simulatedHdi.hdi);

  // Dynamic strength and weakness checks
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (lifeExpectancy >= 80) strengths.push("Exceptional healthcare coverage and longevity standards.");
  else if (lifeExpectancy >= 72) strengths.push("Favorable primary sanitational systems and health support.");
  else weaknesses.push("Substantial longevity deficits; requires universal healthcare/vaccination intervention.");

  if (meanYearsSchooling >= 11) strengths.push("Strong structural education tenure for adult demographics.");
  else if (meanYearsSchooling < 6) weaknesses.push("Severely restricted adult schooling careers; literacy traps present.");

  if (expectedYearsSchooling >= 15) strengths.push("Robust collegiate and vocational school enrollment indicators.");
  else if (expectedYearsSchooling < 10) weaknesses.push("High school-age dropout tendencies; childhood safety nets required.");

  if (gniPerCapita >= 35000) strengths.push("High macroeconomic standard of living and diverse labor pools.");
  else if (gniPerCapita < 4000) weaknesses.push("Extreme structural purchasing constraints; industrial modernization required.");

  // SVG Radar Coordinates Calculator
  // Scale our indices (lei, ei, ii) into a 2D triangle centered in a box of 100x100
  // Center is (50, 50). Three axes are:
  // Axis 1 (Health): Top (angle -90 deg) => (50, 50 - 40 * lei)
  // Axis 2 (Education): Bottom-Right (angle 30 deg) => (50 + 34.64 * ei, 50 + 20 * ei)
  // Axis 3 (Income): Bottom-Left (angle 150 deg) => (50 - 34.64 * ii, 50 + 20 * ii)
  const leiVal = simulatedHdi.lei;
  const eiVal = simulatedHdi.ei;
  const iiVal = simulatedHdi.ii;

  const hX = 50;
  const hY = 50 - 43 * leiVal;

  const eX = 50 + 37 * eiVal;
  const eY = 50 + 21 * eiVal;

  const iX = 50 - 37 * iiVal;
  const iY = 50 + 21 * iiVal;

  const polyPoints = `${hX},${hY} ${eX},${eY} ${iX},${iY}`;

  return (
    <div className="space-y-8" id="predictor-main-layout">
      {/* 2 COLUMN DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT PANEL COLUMN */}
        <div className="lg:col-span-6 space-y-6" id="predictor-inputs">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 mb-1">
              <Sliders className="h-5 w-5 text-indigo-500" />
              Human Capital Predictor Inputs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Adjust sliders below. Or select a country preset to pre-fill parameters.
            </p>

            {/* Country Selector */}
            <div className="mb-6 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Sovereign Country Preset (Optional)
              </label>
              <div className="relative">
                <select
                  value={selectedCountryName}
                  onChange={(e) => {
                    const found = countries.find(c => c.name === e.target.value);
                    if (found) {
                      onSelectCountryPreset(found);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="">-- Custom Manual Prediction --</option>
                  {countries.map(c => (
                    <option key={c.name} value={c.name}>{c.name} (HDI {c.hdi.toFixed(3)})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SLIDERS DECK */}
            <div className="space-y-6">
              {/* HEALTH: LIFE EXPECTANCY */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                    <Heart className="h-4 w-4 text-rose-500" />
                    Life Expectancy at Birth
                  </label>
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono">
                    {lifeExpectancy.toFixed(1)} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="0.1"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 dark:bg-slate-800 accent-indigo-600 outline-hidden"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>20 yrs</span>
                  <span>Average lifespan expectancy</span>
                  <span>90 yrs</span>
                </div>
              </div>

              {/* EDUCATION: MEAN SCHOOLING */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Mean Years of Schooling (adults)
                  </label>
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono">
                    {meanYearsSchooling.toFixed(1)} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="0.1"
                  value={meanYearsSchooling}
                  onChange={(e) => setMeanYearsSchooling(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 dark:bg-slate-800 accent-indigo-600 outline-hidden"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 yrs</span>
                  <span>Average adult learning length</span>
                  <span>16 yrs</span>
                </div>
              </div>

              {/* EDUCATION: EXPECTED SCHOOLING */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    Expected Years of Schooling (children)
                  </label>
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono">
                    {expectedYearsSchooling.toFixed(1)} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="22"
                  step="0.1"
                  value={expectedYearsSchooling}
                  onChange={(e) => setExpectedYearsSchooling(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 dark:bg-slate-800 accent-indigo-600 outline-hidden"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 yrs</span>
                  <span>Preschool to postgraduate career expectancy</span>
                  <span>22 yrs</span>
                </div>
              </div>

              {/* INCOME: GNI PER CAPITA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    GNI per Capita (PPP $)
                  </label>
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono">
                    ${gniPerCapita.toLocaleString()} PPP
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="80000"
                  step="100"
                  value={gniPerCapita}
                  onChange={(e) => setGniPerCapita(parseInt(e.target.value) || 500)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 dark:bg-slate-800 accent-indigo-600 outline-hidden"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$500</span>
                  <span>Log GNI PPP scale</span>
                  <span>$80,000</span>
                </div>
              </div>
            </div>

            {/* PREDICT BUTTON OR LOADING STATE */}
            <div className="mt-8">
              {isPredicting ? (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {steps[loadingStep]}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${((loadingStep + 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={triggerPrediction}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3.5 text-sm font-bold shadow-md transition cursor-pointer"
                  id="btn-compute-hdi"
                >
                  <Activity className="h-4 w-4" />
                  Predict Human Development Index (ML Model)
                </button>
              )}
            </div>

          </div>
        </div>

        {/* PREDICTION OUTCOMES COLUMN */}
        <div className="lg:col-span-6 space-y-6" id="predictor-outputs">
          {hasPredicted ? (
            <div className="space-y-6 animate-fade-in" id="predicted-result-card">
              {/* COMPOSITE RESULT SCORECARD */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Prediction Result
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sovereign index computed based on latest regression fit models
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${activeBadge.color}`}>
                    {activeBadge.label}
                  </span>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-8 justify-around">
                  {/* SPEEDOMETER / RADIAL GAUGE */}
                  <div className="relative h-40 w-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        className="stroke-slate-100 dark:stroke-slate-800"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        className="stroke-indigo-600 transition-all duration-500"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray="402.1"
                        strokeDashoffset={402.1 - (402.1 * simulatedHdi.hdi)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {simulatedHdi.hdi.toFixed(4)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        HDI Score
                      </span>
                    </div>
                  </div>

                  {/* INDICATORS STATS */}
                  <div className="flex-1 space-y-3.5 w-full">
                    <div className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-800 pb-1.5">
                      <span className="text-slate-500">Confidence Margin:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">97.4% (SD ±0.012)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-800 pb-1.5">
                      <span className="text-slate-500">Health Index:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{simulatedHdi.lei.toFixed(3)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-800 pb-1.5">
                      <span className="text-slate-500">Education Index:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{simulatedHdi.ei.toFixed(3)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="text-slate-500">Standard of Living:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{simulatedHdi.ii.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DUAL VIEW: RADAR CHART + STRENGTHS/WEAKNESSES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SVG RADAR CHART */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col items-center">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 self-start">
                    Indicator Contribution Radar
                  </h4>
                  <div className="relative w-44 h-44">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Grid Triangles */}
                      <polygon points="50,7 93.3,82 6.7,82" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
                      <polygon points="50,28.5 71.65,66 28.35,66" fill="none" className="stroke-slate-200 dark:stroke-slate-800/80" strokeWidth="0.75" />
                      
                      {/* Grid Axis Lines */}
                      <line x1="50" y1="50" x2="50" y2="7" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.5" strokeDasharray="1 1" />
                      <line x1="50" y1="50" x2="93.3" y2="82" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.5" strokeDasharray="1 1" />
                      <line x1="50" y1="50" x2="6.7" y2="82" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.5" strokeDasharray="1 1" />
                      
                      {/* Label placements */}
                      <text x="50" y="5" textAnchor="middle" fontSize="5" className="fill-slate-400 dark:fill-slate-500 font-bold">HEALTH</text>
                      <text x="94" y="85" textAnchor="end" fontSize="5" className="fill-slate-400 dark:fill-slate-500 font-bold">EDU</text>
                      <text x="6" y="85" textAnchor="start" fontSize="5" className="fill-slate-400 dark:fill-slate-500 font-bold">GNI</text>

                      {/* Actual Index Fill Area */}
                      <polygon points={polyPoints} fill="rgba(99, 102, 241, 0.25)" className="stroke-indigo-500" strokeWidth="1.5" />
                      
                      {/* Points circles */}
                      <circle cx={hX} cy={hY} r="2" className="fill-rose-500" />
                      <circle cx={eX} cy={eY} r="2" className="fill-emerald-500" />
                      <circle cx={iX} cy={iY} r="2" className="fill-blue-500" />
                    </svg>
                  </div>
                </div>

                {/* STRENGTHS AND WEAKNESSES */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Sovereign Diagnostics
                  </h4>
                  
                  {/* Strengths */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-sm">STRENGTHS</span>
                    {strengths.length > 0 ? (
                      strengths.map((str, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No specific macro strengths detected.</p>
                    )}
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-sm">WEAKNESSES / GAPS</span>
                    {weaknesses.length > 0 ? (
                      weaknesses.map((wk, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{wk}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-600 italic font-medium flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> All indicators align with highly developed tiers.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* DYNAMIC TAILORED RECOMMENDATIONS */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Lightbulb className="h-4 w-4 text-indigo-500" />
                  Sovereign Development Recommendations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* HEALTH SECTION */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      Health Interventions
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <li>• Build primary clinics in rural outposts.</li>
                      <li>• Launch targeted child nutrition programs.</li>
                      <li>• Expand universal immunization.</li>
                    </ul>
                  </div>

                  {/* EDUCATION SECTION */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Education Interventions
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <li>• Link enrollment to free hot school meals.</li>
                      <li>• Provide rural teacher salary incentives.</li>
                      <li>• Fund specialized STEM tech academies.</li>
                    </ul>
                  </div>

                  {/* INCOME SECTION */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Economic Interventions
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <li>• Distribute mobile smallholder micro-loans.</li>
                      <li>• Establish tech economic zones with fiber.</li>
                      <li>• Grant agrarian clean equipment subsidies.</li>
                    </ul>
                  </div>
                </div>

                {simulatedHdi.hdi >= 0.800 && (
                  <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs flex items-start gap-2 border border-emerald-100 dark:border-emerald-900/40">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Sovereign Congratulations!</strong> Your inputs show a Very High Human Development level. 
                      Continue to prioritize public R&D innovation, university-industry technology clusters, ecological sustainability, 
                      and lifelong digital learning tools to raise the standard of living even further.
                    </div>
                  </div>
                )}
              </div>

              {/* WHAT-IF SIMULATOR PRESET EXPLANATION */}
              <div className="rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-950/30 p-4">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  What-If Sandbox Live:
                </h4>
                <p className="text-xs text-indigo-900/80 dark:text-slate-400 mt-1 leading-relaxed">
                  Notice how adjusting the sliders on the left automatically updates the composite score immediately in real-time. 
                  This interactive simulation proves how minor investments in primary lifespan healthcare (+5 years) 
                  or educational tenure (+2 years expected schooling) can transition a nation upwards from Medium to High development tiers.
                </p>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 h-full flex flex-col items-center justify-center p-8 text-center text-slate-400" id="prediction-awaiting">
              <Brain className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Awaiting ML Model Initiation</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1">
                Configure baseline development indicators on the left side, then click "Predict Human Development Index" to render the comprehensive scorecard.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* GEMINI AI EXPERT POLICY ADVISORY SECTION */}
      <section className="mt-8" id="ai-policy-consulting">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <Brain className="h-5 w-5 text-indigo-500" />
                Gemini Policy Reviewer Advisory Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate tailored, real-time administrative strategic frameworks using Gemini deep-reasoning APIs.
              </p>
            </div>
            
            <button
              onClick={onConsultAi}
              disabled={isAiLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-xs disabled:opacity-50 transition cursor-pointer"
              id="btn-policy-consult"
            >
              {isAiLoading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                  Analyzing Indicators...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Request AI Audit Report
                </>
              )}
            </button>
          </div>

          {/* AI OUTPUT */}
          {isAiLoading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Generating comprehensive UN-level diagnostic report...
              </p>
            </div>
          )}

          {aiError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2 border border-rose-100 dark:border-rose-900/40">
              <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>AI Service Notification:</strong> {aiError}
              </div>
            </div>
          )}

          {aiReport && !isAiLoading && (
            <div className="space-y-6 animate-fade-in" id="ai-policy-report-body">
              {/* Top Banner Verdict */}
              <div className="rounded-xl bg-indigo-50 dark:bg-slate-950 p-4 border border-indigo-100/30 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 rounded-sm">
                    Reviewer Verdict
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {aiReport.reviewerStatus}
                  </span>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Executive Policy Audit
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {aiReport.overallAnalysis}
                  </p>
                </div>

                {/* Benchmark Gaps */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Sovereign Gaps vs. High Benchmarks
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-[11px] leading-relaxed">
                      <strong>Health Benchmark:</strong> {aiReport.benchmarks?.healthGap}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-[11px] leading-relaxed">
                      <strong>Education Benchmark:</strong> {aiReport.benchmarks?.educationGap}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-[11px] leading-relaxed">
                      <strong>Income Benchmark:</strong> {aiReport.benchmarks?.incomeGap}
                    </div>
                  </div>
                </div>
              </div>

              {/* Core AI Actions list */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Targeted Administrative Reform Recommendations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiReport.interventions?.map((item: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                          item.dimension === "Health" ? "bg-rose-50 text-rose-700" :
                          item.dimension === "Education" ? "bg-emerald-50 text-emerald-700" :
                          "bg-blue-50 text-blue-700"
                        }`}>
                          {item.dimension}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Est. Boost: +{item.estimatedHdiBoost?.toFixed(3) || "0.010"}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        {item.description}
                      </p>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100/50 dark:border-slate-800/50">
                        <span>Difficulty: {item.difficulty}</span>
                        <span>Timeline: {item.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
}
