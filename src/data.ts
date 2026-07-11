import { Preset, Policy, CountryData } from './types';

export const SCENARIOS: Preset[] = [
  {
    id: "scenario-1",
    name: "Scenario 1: Very High Development (Nordic Model)",
    description: "Extremely high longevity, comprehensive higher-education streams, and elevated household productivity.",
    lifeExpectancy: 83.2,
    meanYearsSchooling: 13.5,
    expectedYearsSchooling: 18.5,
    gniPerCapita: 66000,
    badge: "Very High"
  },
  {
    id: "scenario-2",
    name: "Scenario 2: High Development (Emerging Vanguard)",
    description: "Robust primary and secondary education frameworks with a rapidly scaling services sector.",
    lifeExpectancy: 74.5,
    meanYearsSchooling: 9.8,
    expectedYearsSchooling: 14.2,
    gniPerCapita: 19500,
    badge: "High"
  },
  {
    id: "scenario-3",
    name: "Scenario 3: Emerging Economy (Medium Profile)",
    description: "Active basic education campaigns offset by high secondary dropouts and middle-income stagnation.",
    lifeExpectancy: 67.8,
    meanYearsSchooling: 7.5,
    expectedYearsSchooling: 11.5,
    gniPerCapita: 8500,
    badge: "Medium"
  },
  {
    id: "scenario-4",
    name: "Scenario 4: Structural Intervention (Low Profile)",
    description: "Critical resource deficits. Constrained medical facilities, high youth dropouts, and low subsistence GNI.",
    lifeExpectancy: 53.0,
    meanYearsSchooling: 3.5,
    expectedYearsSchooling: 7.0,
    gniPerCapita: 1200,
    badge: "Low"
  }
];

export const POLICY_INTERVENTIONS: Policy[] = [
  {
    id: "policy-health-1",
    title: "Maternal Health & Primary Clinic Expansion",
    dimension: "Health",
    description: "Deploy community clinics to rural and informal sectors, provide infant vitamin formulas, and mandate universal childhood vaccination programs.",
    boost: { lifeExpectancy: 4.5, meanYearsSchooling: 0, expectedYearsSchooling: 0, gniMultiplier: 1.0 },
    difficulty: "Medium",
    costLabel: "Moderate Cost",
    impactText: "+4.5 yrs Life Expectancy"
  },
  {
    id: "policy-health-2",
    title: "Sovereign Water & Sanitation Grid Support",
    dimension: "Health",
    description: "Construct clean community water pumps, eliminate municipal waste accumulation, and install drainage pipelines to curb waterborne longevity deficits.",
    boost: { lifeExpectancy: 3.2, meanYearsSchooling: 0, expectedYearsSchooling: 0, gniMultiplier: 1.02 },
    difficulty: "High",
    costLabel: "Significant Investment",
    impactText: "+3.2 yrs Life Expectancy, +2% GNI"
  },
  {
    id: "policy-edu-1",
    title: "Universal Hot School Meals Campaign",
    dimension: "Education",
    description: "Guarantee a highly nutritious, free midday hot meal to primary school children, dramatically raising school attendance and reducing child labor pressure.",
    boost: { lifeExpectancy: 0.5, meanYearsSchooling: 0, expectedYearsSchooling: 2.5, gniMultiplier: 1.0 },
    difficulty: "Low",
    costLabel: "Budget Surplus",
    impactText: "+2.5 yrs Expected Schooling"
  },
  {
    id: "policy-edu-2",
    title: "STEM Academy Funding & Teacher Stipends",
    dimension: "Education",
    description: "Introduce free specialized regional programming bootcamps, digitize curriculums, and distribute rural teaching stipends to secure adult qualifications.",
    boost: { lifeExpectancy: 0, meanYearsSchooling: 1.8, expectedYearsSchooling: 1.0, gniMultiplier: 1.15 },
    difficulty: "Medium",
    costLabel: "Moderate Cost",
    impactText: "+1.8 MYS, +1.0 EYS, +15% GNI Productivity"
  },
  {
    id: "policy-inc-1",
    title: "Agrarian Modernization & SME Micro-Credits",
    dimension: "Income",
    description: "Establish digital micro-finance micro-credit apps bypassing collateral checks, and issue solar irrigation grants for smallholders.",
    boost: { lifeExpectancy: 0, meanYearsSchooling: 0, expectedYearsSchooling: 0, gniMultiplier: 1.25 },
    difficulty: "Low",
    costLabel: "Budget Surplus",
    impactText: "+25% Gross National Income (GNI)"
  },
  {
    id: "policy-inc-2",
    title: "Special Digital Economic Corridors (SEZs)",
    dimension: "Income",
    description: "Incentivize foreign high-tech capital with zero-tax corridors, gigabit fiber lines, and modern technical learning centers.",
    boost: { lifeExpectancy: 0.8, meanYearsSchooling: 0.5, expectedYearsSchooling: 0.8, gniMultiplier: 1.40 },
    difficulty: "High",
    costLabel: "Significant Investment",
    impactText: "+40% GNI, +0.5 MYS, +0.8 EYS"
  }
];

