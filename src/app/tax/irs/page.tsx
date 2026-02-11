'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleDot,
  Clock,
  Download,
  FileCheck2,
  FileClock,
  FileCog,
  FileText,
  FileX2,
  Filter,
  Layers,
  Mail,
  MailOpen,
  MailWarning,
  Minus,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  ServerCrash,
  Settings2,
  Share,
  ShieldCheck,
  Slash,
  SquareCheck,
  TriangleAlert,
  UploadCloud,
  User,
  X,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- MOCK DATA ---

const kpiData = [
  { title: 'Ready to Transmit', value: '1,204', icon: FileCog },
  { title: 'In Transmission', value: '89', icon: UploadCloud },
  { title: 'Accepted', value: '15,678', icon: BadgeCheck },
  { title: 'Rejected / Needs Fix', value: '32', icon: TriangleAlert },
  { title: 'Email Sent / Print Queued', value: '14,980', icon: Mail },
  { title: 'SLA Breaches', value: '3', icon: Clock },
];

const eFileFunnelData = [
  { value: 1204, name: 'Ready', fill: 'hsl(var(--chart-2))' },
  { value: 89, name: 'Transmitted', fill: 'hsl(var(--chart-3))' },
  { value: 45, name: 'ACK Pending', fill: 'hsl(var(--chart-4))' },
  { value: 15710, name: 'Accepted/Rejected', fill: 'hsl(var(--chart-1))' },
];

const rejectionReasonsData = [
  { reason: 'TIN Mismatch (001)', count: 12 },
  { reason: 'Invalid Format (010)', count: 8 },
  { reason: 'Duplicate File (005)', count: 5 },
  { reason: 'Payer Data Error (101)', count: 3 },
  { reason: 'Missing Payee (203)', count: 2 },
];

const deliveryChannelData = [
  { channel: 'Email', value: 10234, fill: 'hsl(var(--chart-1))' },
  { channel: 'Portal', value: 3456, fill: 'hsl(var(--chart-2))' },
  { channel: 'Print', value: 1290, fill: 'hsl(var(--chart-3))' },
];

const submissionsData = [
  {
    id: 'SUB-1001',
    tcc: '12AB',
    payerName: 'Maplewood Family Trust',
    docTypes: ['DIV', 'INT'],
    formsCount: 234,
    status: 'REJECTED',
    ackCode: '001',
    ackMessage: 'TIN/Name Mismatch',
    environment: 'TEST',
  },
  {
    id: 'SUB-1002',
    tcc: '12AB',
    payerName: 'Oak Ridge Investments',
    docTypes: ['DIV'],
    formsCount: 150,
    status: 'ACCEPTED',
    ackCode: 'A',
    ackMessage: 'Accepted',
    environment: 'PROD',
  },
  {
    id: 'SUB-1003',
    tcc: '34CD',
    payerName: 'Willow Creek Holdings',
    docTypes: ['OID', 'B'],
    formsCount: 88,
    status: 'ACK_PENDING',
    ackCode: null,
    ackMessage: null,
    environment: 'PROD',
  },
  {
    id: 'SUB-1004',
    tcc: '12AB',
    payerName: 'Pine Grove Investments',
    docTypes: ['COMPOSITE'],
    formsCount: 512,
    status: 'TRANSMITTED',
    ackCode: null,
    ackMessage: null,
    environment: 'PROD',
  },
];

const mailJobsData = [
  {
    id: 'MAIL-2001',
    channel: 'EMAIL',
    formsCount: 234,
    recipientCount: 120,
    status: 'SENT',
    bounceRate: 2.5,
  },
  {
    id: 'MAIL-2002',
    channel: 'PRINT',
    formsCount: 88,
    recipientCount: 88,
    status: 'COMPLETED',
    bounceRate: 0,
  },
  {
    id: 'MAIL-2003',
    channel: 'PORTAL',
    formsCount: 150,
    recipientCount: 1,
    status: 'COMPLETED',
    bounceRate: 0,
  },
  {
    id: 'MAIL-2004',
    channel: 'EMAIL',
    formsCount: 512,
    recipientCount: 350,
    status: 'PACKAGING',
    bounceRate: 0,
  },
];

// --- COMPONENTS ---

