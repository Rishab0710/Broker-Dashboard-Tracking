
'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  BookCopy,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  Layers,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  BarChart2,
  FileText,
  DollarSign,
  UserCheck,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// --- MOCK DATA ---

const kpiData = {
    ordinaryDividends: 15023.45,
    qualifiedDividends: 12000.00,
    interestTaxable: 5432.10,
    interestExempt: 15234.89,
    capitalGainsST: 3015.50,
    capitalGainsLT: 8990.25,
    foreignTaxPaid: 350.75,
    withholding: 2403.75,
    expensesDeductible: 4500.00,
    k1UBTI: 2500.00,
    worksheetVariance: -10.55
};

const incomeCompositionData = [
    { name: 'DIV', value: kpiData.ordinaryDividends },
    { name: 'INT', value: kpiData.interestTaxable },
    { name: 'STCG', value: kpiData.capitalGainsST },
    { name: 'LTCG', value: kpiData.capitalGainsLT },
];

const incomeLineItems = [
    { id: 'INC001', source: 'Schwab', docType: 'DIV', box: '1a', security: 'Apple Inc', cusip: '037833100', amount: 15023.45, withholding: 2403.75, variance: 0, status: 'OK', lineage: { refs: [{ collection: 'transactions', id: 'TXN-DIV-001' }], files: ['/broker-imports/schwab/2024/q1.csv'] } },
    { id: 'INC002', source: 'Schwab', docType: 'DIV', box: '1b', security: 'Apple Inc', cusip: '037833100', amount: 12000.00, withholding: 0, variance: 0, status: 'OK', lineage: { refs: [{ collection: 'transactions', id: 'TXN-DIV-001' }], files: ['/broker-imports/schwab/2024/q1.csv'] } },
    { id: 'INC003', source: 'Fidelity', docType: 'INT', box: '1', security: 'US Treasury Bond', cusip: '912828U41', amount: 5432.10, withholding: 0, variance: 0.01, status: 'VARIANCE', lineage: { refs: [{ collection: 'transactions', id: 'TXN-INT-003' }], files: ['/broker-imports/fidelity/2024/q1.csv'] } },
    { id: 'INC004', source: 'Schwab', docType: 'B', box: '1d', security: 'Microsoft Corp', cusip: '594918104', amount: 3015.50, withholding: 0, variance: 0, status: 'OK', lineage: { refs: [{ collection: 'transactions', id: 'TXN-SALE-005' }], files: ['/broker-imports/schwab/2024/q2.csv'] } },
];

const k1LineItems = [
    { id: 'K1001', lpName: 'Blackstone Fund VIII', ein: 'XX-XXX1234', k1Line: '1', amount: 18500.00, k3: true, ubti: 2500.00, eci: 0, status: 'OK' },
    { id: 'K1002', lpName: 'Carlyle Partners VII', ein: 'XX-XXX5678', k1Line: '5', amount: 7200.00, k3: false, ubti: 0, eci: 0, status: 'OK' },
    { id: 'K1003', lpName: 'Energy Transfer LP', ein: 'XX-XXX9012', k1Line: '20AH', amount: -500.00, k3: true, ubti: 0, eci: 0, status: 'ERROR', exceptionTags: ['Missing State K-1'] },
];

const selectedLineItem = {
    ...incomeLineItems[2],
    lineage: { refs: [{ collection: 'transactions', id: 'TXN-INT-003' }], files: ['/broker-imports/fidelity/2024/q1.csv'] },
    computation: 'SUM(Fidelity.INT) WHERE CUSIP=912828U41',
    externalValue: 5432.09,
    delta: 0.01,
    tolerance: 0.05,
};

// --- COMPONENTS ---

