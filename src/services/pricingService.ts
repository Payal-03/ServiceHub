import { MOCK_CATEGORIES } from '../constants/mockData';
import { MockStorage } from './mockStorage';

export interface ServiceProblemOption {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  title: string;
  baseMultiplier: number;
  complexityRatio: [number, number]; // [minRatio, maxRatio]
  typicalTurnaround: string;
  popular?: boolean;
}

export const COMMON_SERVICE_PROBLEMS: ServiceProblemOption[] = [
  {
    id: 'el-wiring',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'Room Wiring / Short Circuit Repair',
    baseMultiplier: 1.1,
    complexityRatio: [1.0, 1.4],
    typicalTurnaround: '1–2 hours',
    popular: true,
  },
  {
    id: 'el-mcb',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'MCB Tripping & Switchboard Replacement',
    baseMultiplier: 1.0,
    complexityRatio: [0.9, 1.3],
    typicalTurnaround: '45 mins',
    popular: true,
  },
  {
    id: 'el-fan',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'Ceiling Fan Installation & Regulator Fix',
    baseMultiplier: 0.8,
    complexityRatio: [0.8, 1.1],
    typicalTurnaround: '30 mins',
    popular: true,
  },
  {
    id: 'el-inverter',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'Inverter & Battery Wiring Setup',
    baseMultiplier: 1.4,
    complexityRatio: [1.2, 1.8],
    typicalTurnaround: '2 hours',
  },
  {
    id: 'el-geyser',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'Geyser & Water Heater Wiring',
    baseMultiplier: 1.0,
    complexityRatio: [0.9, 1.3],
    typicalTurnaround: '1 hour',
  },
  {
    id: 'el-ac-point',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'AC Power Point & Stabilizer Setup',
    baseMultiplier: 1.0,
    complexityRatio: [0.9, 1.3],
    typicalTurnaround: '1 hour',
  },
  {
    id: 'el-lighting',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'LED Panel, Chandelier & Decorative Lighting',
    baseMultiplier: 1.1,
    complexityRatio: [0.9, 1.5],
    typicalTurnaround: '1–2 hours',
  },
  {
    id: 'el-smart',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'Smart Switch & Home Automation Setup',
    baseMultiplier: 1.6,
    complexityRatio: [1.2, 2.0],
    typicalTurnaround: '2 hours',
  },
  {
    id: 'el-pump',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'Water Pump & Motor Starter Wiring',
    baseMultiplier: 1.3,
    complexityRatio: [1.1, 1.7],
    typicalTurnaround: '1.5 hours',
  },
  {
    id: 'el-safety',
    categoryId: 'cat-1',
    categorySlug: 'electrician',
    categoryName: 'Electrician',
    title: 'Home Electrical Safety Inspection & Earthing Check',
    baseMultiplier: 2.0,
    complexityRatio: [1.5, 2.8],
    typicalTurnaround: '3 hours',
  },
];

export interface PriceEstimationResult {
  categoryId: string;
  categoryName: string;
  benchmarkBase: number;
  estimatedMin: number;
  estimatedMax: number;
  typicalBudget: number;
  formattedRange: string;
  notes: string;
}

/**
 * Calculates a transparent price estimate range for an electrical job and optional problem type.
 * Centralizes all estimation logic so components do not hard-code arbitrary numbers.
 */
export const calculateServiceEstimate = (
  categoryIdOrSlug: string,
  serviceTypeIdOrTitle?: string
): PriceEstimationResult => {
  // Read live category data so admin changes to the benchmark price are reflected in estimates.
  const categories = MockStorage.getCategories();
  const pool = categories.length > 0 ? categories : MOCK_CATEGORIES;
  const category = pool.find(
    (c) => c.id === categoryIdOrSlug || c.slug === categoryIdOrSlug || c.name.toLowerCase() === categoryIdOrSlug.toLowerCase()
  ) || pool[0];

  const problemOption = COMMON_SERVICE_PROBLEMS.find(
    (p) =>
      p.id === serviceTypeIdOrTitle ||
      p.title.toLowerCase() === (serviceTypeIdOrTitle || '').toLowerCase()
  );

  const basePrice = category.basePrice || 499;

  let multiplier = 1.0;
  let minRatio = 0.9;
  let maxRatio = 1.4;

  if (problemOption) {
    multiplier = problemOption.baseMultiplier;
    minRatio = problemOption.complexityRatio[0];
    maxRatio = problemOption.complexityRatio[1];
  }

  // Round to nearest 50 for clean Indian Rupee numbers
  const roundToFifty = (val: number) => Math.round(val / 50) * 50;

  const estimatedMin = Math.max(250, roundToFifty(basePrice * multiplier * minRatio));
  const estimatedMax = Math.max(estimatedMin + 150, roundToFifty(basePrice * multiplier * maxRatio));
  const typicalBudget = roundToFifty((estimatedMin + estimatedMax) / 2);

  return {
    categoryId: category.id,
    categoryName: category.name,
    benchmarkBase: basePrice,
    estimatedMin,
    estimatedMax,
    typicalBudget,
    formattedRange: `₹${estimatedMin.toLocaleString('en-IN')} – ₹${estimatedMax.toLocaleString('en-IN')}`,
    notes: 'Estimated benchmark based on local market trade rates and parts diagnosis. Final charges require your approval.',
  };
};
