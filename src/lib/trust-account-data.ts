




type BrokerInfo = {
    name: string;
    has1099: boolean;
    hasK1: boolean;
};

export type AuditFlag = {
    id: string;
    description: string;
    date: string;
    status: 'Open' | 'Resolved';
};

export type TrustAccount = {
    id: string;
    trustName: string;
    ctAccount: string;
    ein: string;
    cpa: string;
    packetStatus: 'Not Started' | 'In Progress' | 'Completed';
    status1099: 'Pending' | 'Received' | 'Error' | 'Not Started';
    statusK1: 'Pending' | 'Received' | 'Not Started';
    alerts: AuditFlag[];
    dateCreated: string;
    accountStatus: 'Active' | 'Inactive';
    trustType: 'Family' | 'Investment' | 'Holding' | 'Charitable' | 'Testamentary';
    brokers: BrokerInfo[];
    taxReturnStatus: 'Filed' | 'Pending';
    processingTime?: {
        '1099'?: number;
        'k-1'?: number;
    }
};
  
export const trustAccounts: TrustAccount[] = [
    { 
        id: 'ACC001', 
        trustName: 'Maplewood Family Trust', 
        ctAccount: 'CT-12345', 
        ein: 'XX-XXXX123', 
        cpa: 'Sarah Johnson', 
        packetStatus: 'In Progress', 
        status1099: 'Received', 
        statusK1: 'Pending', 
        alerts: [
            { id: 'FLAG001', description: 'Missing K-1 year-end estimate', date: '2024-03-15', status: 'Open' }
        ], 
        dateCreated: '2023-05-10', 
        accountStatus: 'Active', 
        trustType: 'Family',
        brokers: [
            { name: 'Fidelity', has1099: true, hasK1: true }
        ],
        taxReturnStatus: 'Pending',
        processingTime: { '1099': 3 }
    },
    { 
        id: 'ACC002', 
        trustName: 'Oak Ridge Investments', 
        ctAccount: 'CT-67890', 
        ein: 'XX-XXXX456', 
        cpa: 'David Chen', 
        packetStatus: 'Completed', 
        status1099: 'Received', 
        statusK1: 'Received', 
        alerts: [], 
        dateCreated: '2022-11-20', 
        accountStatus: 'Active', 
        trustType: 'Investment',
        brokers: [
            { name: 'Charles Schwab', has1099: true, hasK1: true },
            { name: 'Blackstone', has1099: false, hasK1: true }
        ],
        taxReturnStatus: 'Filed',
        processingTime: { '1099': 5, 'k-1': 8 }
    },
    { 
        id: 'ACC003', 
        trustName: 'Willow Creek Trust', 
        ctAccount: 'CT-54321', 
        ein: 'XX-XXXX789', 
        cpa: 'Sarah Johnson', 
        packetStatus: 'Not Started', 
        status1099: 'Pending', 
        statusK1: 'Not Started', 
        alerts: [
            { id: 'FLAG002', description: '1099 document past due', date: '2024-03-20', status: 'Open' },
            { id: 'FLAG003', description: 'Large cash transfer unverified', date: '2024-03-21', status: 'Resolved' }
        ], 
        dateCreated: '2024-01-15', 
        accountStatus: 'Active', 
        trustType: 'Family',
        brokers: [
            { name: 'Fidelity', has1099: true, hasK1: false }
        ],
        taxReturnStatus: 'Pending', 
    },
    { 
        id: 'ACC004', 
        trustName: 'Pine Grove Holdings', 
        ctAccount: 'CT-09876', 
        ein: 'XX-XXXX321', 
        cpa: 'Maria Rodriguez', 
        packetStatus: 'In Progress', 
        status1099: 'Received', 
        statusK1: 'Received', 
        alerts: [], 
        dateCreated: '2023-08-01', 
        accountStatus: 'Active', 
        trustType: 'Holding',
        brokers: [
            { name: 'Morgan Stanley', has1099: true, hasK1: true }
        ],
        taxReturnStatus: 'Pending',
        processingTime: { '1099': 2, 'k-1': 6 }
    },
    { 
        id: 'ACC005', 
        trustName: 'Cedar Hill Family Trust', 
        ctAccount: 'CT-13579', 
        ein: 'XX-XXXX654', 
        cpa: 'David Chen',         
        packetStatus: 'Completed', 
        status1099: 'Received', 
        statusK1: 'Received', 
        alerts: [], 
        dateCreated: '2021-03-30', 
        accountStatus: 'Inactive', 
        trustType: 'Family',
        brokers: [
            { name: 'Vanguard', has1099: true, hasK1: false }
        ],
        taxReturnStatus: 'Filed',
        processingTime: { '1099': 4, 'k-1': 5 } 
    },
    { 
        id: 'ACC006', 
        trustName: 'Elm Street Trust', 
        ctAccount: 'CT-24680', 
        ein: 'XX-XXXX987', 
        cpa: 'Sarah Johnson', 
        packetStatus: 'In Progress', 
        status1099: 'Error', 
        statusK1: 'Pending', 
        alerts: [
            { id: 'FLAG004', description: 'Document processing failed (Error)', date: '2024-03-25', status: 'Open' }
        ], 
        dateCreated: '2024-02-01', 
        accountStatus: 'Active', 
        trustType: 'Charitable',
        brokers: [
            { name: 'JP Morgan', has1099: true, hasK1: true }
        ],
        taxReturnStatus: 'Pending', 
    },
    { 
        id: 'ACC007', 
        trustName: 'Riverbend Trust', 
        ctAccount: 'CT-97531', 
        ein: 'XX-XXXX753', 
        cpa: 'Tom Williams', 
        packetStatus: 'Not Started', 
        status1099: 'Pending', 
        statusK1: 'Not Started', 
        alerts: [], 
        dateCreated: '2023-12-12', 
        accountStatus: 'Active', 
        trustType: 'Testamentary',
        brokers: [
            { name: 'Fidelity', has1099: true, hasK1: false }
        ],
        taxReturnStatus: 'Pending',
     },
    { 
        id: 'ACC008', 
        trustName: 'Stonebridge Capital', 
        ctAccount: 'CT-86420', 
        ein: 'XX-XXXX159', 
        cpa: 'Maria Rodriguez', 
        packetStatus: 'Completed', 
        status1099: 'Received', 
        statusK1: 'Received', 
        alerts: [], 
        dateCreated: '2022-07-25', 
        accountStatus: 'Inactive', 
        trustType: 'Investment',
        brokers: [
            { name: 'Charles Schwab', has1099: true, hasK1: false }
        ],
        taxReturnStatus: 'Filed',
        processingTime: { '1099': 3, 'k-1': 9 }
    },
    ...Array.from({ length: 150 }, (_, i) => {
        const cpas = ['Sarah Johnson', 'David Chen', 'Maria Rodriguez', 'Tom Williams'];
        const trustTypes: TrustAccount['trustType'][] = ['Family', 'Investment', 'Holding', 'Charitable', 'Testamentary'];
        const packetStatuses: TrustAccount['packetStatus'][] = ['Not Started', 'In Progress', 'Completed'];
        const docStatuses: ('Pending' | 'Received' | 'Error' | 'Not Started')[] = ['Pending', 'Received', 'Error', 'Not Started'];
        const k1Statuses: ('Pending' | 'Received' | 'Not Started')[] = ['Pending', 'Received', 'Not Started'];
        const brokers = ['Fidelity', 'Charles Schwab', 'Morgan Stanley', 'JP Morgan', 'Vanguard', 'Carlyle Group', 'Blackstone'];
        const hasK1 = Math.random() > 0.5;

        const status1099 = docStatuses[i % docStatuses.length];
        const statusK1 = hasK1 ? k1Statuses[i % k1Statuses.length] : 'Not Started';

        let processingTime: TrustAccount['processingTime'] = {};
        if (status1099 === 'Received') {
            processingTime['1099'] = Math.floor(Math.random() * 10) + 1;
        }
        if (statusK1 === 'Received') {
            processingTime['k-1'] = Math.floor(Math.random() * 15) + 3;
        }

        const alerts: AuditFlag[] = [];
        if (Math.random() > 0.8) {
            const flagDescriptions = ['Unmatched Distribution', 'Missing K-1 Estimate', 'Data Discrepancy'];
            alerts.push({
                id: `FLAG${String(i + 5).padStart(3, '0')}`,
                description: flagDescriptions[i % flagDescriptions.length],
                date: `2024-03-${String((i % 28) + 1).padStart(2, '0')}`,
                status: Math.random() > 0.5 ? 'Open' : 'Resolved',
            });
        }


        return {
            id: `ACC${String(i + 9).padStart(3, '0')}`,
            trustName: `Generated Trust ${i + 1}`,
            ctAccount: `CT-G${String(i + 1).padStart(4, '0')}`,
            ein: `XX-GXXX${String(i + 1).padStart(3, '0')}`,
            cpa: cpas[i % cpas.length],
            packetStatus: packetStatuses[i % packetStatuses.length],
            status1099: status1099,
            statusK1: statusK1,
            alerts: alerts,
            dateCreated: `2023-01-${String((i % 30) + 1).padStart(2, '0')}`,
            accountStatus: Math.random() > 0.1 ? 'Active' : 'Inactive',
            trustType: trustTypes[i % trustTypes.length],
            brokers: [
                { name: brokers[i % brokers.length], has1099: true, hasK1: hasK1 }
            ],
            taxReturnStatus: Math.random() > 0.4 ? 'Filed' : 'Pending',
            processingTime: processingTime,
        } as TrustAccount
    })
];
    

    