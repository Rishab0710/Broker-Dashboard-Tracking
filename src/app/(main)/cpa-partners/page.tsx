
'use client';
import * as React from 'react';
import {
  AlertCircle,
  Briefcase,
  Building,
  ChevronDown,
  FileDown,
  Plus,
  Search,
  Users,
  UserCog,
  BarChart3,
  LineChart,
  Calendar,
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
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, LabelList, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { cpaPartners } from '@/lib/data';

// --- MOCK DATA ---

const cpaPartnersData = cpaPartners.slice(0, 4).map(p => ({
    id: p.id,
    name: p.name,
    firm: p.firm,
    tier: p.workload > 10 ? 'Gold' : p.workload > 5 ? 'Silver' : 'Bronze',
    assignedTrusts: p.workload * 4,
    openTasks: p.workload * 2,
    sla: 100 - p.turnaroundTime * 3,
    lastActivity: `${p.turnaroundTime} hours ago`,
    avatar: p.avatar,
    workload: { inProgress: p.workload * 2, review: p.workload, completed: p.workload }
}));

const kpiData = {
    totalPartners: cpaPartnersData.length,
    activeEngagements: cpaPartnersData.reduce((sum, p) => sum + p.assignedTrusts, 0),
    trustsAssigned: cpaPartnersData.reduce((sum, p) => sum + p.assignedTrusts, 0),
    pendingReviews: cpaPartnersData.reduce((sum, p) => sum + p.workload.review, 0),
    docsAwaiting: cpaPartnersData.reduce((sum, p) => sum + p.openTasks, 0),
    slaBreaches: cpaPartnersData.filter(p => p.sla < 80).length,
};

const workloadDistributionData = cpaPartnersData.map(p => ({ name: p.name.split(' ')[0], trusts: p.assignedTrusts, fill: 'var(--color-workload)' }));
const turnaroundTimeData = [{ month: 'Jan', time: 5.2 }, { month: 'Feb', time: 5.8 }, { month: 'Mar', time: 4.9 }, { month: 'Apr', time: 5.1 }, { month: 'May', time: 5.3 }, { month: 'Jun', time: 4.8 }];
const docBacklogData = [{ name: 'CPA Queue', value: 32, fill: 'hsl(var(--chart-4))' }, { name: 'Internal Queue', value: 15, fill: 'hsl(var(--chart-2))' }, { name: 'Completed', value: 203, fill: 'hsl(var(--chart-1))' }];

// --- COMPONENTS ---

const Header = () => {
    const { toast } = useToast();
    const handleAction = (action: string) => toast({ title: "Action Triggered", description: `${action} process initiated.` });

    const chartConfig = {
        workload: { color: 'hsl(var(--chart-1))' },
        'CPA Queue': { label: 'CPA Queue', color: 'hsl(var(--chart-4))' },
        'Internal Queue': { label: 'Internal Queue', color: 'hsl(var(--chart-2))' },
        Completed: { label: 'Completed', color: 'hsl(var(--chart-1))' }
    };

    return (
        <header className="flex h-auto flex-col items-start gap-4 border-b bg-background px-4 py-3 sm:px-6">
            <div className="flex w-full items-center">
                <div><h1 className="text-xl font-bold tracking-tight font-headline">CPA & Tax Prep Partner Hub</h1><p className="text-sm text-muted-foreground">Tax › CPA & Tax Prep Partner Hub</p></div>
                <div className="ml-auto flex items-center gap-2">
                    <Select defaultValue="2024"><SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select>
                    <Select><SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="All Tiers" /></SelectTrigger><SelectContent><SelectItem value="all">All Tiers</SelectItem><SelectItem value="gold">Gold</SelectItem><SelectItem value="silver">Silver</SelectItem><SelectItem value="bronze">Bronze</SelectItem></SelectContent></Select>
                    <Button size="sm" onClick={() => handleAction('Add Partner')}><Plus className="mr-2 h-4 w-4" /> Add Partner</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Export <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent><DropdownMenuItem>Export Workload Summary</DropdownMenuItem><DropdownMenuItem>Export Engagement List</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Total Partners <Users className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.totalPartners}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Active Engagements <Briefcase className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.activeEngagements}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Trusts Assigned <Building className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.trustsAssigned}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Pending Reviews <UserCog className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.pendingReviews}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Docs Awaiting CPA <FileDown className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold">{kpiData.docsAwaiting}</div></CardContent></Card>
                <Card><CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">SLA Breaches <AlertCircle className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader><CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-red-500">{kpiData.slaBreaches}</div></CardContent></Card>
            </div>
             <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BarChart3/> Workload Distribution</CardTitle></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[120px] w-full"><ResponsiveContainer><BarChart data={workloadDistributionData} margin={{ top: 20 }}><CartesianGrid vertical={false} /><XAxis dataKey="name" tickLine={false} axisLine={false} /><YAxis hide /><RechartsTooltip content={<ChartTooltipContent />} /><Bar dataKey="trusts" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></ChartContainer></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><LineChart/> Avg. Turnaround Time</CardTitle></CardHeader><CardContent><ChartContainer config={{}} className="h-[120px] w-full"><ResponsiveContainer><AreaChart data={turnaroundTimeData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}><CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><YAxis unit="d" tickLine={false} axisLine={false} /><RechartsTooltip content={<ChartTooltipContent />} /><Area type="natural" dataKey="time" strokeWidth={2} fillOpacity={0.4} stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" /></AreaChart></ResponsiveContainer></ChartContainer></CardContent></Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2"><Calendar/> Document Backlog</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[120px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={docBacklogData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
                                    <CartesianGrid horizontal={false} />
                                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={5} width={100} fontSize={12} />
                                    <XAxis type="number" hide />
                                    <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
                                        {docBacklogData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </header>
    );
}

