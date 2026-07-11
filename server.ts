import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Derive __filename and __dirname in a way that works for both ESM and
// CommonJS bundles. When `import.meta.url` is unavailable (e.g., after
// bundling to CJS), fall back to sensible defaults so the server doesn't crash
// at startup in production environments like Render.
let __filename: string;
let __dirname: string;
try {
  // Preferred approach for ESM environments
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (err) {
  // Fallback for CommonJS or bundled output where import.meta.url may be undefined
  __filename = process.argv && process.argv[1] ? process.argv[1] : '';
  __dirname = __filename ? path.dirname(__filename) : process.cwd();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route for HDI Policy Advisor
  app.post('/api/advisor', async (req, res) => {
    try {
      const { lifeExpectancy, meanYearsSchooling, expectedYearsSchooling, gniPerCapita, currentHdi, hdiCategory } = req.body;

      if (
        lifeExpectancy === undefined ||
        meanYearsSchooling === undefined ||
        expectedYearsSchooling === undefined ||
        gniPerCapita === undefined ||
        currentHdi === undefined ||
        !hdiCategory
      ) {
        return res.status(400).json({ error: 'Missing country development parameters.' });
      }

      // Check for Gemini API key
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
        console.warn('GEMINI_API_KEY is not configured or is a placeholder. Serving dynamic heuristic fallback.');
        const fallback = generateFallbackRecommendations(
          lifeExpectancy,
          meanYearsSchooling,
          expectedYearsSchooling,
          gniPerCapita,
          currentHdi,
          hdiCategory
        );
        return res.json(fallback);
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are a Senior Policy Reviewer for the United Nations Development Programme (UNDP). 
Evaluate this country profile and generate a comprehensive HDI Policy Advisory Report.

Country Indicators:
- Life Expectancy: ${lifeExpectancy} years (normalized Health Index: ${((lifeExpectancy - 20) / 65).toFixed(3)})
- Mean Years of Schooling (adults): ${meanYearsSchooling} years (normalized MYSI: ${(meanYearsSchooling / 15).toFixed(3)})
- Expected Years of Schooling (children): ${expectedYearsSchooling} years (normalized EYSI: ${(expectedYearsSchooling / 18).toFixed(3)})
- GNI per Capita (PPP): $${gniPerCapita} (normalized Income Index: ${((Math.log(gniPerCapita) - Math.log(100)) / (Math.log(75000) - Math.log(100))).toFixed(3)})
- Current Computed HDI: ${currentHdi.toFixed(4)}
- Development Tier: ${hdiCategory}

Analyze:
1. The primary developmental bottleneck (health, education, or income).
2. Development gaps compared to Very High HDI countries (Life Expectancy 80+, MYS 12+, EYS 16+, GNI $40,000+).
3. 4 highly targeted, realistic, and actionable policy interventions:
   - For each intervention, specify which HDI dimension it targets ("Health", "Education", or "Income"), the specific action title, detailed description of execution, implementation difficulty ("Low", "Medium", "High"), timeline ("Short-Term", "Medium-Term", "Long-Term"), and projected HDI impact ("Low", "Medium", "High").
4. A calculated projection of how much these combined interventions would increase the country's HDI score (e.g., +0.045).
5. A project reviewer review summary rating the viability of rapid development intervention in this country (e.g., "Highly Recommended", "Strategic Focus Required", "Immediate Structural Overhaul Needed").

Generate a complete and valid JSON response matching the requested schema. Do not include markdown tags inside the JSON strings.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reviewerStatus: {
                type: Type.STRING,
                description: "Brief 1-sentence reviewer status/verdict on viability, e.g., Strategic Intervention Priority"
              },
              overallAnalysis: {
                type: Type.STRING,
                description: "A detailed 2-3 paragraph policy evaluation of the country's indicators, highlighting its chief structural bottlenecks."
              },
              keyBottleneck: {
                type: Type.STRING,
                description: "The primary dimension lagging behind (Health, Education, or Income)"
              },
              benchmarks: {
                type: Type.OBJECT,
                properties: {
                  healthGap: { type: Type.STRING, description: "Comparison of health to Very High HDI benchmarks" },
                  educationGap: { type: Type.STRING, description: "Comparison of education to Very High HDI benchmarks" },
                  incomeGap: { type: Type.STRING, description: "Comparison of income to Very High HDI benchmarks" }
                },
                required: ["healthGap", "educationGap", "incomeGap"]
              },
              interventions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dimension: { type: Type.STRING, description: "Health, Education, or Income" },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    difficulty: { type: Type.STRING, description: "Low, Medium, or High" },
                    timeline: { type: Type.STRING, description: "Short-Term, Medium-Term, or Long-Term" },
                    impact: { type: Type.STRING, description: "Low, Medium, or High" },
                    estimatedHdiBoost: { type: Type.NUMBER, description: "Numeric fractional boost to HDI, e.g., 0.015" }
                  },
                  required: ["dimension", "title", "description", "difficulty", "timeline", "impact", "estimatedHdiBoost"]
                }
              },
              projectedHdiBoost: {
                type: Type.NUMBER,
                description: "Estimated cumulative boost to the country's HDI score if recommendations are successfully implemented."
              }
            },
            required: ["reviewerStatus", "overallAnalysis", "keyBottleneck", "benchmarks", "interventions", "projectedHdiBoost"]
          }
        }
      });

      const text = response.text || '{}';
      const data = JSON.parse(text.trim());
      res.json(data);
    } catch (error: any) {
      console.error('Error with Gemini API:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Serve static files / development middleware
  if (process.env.NODE_ENV !== 'production') {
    // Lazily import Vite to avoid loading it in production (where Vite may not be installed)
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve from the Vite build output
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
  });
}

