
'use client';
import * as React from 'react';
import {
  AlertCircle,
  Banknote,
  CalendarIcon,
  Check,
  CheckCircle,
  ChevronDown,
  CircleDotDashed,
  FileCheck2,
  FileDown,
  FileUp,
  Filter,
  Layers,
  ListFilter,
  Lock,
  MoreVertical,
  PieChart as PieChartIcon,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Settings,
  X,
  ArrowRightLeft,
  BadgePercent,
  Calculator,
  ShieldCheck,
  FileClock,
  History,
  Paperclip,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Pie, Cell, AreaChart, Area, Legend, Tooltip as RechartsTooltip, Line, LineChart } from 'recharts';
import { Progress } from '@/components/ui/progress';

// --- MOCK DATA ---
const kpiData = {
  totalExpenses: 12_450_000,
  reportable: 8_300_000,
  nonReportable: 4_150_000,
  allocated: 10_500_000,
  unallocated: 1_950_000,
  exceptions: 32,
  adjustmentImpact: -75_000,
};

let expensesData: any[] = [];

// --- COMPONENTS ---

const Header = () => {
    const { toast } = useToast();
    const [formatter, setFormatter] = React.useState<Intl.NumberFormat | null>(null);

    React.useEffect(() => {
        setFormatter(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }));
    }, []);

    const handleAction = (action: string) => toast({ title: "Action Triggered", description: `${action} process initiated.` });

    return (
        <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div className="flex w-full items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-tight font-headline">Expense Reporting &amp; Adjustments</h1>
                    <p className="text-sm text-muted-foreground">Tax › Expense Reporting &amp; Adjustments</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Select defaultValue="2024"><SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select>
                    <Button size="sm" variant="outline" onClick={() => handleAction('Import')}><FileUp className="mr-2 h-4 w-4" /> Import</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Bulk Actions <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleAction('Run Validations')}><Check className="mr-2 h-4 w-4" />Run Validations</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Apply Policies')}><Settings className="mr-2 h-4 w-4" />Apply Policies</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Auto-Categorize')}><Layers className="mr-2 h-4 w-4" />Auto-Categorize</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Net/Allocate')}><Calculator className="mr-2 h-4 w-4" />Net/Allocate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction('Post to 1099')}><FileCheck2 className="mr-2 h-4 w-4" />Post to 1099</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Lock Period')}><Lock className="mr-2 h-4 w-4 text-destructive" />Lock Period</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Total Expenses <Banknote className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{formatter?.format(kpiData.totalExpenses)}</div><p className="text-xs text-muted-foreground">YTD</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Reportable <BadgePercent className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{formatter?.format(kpiData.reportable)}</div><p className="text-xs text-muted-foreground">vs Non-Reportable</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Allocated <Layers className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{formatter?.format(kpiData.allocated)}</div><p className="text-xs text-muted-foreground">of total expenses</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Unallocated <CircleDotDashed className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-amber-500">{formatter?.format(kpiData.unallocated)}</div><p className="text-xs text-muted-foreground">needs action</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Exceptions <AlertCircle className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-red-500">{kpiData.exceptions}</div><p className="text-xs text-muted-foreground">items need review</p></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Adj. Impact <ArrowRightLeft className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-green-500">{formatter?.format(kpiData.adjustmentImpact)}</div><p className="text-xs text-muted-foreground">Net change</p></CardContent></Card>
            </div>
        </header>
    );
};

const LeftPane = () => (
    <div className="space-y-4 p-4 sm:p-6 border-b">
         <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm font-semibold p-0 hover:no-underline">
                   <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters & Views
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        <div className="grid lg:grid-cols-2 gap-2">
                            <Input placeholder="Search Trust, Vendor..." className="h-8 text-xs" />
                            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="mgmt">Management Fee</SelectItem><SelectItem value="advisory">Advisory</SelectItem><SelectItem value="custody">Custody</SelectItem></SelectContent></Select>
                            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="validated">Validated</SelectItem><SelectItem value="flagged">Flagged</SelectItem></SelectContent></Select>
                            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Tax Mapping" /></SelectTrigger><SelectContent><SelectItem value="misc">1099-MISC</SelectItem><SelectItem value="basis">1099-B Basis Adj</SelectItem><SelectItem value="none">Non-reportable</SelectItem></SelectContent></Select>
                        </div>
                        <div className="flex gap-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-xs">Exception Types</h3>
                                {['Unallocated', 'Cap Violation', 'Missing Doc', 'Duplicate'].map(filter => <div key={filter} className="flex items-center space-x-2"><Checkbox id={`filter-${filter}`} /><label htmlFor={`filter-${filter}`} className="text-xs">{filter}</label></div>)}
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-xs">Policy Packs</h3>
                                {['Expense Caps', 'Allocation Rules', '1099 Eligibility'].map(pack => <div key={pack} className="flex items-center space-x-2"><Checkbox id={`pack-${pack}`} checked /><label htmlFor={`pack-${pack}`} className="text-xs">{pack}</label></div>)}
                            </div>
                        </div>
                        <div className="space-y-2">
                             <h3 className="font-semibold text-xs">Saved Views</h3>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">Unallocated Management Fees</Button>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">My Flagged Expenses</Button>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
);

