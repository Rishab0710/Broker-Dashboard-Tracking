'use client';
import { redirect } from 'next/navigation';
import * as React from 'react';

export default function DashboardPage() {
    React.useEffect(() => {
        redirect('/brokers');
    }, []);

    return null;
}
