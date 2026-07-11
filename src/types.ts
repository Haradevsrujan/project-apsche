export interface Preset {
  id: string;
  name: string;
  description: string;
  lifeExpectancy: number;
  meanYearsSchooling: number;
  expectedYearsSchooling: number;
  gniPerCapita: number;
  badge: string;
}

export interface Policy {
  id: string;
  title: string;
  dimension: "Health" | "Education" | "Income";
  description: string;
  boost: {
    lifeExpectancy: number;
    meanYearsSchooling: number;
    expectedYearsSchooling: number;
    gniMultiplier: number;
  };
  difficulty: "Low" | "Medium" | "High";
  costLabel: "Budget Surplus" | "Moderate Cost" | "Significant Investment";
  impactText: string;
}

export interface CountryData {
  name: string;
  code: string;
  hdi: number;
  rank: number;
  lifeExpectancy: number;
  meanYearsSchooling: number;
  expectedYearsSchooling: number;
  gniPerCapita: number;
  trends: number[]; // 2020, 2021, 2022, 2023
  continent: string;
}

export interface HdiComputation {
  lei: number;
  mysi: number;
  eysi: number;
  ei: number;
  ii: number;
  hdi: number;
}
