'use client';
import { redirect } from 'next/navigation';
import * as React from 'react';

export default function IngestionRedirectPage() {
    React.useEffect(() => {
        redirect('/expenses');
    }, []);
    
    return null;
}