export const COUNTRIES: CountryData[] = [
  {
    name: "Norway",
    code: "NO",
    hdi: 0.966,
    rank: 1,
    lifeExpectancy: 83.2,
    meanYearsSchooling: 13.1,
    expectedYearsSchooling: 18.7,
    gniPerCapita: 66000,
    trends: [0.957, 0.961, 0.964, 0.966],
    continent: "Europe"
  },
  {
    name: "Germany",
    code: "DE",
    hdi: 0.950,
    rank: 9,
    lifeExpectancy: 81.0,
    meanYearsSchooling: 14.1,
    expectedYearsSchooling: 17.3,
    gniPerCapita: 55000,
    trends: [0.942, 0.946, 0.948, 0.950],
    continent: "Europe"
  },
  {
    name: "Japan",
    code: "JP",
    hdi: 0.925,
    rank: 24,
    lifeExpectancy: 84.8,
    meanYearsSchooling: 12.7,
    expectedYearsSchooling: 15.2,
    gniPerCapita: 43000,
    trends: [0.919, 0.921, 0.923, 0.925],
    continent: "Asia"
  },
  {
    name: "Brazil",
    code: "BR",
    hdi: 0.760,
    rank: 89,
    lifeExpectancy: 73.4,
    meanYearsSchooling: 8.1,
    expectedYearsSchooling: 15.6,
    gniPerCapita: 15000,
    trends: [0.752, 0.754, 0.758, 0.760],
    continent: "Americas"
  },
  {
    name: "India",
    code: "IN",
    hdi: 0.644,
    rank: 134,
    lifeExpectancy: 67.2,
    meanYearsSchooling: 6.7,
    expectedYearsSchooling: 11.9,
    gniPerCapita: 6900,
    trends: [0.631, 0.635, 0.640, 0.644],
    continent: "Asia"
  },
  {
    name: "Kenya",
    code: "KE",
    hdi: 0.601,
    rank: 150,
    lifeExpectancy: 62.1,
    meanYearsSchooling: 6.8,
    expectedYearsSchooling: 10.7,
    gniPerCapita: 4500,
    trends: [0.589, 0.593, 0.597, 0.601],
    continent: "Africa"
  },
  {
    name: "Niger",
    code: "NE",
    hdi: 0.394,
    rank: 189,
    lifeExpectancy: 61.6,
    meanYearsSchooling: 2.1,
    expectedYearsSchooling: 5.7,
    gniPerCapita: 1250,
    trends: [0.381, 0.386, 0.390, 0.394],
    continent: "Africa"
  }
];

export const GLOBAL_AVERAGES = {
  lifeExpectancy: 72.0,
  meanYearsSchooling: 8.7,
  expectedYearsSchooling: 12.8,
  gniPerCapita: 16750,
  hdi: 0.732
};
