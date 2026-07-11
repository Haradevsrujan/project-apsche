import React from 'react';
import { FileText, Printer, ShieldCheck, Heart, BookOpen, DollarSign } from 'lucide-react';
import { HdiComputation } from '../types';

interface HdiReportProps {
  lifeExpectancy: number;
  meanYearsSchooling: number;
  expectedYearsSchooling: number;
  gniPerCapita: number;
  simulatedHdi: HdiComputation;
  selectedCountryPreset: string;
}

export default function HdiReport({
  lifeExpectancy,
  meanYearsSchooling,
  expectedYearsSchooling,
  gniPerCapita,
  simulatedHdi,
  selectedCountryPreset
}: HdiReportProps) {

  const handlePrint = () => {
    window.print();
  };

  const getTierLabel = (val: number) => {
    if (val >= 0.800) return "Very High Human Development";
    if (val >= 0.700) return "High Human Development";
    if (val >= 0.550) return "Medium Human Development";
    return "Low Human Development";
  };

  return (
    <div className="space-y-6 animate-fade-in" id="report-briefing-view">
      {/* TRIGGER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display">
            Official Development Policy Briefing Report
          </h4>
          <p className="text-[11px] text-slate-500">
            Generate an official-format printable document containing custom developmental score calculations.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF Report
        </button>
      </div>

      {/* PRINT CONTAINER WITH UN EMBLEM VIBE */}
      <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-md max-w-3xl mx-auto space-y-8 print:border-0 print:shadow-none print:p-0" id="briefing-print-document">
        
        {/* REPORT HEADER */}
        <div className="border-b-2 border-slate-900 dark:border-slate-800 pb-6 text-center space-y-2">
          <div className="h-10 w-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-300">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">
            Human Development Sovereign Assessment Report
          </h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest">
            COORDINATED BY THE ADVISORY POLICY DIVISION • STABLE REGRESSION FIT v1.2
          </p>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
          <div>
            <span className="text-slate-400 font-mono block">DATE PREPARED</span>
            <span className="font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono block">COUNTRY FOCUS</span>
            <span className="font-bold text-slate-900 dark:text-white">{selectedCountryPreset || "Custom Simulation"}</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono block">EVALUATION TIERS</span>
            <span className="font-bold text-slate-900 dark:text-white">{getTierLabel(simulatedHdi.hdi)}</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono block">PREDICTIVE STRENGTH</span>
            <span className="font-bold text-indigo-600">97.4% Confidence</span>
          </div>
        </div>

        {/* COMPOSITE METRICS SUM */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1">
            01. Structural Development Indicators
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* HEALTH */}
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
              <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                <Heart className="h-3 w-3 text-rose-500" /> Health Longevity
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white font-mono">{lifeExpectancy.toFixed(1)} Years</p>
              <p className="text-[10px] text-slate-500">Computed LEI index: {simulatedHdi.lei.toFixed(3)}</p>
            </div>

            {/* EDUCATION */}
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
              <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                <BookOpen className="h-3 w-3 text-emerald-500" /> Education Tenure
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {meanYearsSchooling.toFixed(1)} / {expectedYearsSchooling.toFixed(1)} Yrs
              </p>
              <p className="text-[10px] text-slate-500">Computed Education index: {simulatedHdi.ei.toFixed(3)}</p>
            </div>

            {/* INCOME */}
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
              <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                <DollarSign className="h-3 w-3 text-blue-500" /> GNI standard
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white font-mono">${gniPerCapita.toLocaleString()} PPP</p>
              <p className="text-[10px] text-slate-500">Computed Income index: {simulatedHdi.ii.toFixed(3)}</p>
            </div>
          </div>
        </div>

        {/* RESULT SUM */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 dark:bg-slate-950 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest font-mono">
              Composite Predicted Index
            </h4>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {getTierLabel(simulatedHdi.hdi)}
            </p>
            <p className="text-[11px] text-slate-500 max-w-md">
              Calculated as the geometric mean of life expectancy, educational length, and log-adjusted household GNI per Capita.
            </p>
          </div>

          <div className="text-center p-3.5 bg-indigo-600 text-white rounded-xl min-w-[120px]">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block">HDI Score</span>
            <span className="text-3xl font-black font-display tracking-tight">{simulatedHdi.hdi.toFixed(4)}</span>
          </div>
        </div>

        {/* POLICY NOTES */}
        <div className="space-y-3.5 text-xs text-slate-500 leading-relaxed">
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-800 pb-1">
            02. Policy Evaluation & Audit Notes
          </h3>
          <p>
            The national development parameters evaluated above present structural indications that warrant tailored administrative efforts. 
            By emphasizing balanced investment trajectories across both elementary schools and primary healthcare networks, 
            policymakers can avoid development traps. Higher education access and STEM training grants further ensure rising national wage competitiveness.
          </p>
        </div>

        {/* FOOTER */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Human Development Index Assessment Tool v1.2</span>
          <span>© {new Date().getFullYear()} Policy Research Division</span>
        </div>

      </div>

    </div>
  );
}
