
'use client';

import * as React from 'react';

type DashboardFilterContextType = {
    year: string;
    setYear: (year: string) => void;
    cpa: string;
    setCpa: (cpa: string) => void;
};

const DashboardFilterContext = React.createContext<DashboardFilterContextType | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: React.ReactNode }) {
    const [year, setYear] = React.useState('2024');
    const [cpa, setCpa] = React.useState('all');

    const value = { year, setYear, cpa, setCpa };

    return (
        <DashboardFilterContext.Provider value={value}>
            {children}
        </DashboardFilterContext.Provider>
    );
}

export function useDashboardFilters() {
    const context = React.useContext(DashboardFilterContext);
    if (context === undefined) {
        throw new Error('useDashboardFilters must be used within a DashboardFilterProvider');
    }
    return context;
}
