
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
  ChevronDown,
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
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// --- MOCK DATA ---
const kpiData = {
  totalDistributions: 25_450_000,
  matchedCount: 1230,
  unmatchedCount: 45,
  clientDirectCount: 88,
  clientDirectAmount: 1_200_000,
  pendingReviewCount: 12,
  postedTo1099Count: 1198,
  avgAgingDays: 12,
};

const distributions = Array.from({ length: 50 }, (_, i) => {
  const statuses = ['MATCHED', 'UNMATCHED', 'CLIENT_DIRECT'];
  const channels = ['ACH', 'Check', 'Wire', 'BillPay'];
  const brokers = ['Schwab', 'Merrill', 'Fidelity', 'Off-platform'];
  const clients = ['Maplewood Family Trust', 'Oak Ridge Investments', 'Willow Creek Trust'];
  const status = statuses[i % statuses.length];

  return {
    id: `DIST-${1001 + i}`,
    trustName: clients[i % clients.length],
    acctNo: `...${1234 + i}`,
    clientName: 'Beneficiary Name',
    broker: brokers[i % brokers.length],
    channel: channels[i % channels.length],
    distDate: `2024-03-${String(i % 28 + 1).padStart(2, '0')}`,
    amount: Math.random() * 50000 + 1000,
    payeeName: 'John B. Client',
    matchedStatus: status,
    matchConfidence: status === 'MATCHED' ? Math.random() * 20 + 80 : Math.random() * 50,
    exceptionTags: status === 'UNMATCHED' ? ['Payee mismatch'] : [],
    postedTo1099: status === 'MATCHED' && Math.random() > 0.3,
    reviewer: 'user@taxwise.com',
  };
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});
const fullCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// --- COMPONENTS ---

const Header = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: 'Action Triggered',
      description: `${action} process initiated.`,
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex w-full items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight font-headline">
            Distribution to Client Review
          </h1>
          <p className="text-sm text-muted-foreground">
            Tax › Distribution to Client Review
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={() => handleAction('Import')}>
            <FileUp className="mr-2 h-4 w-4" /> Import
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleAction('Run Validation')}>
                <Check className="mr-2 h-4 w-4" /> Run Validation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Auto-Match')}>
                <CircleDotDashed className="mr-2 h-4 w-4" /> Auto-Match
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Post to 1099')}>
                <FileCheck2 className="mr-2 h-4 w-4" /> Post to 1099
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Distributions <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold">{currencyFormatter.format(kpiData.totalDistributions)}</div>
            <p className="text-xs text-muted-foreground">YTD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Matched vs Unmatched <BadgePercent className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold">{((kpiData.matchedCount / (kpiData.matchedCount + kpiData.unmatchedCount)) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{kpiData.unmatchedCount} unmatched</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Client-Direct <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold">{kpiData.clientDirectCount}</div>
            <p className="text-xs text-muted-foreground">{currencyFormatter.format(kpiData.clientDirectAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Pending Review <Users className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold">{kpiData.pendingReviewCount}</div>
            <p className="text-xs text-muted-foreground">items require action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Posted to 1099 <FileText className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold">{kpiData.postedTo1099Count}</div>
            <p className="text-xs text-muted-foreground">records created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Avg. Aging <Clock className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold">{kpiData.avgAgingDays} days</div>
            <p className="text-xs text-muted-foreground">for unmatched items</p>
          </CardContent>
        </Card>
      </div>
    </header>
  );
};