const ExpenseInspector = ({ item, isOpen, onOpenChange }: { item: any; isOpen: boolean; onOpenChange: (open: boolean) => void; }) => {
    
    const [formatter, setFormatter] = React.useState<Intl.NumberFormat | null>(null);

    React.useEffect(() => {
        setFormatter(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }));
    }, []);

    if (!item) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none p-0">
                <SheetHeader className="p-6"><SheetTitle>Expense: {item.id}</SheetTitle><SheetDescription>{item.trustName} - {formatter?.format(item.amount)} on {item.expenseDate}</SheetDescription></SheetHeader>
                <Tabs defaultValue="exceptions" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6"><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="exceptions">Exceptions</TabsTrigger><TabsTrigger value="allocation">Allocation</TabsTrigger><TabsTrigger value="audit">Audit Log</TabsTrigger></TabsList>
                    <TabsContent value="details" className="p-6">Details for {item.id} would go here, including accrual reversal dates and amortization schedules.</TabsContent>
                    <TabsContent value="exceptions" className="p-6">
                        {item.exceptionTags.length > 0 ? (
                            <div className="text-sm space-y-2 text-destructive border border-destructive/50 bg-destructive/5 p-3 rounded-md">
                                <p className="font-semibold flex items-center gap-2"><AlertCircle className="h-4 w-4" />{item.exceptionTags[0]}</p>
                                {item.exceptionTags[0] === 'Cap Violation' && <p>Expense of {formatter?.format(item.amount)} exceeds policy cap of $50,000.</p>}
                                {item.exceptionTags[0] === 'Negative Amount' && <p>This is a reversal or correction and should be reviewed.</p>}
                                {item.exceptionTags[0] === 'Unallocated' && <p>The "Allocated Amount" does not match the total expense amount.</p>}
                                <Button variant="link" size="sm" className="p-0 h-auto text-destructive">Apply Suggestion</Button>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <ShieldCheck className="mx-auto h-8 w-8 mb-2"/>
                                <p className="text-sm">No exceptions found.</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="allocation" className="p-6 space-y-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-base">Allocation Wizard</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select defaultValue={item.allocationMethod}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Pro-rata AUM">Pro-rata AUM</SelectItem><SelectItem value="Equal">Equal</SelectItem><SelectItem value="Manual">Manual</SelectItem><SelectItem value="Amortized">Amortized</SelectItem></SelectContent></Select>
                                    <Select><SelectTrigger><SelectValue placeholder="Basis Date..."/></SelectTrigger><SelectContent><SelectItem value="2023-12-31">2023-12-31</SelectItem></SelectContent></Select>
                                </div>
                                <Button className="mt-4 w-full">Preview Allocation</Button>
                            </CardContent>
                        </Card>
                        {item.allocationMethod === 'Amortized' && (
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileClock/>Amortization Schedule</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">12-month schedule, {formatter?.format(10000)}/month. Residual: $0.00.</p>
                                    <Progress value={(1/12)*100} className="mt-2 h-2" />
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                    <TabsContent value="audit" className="p-6 text-center text-muted-foreground"><History className="mx-auto h-8 w-8 mb-2"/>Audit log for changes would be here.</TabsContent>
                </Tabs>
                <SheetFooter className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex gap-2">
                    <Button variant="secondary">Create Adjustment</Button>
                    <Button>Post to 1099</Button>
                    <SheetClose asChild><Button variant="outline" className="ml-auto">Close</Button></SheetClose>
                </SheetFooter>
        </SheetContent>
    </Sheet>
  );
};

export default function ExpensesPage() {
    const [selectedItem, setSelectedItem] = React.useState<any>(null);
    const [gridData, setGridData] = React.useState<any[]>([]);
    const [formatter, setFormatter] = React.useState<Intl.NumberFormat | null>(null);

    React.useEffect(() => {
        const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        setFormatter(currencyFormatter);

        const data = [
            { id: 'EXP-1001', trustName: 'Maplewood Family Trust', acctNo: '...1234', broker: 'Schwab', expenseDate: '2024-01-01', postDate: '2024-01-05', category: 'Management Fee', amount: 120000, taxMapping: '1099-MISC', allocationMethod: 'Amortized', allocatedAmt: 10000, memo: 'Annual Mgmt Fee (Amortized)', exceptionTags: [], status: 'VALIDATED' },
            ...Array.from({ length: 11 }, (_, i) => ({ id: `EXP-1001-${i + 1}`, trustName: 'Maplewood Family Trust', acctNo: '...1234', broker: 'Schwab', expenseDate: `2024-${String(i + 2).padStart(2, '0')}-01`, postDate: `2024-${String(i + 2).padStart(2, '0')}-05`, category: 'Management Fee', amount: 10000, taxMapping: '1099-MISC', allocationMethod: 'Amortized', allocatedAmt: 10000, memo: `Amort. for EXP-1001 (Month ${i + 2})`, exceptionTags: [], status: 'VALIDATED' })),
            { id: 'EXP-1002', trustName: 'Oak Ridge Investments', acctNo: '...5678', broker: 'Fidelity', expenseDate: '2024-03-15', postDate: '2024-03-18', category: 'Advisory', amount: 75000, taxMapping: 'Non-reportable', allocationMethod: 'Pro-rata AUM', allocatedAmt: 75000, memo: 'Q1 Advisory Fee', exceptionTags: ['Cap Violation'], status: 'FLAGGED' },
            { id: 'EXP-1003', trustName: 'Willow Creek Trust', acctNo: '...9012', broker: 'Off-platform', expenseDate: '2024-03-20', postDate: '2024-03-20', category: 'Commission', amount: -500, taxMapping: '1099-B Basis Adj', allocationMethod: 'Manual', allocatedAmt: -500, memo: 'Correction for trade T-123', exceptionTags: ['Negative Amount'], status: 'FLAGGED' },
            { id: 'EXP-1004', trustName: 'Maplewood Family Trust', acctNo: '...1234', broker: 'Schwab', expenseDate: '2024-03-22', postDate: '2024-03-25', category: 'Custody', amount: 1250, taxMapping: 'Non-reportable', allocationMethod: 'Pro-rata AUM', allocatedAmt: 1250, memo: 'Monthly custody fee', exceptionTags: [], status: 'VALIDATED' },
            { id: 'EXP-1005', trustName: 'Oak Ridge Investments', acctNo: '...5678', broker: 'Fidelity', expenseDate: '2024-03-28', postDate: '2024-03-29', category: 'Admin', amount: 300, taxMapping: 'Non-reportable', allocationMethod: 'Equal', allocatedAmt: 100, memo: 'State filing fee', exceptionTags: ['Unallocated'], status: 'FLAGGED' },
        ];
        setGridData(data);
        expensesData = data; // Keep this for handleRowClick logic
    }, []);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'VALIDATED': return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-500/10' };
            case 'FLAGGED': return { icon: AlertCircle, color: 'text-amber-600', bgColor: 'bg-amber-500/10' };
            case 'POSTED':
            case 'LOCKED': return { icon: Lock, color: 'text-gray-600', bgColor: 'bg-gray-500/10' };
            default: return { icon: MoreVertical, color: 'text-muted-foreground', bgColor: '' };
        }
    };
    
    const handleRowClick = (item: any) => {
        if(item.memo.startsWith('Amort.')) {
            const parentId = item.memo.match(/EXP-\d+/)?.[0];
            const parentItem = expensesData.find(e => e.id === parentId);
            setSelectedItem(parentItem || item);
        } else {
            setSelectedItem(item);
        }
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col bg-background">
                <Header />
                <main>
                    <LeftPane />
                    <div className="p-4 sm:p-6 pt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Expenses Grid</CardTitle>
                                <CardDescription>Review, categorize, and adjust all trust-related expenses.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[40px] p-2"><Checkbox /></TableHead>
                                                <TableHead className="p-2 text-xs">Trust Account</TableHead>
                                                <TableHead className="p-2 text-xs">Date</TableHead>
                                                <TableHead className="p-2 text-xs">Category</TableHead>
                                                <TableHead className="text-right p-2 text-xs">Amount</TableHead>
                                                <TableHead className="p-2 text-xs">Tax Mapping</TableHead>
                                                <TableHead className="p-2 text-xs">Status</TableHead>
                                                <TableHead className="p-2 text-xs">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {gridData.map((d) => {
                                                const { icon: Icon, color, bgColor } = getStatusConfig(d.status);
                                                const isChildAmortization = d.memo.startsWith('Amort.');
                                                return (
                                                    <TableRow key={d.id} className={cn('cursor-pointer', d.id === selectedItem?.id ? 'bg-muted' : bgColor, isChildAmortization && 'bg-muted/30 text-muted-foreground')} onClick={() => handleRowClick(d)}>
                                                        <TableCell className="p-2"><Checkbox checked={d.id === 'EXP-1001'}/></TableCell>
                                                        <TableCell className={cn("font-medium text-xs p-2", isChildAmortization && 'pl-6')}>{d.trustName}</TableCell>
                                                        <TableCell className="text-xs p-2">{d.expenseDate}</TableCell>
                                                        <TableCell className="text-xs p-2">{d.category}</TableCell>
                                                        <TableCell className="text-right font-mono text-xs p-2">{formatter?.format(d.amount)}</TableCell>
                                                        <TableCell className="text-xs p-2"><Badge variant="outline" className="text-xs">{d.taxMapping}</Badge></TableCell>
                                                        <TableCell className="p-2"><Badge variant="outline" className={cn('gap-1 text-xs', color, bgColor)}><Icon className="h-3 w-3" />{d.status}</Badge></TableCell>
                                                        <TableCell className="p-2"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleRowClick(d); }}><MoreVertical className="h-4 w-4" /></Button></TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <ExpenseInspector item={selectedItem} isOpen={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
            </div>
        </TooltipProvider>
    );
}

