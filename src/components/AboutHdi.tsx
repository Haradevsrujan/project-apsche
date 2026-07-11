import React from 'react';
import { Heart, BookOpen, DollarSign, ArrowRight, ShieldCheck, HelpCircle, ArrowLeft } from 'lucide-react';

interface AboutHdiProps {
  onNavigateToPredictor: () => void;
  onBack: () => void;
  darkMode: boolean;
}

export default function AboutHdi({ onNavigateToPredictor, onBack, darkMode }: AboutHdiProps) {
  return (
    <div className="space-y-12 animate-fade-in" id="about-hdi-view">
      {/* NAVIGATION HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-200/40 dark:border-slate-800/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
          UNDP HUMAN DEVELOPMENT INDEX (HDI) GUIDE
        </span>
      </div>

      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-display">
          Demystifying Human Development
        </h2>
        <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
          The Human Development Index (HDI) was introduced by the United Nations Development Programme (UNDP) 
          to shift the focus of development economics from raw GDP growth to people and their capabilities.
        </p>
      </div>

      {/* CORE 3 PILLARS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* HEALTH CARD */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
              <Heart className="h-6 w-6" />
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">DIMENSION 01</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Long & Healthy Life</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Measured through <strong>Life Expectancy at Birth</strong>. It represents the structural capacity of 
            healthcare infrastructure, sanitation systems, nutrition quality, and disease preventive systems.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            UNDP Bounds: 20 to 85 years
          </div>
        </div>

        {/* EDUCATION CARD */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">DIMENSION 02</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Knowledge & Schooling</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Aggregated via <strong>Mean Years of Schooling</strong> (completed education by adults 25+) and 
            <strong>Expected Years of Schooling</strong> (predicted career path for school-entering children).
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            UNDP Bounds: MYS 0-15y, EYS 0-18y
          </div>
        </div>

        {/* INCOME CARD */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
              <DollarSign className="h-6 w-6" />
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">DIMENSION 03</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Decent Standard of Living</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Evaluated by **Gross National Income (GNI) per Capita** adjusted for purchasing power parity (PPP) 
            on a natural log scale. Reflects domestic resource availability and structural buying potential.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            UNDP Bounds: $100 to $75,000 PPP
          </div>
        </div>
      </div>

      {/* FORMULA INFOGRAPHIC */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-r from-indigo-50/50 to-slate-50/50 dark:from-slate-950/30 dark:to-slate-900/40 p-8 shadow-inner">
        <h3 className="text-center font-bold text-slate-900 dark:text-white text-lg font-display mb-8">
          The Official Geometric Mean Calculation Framework
        </h3>
        
        {/* INFOGRAPHIC FLOW */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 relative">
          
          {/* HEALTH COLUMN */}
          <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 w-48">
            <Heart className="h-8 w-8 text-rose-500 mb-2" />
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Life Expectancy</span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Normalized LEI</span>
          </div>

          <div className="hidden lg:block text-slate-400 font-bold text-xl">✕</div>

          {/* EDUCATION COLUMN */}
          <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 w-48">
            <BookOpen className="h-8 w-8 text-emerald-500 mb-2" />
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Mean & Expected Schooling</span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Combined EI</span>
          </div>

          <div className="hidden lg:block text-slate-400 font-bold text-xl">✕</div>

          {/* INCOME COLUMN */}
          <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 w-48">
            <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Log GNI per Capita</span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Normalized II</span>
          </div>

          <div className="text-slate-400 font-bold text-xl block">➜</div>

          {/* COMPOSITE RESULT */}
          <div className="flex flex-col items-center text-center p-6 bg-indigo-600 dark:bg-indigo-700 text-white rounded-2xl shadow-lg w-52 transform scale-105 border border-indigo-400/20">
            <ShieldCheck className="h-10 w-10 text-indigo-200 mb-2 animate-bounce" />
            <span className="font-bold text-sm tracking-wide">Geometric Mean</span>
            <span className="text-2xl font-black mt-1 font-display">HDI Index</span>
            <span className="text-[9px] text-indigo-200 mt-2 font-mono">³√(LEI × EI × II)</span>
          </div>

        </div>

        {/* MATH EXPLANATION */}
        <div className="mt-8 text-center max-w-2xl mx-auto bg-white dark:bg-slate-900/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800/80">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2.5 text-left">
            <HelpCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Why a Geometric Mean?</strong> An arithmetic mean allows highly elevated values in one sector 
              to mask severe underdevelopment in another. The UN uses a geometric mean so that a country with depressed longevity 
              or schooling suffers a significant penalty to its overall score, encouraging balanced, comprehensive investment pathways.
            </span>
          </p>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-indigo-500 text-white shadow-md gap-4">
        <div>
          <h4 className="text-lg font-bold font-display">Ready to Predict National Human Development?</h4>
          <p className="text-xs text-indigo-100 mt-1">
            Simulate combinations of the three indicators or evaluate customized countries in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 text-white border border-slate-700 px-4 py-2.5 text-sm font-bold shadow-xs hover:bg-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <button
            onClick={onNavigateToPredictor}
            className="inline-flex items-center gap-2 rounded-lg bg-white text-indigo-600 px-4 py-2.5 text-sm font-bold shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Open Predictor
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