const Header = ({ currencyFormatter, compactCurrencyFormatter }: { currencyFormatter: Intl.NumberFormat | null, compactCurrencyFormatter: Intl.NumberFormat | null }) => {
    const { toast } = useToast();
    const handleAction = (action: string) => toast({ title: "Action Triggered", description: `${action} initiated.` });

    return (
        <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div className="flex w-full items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-tight font-headline">Consolidated Tax Worksheet</h1>
                    <p className="text-sm text-muted-foreground">Tax › Consolidated Tax Worksheet</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Select defaultValue="2024"><SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select>
                    <Select><SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="All Trusts" /></SelectTrigger><SelectContent><SelectItem value="all">All Trusts</SelectItem><SelectItem value="trust-1">Maplewood Family Trust</SelectItem></SelectContent></Select>
                    <Button size="sm" variant="outline" onClick={() => handleAction('Refresh/Sync')}><RefreshCw className="mr-2 h-4 w-4" /> Sync</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Bulk Actions <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleAction('Mark Ready')}>Mark Ready for Review</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Lock Version')}><Lock className="mr-2 h-4 w-4"/>Lock Version</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Send to CPA')}><Send className="mr-2 h-4 w-4"/>Send to CPA</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction('Post to 1099')}><Layers className="mr-2 h-4 w-4"/>Post to 1099</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Dividends</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-lg font-bold">{compactCurrencyFormatter?.format(kpiData.ordinaryDividends)}</div><p className="text-xs text-muted-foreground">{compactCurrencyFormatter?.format(kpiData.qualifiedDividends)} Qual.</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Interest</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-lg font-bold">{compactCurrencyFormatter?.format(kpiData.interestTaxable)}</div><p className="text-xs text-muted-foreground">{compactCurrencyFormatter?.format(kpiData.interestExempt)} TE</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Capital Gains</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-lg font-bold">{compactCurrencyFormatter?.format(kpiData.capitalGainsST + kpiData.capitalGainsLT)}</div><p className="text-xs text-muted-foreground">{compactCurrencyFormatter?.format(kpiData.capitalGainsST)} ST</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Foreign Tax</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-lg font-bold">{compactCurrencyFormatter?.format(kpiData.foreignTaxPaid)}</div><p className="text-xs text-muted-foreground">Paid</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Deductible Exp</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-lg font-bold">{compactCurrencyFormatter?.format(kpiData.expensesDeductible)}</div><p className="text-xs text-muted-foreground">from {Object.keys(kpiData).length} sources</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">K-1 UBTI</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-lg font-bold">{compactCurrencyFormatter?.format(kpiData.k1UBTI)}</div><p className="text-xs text-muted-foreground">from 1 entity</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium text-amber-500">Worksheet Δ</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-lg font-bold text-amber-500">{currencyFormatter?.format(kpiData.worksheetVariance)}</div><p className="text-xs text-muted-foreground">vs 1099 Package</p></CardContent></Card>
            </div>
        </header>
    );
};

