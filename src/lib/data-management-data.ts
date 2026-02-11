

export type TransactionDetail = {
  id: string;
  trustAccountName: string;
  accountNumber: string;
  marketValue: number;
  income: number;
  cusip: string;
  postingDate: string;
  broker: 'UBS' | 'Schwab' | 'Fidelity' | 'Morgan Stanley';
  trustType: 'Family' | 'Investment' | 'Holding';
  validationStatus: 'Valid' | 'Pending' | 'Invalid';
  issues: string[];
};

export const sourceMonitors = [
    { name: 'Schwab', completeness: 99, lastFile: '2 hours ago', rows: 23450, warnings: 12 },
    { name: 'Fidelity', completeness: 92, lastFile: '4 hours ago', rows: 18765, warnings: 88 },
    { name: 'FIS', completeness: 100, lastFile: 'yesterday', rows: 8901, warnings: 0 },
    { name: 'SEI', completeness: 78, lastFile: '3 days ago', rows: 4321, warnings: 201 },
];


const brokers: TransactionDetail['broker'][] = ['UBS', 'Schwab', 'Fidelity', 'Morgan Stanley'];
const trustTypes: TransactionDetail['trustType'][] = ['Family', 'Investment', 'Holding'];
const statuses: TransactionDetail['validationStatus'][] = ['Valid', 'Pending', 'Invalid'];
const trustNameSamples = [
    "Maplewood Family Trust",
    "Oak Ridge Investments",
    "Willow Creek Trust",
    "Pine Grove Holdings",
    "Cedar Hill Family Trust",
    "Elm Street Trust",
    "Riverbend Trust",
    "Stonebridge Capital"
];

const generateRandomString = (length: number, characters: string) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const invalidIssueSamples = ['Missing CUSIP', 'Incorrect Allocation', 'Negative market value', 'Future posting date'];
const pendingIssueSamples = ['Awaiting broker confirmation', 'Internal review queued', 'Data mismatch with source'];


let idCounter = 0;
const generateUniqueId = () => {
    idCounter++;
    return `TD${String(idCounter).padStart(3, '0')}`;
}

export const generateTransactionDetails = (count = 50): TransactionDetail[] => {
    return Array.from({ length: count }, (_, i) => {
        const status = statuses[i % statuses.length];
        const issues: string[] = [];
        
        if (status === 'Invalid') {
            issues.push(invalidIssueSamples[i % invalidIssueSamples.length]);
            if (Math.random() > 0.7) {
                 issues.push(invalidIssueSamples[(i + 1) % invalidIssueSamples.length]);
            }
        }
        if (status === 'Pending') {
            issues.push(pendingIssueSamples[i % pendingIssueSamples.length]);
        }

        const hasCusip = !(status === 'Invalid' && issues.includes('Missing CUSIP'));

        return {
            id: generateUniqueId(),
            trustAccountName: trustNameSamples[i % trustNameSamples.length],
            accountNumber: `ACCT-${generateRandomString(5, '0123456789')}`,
            marketValue: parseFloat((Math.random() * 500000 + 50000).toFixed(2)),
            income: parseFloat((Math.random() * 20000).toFixed(2)),
            cusip: hasCusip ? generateRandomString(9, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') : '',
            postingDate: `2024-03-${String((i % 28) + 1).padStart(2, '0')}`,
            broker: brokers[i % brokers.length],
            trustType: trustTypes[i % trustTypes.length],
            validationStatus: status,
            issues: issues,
        };
    });
};
