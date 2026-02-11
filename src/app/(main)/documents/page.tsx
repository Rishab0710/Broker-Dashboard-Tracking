
'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  FileCheck2,
  FileDown,
  FileUp,
  Filter,
  Layers,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Check,
  CircleDotDashed,
  Banknote,
  Users,
  UserCheck,
  FileText,
  Clock,
  ThumbsUp,
  BadgePercent,
  X,
  Lock,
  ChevronDown,
  Calendar,
  BarChart3,
  LineChart,
  AreaChart,
  Settings,
  MoreHorizontal,
  PanelLeft,
  ChevronsRight,
  ShieldCheck,
  GitCommit,
  CheckCircle2,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { controlSheetData, kpiData, type ControlSheetRow } from '@/lib/control-sheet-data';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, FunnelChart, Funnel, LabelList, ResponsiveContainer, BarChart } from 'recharts';


const Header = () => {
    const { toast } = useToast();
    const handleAction = (action: string) => toast({ title: "Action Triggered", description: `${action} process initiated.` });

    return (
        <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div className="flex w-full items-center">
                <div><h1 className="text-xl font-bold tracking-tight font-headline">Digital Tax Control Sheet</h1><p className="text-sm text-muted-foreground">Tax › Digital Tax Control Sheet</p></div>
                <div className="ml-auto flex items-center gap-2">
                    <Select defaultValue="2024"><SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select>
                     <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search Trust, Client..." className="pl-8 h-9 w-[250px]" /></div>
                    <Button size="sm" variant="outline" onClick={() => handleAction('Import')}><FileUp className="mr-2 h-4 w-4" /> Import</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Bulk Actions <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent><DropdownMenuItem onClick={() => handleAction('Run Validation')}><ShieldCheck className="mr-2 h-4 w-4" />Run Validation</DropdownMenuItem><DropdownMenuItem onClick={() => handleAction('Advance Stage')}><ChevronsRight className="mr-2 h-4 w-4" />Advance Stage</DropdownMenuItem><DropdownMenuItem onClick={() => handleAction('Assign Reviewer')}><UserCheck className="mr-2 h-4 w-4" />Assign Reviewer</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => handleAction('Lock Version')}><Lock className="mr-2 h-4 w-4" />Lock Version</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Total Trusts</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.totalTrusts}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">In Progress</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.stageProgress.inProgress}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Docs Complete</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.docsComplete}%</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium text-amber-500">Exceptions Open</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-amber-500">{kpiData.exceptionsOpen}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium text-red-500">SLA Breaches</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-red-500">{kpiData.slaBreaches}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium">Ready for 1099</CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.readyFor1099}</div></CardContent></Card>
            </div>
        </header>
    );
};

const FilterPane = () => (
    <div className="space-y-4 p-4 sm:px-6 border-b">
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-sm font-semibold p-0 hover:no-underline">
                   <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters & Views
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xs">Saved Views</h3>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">My At-Risk Items</Button>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">Unassigned Queue</Button>
                        </div>
                         <div className="space-y-2">
                            <h3 className="font-semibold text-xs">Stage</h3>
                            {['Intake', 'Data QA', 'Statement Review', 'CPA Review', 'IRS Submission'].map(filter => <div key={filter} className="flex items-center space-x-2"><Checkbox id={`filter-${filter}`} /><label htmlFor={`filter-${filter}`} className="text-xs">{filter}</label></div>)}
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xs">Owner</h3>
                             {['Alex Green', 'Brian Wilson', 'Cathy Lee'].map(owner => <div key={owner} className="flex items-center space-x-2"><Checkbox id={`owner-${owner}`} /><label htmlFor={`owner-${owner}`} className="text-xs">{owner}</label></div>)}
                        </div>
                         <div className="space-y-2">
                            <h3 className="font-semibold text-xs">SLA</h3>
                             {['On Track', 'At Risk', 'Breached'].map(sla => <div key={sla} className="flex items-center space-x-2"><Checkbox id={`sla-${sla}`} /><label htmlFor={`sla-${sla}`} className="text-xs">{sla}</label></div>)}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
);