const FilterPane = () => (
    <div className="space-y-4 p-4 sm:px-6 border-b">
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-sm font-semibold p-0 hover:no-underline">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters & Views
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xs">Saved Views</h3>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">Unreconciled Variances</Button>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">K-1 Items with State Factors</Button>
                        </div>
                        <div className="space-y-2">
                             <h3 className="font-semibold text-xs">Filters</h3>
                             <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Stage (e.g. Draft)" /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="approved">Approved</SelectItem></SelectContent></Select>
                             <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Variance Status" /></SelectTrigger><SelectContent><SelectItem value="has-variance">Has Variance</SelectItem><SelectItem value="no-variance">Zero Variance</SelectItem></SelectContent></Select>
                             <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Reviewer" /></SelectTrigger><SelectContent><SelectItem value="user1">Alex Green</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xs">Rule Packs</h3>
                            {['Cross-source consistency', 'Rounding & tolerances', 'Category mapping'].map(pack => (
                                <div key={pack} className="flex items-center space-x-2"><Checkbox id={`pack-${pack}`} checked /><label htmlFor={`pack-${pack}`} className="text-xs">{pack}</label></div>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
);


const LineItemInspector = ({ item, isOpen, onOpenChange, currencyFormatter }: { item: any | null; isOpen: boolean; onOpenChange: (open: boolean) => void; currencyFormatter: Intl.NumberFormat | null; }) => {
    if (!item) return null;
    
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none p-0">
                <SheetHeader className="p-6">
                    <SheetTitle>Line Item: {item.id}</SheetTitle>
                    <SheetDescription>{item.security || item.lpName} - {item.source || item.ein} - {item.docType || 'K-1'} {item.box || item.k1Line}</SheetDescription>
                </SheetHeader>
                <Tabs defaultValue="variance" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
                        <TabsTrigger value="variance">Variance & Exceptions</TabsTrigger>
                        <TabsTrigger value="lineage">Lineage</TabsTrigger>
                        <TabsTrigger value="mapping">Mapping</TabsTrigger>
                        <TabsTrigger value="audit">Audit Log</TabsTrigger>
                    </TabsList>
                    <TabsContent value="variance" className="p-6 space-y-4">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Variance Details</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between"><span>Worksheet Value:</span> <span className="font-mono">{currencyFormatter?.format(item.amount)}</span></div>
                                <div className="flex justify-between"><span>External Value:</span> <span className="font-mono">{currencyFormatter?.format(selectedLineItem.externalValue)}</span></div>
                                <div className="flex justify-between font-semibold border-t pt-2 mt-2"><span>Delta:</span> <span className={cn("font-mono", item.status === 'VARIANCE' ? 'text-amber-500' : 'text-green-500')}>{currencyFormatter?.format(selectedLineItem.delta)}</span></div>
                                <p className="text-xs text-muted-foreground">Tolerance: {currencyFormatter?.format(selectedLineItem.tolerance)}</p>
                            </CardContent>
                        </Card>
                        <Button>Adopt External Value</Button>
                    </TabsContent>
                    <TabsContent value="lineage" className="p-6 text-sm space-y-2">
                        {item.lineage ? (
                            <>
                                <div><span className="font-semibold">Source Ref:</span> <span className="font-mono">{item.lineage.refs[0].id}</span></div>
                                <div><span className="font-semibold">Source File:</span> <span className="font-mono">{item.lineage.files[0]}</span></div>
                                <Button variant="link" className="p-0 h-auto">View Source Transaction</Button>
                            </>
                        ) : (
                            <p className="text-muted-foreground">Lineage information is not applicable for this K-1 item.</p>
                        )}
                    </TabsContent>
                     <TabsContent value="mapping" className="p-6">Mapping controls here.</TabsContent>
                     <TabsContent value="audit" className="p-6">Audit trail here.</TabsContent>
                </Tabs>
                <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex gap-2">
                    <Button variant="secondary">Create Adjustment</Button>
                    <SheetClose asChild><Button variant="outline" className="ml-auto">Close</Button></SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );
};


const StatusBadge = ({ status }: { status: string }) => {
    const config = {
        'OK': 'bg-green-100 text-green-800',
        'VARIANCE': 'bg-amber-100 text-amber-800',
        'ERROR': 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800';

    const Icon = status === 'OK' ? CheckCircle : status === 'VARIANCE' ? AlertTriangle : XCircle;

    return <Badge variant="outline" className={cn('font-medium', config)}><Icon className="mr-1 h-3 w-3" />{status}</Badge>;
};


export default function WorksheetPage() {
    const [selectedItem, setSelectedItem] = React.useState<any>(null);
    const [isInspectorOpen, setIsInspectorOpen] = React.useState(false);
    const [currencyFormatter, setCurrencyFormatter] = React.useState<Intl.NumberFormat | null>(null);
    const [compactCurrencyFormatter, setCompactCurrencyFormatter] = React.useState<Intl.NumberFormat | null>(null);

    React.useEffect(() => {
        setCurrencyFormatter(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }));
        setCompactCurrencyFormatter(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }));
    }, []);

    const handleRowClick = (item: any) => {
        setSelectedItem(item);
        setIsInspectorOpen(true);
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col bg-background">
                <Header currencyFormatter={currencyFormatter} compactCurrencyFormatter={compactCurrencyFormatter} />
                <main>
                    <FilterPane />
                    <div className="p-4 sm:p-6 pt-0">
                        <Tabs defaultValue="income-broker">
                            <TabsList>
                                <TabsTrigger value="income-broker">Income (Broker)</TabsTrigger>
                                <TabsTrigger value="income-k1">Income (K-1)</TabsTrigger>
                                <TabsTrigger value="expenses">Expenses & Adjustments</TabsTrigger>
                                <TabsTrigger value="output">Consolidated Output</TabsTrigger>
                            </TabsList>
                            <TabsContent value="income-broker" className="mt-4">
                                <Card>
                                    <CardHeader><CardTitle>Broker-Sourced Income</CardTitle><CardDescription>All income items sourced from broker 1099s (DIV, INT, B, OID).</CardDescription></CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader><TableRow><TableHead>Source</TableHead><TableHead>Type</TableHead><TableHead>Security</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                            <TableBody>
                                                {incomeLineItems.map(item => (
                                                    <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer">
                                                        <TableCell>{item.source}</TableCell>
                                                        <TableCell><Badge variant="secondary">{item.docType} {item.box}</Badge></TableCell>
                                                        <TableCell className="font-medium">{item.security}</TableCell>
                                                        <TableCell className="text-right font-mono">{currencyFormatter?.format(item.amount)}</TableCell>
                                                        <TableCell><StatusBadge status={item.status} /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="income-k1" className="mt-4">
                                <Card>
                                    <CardHeader><CardTitle>K-1 Roll-ups</CardTitle><CardDescription>Income and attribute items sourced from partnership K-1s.</CardDescription></CardHeader>
                                    <CardContent>
                                         <Table>
                                            <TableHeader><TableRow><TableHead>LP Name</TableHead><TableHead>K-1 Line</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Flags</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                            <TableBody>
                                                {k1LineItems.map(item => (
                                                    <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer">
                                                        <TableCell className="font-medium">{item.lpName}</TableCell>
                                                        <TableCell><Badge variant="secondary">Line {item.k1Line}</Badge></TableCell>
                                                        <TableCell className="text-right font-mono">{currencyFormatter?.format(item.amount)}</TableCell>
                                                        <TableCell className="space-x-1">
                                                            {item.k3 && <Badge variant="outline">K-3</Badge>}
                                                            {item.ubti > 0 && <Badge variant="destructive">UBTI</Badge>}
                                                        </TableCell>
                                                        <TableCell><StatusBadge status={item.status} /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
                 <LineItemInspector item={selectedItem} isOpen={isInspectorOpen} onOpenChange={setIsInspectorOpen} currencyFormatter={currencyFormatter} />
            </div>
        </TooltipProvider>
    );
}
