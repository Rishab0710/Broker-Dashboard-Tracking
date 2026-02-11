
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export type CpaPartner = {
  id: string;
  name: string;
  firm: string;
  workload: number;
  turnaroundTime: number; // in days
  status: 'On Track' | 'Delayed' | 'Completed';
  avatar: ImagePlaceholder | null;
  initials: string;
};

const cpaImages = {
  cpa1: PlaceHolderImages.find(p => p.id === 'cpa1')!,
  cpa2: PlaceHolderImages.find(p => p.id === 'cpa2')!,
  cpa3: PlaceHolderImages.find(p => p.id === 'cpa3')!,
  cpa4: PlaceHolderImages.find(p => p.id === 'cpa4')!,
}

export const cpaPartners: CpaPartner[] = [
  { id: 'CPA01', name: 'Sarah Johnson', firm: 'TaxPro Associates', workload: 8, turnaroundTime: 5, status: 'On Track', avatar: cpaImages.cpa1, initials: 'SJ' },
  { id: 'CPA02', name: 'David Chen', firm: 'Chen & Partners', workload: 12, turnaroundTime: 7, status: 'Delayed', avatar: cpaImages.cpa2, initials: 'DC' },
  { id: 'CPA03', name: 'Maria Rodriguez', firm: 'RM Tax Services', workload: 5, turnaroundTime: 4, status: 'On Track', avatar: cpaImages.cpa3, initials: 'MR' },
  { id: 'CPA04', name: 'Tom Williams', firm: 'Williams Financial', workload: 3, turnaroundTime: 6, status: 'Completed', avatar: cpaImages.cpa4, initials: 'TW' },
];

export const chartData = [
  { date: 'Mar 1', 'Processed': 12, 'Ingested': 20 },
  { date: 'Mar 2', 'Processed': 15, 'Ingested': 25 },
  { date: 'Mar 3', 'Processed': 18, 'Ingested': 30 },
  { date: 'Mar 4', 'Processed': 22, 'Ingested': 38 },
  { date: 'Mar 5', 'Processed': 30, 'Ingested': 45 },
  { date: 'Mar 6', 'Processed': 35, 'Ingested': 50 },
  { date: 'Mar 7', 'Processed': 40, 'Ingested': 60 },
];

export const taxWorksheetData = {
  summary: {
    totalProceeds: 1250345.67,
    totalCostBasis: 987123.45,
    netGainLoss: 263222.22,
    taxExemptInterest: 15234.89,
  },
  salesData: [
    { broker: 'Fidelity', proceeds: 500123.45, costBasis: 450000.12, net: 50123.33 },
    { broker: 'Charles Schwab', proceeds: 350000.00, costBasis: 275123.33, net: 74876.67 },
    { broker: 'Morgan Stanley', proceeds: 400222.22, costBasis: 262000.00, net: 138222.22 },
  ],
  exemptInterest: [
    { broker: 'Fidelity', amount: 7100.50 },
    { broker: 'Charles Schwab', amount: 5034.39 },
    { broker: 'Morgan Stanley', amount: 3100.00 },
  ]
};

// Data for new charts
export const monthlyProcessingData = [
  { month: 'Jan', '1099s': 40, 'K-1s': 24 },
  { month: 'Feb', '1099s': 30, 'K-1s': 22 },
  { month: 'Mar', '1099s': 50, 'K-1s': 42 },
  { month: 'Apr', '1099s': 47, 'K-1s': 45 },
  { month: 'May', '1099s': 43, 'K-1s': 39 },
  { month: 'Jun', '1099s': 54, 'K-1s': 48 },
];

export const taxReportingFunnelData = [
  { value: 158, name: 'Draft', fill: 'hsl(var(--chart-5))' },
  { value: 120, name: 'Review', fill: 'hsl(var(--chart-4))' },
  { value: 95, name: 'Approved', fill: 'hsl(var(--chart-2))' },
  { value: 71, name: 'Filed', fill: 'hsl(var(--chart-1))' },
];

export const assetPerformanceData = [
    { trust: 'Maplewood', equities: 12, bonds: 8, cash: 5, alternatives: 3 },
    { trust: 'Oak Ridge', equities: 9, bonds: 15, cash: 3, alternatives: 4 },
    { trust: 'Willow Creek', equities: 15, bonds: 5, cash: 8, alternatives: 5 },
    { trust: 'Pine Grove', equities: 7, bonds: 10, cash: 12, alternatives: 3 },
    { trust: 'Cedar Hill', equities: 10, bonds: 12, cash: 7, alternatives: 1 },
    { trust: 'Elm Street', equities: 5, bonds: 7, cash: 15, alternatives: 6 },
    { trust: 'Riverbend', equities: 8, bonds: 10, cash: 10, alternatives: 2 },
    { trust: 'Stonebridge', equities: 11, bonds: 9, cash: 6, alternatives: 4 },
];