const FilterPane = () => {
  return (
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
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">My Pending Review</Button>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">Unmatched Wires</Button>
                            <Button variant="ghost" className="w-full justify-start h-8 px-2 text-xs">Client-Direct > $100k</Button>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xs">Quick Filters: Exceptions</h3>
                             {[ 'Unmatched', 'Account mismatch', 'Payee mismatch', 'Date out of range', 'Duplicate', ].map((filter) => (
                                <div key={filter} className="flex items-center space-x-2">
                                    <Checkbox id={`filter-${filter}`} />
                                    <label htmlFor={`filter-${filter}`} className="text-xs">{filter}</label>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                             <h3 className="font-semibold text-xs">Filters</h3>
                             <Input placeholder="Search Trust, Client..." className="h-8 text-xs" />
                             <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Channel" /></SelectTrigger><SelectContent><SelectItem value="ach">ACH</SelectItem><SelectItem value="check">Check</SelectItem><SelectItem value="wire">Wire</SelectItem></SelectContent></Select>
                             <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="validated">Validated</SelectItem><SelectItem value="flagged">Flagged</SelectItem><SelectItem value="posted">Posted</SelectItem></SelectContent></Select>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
};

const DistributionInspector = ({ item, onOpenChange }: { item: any; onOpenChange: (open: boolean) => void; }) => {
  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none p-0">
        {item && (
          <>
            <SheetHeader className="p-6">
              <SheetTitle>Distribution: {item.id}</SheetTitle>
              <SheetDescription>
                {item.trustName} - {fullCurrencyFormatter.format(item.amount)} on {item.distDate}
              </SheetDescription>
            </SheetHeader>
            <Tabs defaultValue="matching" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="matching">Matching</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-6">
                Details for {item.id} would go here.
              </TabsContent>
              <TabsContent value="matching" className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Candidate Matches</h4>
                  <p className="text-sm text-muted-foreground">Review potential matches from internal ledgers and broker feeds.</p>
                  <Card className="bg-green-500/5 border-green-500/30">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                           <CardTitle className="text-base">Ledger Entry #L-5678</CardTitle>
                           <CardDescription>Match Confidence: 98%</CardDescription>
                        </div>
                        <Button size="sm"><ThumbsUp className="mr-2"/>Accept Match</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                      <p>Features matched: Amount, Date (within 1 day), Payee Name (High similarity)</p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                           <CardTitle className="text-base">Broker Cash Movement #B-9912</CardTitle>
                           <CardDescription>Match Confidence: 75%</CardDescription>
                        </div>
                        <Button size="sm" variant="secondary">Select</Button>
                      </div>
                    </CardHeader>
                     <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                      <p>Features matched: Amount. Date differs by 3 days.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="docs" className="p-6">
                Associated documents (check images, wire PDFs) would be listed here.
              </TabsContent>
              <TabsContent value="audit" className="p-6">
                Audit log for changes to this distribution would be here.
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};


export default function TransactionsPage() {
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'MATCHED':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-500/10' };
      case 'UNMATCHED':
        return { icon: AlertCircle, color: 'text-amber-600', bgColor: 'bg-amber-500/10' };
      case 'CLIENT_DIRECT':
        return { icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-500/10' };
      default:
        return { icon: MoreVertical, color: 'text-muted-foreground', bgColor: '' };
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col bg-background">
        <Header />
        <main>
            <FilterPane />
            <div className="p-4 sm:p-6 pt-0">
                <Card>
                <CardHeader>
                    <CardTitle>Distributions Grid</CardTitle>
                    <CardDescription>
                    Review, match, and post all client distributions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"><Checkbox /></TableHead>
                            <TableHead>Trust Account</TableHead>
                            <TableHead>Broker</TableHead>
                            <TableHead>Channel</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Payee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Posted</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {distributions.map((d) => {
                            const { icon: Icon, color, bgColor } = getStatusConfig(d.matchedStatus);
                            return (
                            <TableRow key={d.id} className={cn('cursor-pointer', bgColor)} onClick={() => setSelectedItem(d)}>
                                <TableCell><Checkbox /></TableCell>
                                <TableCell className="font-medium">{d.trustName}</TableCell>
                                <TableCell>{d.broker}</TableCell>
                                <TableCell>{d.channel}</TableCell>
                                <TableCell>{d.distDate}</TableCell>
                                <TableCell className="text-right">{fullCurrencyFormatter.format(d.amount)}</TableCell>
                                <TableCell>{d.payeeName}</TableCell>
                                <TableCell>
                                <Badge variant="outline" className={cn('gap-1', color, bgColor)}>
                                    <Icon className="h-3 w-3" />
                                    {d.matchedStatus.replace('_', ' ')}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                {d.postedTo1099 ? <CheckCircle className="h-5 w-5 text-green-600"/> : <X className="h-5 w-5 text-muted-foreground"/>}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedItem(d); }}>
                                        <MoreVertical className="h-4 w-4"/>
                                    </Button>
                                </TableCell>
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

        <DistributionInspector
          item={selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        />
      </div>
    </TooltipProvider>
  );
}