function generateFallbackRecommendations(le: number, mys: number, eys: number, gni: number, currentHdi: number, category: string) {
  // Determine normalized dimension indices
  const lei = Math.max(0, Math.min(1, (le - 20) / 65));
  const mysi = Math.max(0, Math.min(1, mys / 15));
  const eysi = Math.max(0, Math.min(1, eys / 18));
  const ei = (mysi + eysi) / 2;
  const ii = Math.max(0, Math.min(1, (Math.log(gni) - Math.log(100)) / (Math.log(75000) - Math.log(100))));

  let keyBottleneck = "Income";
  let minIndexValue = ii;

  if (lei < minIndexValue) {
    keyBottleneck = "Health";
    minIndexValue = lei;
  }
  if (ei < minIndexValue) {
    keyBottleneck = "Education";
    minIndexValue = ei;
  }

  let reviewerStatus = "Strategic Focus Required";
  if (currentHdi < 0.550) {
    reviewerStatus = "Immediate Structural Intervention Urgent";
  } else if (currentHdi >= 0.800) {
    reviewerStatus = "High Performance Optimization Recommended";
  }

  const interventions = [];

  // Recommend 1: Health
  if (lei < 0.70) {
    interventions.push({
      dimension: "Health",
      title: "Primary Healthcare Expansion & Vaccination Campaign",
      description: "Build robust rural health outposts, subsidize prenatal checkups, and implement comprehensive childhood immunization protocols to counter life expectancy deficits.",
      difficulty: "Medium",
      timeline: "Short-Term",
      impact: "High",
      estimatedHdiBoost: 0.024
    });
  } else {
    interventions.push({
      dimension: "Health",
      title: "Universal Cardiovascular & Geriatric Care Protocol",
      description: "Introduce free screening networks for hypertension, support healthy-aging nutrition initiatives, and upgrade district oncology equipment to raise longevity benchmarks.",
      difficulty: "High",
      timeline: "Medium-Term",
      impact: "Medium",
      estimatedHdiBoost: 0.009
    });
  }

  // Recommend 2: Education
  if (ei < 0.70) {
    interventions.push({
      dimension: "Education",
      title: "School Feeding Programs & Rural Teacher Incentives",
      description: "Increase Expected Years of Schooling by linking enrollment with free daily school meals, and assign premium stipends for highly qualified teachers in remote zones.",
      difficulty: "Low",
      timeline: "Short-Term",
      impact: "High",
      estimatedHdiBoost: 0.027
    });
  } else {
    interventions.push({
      dimension: "Education",
      title: "Vocational Academy Grants & University Research Integration",
      description: "Create state-backed software academies and digital centers, and subsidize private tech sector internships to capitalize on existing years of schooling.",
      difficulty: "Medium",
      timeline: "Medium-Term",
      impact: "Medium",
      estimatedHdiBoost: 0.014
    });
  }

  // Recommend 3: Income
  if (ii < 0.60) {
    interventions.push({
      dimension: "Income",
      title: "Agrarian Modernization & SME Micro-Credits",
      description: "Introduce mobile micro-lending portals to bypass traditional collateral requirements, and distribute solar-powered water pumps to safeguard rural agricultural revenue.",
      difficulty: "Low",
      timeline: "Short-Term",
      impact: "High",
      estimatedHdiBoost: 0.029
    });
  } else {
    interventions.push({
      dimension: "Income",
      title: "Special Economic Zones & Digital Services Deregulation",
      description: "Establish dedicated low-tax industrial corridors with high-speed fiber grids to absorb urban youth and expand the export-oriented high-value digital sector.",
      difficulty: "High",
      timeline: "Long-Term",
      impact: "High",
      estimatedHdiBoost: 0.021
    });
  }

  // Recommend 4: Tailored structural review
  interventions.push({
    dimension: keyBottleneck,
    title: `${keyBottleneck} Budget Audit & Administrative Streamlining`,
    description: `Target the primary developmental lag by auditing ${keyBottleneck.toLowerCase()} expenditure, eradicating bureaucratic overheads, and reallocating resources directly to local providers.`,
    difficulty: "Medium",
    timeline: "Short-Term",
    impact: "Medium",
    estimatedHdiBoost: 0.012
  });

  const healthGap = lei >= 0.85 
    ? "Health indicators are in line with leading sovereign tiers, indicating low infant mortality and high public safety."
    : lei >= 0.7 
    ? "Moderate longevity levels; however, premature deaths from preventable cardiovascular causes limit additional expansion."
    : "Critical health deficit. Low access to clean water, poor medical infrastructure, and low immunization drag down the index.";

  const educationGap = ei >= 0.85
    ? "Strong average educational pathways; secondary and tertiary retention levels are outstanding."
    : ei >= 0.65
    ? "Intermediate school careers. High enrollment in primary tiers is offset by heavy secondary school dropout ratios."
    : "Substantial educational deficit. Classroom capacity shortages and economic child labor pressures disrupt elementary learning.";

  const incomeGap = ii >= 0.8
    ? "Outstanding GNI indicators, indicative of diversified export operations and high-value internal trade."
    : ii >= 0.55
    ? "Emerging income tiers. Economic activity remains overly reliant on primary commodities or agriculture, yielding middle-income traps."
    : "Severe structural economic stagnation. Extremely low average wages, high informal sector share, and credit starvation.";

  const projectedHdiBoost = interventions.reduce((acc, curr) => acc + curr.estimatedHdiBoost, 0);

  return {
    reviewerStatus,
    overallAnalysis: `The country represents an overall development profile matching the ${category} tier. Based on our statistical composite analysis, the primary development bottleneck is ${keyBottleneck} (currently indexing at ${minIndexValue.toFixed(3)}). To accelerate progress towards high-tier classifications, policy architectures must execute structural interventions in this key sector. If the recommended action points are fully operationalized, the country could expect a cumulative HDI increase of +${projectedHdiBoost.toFixed(3)}, significantly upgrading its citizens' well-being.`,
    keyBottleneck,
    benchmarks: {
      healthGap,
      educationGap,
      incomeGap
    },
    interventions,
    projectedHdiBoost: parseFloat(projectedHdiBoost.toFixed(3))
  };
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
