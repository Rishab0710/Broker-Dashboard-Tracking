
'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  FileDown,
  Mail,
  Save,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  Layers,
  FileText,
  Search,
  ChevronDown,
  ShieldCheck,
  FileWarning,
  Eye,
  ChevronsRight,
  BookCopy,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// --- Mock Data (as per spec) ---
const mockTrusts = [
  { id: 'TRUST-001', name: 'Maplewood Family Trust', acctNo: 'CT-12345', year: 2024, status: 'READY_REVIEW', score: 98 },
  { id: 'TRUST-002', name: 'Oak Ridge Investments', acctNo: 'CT-67890', year: 2024, status: 'DRAFT', score: 75 },
  { id: 'TRUST-003', name: 'Willow Creek Holdings', acctNo: 'CT-54321', year: 2024, status: 'APPROVED', score: 100 },
  { id: 'TRUST-004', name: 'Pine Grove Investments', acctNo: 'CT-09876', year: 2023, status: 'SUBMITTED', score: 100 },
];

const mockFormData = {
  'TRUST-001': {
    trustId: 'TRUST-001',
    year: 2024,
    docType: 'DIV',
    status: 'READY_REVIEW',
    fields: { payerName: 'Cumberland Trust', payerTin: 'XX-XXXX123', recipientName: 'Maplewood Family Trust', recipientTin: 'XX-XXXX456', accountNumber: 'CT-12345', box1aOrdinaryDividends: 15023.45, box1bQualifiedDividends: 12000.0, box2aCapitalGains: 5012.88, box5Section199A: 1500.0, box6ForeignTaxPaid: 350.75, federalTaxWithheld: 2403.75 },
    lineage: { box1aOrdinaryDividends: { source: 'BROKER', broker: 'Schwab', cusips: ['037833100'], txnIds: ['TXN-DIV-001'] } },
    validation: {
      score: 98,
      issues: [{ id: 'V005', category: 'K-1 Overlap', severity: 'warn', fieldPath: 'box1aOrdinaryDividends', message: 'Potential overlap with K-1 income from Energy Transfer LP.', suggestion: 'Review K-1 schedule for matching income.' }],
    },
    workflow: { preparedBy: 'user@taxwise.com', timestamps: { created: new Date().toISOString(), updated: new Date().toISOString() } },
  },
  'TRUST-002': {
    trustId: 'TRUST-002',
    year: 2024,
    docType: 'DIV',
    status: 'DRAFT',
    fields: { payerName: 'Cumberland Trust', payerTin: 'XX-XXXX123', recipientName: 'Oak Ridge Investments', recipientTin: 'XX-XXXX789', accountNumber: 'CT-67890', box1aOrdinaryDividends: 8540.1, box1bQualifiedDividends: 8000.0, box2aCapitalGains: 1200.0, box5Section199A: 0.0, box6ForeignTaxPaid: null, federalTaxWithheld: 1281.02 },
    lineage: { box1aOrdinaryDividends: { source: 'BROKER', broker: 'Merrill', cusips: ['123456789'], txnIds: ['TXN-DIV-002'] } },
    validation: {
      score: 75,
      issues: [
        { id: 'V001', category: 'Data Completeness', severity: 'error', fieldPath: 'box6ForeignTaxPaid', message: 'Field "Foreign Tax Paid" is missing.', suggestion: 'Enter value or confirm as zero.' },
        { id: 'V008', category: 'Rounding & Totals', severity: 'warn', fieldPath: 'box1bQualifiedDividends', message: 'Qualified dividends rounding differs from source by $0.01.', suggestion: 'Confirm rounding method is acceptable.' },
      ],
    },
    workflow: { preparedBy: 'user@taxwise.com', timestamps: { created: new Date().toISOString(), updated: new Date().toISOString() } },
  },
};

const riskFlags = [
  { id: 'missing_fields', label: 'Missing Fields', count: 1 },
  { id: 'mismatches', label: 'Mismatches', count: 0 },
  { id: 'outliers', label: 'Outliers', count: 0 },
  { id: 'whfit_pending', label: 'WHFIT Pending', count: 2 },
  { id: 'k1_conflicts', label: 'K-1 Conflicts', count: 1 },
];

// --- Sub-components ---

