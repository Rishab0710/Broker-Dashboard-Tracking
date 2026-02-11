
'use client';
import * as React from 'react';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Filter,
  FileUp,
  Lock,
  RefreshCw,
  Search,
  Share,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { addDays, format, type DateRange } from 'date-fns';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { sourceMonitors, generateTransactionDetails, type TransactionDetail } from '@/lib/data-management-data';
import { Progress } from '@/components/ui/progress';

// --- COMPONENTS ---

const Header = () => {
    const { toast } = useToast();
    const handleAction = (action: string) => {
        toast({ title: "Action Triggered", description: `${action} process initiated.` });
    };
     const [date, setDate] = React.useState<DateRange | undefined>({ from: new Date(2024, 0, 1), to: addDays(new Date(2024, 0, 1), 90) });

    return (
        <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div className="flex w-full items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight font-headline whitespace-nowrap">Transactional Data Management</h1>
                    <p className="text-sm text-muted-foreground">Tax › Transactions › All Trusts › 2024</p>
                </div>
                <div className="flex items-center gap-1.5 ml-4">
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleAction('Import Data')}><FileUp /></Button></TooltipTrigger><TooltipContent>Import Data</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleAction('Run Validation')}><ShieldCheck /></Button></TooltipTrigger><TooltipContent>Run Validation</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleAction('Auto-Reconcile')}><RefreshCw /></Button></TooltipTrigger><TooltipContent>Auto-Reconcile</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleAction('Publish to 1099')}><Share /></Button></TooltipTrigger><TooltipContent>Publish to 1099</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleAction('Export Exceptions')}><Download /></Button></TooltipTrigger><TooltipContent>Export Exceptions</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="destructive" size="icon" onClick={() => handleAction('Lock Period')}><Lock /></Button></TooltipTrigger><TooltipContent>Lock Period</TooltipContent></Tooltip>
                </div>
            </div>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters" className="border-b-0">
                  <AccordionTrigger className="text-sm font-semibold p-0 hover:no-underline">
                      <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Filters
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                          <Popover>
                              <PopoverTrigger asChild>
                                  <Button
                                      id="date"
                                      variant={"outline"}
                                      className={cn(
                                          "w-full justify-start text-left font-normal bg-background",
                                          !date && "text-muted-foreground"
                                      )}
                                  >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {date?.from ? (
                                          date.to ? (<>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>) : (format(date.from, "LLL dd, y"))
                                      ) : (
                                          <span>Posting Date</span>
                                      )}
                                  </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                              </PopoverContent>
                          </Popover>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between bg-background">
                                  Document Type <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by Doc Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {['DIV', 'INT', 'B', 'OID', 'Composite'].map(type => (
                                    <DropdownMenuCheckboxItem key={type}>{type}</DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                          </DropdownMenu>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between bg-background">
                                  Security Type <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by Security Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {['Equity', 'Bond', 'Fund', 'LP-PTP', 'LP-Private'].map(type => (
                                    <DropdownMenuCheckboxItem key={type}>{type}</DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                  </AccordionContent>
              </AccordionItem>
          </Accordion>
        </header>
    );
};

const LeftPane = () => (
    <aside className="h-full w-full flex-col space-y-4 border-r bg-muted/20 p-4 lg:flex">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Source Monitors</CardTitle>
                <CardDescription className="text-xs">Real-time status of data ingestion feeds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {sourceMonitors.map((monitor, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{monitor.name}</span>
                            <span className="text-xs text-muted-foreground">{monitor.lastFile}</span>
                        </div>
                        <Progress value={monitor.completeness} className="h-2 mt-1" />
                        <div className="flex items-center justify-between text-xs mt-1 text-muted-foreground">
                            <span>{monitor.rows.toLocaleString()} rows</span>
                            {monitor.warnings > 0 && <span className="flex items-center text-amber-500 gap-1"><AlertCircle className="h-3 w-3" /> {monitor.warnings}</span>}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </aside>
);

const CenterPane = ({ onRowSelect, transactionData }: { onRowSelect: (detail: TransactionDetail) => void, transactionData: TransactionDetail[] }) => {
    
    const getStatusIcon = (status: TransactionDetail['validationStatus']) => {
        if (status === 'Valid') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        if (status === 'Invalid') return <AlertCircle className="h-4 w-4 text-red-500" />;
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    };

    return (
         <main className="h-full flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Smart Data Grid</CardTitle>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search CUSIP, Account..." className="pl-8 h-9 w-[250px]" />
                        </div>
                     </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-x-auto">
                    <TooltipProvider>
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px]"><Checkbox /></TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Trust</TableHead>
                                    <TableHead>Broker</TableHead>
                                    <TableHead>CUSIP</TableHead>
                                    <TableHead className="text-right">Market Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactionData.map(t => (
                                    <TableRow key={t.id} onClick={() => onRowSelect(t)} className={cn( 'cursor-pointer', t.validationStatus === 'Invalid' && 'bg-destructive/10', t.validationStatus === 'Pending' && 'bg-amber-400/10' )}>
                                        <TableCell><Checkbox onClick={(e) => e.stopPropagation()} /></TableCell>
                                        <TableCell>
                                            <Tooltip><TooltipTrigger>{getStatusIcon(t.validationStatus)}</TooltipTrigger><TooltipContent>{t.validationStatus}</TooltipContent></Tooltip>
                                        </TableCell>
                                        <TableCell className="font-medium text-xs">{t.trustAccountName}</TableCell>
                                        <TableCell>{t.broker}</TableCell>
                                        <TableCell className="font-mono text-xs">{t.cusip || 'N/A'}</TableCell>
                                        <TableCell className="text-right font-mono text-xs">${t.marketValue.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    </TooltipProvider>
                </CardContent>
            </Card>
        </main>
    );
}

const RightPane = ({ selectedDetail }: { selectedDetail: TransactionDetail | null }) => (
    <aside className="h-full w-full flex-col space-y-4 border-l bg-muted/20 p-4 lg:flex">
         <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-base">Data Validation Details</CardTitle>
                <CardDescription className="text-xs">Drill-down into specific validation issues and history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {selectedDetail ? (
                    <div>
                        <h4 className="font-semibold text-sm">{selectedDetail.trustAccountName}</h4>
                        <p className="text-xs text-muted-foreground font-mono">{selectedDetail.cusip || 'N/A'} - {selectedDetail.accountNumber}</p>
                        <div className="mt-4 space-y-2">
                             <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Status:</span> <Badge variant={selectedDetail.validationStatus === 'Invalid' ? 'destructive' : selectedDetail.validationStatus === 'Pending' ? 'outline' : 'secondary'} className={cn(selectedDetail.validationStatus === 'Pending' && "border-amber-400")}>{selectedDetail.validationStatus}</Badge></div>
                             <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Market Value:</span> <span>${selectedDetail.marketValue.toLocaleString()}</span></div>
                             <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Income:</span> <span>${selectedDetail.income.toLocaleString()}</span></div>
                        </div>

                        {selectedDetail.issues.length > 0 && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-sm mb-2">Issues Detected</h5>
                                <div className="space-y-2">
                                    {selectedDetail.issues.map((issue, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-md bg-background/50 border border-dashed border-red-500/50 text-red-500">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0"/>
                                            <span>{issue}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button className="w-full mt-4">Create Adjustment</Button>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                        <p>Select a row to see details</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </aside>
);


export default function DataManagementPage() {
    const [transactionData, setTransactionData] = React.useState<TransactionDetail[]>([]);
    const [selectedDetail, setSelectedDetail] = React.useState<TransactionDetail | null>(null);

    React.useEffect(() => {
        const data = generateTransactionDetails(100);
        setTransactionData(data);
        setSelectedDetail(data.find(d => d.validationStatus === 'Invalid') || null);
    }, []);

    return (
        <TooltipProvider>
            <div className="flex h-screen flex-col bg-background">
                <Header />
                 <div className="grid flex-1 overflow-hidden lg:grid-cols-[20%_auto_25%]">
                     <div className="hidden h-full overflow-y-auto lg:block">
                        <LeftPane />
                     </div>
                     <div className="h-full overflow-y-auto">
                        <CenterPane transactionData={transactionData} onRowSelect={setSelectedDetail} />
                    </div>
                    <div className="hidden h-full overflow-y-auto lg:block">
                        <RightPane selectedDetail={selectedDetail} />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
