import { MOCK_CATEGORIES } from '../constants/mockData';

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
  // Electrician
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

  // Plumber
  {
    id: 'pl-pipe-leak',
    categoryId: 'cat-2',
    categorySlug: 'plumber',
    categoryName: 'Plumber',
    title: 'Water Pipe Leakage & Joint Sealing',
    baseMultiplier: 1.1,
    complexityRatio: [1.0, 1.5],
    typicalTurnaround: '1 hour',
    popular: true,
  },
  {
    id: 'pl-tap-flush',
    categoryId: 'cat-2',
    categorySlug: 'plumber',
    categoryName: 'Plumber',
    title: 'Tap, Shower & Flush Tank Repair',
    baseMultiplier: 0.9,
    complexityRatio: [0.8, 1.2],
    typicalTurnaround: '45 mins',
    popular: true,
  },
  {
    id: 'pl-drain',
    categoryId: 'cat-2',
    categorySlug: 'plumber',
    categoryName: 'Plumber',
    title: 'Sink & Bathroom Drain Blockage Clearing',
    baseMultiplier: 1.2,
    complexityRatio: [1.0, 1.6],
    typicalTurnaround: '1.5 hours',
  },
  {
    id: 'pl-geyser',
    categoryId: 'cat-2',
    categorySlug: 'plumber',
    categoryName: 'Plumber',
    title: 'Water Heater / Geyser Fitting & Inlet Pipes',
    baseMultiplier: 1.3,
    complexityRatio: [1.1, 1.7],
    typicalTurnaround: '1 hour',
  },

  // AC Repair
  {
    id: 'ac-cooling',
    categoryId: 'cat-3',
    categorySlug: 'ac-repair',
    categoryName: 'AC Repair',
    title: 'AC Not Cooling / Gas Leak Diagnostics',
    baseMultiplier: 1.2,
    complexityRatio: [1.0, 1.6],
    typicalTurnaround: '1.5 hours',
    popular: true,
  },
  {
    id: 'ac-jet-clean',
    categoryId: 'cat-3',
    categorySlug: 'ac-repair',
    categoryName: 'AC Repair',
    title: 'Deep Foam & High-Pressure Jet Service',
    baseMultiplier: 1.0,
    complexityRatio: [0.9, 1.3],
    typicalTurnaround: '1 hour',
    popular: true,
  },
  {
    id: 'ac-pcb',
    categoryId: 'cat-3',
    categorySlug: 'ac-repair',
    categoryName: 'AC Repair',
    title: 'Inverter AC PCB Board Repair',
    baseMultiplier: 1.8,
    complexityRatio: [1.4, 2.2],
    typicalTurnaround: '2–3 hours',
  },
  {
    id: 'ac-install',
    categoryId: 'cat-3',
    categorySlug: 'ac-repair',
    categoryName: 'AC Repair',
    title: 'Split AC Dismantling & Re-installation',
    baseMultiplier: 1.7,
    complexityRatio: [1.3, 2.0],
    typicalTurnaround: '2.5 hours',
  },

  // Laptop Repair
  {
    id: 'lp-screen-hinge',
    categoryId: 'cat-4',
    categorySlug: 'laptop-repair',
    categoryName: 'Laptop Repair',
    title: 'Broken Screen or Hinge Replacement',
    baseMultiplier: 1.4,
    complexityRatio: [1.1, 1.8],
    typicalTurnaround: 'Same day',
    popular: true,
  },
  {
    id: 'lp-os-slow',
    categoryId: 'cat-4',
    categorySlug: 'laptop-repair',
    categoryName: 'Laptop Repair',
    title: 'OS Crash, Virus & SSD Speed Upgrade',
    baseMultiplier: 1.0,
    complexityRatio: [0.8, 1.3],
    typicalTurnaround: '2 hours',
    popular: true,
  },
  {
    id: 'lp-battery',
    categoryId: 'cat-4',
    categorySlug: 'laptop-repair',
    categoryName: 'Laptop Repair',
    title: 'Battery Not Charging / Power Jack Repair',
    baseMultiplier: 1.1,
    complexityRatio: [0.9, 1.4],
    typicalTurnaround: '1.5 hours',
  },

  // Deep Cleaning
  {
    id: 'cl-bathroom',
    categoryId: 'cat-5',
    categorySlug: 'cleaning',
    categoryName: 'Deep Cleaning',
    title: 'Bathroom Hard-Water Stain Scrub & Sanitization',
    baseMultiplier: 0.9,
    complexityRatio: [0.8, 1.2],
    typicalTurnaround: '1.5 hours',
    popular: true,
  },
  {
    id: 'cl-kitchen',
    categoryId: 'cat-5',
    categorySlug: 'cleaning',
    categoryName: 'Deep Cleaning',
    title: 'Kitchen Degreasing, Chimney & Cabinets',
    baseMultiplier: 1.3,
    complexityRatio: [1.1, 1.6],
    typicalTurnaround: '2.5 hours',
    popular: true,
  },
  {
    id: 'cl-fullhome',
    categoryId: 'cat-5',
    categorySlug: 'cleaning',
    categoryName: 'Deep Cleaning',
    title: 'Full 2BHK/3BHK Home Deep Sanitization',
    baseMultiplier: 2.2,
    complexityRatio: [1.6, 2.8],
    typicalTurnaround: '5 hours',
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
 * Calculates a transparent price estimate range for any category and optional service/problem type.
 * Centralizes all estimation logic so components do not hard-code arbitrary numbers.
 */
export const calculateServiceEstimate = (
  categoryIdOrSlug: string,
  serviceTypeIdOrTitle?: string
): PriceEstimationResult => {
  const category = MOCK_CATEGORIES.find(
    (c) => c.id === categoryIdOrSlug || c.slug === categoryIdOrSlug || c.name.toLowerCase() === categoryIdOrSlug.toLowerCase()
  ) || MOCK_CATEGORIES[0];

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