const WorkbenchHeader = ({ trustId, year }: { trustId: string; year: string }) => {
  const { toast } = useToast();
  const trustName = mockTrusts.find(t => t.id === trustId)?.name || trustId;
  const formData = (mockFormData as any)[trustId];
  const status = formData?.status || 'DRAFT';

  const isReadyForReview = status === 'READY_REVIEW';
  const isApproved = status === 'APPROVED';
  const isSubmitted = status === 'SUBMITTED';

  const handleAction = (actionName: string) => {
    toast({
      title: 'Action Triggered',
      description: `${actionName} process started. (This is a demo and not a real action).`,
    });
  };

  return (
    <header className="sticky top-0 z-20 flex h-auto flex-col items-start gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      {/* Breadcrumb and Meta Chips */}
      <div className="flex w-full flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="outline" size="sm" className="h-7 gap-1" asChild>
              <Link href="/"><ArrowLeft className="h-4 w-4"/> Back to Dashboard</Link>
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{trustName}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{year}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Last updated: 2 mins ago</Badge>
          <Badge variant="secondary">Prepared by: you</Badge>
          <Badge variant={
            status === 'DRAFT' ? 'outline' :
            status === 'READY_REVIEW' ? 'default' :
            status === 'APPROVED' ? 'secondary' : 'default'
          } className={cn(
             status === 'READY_REVIEW' && 'bg-amber-500/80 text-white',
             status === 'APPROVED' && 'bg-blue-500/80 text-white',
             status === 'SUBMITTED' && 'bg-green-600 text-white'
          )}>
            Status: {status.replace('_', ' ')}
          </Badge>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex w-full flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => handleAction('Save Draft')} disabled={isSubmitted}><Save className="mr-2 h-4 w-4" /> Save Draft</Button>
        <Button size="sm" variant="outline" onClick={() => handleAction('Validate')} disabled={isSubmitted}><ShieldCheck className="mr-2 h-4 w-4" /> Validate</Button>
        <Button size="sm" onClick={() => handleAction('Approve')} disabled={!isReadyForReview || isSubmitted}><CheckCircle className="mr-2 h-4 w-4" /> Approve</Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleAction('Generate PDF')} disabled={!isApproved && !isSubmitted}><FileDown className="mr-2 h-4 w-4" /> Generate PDF</Button>
          <Button size="sm" variant="secondary" onClick={() => handleAction('Export MAG')} disabled={!isApproved && !isSubmitted}><Layers className="mr-2 h-4 w-4" /> Export MAG</Button>
          <Button size="sm" variant="destructive" onClick={() => handleAction('Submit to IRS')} disabled={!isApproved || isSubmitted}>
            <UploadCloud className="mr-2 h-4 w-4" /> {isSubmitted ? 'Submitted' : 'Submit to IRS'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleAction('Email Client')} disabled={!isSubmitted}><Mail className="mr-2 h-4 w-4" /> Email Client</Button>
        </div>
      </div>
    </header>
  );
};

