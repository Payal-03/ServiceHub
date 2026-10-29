import React from 'react';
import {
  Fan,
  Lightbulb,
  ToggleRight,
  AlertTriangle,
  AirVent,
  Tv,
  Flame,
  Wrench,
  LucideIcon,
} from 'lucide-react';
import { ServiceCategory } from '../types';

export interface CategoryInfo {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  colorClass: string;
}

export const STANDARD_CATEGORIES: CategoryInfo[] = [
  {
    id: 1,
    name: 'Fan & Lighting',
    description: 'Fans, regulators, bulbs, tube lights, LED lights, decorative lights, and exhaust fans.',
    icon: Fan,
    badge: 'Popular',
    colorClass: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200',
  },
  {
    id: 2,
    name: 'Switches, Sockets & Wiring',
    description: 'Switchboards, plug points, new wiring, rewiring, and loose connections.',
    icon: ToggleRight,
    badge: 'Essential',
    colorClass: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200',
  },
  {
    id: 3,
    name: 'Electrical Faults & Power',
    description: 'Power failures, short circuits, MCBs, fuses, and inverter connections.',
    icon: AlertTriangle,
    badge: 'Emergency',
    colorClass: 'from-rose-500/10 to-red-500/10 text-rose-600 border-rose-200',
  },
  {
    id: 4,
    name: 'AC Installation & Repair',
    description: 'AC installation, servicing, cooling issues, and AC electrical faults.',
    icon: AirVent,
    badge: 'Seasonal',
    colorClass: 'from-cyan-500/10 to-sky-500/10 text-cyan-600 border-cyan-200',
  },
  {
    id: 5,
    name: 'Home Appliance Repair',
    description: 'Washing machines, refrigerators, and other household appliances.',
    icon: Tv,
    badge: 'Specialist',
    colorClass: 'from-purple-500/10 to-violet-500/10 text-purple-600 border-purple-200',
  },
  {
    id: 6,
    name: 'Geyser & Water Heater',
    description: 'Installation, electrical connection issues, and repairs.',
    icon: Flame,
    badge: 'High Power',
    colorClass: 'from-orange-500/10 to-amber-500/10 text-orange-600 border-orange-200',
  },
  {
    id: 7,
    name: 'General Electrical Work',
    description: 'Doorbells, new electrical points, appliance connections, and other small electrical jobs.',
    icon: Wrench,
    badge: 'Quick Fix',
    colorClass: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200',
  },
];

export const DEFAULT_SERVICE_CATEGORIES: ServiceCategory[] = STANDARD_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.name,
  description: cat.description,
  active: true,
}));