const PartnerCard = ({ partner }: { partner: typeof cpaPartnersData[0] }) => {
    const { toast } = useToast();
    const handleAction = (action: string) => toast({ title: `Action for ${partner.name}`, description: `${action} initiated.` });
    
    const tierColor = partner.tier === 'Gold' ? 'border-amber-400 bg-amber-400/5' : partner.tier === 'Silver' ? 'border-slate-400 bg-slate-400/5' : 'border-orange-600/50 bg-orange-600/5';
    const slaColor = partner.sla > 95 ? 'text-green-400' : partner.sla > 85 ? 'text-amber-400' : 'text-red-400';

    return (
        <Card className={cn('flex flex-col', tierColor)}>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={partner.avatar?.imageUrl} data-ai-hint={partner.avatar?.imageHint} />
                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-base">{partner.name}</CardTitle>
                    <CardDescription>{partner.tier} Tier Partner</CardDescription>
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Users /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleAction('Assign Trusts')}>Assign Trusts</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Manage Team')}>Manage Team</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-muted/50 p-2">
                    <p className="font-bold text-lg">{partner.assignedTrusts}</p>
                    <p className="text-muted-foreground">Trusts</p>
                </div>
                 <div className="rounded-md bg-muted/50 p-2">
                    <p className="font-bold text-lg">{partner.openTasks}</p>
                    <p className="text-muted-foreground">Open Tasks</p>
                </div>
                 <div className="rounded-md bg-muted/50 p-2">
                    <p className={cn("font-bold text-lg", slaColor)}>{partner.sla}%</p>
                    <p className="text-muted-foreground">SLA</p>
                </div>
            </CardContent>
            <CardContent className="mt-auto">
                <p className="text-xs text-muted-foreground mb-1">Workload Status</p>
                <Progress
                  value={(partner.workload.completed / partner.assignedTrusts) * 100}
                  className="h-2"
                  style={{
                    // This is a creative way to show multiple segments in a progress bar
                    background: `linear-gradient(to right, 
                      hsl(var(--chart-1)) 0%, 
                      hsl(var(--chart-1)) ${partner.workload.completed / partner.assignedTrusts * 100}%, 
                      hsl(var(--chart-2)) ${partner.workload.completed / partner.assignedTrusts * 100}%, 
                      hsl(var(--chart-2)) ${(partner.workload.completed + partner.workload.review) / partner.assignedTrusts * 100}%, 
                      hsl(var(--chart-4)) ${(partner.workload.completed + partner.workload.review) / partner.assignedTrusts * 100}%, 
                      hsl(var(--chart-4)) 100%)`
                  }}
                />
                 <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>{partner.workload.completed} Comp.</span>
                    <span>{partner.workload.review} Rev.</span>
                    <span>{partner.workload.inProgress} Prog.</span>
                </div>
            </CardContent>
        </Card>
    );
};


export default function CpaHubPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [tierFilter, setTierFilter] = React.useState('all');

    const filteredPartners = cpaPartnersData.filter(partner => {
        const nameMatch = partner.name.toLowerCase().includes(searchTerm.toLowerCase());
        const tierMatch = tierFilter === 'all' || partner.tier.toLowerCase() === tierFilter;
        return nameMatch && tierMatch;
    });

    return (
        <TooltipProvider>
            <div className="flex flex-col bg-background">
                <Header />
                 <main className="flex-1 p-4 sm:p-6">
                    <div className="mb-4 flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search partners..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPartners.map(partner => (
                            <PartnerCard key={partner.id} partner={partner} />
                        ))}
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}
 