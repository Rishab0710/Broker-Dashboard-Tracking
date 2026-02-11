
'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  BookCopy,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  Clock,
  Download,
  FileCheck2,
  FileDown,
  FileUp,
  Filter,
  Info,
  Layers,
  ListFilter,
  Lock,
  PieChart,
  RefreshCw,
  Save,
  Search,
  Settings2,
  Share,
  ShieldCheck,
  Table2,
  UploadCloud,
  Briefcase,
  DollarSign,
  FileX,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Donut, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// MOCK DATA
const kpiData = {
    totalEntities: { ptp: 28, private: 112 },
    commitments: { total: 150_000_000, called: 95_000_000 },
    unfunded: 55_000_000,
    k1s: { expected: 140, received: 110, missing: 30, exceptions: 5 },
    cashflows: { calls: 25_000_000, distributions: 12_000_000 },
    exposure: { eci: 15, ubti: 22 }
};

const trusts = [
    { id: 'TRUST-001', name: 'Maplewood Family Trust', entities: 12 },
    { id: 'TRUST-002', name: 'Oak Ridge Investments', entities: 8 },
    { id: 'TRUST-003', name: 'Willow Creek Trust', entities: 22 },
];

const positions = [
    { id: 'LP001', trustName: 'Maplewood', lpName: 'Blackstone Fund VIII', entityType: 'Private', vintageYear: 2022, commitmentAmt: 5000000, calledToDate: 3000000, unfundedCommitment: 2000000, navLast: 3250000, k1Status: 'Received', stateFlags: ['NY', 'CA'], eciFlag: true, ubtiFlag: false, k3Flag: true },
    { id: 'LP002', trustName: 'Maplewood', lpName: 'Energy Transfer LP', entityType: 'PTP', ticker: 'ET', vintageYear: 2020, commitmentAmt: 0, calledToDate: 0, unfundedCommitment: 0, navLast: 150000, k1Status: 'Expected', stateFlags: ['TX', 'LA'], eciFlag: false, ubtiFlag: false, k3Flag: false },
    { id: 'LP003', trustName: 'Oak Ridge', lpName: 'Carlyle Partners VII', entityType: 'Private', vintageYear: 2018, commitmentAmt: 2000000, calledToDate: 2000000, unfundedCommitment: 0, navLast: 2800000, k1Status: 'Missing', stateFlags: ['DE'], eciFlag: false, ubtiFlag: true, k3Flag: false },
    { id: 'LP004', trustName: 'Willow Creek', lpName: 'Enterprise Products', entityType: 'PTP', ticker: 'EPD', vintageYear: 2019, commitmentAmt: 0, calledToDate: 0, unfundedCommitment: 0, navLast: 500000, k1Status: 'Exception', stateFlags: ['TX'], eciFlag: false, ubtiFlag: false, k3Flag: false },
];


const k1ProgressData = [
  { name: 'Received', value: kpiData.k1s.received, fill: 'var(--color-received)' },
  { name: 'Expected', value: kpiData.k1s.expected - kpiData.k1s.received, fill: 'var(--color-expected)' },
  { name: 'Missing', value: kpiData.k1s.missing, fill: 'var(--color-missing)' },
];

const k1ChartConfig = {
  received: { label: "Received", color: "hsl(var(--chart-1))" },
  expected: { label: "Expected", color: "hsl(var(--chart-4))" },
  missing: { label: "Missing", color: "hsl(var(--chart-5))" },
};

