
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';
import type { TrustAccount } from './trust-account-data';
import { trustAccounts } from './trust-account-data';


export type Document = {
  id: string;
  name: string;
  type: '1099-DIV' | 'K-1' | '1099-INT' | 'W-2';
  broker: string;
  year: number;
  status: 'Pending' | 'Processed' | 'Error';
  dateAdded: string;
};

export const documents: Document[] = [
  { id: 'DOC001', name: 'Fidelity_1099_2023.pdf', type: '1099-DIV', broker: 'Fidelity', year: 2023, status: 'Processed', dateAdded: '2024-02-15' },
  { id: 'DOC002', name: 'Carlyle_K1_2023.pdf', type: 'K-1', broker: 'Carlyle Group', year: 2023, status: 'Processed', dateAdded: '2024-03-10' },
  { id: 'DOC003', name: 'Schwab_1099_2023.pdf', type: '1099-INT', broker: 'Charles Schwab', year: 2023, status: 'Processed', dateAdded: '2024-02-20' },
  { id: 'DOC004', name: 'MS_1099_2023_Cons.pdf', type: '1099-DIV', broker: 'Morgan Stanley', year: 2023, status: 'Pending', dateAdded: '2024-03-25' },
  { id: 'DOC005', name: 'Blackstone_K1_2023.pdf', type: 'K-1', broker: 'Blackstone', year: 2023, status: 'Processed', dateAdded: '2024-03-12' },
  { id: 'DOC006', name: 'Corrupt_Doc.pdf', type: 'W-2', broker: 'Vanguard', year: 2023, status: 'Error', dateAdded: '2024-03-28' },
  { id: 'DOC007', name: 'JPM_1099_2023.pdf', type: '1099-DIV', broker: 'JP Morgan', year: 2023, status: 'Pending', dateAdded: '2024-03-29' },
];

export type Position = {
  id: string;
  name: string;
  type: 'PTP' | 'Private LP';
  broker: string;
  status: 'Active' | 'Sold' | 'Pending Update';
  yearEndEstimate: string;
};

export const positions: Position[] = [
  { id: 'POS01', name: 'Energy Transfer LP', type: 'PTP', broker: 'Fidelity', status: 'Active', yearEndEstimate: 'Received' },
  { id: 'POS02', name: 'Blackstone Fund VIII', type: 'Private LP', broker: 'Internal', status: 'Active', yearEndEstimate: 'Pending' },
  { id: 'POS03', name: 'Enterprise Products', type: 'PTP', broker: 'Charles Schwab', status: 'Sold', yearEndEstimate: 'Received' },
  { id: 'POS04', name: 'Carlyle Partners VII', type: 'Private LP', broker: 'Internal', status: 'Active', yearEndEstimate: 'Received' },
  { id: 'POS05', name: 'Magellan Midstream', type: 'PTP', broker: 'Morgan Stanley', status: 'Active', yearEndEstimate: 'Pending Update' },
];

export type Transaction = {
  id: string;
  date: string;
  client: string;
  amount: number;
  type: 'Distribution' | 'Cash Inflow' | 'Cash Outflow';
  status: 'Reviewed' | 'Flagged';
};

const generatedTransactions: Transaction[] = Array.from({length: 200}, (_, i) => {
    const clients = trustAccounts.map(a => a.trustName);
    const types: Transaction['type'][] = ['Distribution', 'Cash Inflow', 'Cash Outflow'];
    return {
        id: `TRN${String(i + 6).padStart(3, '0')}`,
        date: `2024-03-${String((i % 28) + 1).padStart(2, '0')}`,
        client: clients[i % clients.length],
        amount: Math.floor(Math.random() * (250000 - 5000 + 1)) + 5000,
        type: types[i % types.length],
        status: Math.random() > 0.2 ? 'Reviewed' : 'Flagged',
    }
});


export const transactions: Transaction[] = [
  { id: 'TRN001', date: '2024-03-15', client: 'John Doe Trust', amount: 75000, type: 'Distribution', status: 'Reviewed' },
  { id: 'TRN002', date: '2024-03-20', client: 'Jane Smith IRA', amount: 250000, type: 'Cash Inflow', status: 'Flagged' },
  { id: 'TRN003', date: '2024-03-22', client: 'Family Foundation', amount: 120000, type: 'Distribution', status: 'Reviewed' },
  { id: 'TRN004', date: '2024-03-25', client: 'Legacy Holdings LLC', amount: 5000, type: 'Cash Outflow', status: 'Reviewed' },
  { id: 'TRN005', date: '2024-03-28', client: 'Childrens Education Fund', amount: 55000, type: 'Distribution', status: 'Flagged' },
  ...generatedTransactions
];


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


export const taxDiscrepancyData = [
    ...Array.from({ length: 35 }, (_, i) => ({ day: Math.floor(Math.random() * 30) + 1, amount: Math.floor(Math.random() * 900000) + 50000, issues: Math.floor(Math.random() * 3), type: '1099' })),
    ...Array.from({ length: 35 }, (_, i) => ({ day: Math.floor(Math.random() * 30) + 1, amount: Math.floor(Math.random() * 950000) + 50000, issues: Math.floor(Math.random() * 5), type: 'K-1' })),
];

export const documentStatusByTrustData = trustAccounts.slice(0, 5).map(account => {
    let received = 0;
    let pending = 0;
    let missing = 0;
    let error = 0;

    const checkStatus = (status: 'Pending' | 'Received' | 'Error' | 'Not Started') => {
        switch (status) {
            case 'Received': received++; break;
            case 'Pending': pending++; break;
            case 'Error': error++; break;
            case 'Not Started': missing++; break;
        }
    }

    checkStatus(account.status1099);
    
    if (account.brokers.some(b => b.hasK1)) {
        checkStatus(account.statusK1 as any); // Type assertion to match
    }

    return {
        trustName: account.trustName.replace(' Trust', '').replace(' Family', ''),
        received,
        pending,
        missing,
        error
    };
});

export const cpaComplianceData = cpaPartners.map(cpa => {
  const accountsForCpa = trustAccounts.filter(acc => acc.cpa === cpa.name);
  const filedCount = accountsForCpa.filter(acc => acc.taxReturnStatus === 'Filed').length;
  return {
    cpa: cpa.name.split(' ')[0], // Short name
    accounts: accountsForCpa.length,
    filed: filedCount
  }
});


export { trustAccounts };
export type { TrustAccount };


    