const StatusBadge = ({
  status,
  isTable = false,
}: {
  status:
    | 'QUEUED'
    | 'TRANSMITTED'
    | 'ACK_PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'RESUBMIT_REQUIRED'
    | 'PACKAGING'
    | 'SENT'
    | 'BOUNCED'
    | 'UNDELIVERABLE'
    | 'COMPLETED';
  isTable?: boolean;
}) => {
  const config = {
    // Submission Statuses
    QUEUED: { icon: Clock, color: 'bg-gray-100 text-gray-800' },
    TRANSMITTED: { icon: UploadCloud, color: 'bg-blue-100 text-blue-800' },
    ACK_PENDING: { icon: FileClock, color: 'bg-amber-100 text-amber-800' },
    ACCEPTED: { icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
    REJECTED: { icon: X, color: 'bg-red-100 text-red-800' },
    RESUBMIT_REQUIRED: {
      icon: RefreshCw,
      color: 'bg-purple-100 text-purple-800',
    },
    // Mail Statuses
    PACKAGING: { icon: FileCog, color: 'bg-blue-100 text-blue-800' },
    SENT: { icon: Send, color: 'bg-green-100 text-green-800' },
    BOUNCED: { icon: MailWarning, color: 'bg-amber-100 text-amber-800' },
    UNDELIVERABLE: { icon: ServerCrash, color: 'bg-red-100 text-red-800' },
    COMPLETED: { icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
  };
  const currentConfig = config[status];
  const Icon = currentConfig.icon;

  if (isTable) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Icon className={`${currentConfig.color.replace('bg-', 'text-')} h-5 w-5`} />
        </TooltipTrigger>
        <TooltipContent>{status.replace('_', ' ')}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 font-medium ${currentConfig.color}`}
    >
      <Icon className="h-3 w-3" />
      {status.replace('_', ' ')}
    </Badge>
  );
};

const Header = () => {
  const { toast } = useToast();
  const [isSubWizardOpen, setIsSubWizardOpen] = React.useState(false);
  const [isMailWizardOpen, setIsMailWizardOpen] = React.useState(false);

  const handleAction = (action: string) => {
    toast({ title: 'Action Triggered', description: `${action}` });
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-auto flex-col items-start gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="outline" size="sm" className="h-7 gap-1" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              IRS &amp; Mail Interface
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Last IRS Poll: 2 mins ago</Badge>
            <Select defaultValue="PROD">
              <SelectTrigger className="h-8 w-[100px] text-xs">
                <SelectValue placeholder="Env" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROD">PROD</SelectItem>
                <SelectItem value="TEST">TEST</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full items-center gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-9 w-[200px]">
              <SelectValue placeholder="Select Payer / TCC..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tcc1">12AB (Acme Corp)</SelectItem>
              <SelectItem value="tcc2">34CD (Global Tax)</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={() => setIsSubWizardOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Submission
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsMailWizardOpen(true)}
            >
              <Mail className="mr-2 h-4 w-4" /> Create Mail Job
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAction('Syncing with IRS...')}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Sync
            </Button>
          </div>
        </div>
      </header>
      <SubmissionWizard
        isOpen={isSubWizardOpen}
        setIsOpen={setIsSubWizardOpen}
      />
      <MailWizard isOpen={isMailWizardOpen} setIsOpen={setIsMailWizardOpen} />
    </>
  );
};

const SubmissionWizard = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [step, setStep] = React.useState(1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New IRS Submission</DialogTitle>
          <DialogDescription>
            Step {step} of 4: Follow the steps to create and transmit a new file to the IRS.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 1 && (
            <div>
              <h3 className="font-semibold">Select Forms</h3>
              <p className="text-sm text-muted-foreground">Choose forms that are validated and approved.</p>
            </div>
          )}
          {step === 2 && (
             <div>
              <h3 className="font-semibold">Pre-Validation</h3>
              <p className="text-sm text-muted-foreground">Running final checks against IRS Pub 1220...</p>
            </div>
          )}
           {step === 3 && (
             <div>
              <h3 className="font-semibold">Package Details</h3>
              <p className="text-sm text-muted-foreground">Confirm file naming and environment.</p>
            </div>
          )}
           {step === 4 && (
             <div>
              <h3 className="font-semibold">Confirm &amp; Generate</h3>
              <p className="text-sm text-muted-foreground">Review the summary before generating the submission file.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button onClick={() => setStep(step < 4 ? step + 1 : 1)}>
            {step < 4 ? 'Next' : 'Finish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MailWizard = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
    const [step, setStep] = React.useState(1);
    return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Mail Job</DialogTitle>
          <DialogDescription>
             Step {step} of 4: Compose and schedule client deliveries.
          </DialogDescription>
        </DialogHeader>
         <div className="py-4">
          {step === 1 && <div>Step 1: Select Channel &amp; Audience</div>}
          {step === 2 && <div>Step 2: Compose Artifacts</div>}
          {step === 3 && <div>Step 3: Validate Recipients</div>}
          {step === 4 && <div>Step 4: Schedule &amp; Launch</div>}
        </div>
        <DialogFooter>
           {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
           <Button onClick={() => setStep(step < 4 ? step + 1 : 1)}>{step < 4 ? 'Next' : 'Launch Job'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SubmissionInspector = ({
  item,
  onOpenChange,
}: {
  item: any;
  onOpenChange: (open: boolean) => void;
}) => {
    const { toast } = useToast();
    const handleAction = (action: string) => {
        toast({ title: 'Action Triggered', description: `${action}` });
    };

  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none p-0">
        <SheetHeader className="p-6">
          <SheetTitle className='flex items-center gap-2'>
            <FileText /> Submission: {item?.id}
            {item && <StatusBadge status={item.status}/>}
          </SheetTitle>
          <SheetDescription>
            Payer: {item?.payerName} ({item?.tcc}) for Tax Year 2024
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="p-6">
            <p>Summary details for {item?.id} go here.</p>
          </TabsContent>
          <TabsContent value="files" className="p-6">
             <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-between"><div className="flex items-center gap-2"><Paperclip/>mag_file_final.txt</div><Download/></Button>
                <Button variant="outline" size="sm" className="w-full justify-between"><div className="flex items-center gap-2"><Paperclip/>control_record.txt</div><Download/></Button>
                <Button variant="outline" size-="sm" className="w-full justify-between"><div className="flex items-center gap-2"><Paperclip/>ack_file_789.xml</div><Download/></Button>
             </div>
          </TabsContent>
          <TabsContent value="issues" className="p-6">
             {item?.status === "REJECTED" ? (
                 <div className="text-sm space-y-2 text-destructive border border-destructive/50 bg-destructive/5 p-3 rounded-md">
                    <p className="font-semibold">Rejection Code {item.ackCode}: {item.ackMessage}</p>
                    <p className="text-destructive/80">Probable cause: The TIN and Name combination for the payer does not match IRS records.</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-destructive">Open in 1099 Workbench</Button>
                 </div>
             ) : (<p className="text-sm text-muted-foreground">No issues found.</p>)}
          </TabsContent>
          <TabsContent value="events" className="p-6">
            <p>Audit trail for {item?.id} goes here.</p>
          </TabsContent>
        </Tabs>
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex gap-2">
            <Button variant="secondary" onClick={() => handleAction("Package regenerating...")}>Regenerate Package</Button>
            <Button variant="secondary" onClick={() => handleAction("Re-transmitting to IRS...")}>Re-Transmit</Button>
            <Button variant="destructive" onClick={() => { onOpenChange(false); }}>Cancel Submission</Button>
            <SheetClose asChild><Button variant="outline" className="ml-auto">Close</Button></SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
const MailJobInspector = ({
  item,
  onOpenChange,
}: {
  item: any;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none p-0">
        <SheetHeader className="p-6">
           <SheetTitle className='flex items-center gap-2'>
            <MailOpen/> Mail Job: {item?.id}
            {item && <StatusBadge status={item.status}/>}
          </SheetTitle>
          <SheetDescription>
            Channel: {item?.channel}
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="recipients">Recipients</TabsTrigger>
                <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="p-6">Summary</TabsContent>
            <TabsContent value="recipients" className="p-6">Recipients</TabsContent>
            <TabsContent value="artifacts" className="p-6">Artifacts</TabsContent>
            <TabsContent value="events" className="p-6">Events</TabsContent>
        </Tabs>
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex gap-2">
            <Button variant="secondary">Re-send Failed</Button>
            <Button variant="destructive">Cancel Job</Button>
            <SheetClose asChild><Button variant="outline" className="ml-auto">Close</Button></SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default function IrsMailInterfacePage() {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = React.useState<any>(null);
  const [selectedMailJob, setSelectedMailJob] = React.useState<any>(null);

  const handleAction = (action: string) => {
    toast({ title: 'Action Triggered', description: `${action}` });
  };

  const statusColors: any = {
    QUEUED: 'bg-gray-500/10',
    TRANSMITTED: 'bg-blue-500/10',
    ACK_PENDING: 'bg-amber-500/10',
    ACCEPTED: 'bg-green-500/10',
    REJECTED: 'bg-red-500/10',
    RESUBMIT_REQUIRED: 'bg-purple-500/10',
    PACKAGING: 'bg-blue-500/10',
    SENT: 'bg-green-500/10',
    BOUNCED: 'bg-amber-500/10',
    UNDELIVERABLE: 'bg-red-500/10',
    COMPLETED: 'bg-green-500/10',
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Pipeline Overview */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {kpiData.map((kpi) => (
                <Card key={kpi.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {kpi.title}
                    </CardTitle>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-headline flex items-center gap-2">
                    <Filter /> E-file Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="w-full h-[200px]">
                    <ResponsiveContainer>
                      <FunnelChart>
                        <RechartsTooltip />
                        <Funnel
                          dataKey="value"
                          data={eFileFunnelData}
                          isAnimationActive
                        >
                          <LabelList
                            position="right"
                            fill="#fff"
                            stroke="none"
                            dataKey="name"
                          />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-headline flex items-center gap-2">
                    <AlertTriangle /> Top Rejection Reasons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="w-full h-[200px]">
                    <ResponsiveContainer>
                      <BarChart
                        data={rejectionReasonsData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                      >
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="reason"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          width={120}
                        />
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          fill="hsl(var(--chart-5))"
                          radius={4}
                        >
                          <LabelList
                            dataKey="count"
                            position="right"
                            offset={8}
                            className="fill-foreground"
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
               <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-headline flex items-center gap-2">
                    <Share /> Delivery Channel Mix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="w-full h-[200px]">
                    <ResponsiveContainer>
                        <PieChart>
                            <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={deliveryChannelData} dataKey="value" nameKey="channel" cx="50%" cy="50%" outerRadius={80} label>
                                {deliveryChannelData.map((entry) => (
                                    <Cell key={`cell-${entry.channel}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Submissions (IRS E-file)</CardTitle>
                <CardDescription>
                  Electronic filings sent to the IRS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Input placeholder="Filter by Payer, ID..." className="h-9 max-w-xs" />
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="mr-2 h-4 w-4" /> Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuCheckboxItem>Accepted</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Rejected</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Submission ID</TableHead>
                        <TableHead>Payer</TableHead>
                        <TableHead>Doc Types</TableHead>
                        <TableHead>Forms</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>ACK</TableHead>
                        <TableHead>Env</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissionsData.map((s) => (
                        <TableRow
                          key={s.id}
                          className={`cursor-pointer ${statusColors[s.status as keyof typeof statusColors]}`}
                          onClick={() => setSelectedSubmission(s)}
                        >
                          <TableCell className="font-mono text-xs font-medium">{s.id}</TableCell>
                          <TableCell>{s.payerName}</TableCell>
                          <TableCell>{s.docTypes.join(', ')}</TableCell>
                          <TableCell>{s.formsCount}</TableCell>
                          <TableCell><StatusBadge status={s.status as any}/></TableCell>
                          <TableCell>{s.ackMessage}</TableCell>
                          <TableCell>
                            <Badge variant={s.environment === 'PROD' ? 'default' : 'secondary'}>{s.environment}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Mail Jobs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Mail Jobs (Client Delivery)</CardTitle>
                <CardDescription>
                  Email, portal, and print deliveries to clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job ID</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bounce %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mailJobsData.map((job) => (
                        <TableRow
                          key={job.id}
                          className={`cursor-pointer ${statusColors[job.status as keyof typeof statusColors]}`}
                          onClick={() => setSelectedMailJob(job)}
                        >
                          <TableCell className="font-mono text-xs font-medium">{job.id}</TableCell>
                          <TableCell>{job.channel}</TableCell>
                          <TableCell>{job.recipientCount}</TableCell>
                          <TableCell><StatusBadge status={job.status as any}/></TableCell>
                          <TableCell>{job.bounceRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </div>
        </main>
        <SubmissionInspector item={selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)} />
        <MailJobInspector item={selectedMailJob} onOpenChange={(open) => !open && setSelectedMailJob(null)} />
      </div>
    </TooltipProvider>
  );
}
