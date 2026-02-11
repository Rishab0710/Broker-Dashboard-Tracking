

export type ControlSheetRow = {
    id: string;
    trustName: string;
    acctNo: string;
    year: number;
    broker: string;
    cpaFirm: string;
    owner: string;
    priority: 'High' | 'Normal' | 'Low';
    currentStage: string;
    stages: {
        intake: { complete: boolean; by?: string; at?: string };
        dataQa: { complete: boolean; issues?: string[] };
        stmtReview: { complete: boolean; reviewer?: string; findings?: string[] };
    };
    docs: {
        requiredStatus: 'COMPLETE' | 'MISSING' | 'PARTIAL';
        missing: string[];
        links: { path: string; kind: string }[];
    };
    sla: {
        due?: string;
        health: 'GREEN' | 'AMBER' | 'RED';
    };
    exceptionTags: string[];
    sheetVersion: number;
    locked: boolean;
    lastUpdated: string;
};

const stages = ['Intake', 'Data QA', 'Statement Review', 'Transactional Reconciliation', 'LP/LLC Gathering', '1099 Form Gen', 'CPA Review', 'IRS Submission', 'Client Delivery'];
const owners = ['Alex Green', 'Brian Wilson', 'Cathy Lee', 'David Garcia'];
const cpaFirms = ['TaxPro Associates', 'Chen & Partners', 'RM Tax Services', 'Williams Financial'];
const brokers = ['Schwab', 'Fidelity', 'Morgan Stanley', 'JP Morgan'];
const priorities: ControlSheetRow['priority'][] = ['High', 'Normal', 'Low'];

export const kpiData = {
    totalTrusts: 158,
    stageProgress: { inProgress: 88, readyForReview: 32 },
    docsComplete: 78,
    exceptionsOpen: 24,
    slaBreaches: 3,
    readyFor1099: 45,
};

export const stageFunnelData = [
  { value: 158, name: 'Intake', fill: 'hsl(var(--chart-1))' },
  { value: 140, name: 'Data QA', fill: 'hsl(var(--chart-2))' },
  { value: 110, name: 'Review', fill: 'hsl(var(--chart-3))' },
  { value: 88, name: 'CPA Review', fill: 'hsl(var(--chart-4))' },
  { value: 50, name: 'Submitted', fill: 'hsl(var(--chart-5))' },
];

export const exceptionsByTypeData = [
    { type: 'Missing Doc', count: 12 },
    { type: 'Data Mismatch', count: 8 },
    { type: 'SLA Breach', count: 3 },
    { type: 'Validation Fail', count: 1 },
];

export const controlSheetData: ControlSheetRow[] = Array.from({ length: 50 }, (_, i) => {
    const currentStage = stages[i % stages.length];
    const slaHealth = i % 10 === 0 ? 'RED' : i % 5 === 0 ? 'AMBER' : 'GREEN';
    const docsComplete = i % 4 !== 0;

    return {
        id: `CSR-${1001 + i}`,
        trustName: `Maplewood Trust #${i + 1}`,
        acctNo: `...${1234 + i}`,
        year: 2024,
        broker: brokers[i % brokers.length],
        cpaFirm: cpaFirms[i % cpaFirms.length],
        owner: owners[i % owners.length],
        priority: priorities[i % priorities.length],
        currentStage,
        stages: {
            intake: { complete: true, at: '2024-01-15' },
            dataQa: { complete: stages.indexOf(currentStage) > 0 },
            stmtReview: { complete: stages.indexOf(currentStage) > 1 },
        },
        docs: {
            requiredStatus: docsComplete ? 'COMPLETE' : 'MISSING',
            missing: docsComplete ? [] : ['Broker 1099'],
            links: [],
        },
        sla: {
            health: slaHealth,
            due: slaHealth === 'RED' ? '2024-03-20' : '2024-04-15'
        },
        exceptionTags: slaHealth === 'RED' ? ['SLA Breach', 'Missing K-1'] : docsComplete ? [] : ['Missing 1099'],
        sheetVersion: 1,
        locked: false,
        lastUpdated: `Mar ${28 - (i % 5)}, 2024`
    };
});