const StageBadge = ({ stage }: { stage: string }) => {
    const config = {
        'Intake': 'bg-sky-100 text-sky-800', 'Data QA': 'bg-blue-100 text-blue-800',
        'Statement Review': 'bg-indigo-100 text-indigo-800', 'Transactional Reconciliation': 'bg-purple-100 text-purple-800',
        'LP/LLC Gathering': 'bg-violet-100 text-violet-800', '1099 Form Gen': 'bg-fuchsia-100 text-fuchsia-800',
        'CPA Review': 'bg-pink-100 text-pink-800', 'IRS Submission': 'bg-rose-100 text-rose-800',
        'Client Delivery': 'bg-green-100 text-green-800'
    }[stage] || 'bg-gray-100 text-gray-800';
    return <Badge variant="outline" className={cn('font-medium text-xs', config)}>{stage}</Badge>;
};

const RowInspector = ({ item, onOpenChange }: { item: ControlSheetRow | null; onOpenChange: (open: boolean) => void; }) => {
  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none p-0">
        {item && (<>
            <SheetHeader className="p-6"><SheetTitle>{item.trustName}</SheetTitle><SheetDescription>Control Sheet Details for Acct: {item.acctNo} - {item.year}</SheetDescription></SheetHeader>
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="dependencies">Dependencies</TabsTrigger><TabsTrigger value="exceptions">Exceptions</TabsTrigger><TabsTrigger value="documents">Documents</TabsTrigger><TabsTrigger value="audit">Audit Log</TabsTrigger></TabsList>
                <TabsContent value="overview" className="p-6">Overview content here.</TabsContent>
                <TabsContent value="dependencies" className="p-6">Dependencies content here.</TabsContent>
                <TabsContent value="exceptions" className="p-6">Exceptions content here.</TabsContent>
                <TabsContent value="documents" className="p-6">Documents content here.</TabsContent>
                <TabsContent value="audit" className="p-6">Audit Log content here.</TabsContent>
            </Tabs>
        </>)}
      </SheetContent>
    </Sheet>
  );
};

export default function DigitalTaxControlSheetPage() {
    const [selectedRow, setSelectedRow] = React.useState<ControlSheetRow | null>(null);

    const getSlaHealthColor = (health: string) => ({
        'GREEN': 'bg-green-500', 'AMBER': 'bg-amber-500', 'RED': 'bg-red-500'
    }[health] || 'bg-gray-300');
    
    return (
        <TooltipProvider>
            <div className="flex flex-col bg-background">
                <Header />
                 <main>
                    <FilterPane />
                    <div className="p-4 sm:p-6 pt-0">
                         <Card>
                            <CardHeader><CardTitle>Control Sheet Grid</CardTitle><CardDescription>A centralized, real-time ledger for all tax processes across all trusts.</CardDescription></CardHeader>
                            <CardContent>
                                <div className="border rounded-md">
                                <Table>
                                    <TableHeader><TableRow><TableHead className="w-2"><Checkbox /></TableHead><TableHead className="w-4"></TableHead><TableHead>Trust Name</TableHead><TableHead>Current Stage</TableHead><TableHead>Docs</TableHead><TableHead>Exceptions</TableHead><TableHead>Owner</TableHead><TableHead>Last Updated</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                    {controlSheetData.map((row) => (
                                        <TableRow key={row.id} className="cursor-pointer" onClick={() => setSelectedRow(row)}>
                                            <TableCell><Checkbox onClick={(e) => e.stopPropagation()} /></TableCell>
                                            <TableCell><Tooltip><TooltipTrigger><div className={cn("w-2 h-2 rounded-full", getSlaHealthColor(row.sla.health))} /></TooltipTrigger><TooltipContent>{row.sla.health}</TooltipContent></Tooltip></TableCell>
                                            <TableCell className="font-medium">{row.trustName}</TableCell>
                                            <TableCell><StageBadge stage={row.currentStage} /></TableCell>
                                            <TableCell><Badge variant={row.docs.requiredStatus === 'COMPLETE' ? 'secondary' : 'outline'} className={cn(row.docs.requiredStatus === 'COMPLETE' && 'text-green-700 border-green-300')}>{row.docs.requiredStatus}</Badge></TableCell>
                                            <TableCell>{row.exceptionTags.length > 0 ? <Badge variant="destructive">{row.exceptionTags.length}</Badge> : <CheckCircle2 className="h-5 w-5 text-green-600" />}</TableCell>
                                            <TableCell>{row.owner}</TableCell>
                                            <TableCell>{row.lastUpdated}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                 <RowInspector item={selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)} />
            </div>
        </TooltipProvider>
    );
}