const Header = () => {
    const { toast } = useToast();
    const handleAction = (action: string) => {
        toast({ title: "Action Triggered", description: `${action} process initiated.` });
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });

    return (
        <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div className="flex w-full items-center">
                 <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight font-headline whitespace-nowrap">LP/LLC Asset Gathering</h1>
                        <p className="text-sm text-muted-foreground">Tax › LP/LLC Asset Gathering</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Select defaultValue="2024">
                        <SelectTrigger className="w-[120px] h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-[200px] h-9">
                            <SelectValue placeholder="All Trusts" />
                        </SelectTrigger>
                        <SelectContent>
                           {trusts.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search LP Name, EIN..." className="pl-8 h-9 w-[250px]" />
                    </div>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleAction('Import Data')}><FileUp /></Button></TooltipTrigger><TooltipContent>Import Data</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleAction('Export Data')}><FileDown /></Button></TooltipTrigger><TooltipContent>Export Data</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleAction('Run Processes')}><RefreshCw /></Button></TooltipTrigger><TooltipContent>Run Reconciliations</TooltipContent></Tooltip>
                </div>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                 <Card>
                    <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">Entities <Briefcase className="h-4 w-4 text-muted-foreground" /></CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">{kpiData.totalEntities.ptp + kpiData.totalEntities.private}</div>
                        <p className="text-xs text-muted-foreground"> {kpiData.totalEntities.ptp} PTP / {kpiData.totalEntities.private} Private</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">Commitments <DollarSign className="h-4 w-4 text-muted-foreground" /></CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">{currencyFormatter.format(kpiData.commitments.called)}</div>
                        <p className="text-xs text-muted-foreground">of {currencyFormatter.format(kpiData.commitments.total)} called</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">Unfunded <DollarSign className="h-4 w-4 text-muted-foreground" /></CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">{currencyFormatter.format(kpiData.unfunded)}</div>
                        <p className="text-xs text-muted-foreground">Remaining commitment</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">K-1s Status <FileCheck2 className="h-4 w-4 text-muted-foreground" /></CardTitle>
                    </CardHeader>
                     <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">{kpiData.k1s.received} / {kpiData.k1s.expected}</div>
                        <p className="text-xs text-muted-foreground">{kpiData.k1s.missing} Missing, {kpiData.k1s.exceptions} Exceptions</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">Cashflows YTD <ArrowRightLeft className="h-4 w-4 text-muted-foreground" /></CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold text-green-500">+{currencyFormatter.format(kpiData.cashflows.distributions)}</div>
                        <p className="text-xs text-muted-foreground">Net of {currencyFormatter.format(kpiData.cashflows.calls)} in calls</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">Tax Exposure <AlertCircle className="h-4 w-4 text-muted-foreground" /></CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">{kpiData.exposure.eci + kpiData.exposure.ubti}</div>
                        <p className="text-xs text-muted-foreground">{kpiData.exposure.eci} ECI, {kpiData.exposure.ubti} UBTI</p>
                    </CardContent>
                </Card>
            </div>
        </header>
    );
};

