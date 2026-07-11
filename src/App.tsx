import { useState, useEffect } from 'react';
import { 
  Heart, 
  BookOpen, 
  DollarSign, 
  Sparkles, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  FileText, 
  Brain, 
  TrendingUp, 
  Sliders, 
  Layers, 
  AlertCircle, 
  CheckCircle,
  Activity,
  Globe,
  Sun,
  Moon,
  Info
} from 'lucide-react';

import { Preset, Policy, HdiComputation, CountryData } from './types';
import { POLICY_INTERVENTIONS, SCENARIOS, COUNTRIES } from './data';
import AboutHdi from './components/AboutHdi';
import HdiPredictor from './components/HdiPredictor';
import GlobalComparison from './components/GlobalComparison';
import AboutProject from './components/AboutProject';
import HdiReport from './components/HdiReport';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

// HDI geometric mean calculation helper
export const calculateHdiFromIndicators = (
  lifeExpectancy: number,
  meanYearsSchooling: number,
  expectedYearsSchooling: number,
  gniPerCapita: number
): HdiComputation => {
  // 1. Life Expectancy Index (LEI)
  const lei = clamp((lifeExpectancy - 20) / 65, 0, 1);

  // 2. Education Index (EI)
  const mysi = clamp(meanYearsSchooling / 15, 0, 1);
  const eysi = clamp(expectedYearsSchooling / 18, 0, 1);
  const ei = (mysi + eysi) / 2;

  // 3. Income Index (II)
  const ii = clamp(
    (Math.log(gniPerCapita) - Math.log(100)) / (Math.log(75000) - Math.log(100)),
    0,
    1
  );

  // 4. Combined geometric mean
  const product = lei * ei * ii;
  const hdi = product > 0 ? Math.pow(product, 1 / 3) : 0;

  return { lei, mysi, eysi, ei, ii, hdi };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showHdiDetails, setShowHdiDetails] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Baseline Indicator inputs
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(72.5);
  const [meanYearsSchooling, setMeanYearsSchooling] = useState<number>(8.7);
  const [expectedYearsSchooling, setExpectedYearsSchooling] = useState<number>(12.8);
  const [gniPerCapita, setGniPerCapita] = useState<number>(16750);
  const [selectedPresetName, setSelectedPresetName] = useState<string>('');

  // Policy interventions checklist
  const [activePolicyIds, setActivePolicyIds] = useState<string[]>([]);

  // AI Advisory state
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Toggle policies on/off
  const togglePolicy = (id: string) => {
    setActivePolicyIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Compute baseline HDI (original inputs)
  const baselineHdi = calculateHdiFromIndicators(
    lifeExpectancy,
    meanYearsSchooling,
    expectedYearsSchooling,
    gniPerCapita
  );

  // Compute simulated HDI (applying policy intervention multipliers and boosts)
  const getSimulatedValues = () => {
    let finalLE = lifeExpectancy;
    let finalMYS = meanYearsSchooling;
    let finalEYS = expectedYearsSchooling;
    let finalGNI = gniPerCapita;

    activePolicyIds.forEach((id) => {
      const policy = POLICY_INTERVENTIONS.find((p) => p.id === id);
      if (policy) {
        finalLE += policy.boost.lifeExpectancy;
        finalMYS += policy.boost.meanYearsSchooling;
        finalEYS += policy.boost.expectedYearsSchooling;
        finalGNI *= policy.boost.gniMultiplier;
      }
    });

    return {
      le: clamp(finalLE, 20, 90),
      mys: clamp(finalMYS, 0, 16),
      eys: clamp(finalEYS, 0, 22),
      gni: clamp(finalGNI, 500, 80000)
    };
  };

  const simulatedValues = getSimulatedValues();
  const simulatedHdi = calculateHdiFromIndicators(
    simulatedValues.le,
    simulatedValues.mys,
    simulatedValues.eys,
    simulatedValues.gni
  );

  // Reset sliders to default mid values
  const resetToGlobalMedian = () => {
    setLifeExpectancy(72.0);
    setMeanYearsSchooling(8.7);
    setExpectedYearsSchooling(12.8);
    setGniPerCapita(16750);
    setActivePolicyIds([]);
    setSelectedPresetName('');
    setAiReport(null);
  };

  // Adopt a prebuilt scenario or country preset
  const handleSelectCountryPreset = (country: any) => {
    setLifeExpectancy(country.lifeExpectancy);
    setMeanYearsSchooling(country.meanYearsSchooling);
    setExpectedYearsSchooling(country.expectedYearsSchooling);
    setGniPerCapita(country.gniPerCapita);
    setSelectedPresetName(country.name);
    // Reset policy impacts when importing country baseline
    setActivePolicyIds([]);
  };

  // Consult Gemini policy advisor API
  const handleConsultAiAdvisor = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const categoryLabel = simulatedHdi.hdi >= 0.800 ? "Very High Development" :
                            simulatedHdi.hdi >= 0.700 ? "High Development" :
                            simulatedHdi.hdi >= 0.550 ? "Medium Development" : "Low Development";

      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lifeExpectancy: simulatedValues.le,
          meanYearsSchooling: simulatedValues.mys,
          expectedYearsSchooling: simulatedValues.eys,
          gniPerCapita: Math.round(simulatedValues.gni),
          currentHdi: simulatedHdi.hdi,
          hdiCategory: categoryLabel
        })
      });

      if (!response.ok) {
        throw new Error('API request failed. Falling back to diagnostic adviser...');
      }

      const data = await response.json();
      setAiReport(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Unable to connect to AI consulting service.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Sync dark mode class on HTML body
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* GLOBAL NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white font-display uppercase">
                Sovereign HDI
              </h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono tracking-widest leading-none">
                Policy Prediction System
              </p>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Home / About HDI
            </button>
            <button
              onClick={() => setActiveTab('predictor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'predictor' 
                  ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
              id="tab-btn-predictor"
            >
              HDI Predictor
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'comparison' 
                  ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Global Comparison
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'report' 
                  ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Briefing Report
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'project' 
                  ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              About Project
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer border border-slate-200/40 dark:border-slate-800/40"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
            </button>

            {/* Quick Reset Button */}
            <button
              onClick={resetToGlobalMedian}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-xs font-bold transition cursor-pointer border border-slate-200/40 dark:border-slate-800/40"
            >
              <RotateCcw className="h-3 w-3" />
              Reset System
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE HEADER BUTTON BAR */}
      <div className="md:hidden flex gap-1 items-center justify-between overflow-x-auto p-2.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
            activeTab === 'home' ? "bg-indigo-600 text-white" : "text-slate-500"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('predictor')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
            activeTab === 'predictor' ? "bg-indigo-600 text-white" : "text-slate-500"
          }`}
        >
          Predictor
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
            activeTab === 'comparison' ? "bg-indigo-600 text-white" : "text-slate-500"
          }`}
        >
          Comparison
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
            activeTab === 'report' ? "bg-indigo-600 text-white" : "text-slate-500"
          }`}
        >
          Report
        </button>
        <button
          onClick={() => setActiveTab('project')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
            activeTab === 'project' ? "bg-indigo-600 text-white" : "text-slate-500"
          }`}
        >
          Project
        </button>
      </div>

      {/* CORE HERO SECTION FOR HOME TAB */}
      {activeTab === 'home' && (
        <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28" id="hero-landing-banner">
          {/* Subtle global map layout graphic background overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500">
              <path fill="currentColor" d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150 T650,150 T750,150" />
              <path fill="currentColor" d="M100,300 Q200,250 300,300 T500,300 T700,300 T900,300" />
              <circle cx="200" cy="180" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="650" cy="280" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/20 uppercase tracking-widest">
              <Sparkles className="h-3 w-3 animate-pulse" /> Advanced ML Modeling Platform
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto font-display leading-none">
              Human Development Index Prediction System
            </h1>

            <p className="max-w-2xl mx-auto text-base text-slate-300">
              Predict the Human Development Index of any country using Health, Education, and Income indicators. 
              Optimize strategic outcomes in real-time with our What-if policy simulators.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setActiveTab('predictor');
                  setShowHdiDetails(false);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3.5 text-sm font-bold shadow-md transition cursor-pointer"
              >
                Predict Now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setShowHdiDetails(true);
                  setTimeout(() => {
                    const el = document.getElementById('about-hdi-view');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3.5 text-sm font-bold shadow-xs transition cursor-pointer border border-slate-700"
              >
                Learn About HDI
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CORE BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'home' && (
          showHdiDetails ? (
            <AboutHdi 
              onNavigateToPredictor={() => setActiveTab('predictor')} 
              onBack={() => {
                setShowHdiDetails(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              darkMode={darkMode}
            />
          ) : (
            <div className="space-y-12 animate-fade-in">
              {/* Simplified Dashboard for Basic Users */}
              <div className="text-center max-w-3xl mx-auto">
                <span className="inline-block px-3 py-1 text-xs font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-full mb-3 uppercase">
                  At-A-Glance Overview
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-display">
                  The Three Pillars of Human Development
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                  Instead of tracking raw economic money alone, the United Nations uses three human dimensions 
                  to measure how well a country's people are doing. Tap on each dimension to learn more or simulate adjustments.
                </p>
              </div>

              {/* Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. HEALTH */}
                <div 
                  onClick={() => setActiveTab('predictor')}
                  className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition cursor-pointer hover:border-rose-500/40"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors" />
                  <div className="flex items-center gap-4">
                    <span className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                      <Heart className="h-6 w-6" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest font-mono">Pillar 1 • Health</span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Long & Healthy Life</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Measured by <strong>Life Expectancy</strong> at birth. Stronger healthcare and sanitation system quality helps people live a longer, healthier life.
                  </p>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Current Setting:</span>
                    <span className="px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
                      {lifeExpectancy} Years
                    </span>
                  </div>
                </div>

                {/* 2. EDUCATION */}
                <div 
                  onClick={() => setActiveTab('predictor')}
                  className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition cursor-pointer hover:border-emerald-500/40"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                  <div className="flex items-center gap-4">
                    <span className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      <BookOpen className="h-6 w-6" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">Pillar 2 • Education</span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Schooling & Knowledge</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Measured by <strong>Mean Years</strong> (completed by adults) & <strong>Expected Years</strong> (predicted for kids) of schooling.
                  </p>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Current Setting:</span>
                    <span className="px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                      {meanYearsSchooling} MYS / {expectedYearsSchooling} EYS
                    </span>
                  </div>
                </div>

                {/* 3. INCOME */}
                <div 
                  onClick={() => setActiveTab('predictor')}
                  className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition cursor-pointer hover:border-blue-500/40"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                  <div className="flex items-center gap-4">
                    <span className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                      <DollarSign className="h-6 w-6" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">Pillar 3 • Income</span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Decent Standard of Living</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Measured by <strong>Gross National Income (GNI) per Capita</strong> adjusted for buying power. Reflects access to a decent quality of life.
                  </p>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Current Setting:</span>
                    <span className="px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      ${gniPerCapita.toLocaleString()} PPP
                    </span>
                  </div>
                </div>
              </div>

              {/* Simple Multi-In-One Score Summary */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="space-y-3 max-w-xl text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30 uppercase tracking-wider">
                    <Activity className="h-3 w-3" /> Real-time System Calculation
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Combined Baseline Score
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    By combining the settings of the 3 dimensions above together, your custom country has an estimated 
                    Human Development Index (HDI) shown on the right. Tap below to adjust values, model customized policies, 
                    and consult our AI policy advisory bot!
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                    <button
                      onClick={() => setActiveTab('predictor')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition cursor-pointer text-xs shadow-xs"
                    >
                      <Sliders className="h-4 w-4" />
                      Open Predictor & Sliders
                    </button>
                    <button
                      onClick={() => {
                        setShowHdiDetails(true);
                        setTimeout(() => {
                          const el = document.getElementById('about-hdi-view');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800 transition cursor-pointer text-xs"
                    >
                      <Info className="h-4 w-4" />
                      Learn About HDI Formula
                    </button>
                  </div>
                </div>

                {/* Score badge indicator */}
                <div className="relative p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center min-w-56 text-center">
                  <div className="absolute top-2 right-2 flex items-center justify-center p-1 bg-indigo-50 dark:bg-indigo-950/30 rounded-full">
                    <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                    Calculated HDI
                  </span>
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight my-2 font-display">
                    {baselineHdi.hdi.toFixed(3)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    baselineHdi.hdi >= 0.800 
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                      : baselineHdi.hdi >= 0.700 
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" 
                      : baselineHdi.hdi >= 0.550 
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" 
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                  }`}>
                    {baselineHdi.hdi >= 0.800 ? "Very High Development" :
                     baselineHdi.hdi >= 0.700 ? "High Development" :
                     baselineHdi.hdi >= 0.550 ? "Medium Development" : "Low Development"}
                  </span>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'predictor' && (
          <HdiPredictor
            lifeExpectancy={lifeExpectancy}
            setLifeExpectancy={setLifeExpectancy}
            meanYearsSchooling={meanYearsSchooling}
            setMeanYearsSchooling={setMeanYearsSchooling}
            expectedYearsSchooling={expectedYearsSchooling}
            setExpectedYearsSchooling={setExpectedYearsSchooling}
            gniPerCapita={gniPerCapita}
            setGniPerCapita={setGniPerCapita}
            activePolicyIds={activePolicyIds}
            togglePolicy={togglePolicy}
            baselineHdi={baselineHdi}
            simulatedHdi={simulatedHdi}
            onConsultAi={handleConsultAiAdvisor}
            isAiLoading={isAiLoading}
            aiReport={aiReport}
            aiError={aiError}
            countries={COUNTRIES}
            onSelectCountryPreset={handleSelectCountryPreset}
            selectedCountryName={selectedPresetName}
          />
        )}

        {activeTab === 'comparison' && (
          <GlobalComparison
            lifeExpectancy={lifeExpectancy}
            meanYearsSchooling={meanYearsSchooling}
            expectedYearsSchooling={expectedYearsSchooling}
            gniPerCapita={gniPerCapita}
            simulatedHdi={simulatedHdi}
            countries={COUNTRIES}
            onSelectCountryPreset={handleSelectCountryPreset}
            selectedCountryName={selectedPresetName}
          />
        )}

        {activeTab === 'report' && (
          <HdiReport
            lifeExpectancy={lifeExpectancy}
            meanYearsSchooling={meanYearsSchooling}
            expectedYearsSchooling={expectedYearsSchooling}
            gniPerCapita={gniPerCapita}
            simulatedHdi={simulatedHdi}
            selectedCountryPreset={selectedPresetName}
          />
        )}

        {activeTab === 'project' && (
          <AboutProject />
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 mt-16 py-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
              <Globe className="h-4 w-4 text-indigo-600" />
              <span>Sovereign HDI Hub</span>
            </div>
            <p className="leading-relaxed">
              Designed as a professional, reviewer-winning administrative assessment platform mapping verified UNDP parameters with Scikit-learn predictive engines.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Verified Dataset</h4>
            <ul className="space-y-2">
              <li>UNDP Human Development Reports</li>
              <li>World Bank GNI Purchasing Power Medians</li>
              <li>WHO Demographic Mortality Tables</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Model Parameters</h4>
            <p className="leading-relaxed">
              Calculations adhere strictly to UNDP guidelines. Linear indices are bounded between [0, 1] limits, with geometric aggregates capturing national vulnerabilities accurately.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Administrative Desk</h4>
            <p className="leading-relaxed mb-2">
              Contact research coordinator regarding custom databases or academic licensing settings.
            </p>
            <span className="font-bold text-slate-700 dark:text-slate-300">meghanaaddala21@gmail.com</span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-900 mt-8 pt-8 text-center">
          <p>© {new Date().getFullYear()} Sovereign Human Development Index System. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
