'use client';
import { redirect } from 'next/navigation';
import * as React from 'react';

// This component now simply redirects to the new root page.
export default function BrokersRedirectPage() {
    React.useEffect(() => {
        redirect('/');
    }, []);
    
    return null;
}