const LeftPane = () => {
    return (
        <aside className="h-full w-full flex-col space-y-4 border-r bg-muted/20 p-4 lg:flex">
             <div className="space-y-2">
                 <h3 className="font-semibold text-sm">Saved Views</h3>
                 <Button variant="ghost" className="w-full justify-start h-8 px-2">My K-1 Exceptions</Button>
                 <Button variant="ghost" className="w-full justify-start h-8 px-2">Unfunded Commitments</Button>
             </div>
            <Separator />
            <Accordion type="multiple" defaultValue={['registry', 'filters']} className="w-full">
                <AccordionItem value="registry">
                    <AccordionTrigger className="text-sm font-semibold">Registry</AccordionTrigger>
                    <AccordionContent>
                        {trusts.map(trust => (
                             <Accordion key={trust.id} type="single" collapsible>
                                 <AccordionItem value={trust.id}>
                                     <AccordionTrigger className="text-xs hover:no-underline pl-2">{trust.name} <Badge variant="secondary" className="ml-2">{trust.entities}</Badge></AccordionTrigger>
                                     <AccordionContent>
                                         <p className="text-xs text-muted-foreground p-2">Entity list would be here.</p>
                                     </AccordionContent>
                                 </AccordionItem>
                             </Accordion>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="filters">
                    <AccordionTrigger className="text-sm font-semibold">Filters</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <div>
                            <h4 className="text-xs font-semibold mb-2">Entity Type</h4>
                            <div className="flex items-center space-x-2"><Checkbox id="type-ptp" /><label htmlFor="type-ptp" className="text-xs">PTP</label></div>
                            <div className="flex items-center space-x-2"><Checkbox id="type-private" /><label htmlFor="type-private" className="text-xs">Private LP/LLC</label></div>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold mb-2">K-1 Status</h4>
                            <div className="flex items-center space-x-2"><Checkbox id="k1-missing" /><label htmlFor="k1-missing" className="text-xs">Missing</label></div>
                            <div className="flex items-center space-x-2"><Checkbox id="k1-exception" /><label htmlFor="k1-exception" className="text-xs">With Exceptions</label></div>
                        </div>
                         <div>
                            <h4 className="text-xs font-semibold mb-2">Attributes</h4>
                            <div className="flex items-center space-x-2"><Checkbox id="attr-eci" /><label htmlFor="attr-eci" className="text-xs">ECI</label></div>
                            <div className="flex items-center space-x-2"><Checkbox id="attr-ubti" /><label htmlFor="attr-ubti" className="text-xs">UBTI</label></div>
                            <div className="flex items-center space-x-2"><Checkbox id="attr-k3" /><label htmlFor="attr-k3" className="text-xs">K-3 Required</label></div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
};

const CenterPane = () => {
    
    const K1StatusBadge = ({ status }: { status: string }) => {
        const config = {
            'Received': { color: 'text-green-700 border-green-300' },
            'Expected': { color: 'text-blue-700 border-blue-300' },
            'Missing': { color: 'text-amber-700 border-amber-300' },
            'Exception': { color: 'text-red-700 border-red-300' },
        }[status] || { color: ''};

        return <Badge variant="outline" className={config.color}>{status}</Badge>
    }

    return (
        <main className="h-full flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            <Tabs defaultValue="positions" className="flex-1 flex flex-col">
                <TabsList className="mb-4">
                    <TabsTrigger value="positions">Positions</TabsTrigger>
                    <TabsTrigger value="cashflows">Cashflows</TabsTrigger>
                    <TabsTrigger value="k1-tracker">K-1 Tracker</TabsTrigger>
                    <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
                </TabsList>
                <TabsContent value="positions" className="flex-1 flex flex-col overflow-hidden">
                     <Card className="flex-1 flex flex-col overflow-hidden">
                        <CardHeader>
                            <CardTitle>Positions Grid</CardTitle>
                            <CardDescription>All LP/LLC positions across selected trusts.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>LP Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>K-1 Status</TableHead>
                                        <TableHead>Commitment</TableHead>
                                        <TableHead>Unfunded</TableHead>
                                        <TableHead>NAV</TableHead>
                                        <TableHead>Flags</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {positions.map(p => (
                                        <TableRow key={p.id} className="cursor-pointer">
                                            <TableCell className="font-medium">{p.lpName}</TableCell>
                                            <TableCell><Badge variant="secondary">{p.entityType}</Badge></TableCell>
                                            <TableCell><K1StatusBadge status={p.k1Status} /></TableCell>
                                            <TableCell>{p.commitmentAmt > 0 ? (p.commitmentAmt/1000000).toFixed(1)+'M' : '-'}</TableCell>
                                            <TableCell>{p.unfundedCommitment > 0 ? (p.unfundedCommitment/1000000).toFixed(1)+'M' : '-'}</TableCell>
                                            <TableCell>{(p.navLast/1000000).toFixed(1)}M</TableCell>
                                            <TableCell className="space-x-1">
                                                {p.eciFlag && <Badge variant="destructive" className="bg-red-200 text-red-900">ECI</Badge>}
                                                {p.ubtiFlag && <Badge variant="destructive" className="bg-orange-200 text-orange-900">UBTI</Badge>}
                                                {p.k3Flag && <Badge variant="outline">K-3</Badge>}
                                                {p.stateFlags.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="k1-tracker" className="text-center text-muted-foreground p-8">
                    K-1 Tracker View (dedicated board/table) would be here.
                </TabsContent>
                 <TabsContent value="cashflows" className="text-center text-muted-foreground p-8">
                    Cashflows table would be here.
                </TabsContent>
                 <TabsContent value="reconciliation" className="text-center text-muted-foreground p-8">
                    Reconciliation views (PTP & Private) would be here.
                </TabsContent>
            </Tabs>
        </main>
    );
};


export default function LpAssetGatheringPage() {
    return (
        <TooltipProvider>
            <div className="flex h-screen flex-col bg-background">
                <Header />
                <div className="grid flex-1 overflow-hidden lg:grid-cols-[25%_auto]">
                    <div className="hidden h-full overflow-y-auto lg:block">
                       <LeftPane />
                    </div>
                    <div className="h-full overflow-y-auto">
                        <CenterPane />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