const LeftPane = ({ activeTrustId, activeYear }: { activeTrustId: string; activeYear: string }) => {
  return (
    <aside className="h-full w-full flex-col border-r bg-muted/20 p-4 lg:flex">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Trust name, account #..." className="pl-8" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Document Types</label>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            {['DIV', 'INT', 'B', 'OID', 'COMPOSITE'].map(type => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox id={`type-${type}`} defaultChecked={type === 'DIV'} />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Risk Flags</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {riskFlags.map(flag => (
              <Badge key={flag.id} variant="outline" className="cursor-pointer hover:bg-accent">
                {flag.label} <span className="ml-1.5 rounded-full bg-muted px-1.5 text-xs">{flag.count}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex-1">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-1 pr-4">
            {mockTrusts.map(trust => (
              <Link key={trust.id} href={`/tax/1099/${trust.id}/${trust.year}`}>
                <Card className={cn("cursor-pointer transition-colors hover:bg-card", activeTrustId === trust.id && 'border-primary bg-primary/5')}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold">{trust.name}</p>
                      <Badge variant={trust.score > 95 ? 'secondary' : 'default'} className={cn(
                          trust.score > 95 ? 'text-green-700 border-green-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                      )}>
                        {trust.score}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span>{trust.acctNo}</span> &bull; <span>{trust.year}</span>
                    </div>
                     <Badge variant="outline" className="mt-1">{trust.status.replace('_', ' ')}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
       <div className="mt-4 border-t pt-4">
            <Button className="w-full" disabled><ChevronsRight className="mr-2"/> Run Batch (0 selected)</Button>
        </div>
    </aside>
  );
};

const FormField = ({ id, label, value, source, lineage, severity, isEditable = true }: { id: string; label: string; value: number | string | null; source: string; lineage: any; severity?: 'error' | 'warn'; isEditable?: boolean }) => {
  const [currentValue, setCurrentValue] = React.useState(value);

  // TODO: Add onBlur write to Firestore
  const handleBlur = () => console.log(`Saving ${id}: ${currentValue}`);
  
  const borderColor = severity === 'error' ? 'border-red-500' : severity === 'warn' ? 'border-amber-500' : 'border-input';

  return (
    <div className="space-y-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between">
              <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
              <Badge variant="outline" className="h-5 text-[10px]">{source}</Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <p><span className="font-semibold">Source:</span> {lineage.source}</p>
              <p><span className="font-semibold">Broker:</span> {lineage.broker}</p>
              <p><span className="font-semibold">CUSIPs:</span> {lineage.cusips?.join(', ')}</p>
              <p><span className="font-semibold">Txn IDs:</span> {lineage.txnIds?.join(', ')}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Input
        id={id}
        type="text"
        readOnly={!isEditable}
        value={currentValue ?? ''}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        className={cn("h-9 font-mono", borderColor, !isEditable && 'bg-muted/50')}
      />
    </div>
  );
};

const CenterPane = ({ trustId }: { trustId: string }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [formData, setFormData] = React.useState<any>(null);
  
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate loading data from Firestore
    setTimeout(() => {
      setFormData((mockFormData as any)[trustId]);
      setIsLoading(false);
    }, 500);
  }, [trustId]);

  if (isLoading) {
    return <CenterPaneSkeleton />;
  }
  
  if (!formData) {
    return <div className="p-8 text-center text-muted-foreground">No data for this trust.</div>;
  }

  const { fields, lineage, status } = formData;
  const isSubmitted = status === 'SUBMITTED';

  return (
    <main className="h-full flex-1 overflow-y-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Live IRS Form Preview: 1099-DIV</CardTitle>
          <CardDescription>
            This is an editable preview of the 1099-DIV form for calendar year {formData.year}. Fields are color-coded based on validation status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
            <FormField id="payerName" label="PAYER'S name, street address, city, state..." value={fields.payerName} source="INTERNAL" lineage={{ source: 'INTERNAL', broker: 'N/A' }} isEditable={false} />
            <FormField id="payerTin" label="Payer's TIN" value={fields.payerTin} source="INTERNAL" lineage={{ source: 'INTERNAL' }} isEditable={false} />
            <FormField id="recipientName" label="RECIPIENT'S name" value={fields.recipientName} source="INTERNAL" lineage={{ source: 'INTERNAL' }} isEditable={false} />
            <FormField id="recipientTin" label="Recipient's TIN" value={fields.recipientTin} source="INTERNAL" lineage={{ source: 'INTERNAL' }} isEditable={false} />
            <div className="col-span-2">
              <FormField id="accountNumber" label="Account number" value={fields.accountNumber} source="INTERNAL" lineage={{ source: 'INTERNAL' }} isEditable={false} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField id="box1a" label="1a Total ordinary dividends" value={fields.box1aOrdinaryDividends} source="BROKER" lineage={lineage.box1aOrdinaryDividends} isEditable={!isSubmitted} />
            <FormField id="box1b" label="1b Qualified dividends" value={fields.box1bQualifiedDividends} source="BROKER" lineage={lineage.box1aOrdinaryDividends} isEditable={!isSubmitted} severity="warn" />
            <FormField id="box2a" label="2a Total capital gain dist." value={fields.box2aCapitalGains} source="BROKER" lineage={lineage.box1aOrdinaryDividends} isEditable={!isSubmitted} />
            <FormField id="box5" label="5 Section 199A dividends" value={fields.box5Section199A} source="MANUAL" lineage={{ source: 'MANUAL', notes: 'Manual adjustment' }} isEditable={!isSubmitted} />
            <FormField id="box6" label="6 Foreign tax paid" value={fields.box6ForeignTaxPaid} source="BROKER" lineage={lineage.box1aOrdinaryDividends} isEditable={!isSubmitted} severity={fields.box6ForeignTaxPaid === null ? 'error' : undefined} />
            <FormField id="federalTaxWithheld" label="4 Federal income tax withheld" value={fields.federalTaxWithheld} source="BROKER" lineage={lineage.box1aOrdinaryDividends} isEditable={!isSubmitted} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

const CenterPaneSkeleton = () => (
    <div className="p-6">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-full" /></div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
                </div>
            </CardContent>
        </Card>
    </div>
);


const RightPane = ({ trustId }: { trustId: string }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [validationData, setValidationData] = React.useState<any>(null);

  React.useEffect(() => {
    setIsLoading(true);
    // Simulate loading data from Firestore
    setTimeout(() => {
        setValidationData((mockFormData as any)[trustId]?.validation);
        setIsLoading(false);
    }, 500);
  }, [trustId]);

  if (isLoading) {
    return <RightPaneSkeleton />;
  }
  
  if (!validationData) {
    return <div className="p-8 text-center text-muted-foreground">No validation data.</div>;
  }
  
  const { score, issues } = validationData;
  const scoreColor = score > 95 ? 'text-green-500' : score > 80 ? 'text-amber-500' : 'text-red-500';

  const chartConfig = {
    score: { label: 'Score', color: score > 95 ? 'hsl(var(--chart-1))' : score > 80 ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-5))' },
    remainder: { label: 'Remainder', color: 'hsl(var(--muted))' }
  };
  const chartData = [{ name: 'score', value: score }, { name: 'remainder', value: 100 - score }];

  return (
    <aside className="h-full w-full flex-col border-l bg-muted/20 p-4 lg:flex">
      <div className="text-center">
        <h3 className="font-semibold">IRS Compliance Validator</h3>
        <div className="relative my-4 h-32 w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={50}
                          strokeWidth={2}
                      >
                          <Cell key="cell-score" fill={chartConfig.score.color} />
                          <Cell key="cell-remainder" fill={chartConfig.remainder.color} />
                      </Pie>
                  </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-3xl font-bold', scoreColor)}>{score}</span>
                <span className="text-xs text-muted-foreground">Score</span>
            </div>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
        {issues.map((issue: any) => (
            <AccordionItem value={`issue-${issue.id}`} key={issue.id}>
                <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                         {issue.severity === 'error' ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <FileWarning className="h-4 w-4 text-amber-500" />}
                        <span>{issue.category}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 rounded-md border border-dashed p-3 text-xs">
                        <p>{issue.message}</p>
                        <p className="text-muted-foreground"><span className="font-semibold">Suggestion:</span> {issue.suggestion}</p>
                        <Button variant="link" size="sm" className="h-auto p-0">Go to field</Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        ))}
        {issues.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No issues found.</p>}
      </Accordion>
       <div className="mt-auto border-t pt-4">
            <Button variant="secondary" className="w-full"><BookCopy className="mr-2"/> Export Validation Report</Button>
        </div>
    </aside>
  );
};

const RightPaneSkeleton = () => (
    <div className="p-4">
        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
        <div className="relative h-32 w-full flex items-center justify-center">
            <Skeleton className="h-28 w-28 rounded-full" />
        </div>
        <div className="space-y-2 mt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-auto border-t pt-4 absolute bottom-4 right-4 left-4">
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
)

type WorkbenchPageProps = {
  params: { trustId: string; year: string };
};

export default function WorkbenchPage({ params }: WorkbenchPageProps) {
  
  return (
    <div className="flex h-screen flex-col bg-background">
      <WorkbenchHeader trustId={params.trustId} year={params.year} />
      <div className="grid flex-1 overflow-hidden lg:grid-cols-[25%_auto_25%]">
        <div className="hidden h-full overflow-y-auto lg:block">
            <LeftPane activeTrustId={params.trustId} activeYear={params.year} />
        </div>
        <div className="h-full overflow-y-auto">
            <CenterPane trustId={params.trustId} />
        </div>
        <div className="hidden h-full overflow-y-auto lg:block">
            <RightPane trustId={params.trustId} />
        </div>
      </div>
    </div>
  );
}
