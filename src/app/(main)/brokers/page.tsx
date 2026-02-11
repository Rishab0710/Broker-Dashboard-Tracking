
'use client';
import React from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  Archive,
  ArrowRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleDotDashed,
  Clock,
  Download,
  File,
  FileCheck2,
  FileClock,
  FileCog,
  FileDown,
  FileSearch,
  FileText,
  FileUp,
  FileWarning,
  Filter,
  History,
  Inbox,
  Layers,
  ListFilter,
  Loader,
  MoreVertical,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Table2,
  Tags,
  Activity,
  Trello,
  Upload,
  User,
  X,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Funnel, FunnelChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LabelList } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';


// --- MOCK DATA & TYPES ---

type Broker = { id: string; name: string };
type StatementStatus = "MISSING" | "PENDING" | "OK" | "ERRORS";
type Statement = {
  id: string;
  brokerId: string;
  brokerName: string;
  accountId: string;
  year: number;
  month: number;
  status: StatementStatus;
  receivedAt?: string;
  processedAt?: string;
  errorCount: number;
  assignedTo?: string;
  slaDueAt: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};
type StatementError = {
  id: string;
  statementId: string;
  errorCode: string;
  message: string;
  severity: "INFO" | "WARN" | "ERROR";
  status: "New" | "Investigating" | "Waiting for Re-send" | "Resolved";
  assignedTo?: string;
};

const BROKERS: Broker[] = [
  { id: 'ms', name: 'Morgan Stanley' },
  { id: 'fidelity', name: 'Fidelity' },
  { id: 'schwab', name: 'Charles Schwab' },
  { id: 'vanguard', name: 'Vanguard' },
  { id: 'jpm', name: 'JP Morgan' },
  { id: 'bny', name: 'BNY Mellon' },
  { id: 'ubs', name: 'UBS' },
  { id: 'gs', name: 'Goldman Sachs' },
  { id: 'nt', name: 'Northern Trust' },
  { id: 'ss', name: 'State Street' },
];

const STATUSES: StatementStatus[] = ["OK", "ERRORS", "PENDING", "MISSING"];
const statusDisplayNames: Record<StatementStatus, string> = {
  OK: 'Successful',
  ERRORS: 'Errors',
  PENDING: 'Pending',
  MISSING: 'Missing',
};

// --- STATIC DATA FOR DEMO ---
const initialStatements: Statement[] = [
    // Morgan Stanley (9 total): 7 OK, 1 ERRORS, 1 PENDING
    ...Array.from({ length: 7 }, (_, i) => ({ id: `stmt_ms_MS-10${String(i).padStart(2,'0')}`, brokerId: 'ms', brokerName: 'Morgan Stanley', accountId: `MS-10${String(i).padStart(2,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW' as Statement['priority'], receivedAt: '2026-02-05T08:01:15Z', processedAt: `2026-02-05T08:02:${String(10+i).padStart(2,'0')}Z` })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_ms_MS-999`, brokerId: 'ms', brokerName: 'Morgan Stanley', accountId: `MS-999`, year: 2026, month: 2, status: 'ERRORS' as StatementStatus, errorCount: 2, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM', receivedAt: '2026-02-05T08:01:15Z', processedAt: '2026-02-05T08:02:51Z' })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_ms_MS-106${i}`, brokerId: 'ms', brokerName: 'Morgan Stanley', accountId: `MS-106${i}`, year: 2026, month: 2, status: 'PENDING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH', receivedAt: '2026-02-05T08:01:15Z' })),

    // Fidelity (15 total): 12 OK, 1 ERRORS, 1 PENDING, 1 MISSING
    ...Array.from({ length: 12 }, (_, i) => ({ id: `stmt_fidelity_FID-20${String(i+1).padStart(2,'0')}`, brokerId: 'fidelity', brokerName: 'Fidelity', accountId: `FID-20${String(i+1).padStart(2,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW' as Statement['priority'], receivedAt: '2026-02-05T09:10:00Z', processedAt: `2026-02-05T09:11:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}Z` })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_fidelity_FID-210${i+1}`, brokerId: 'fidelity', brokerName: 'Fidelity', accountId: `FID-210${i+1}`, year: 2026, month: 2, status: 'ERRORS' as StatementStatus, errorCount: 1, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM', receivedAt: '2026-02-05T09:10:00Z', processedAt: '2026-02-05T09:18:33Z' })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_fidelity_FID-211${i+2}`, brokerId: 'fidelity', brokerName: 'Fidelity', accountId: `FID-211${i+2}`, year: 2026, month: 2, status: 'PENDING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH', receivedAt: '2026-02-05T09:10:00Z' })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_fidelity_FID-212${i+3}`, brokerId: 'fidelity', brokerName: 'Fidelity', accountId: `FID-212${i+3}`, year: 2026, month: 2, status: 'MISSING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW' })),
  
    // Charles Schwab (26 total): 22 OK, 2 ERRORS, 1 PENDING, 1 MISSING
    ...Array.from({ length: 22 }, (_, i) => ({ id: `stmt_schwab_SCH-3${String(i+1).padStart(3,'0')}`, brokerId: 'schwab', brokerName: 'Charles Schwab', accountId: `SCH-3${String(i+1).padStart(3,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM' as Statement['priority'], receivedAt: '2026-02-05T10:00:00Z', processedAt: `2026-02-05T10:0${Math.floor(i/20)}:${String(10 + (i%20)*3).padStart(2,'0')}Z` })),
    ...Array.from({ length: 2 }, (_, i) => ({ id: `stmt_schwab_SCH-4${158+i}`, brokerId: 'schwab', brokerName: 'Charles Schwab', accountId: `SCH-4${158+i}`, year: 2026, month: 2, status: 'ERRORS' as StatementStatus, errorCount: i % 4 === 0 ? 3 : i % 4 < 2 ? 1 : 2, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH' as Statement['priority'], receivedAt: '2026-02-05T10:00:00Z', processedAt: `2026-02-05T10:06:${String(20 + i*5).padStart(2, '0')}Z` })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_schwab_SCH-5${178+i}`, brokerId: 'schwab', brokerName: 'Charles Schwab', accountId: `SCH-5${178+i}`, year: 2026, month: 2, status: 'PENDING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW', receivedAt: '2026-02-05T10:00:00Z' })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_schwab_SCH-6${179+i}`, brokerId: 'schwab', brokerName: 'Charles Schwab', accountId: `SCH-6${179+i}`, year: 2026, month: 2, status: 'MISSING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM' })),
  
    // Vanguard (13 total): 10 OK, 2 ERRORS, 1 PENDING
    ...Array.from({ length: 10 }, (_, i) => ({ id: `stmt_vanguard_VAN-40${String(i+1).padStart(2,'0')}`, brokerId: 'vanguard', brokerName: 'Vanguard', accountId: `VAN-40${String(i+1).padStart(2,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW' as Statement['priority'], receivedAt: '2026-02-05T11:30:00Z', processedAt: `2026-02-05T11:32:${String(15 + i).padStart(2, '0')}Z` })),
    ...Array.from({ length: 2 }, (_, i) => ({ id: `stmt_vanguard_VAN-50${72+i}`, brokerId: 'vanguard', brokerName: 'Vanguard', accountId: `VAN-50${72+i}`, year: 2026, month: 2, status: 'ERRORS' as StatementStatus, errorCount: (i % 2) + 1, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH' as Statement['priority'], receivedAt: '2026-02-05T11:30:00Z', processedAt: `2026-02-05T11:33:${String(20+i).padStart(2,'0')}Z` })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_vanguard_VAN-60${89+i}`, brokerId: 'vanguard', brokerName: 'Vanguard', accountId: `VAN-60${89+i}`, year: 2026, month: 2, status: 'PENDING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW', receivedAt: '2026-02-05T11:30:00Z' })),
    
    // JP Morgan (13 total): 12 OK, 1 ERRORS
    ...Array.from({ length: 12 }, (_, i) => ({ id: `stmt_jpm_JPM-50${String(i+1).padStart(2,'0')}`, brokerId: 'jpm', brokerName: 'JP Morgan', accountId: `JPM-50${String(i+1).padStart(2,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM' as Statement['priority'], receivedAt: '2026-02-05T12:00:00Z', processedAt: `2026-02-05T12:01:${String(30 + Math.floor(i/2)).padStart(2, '0')}Z` })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_jpm_JPM-508${i+1}`, brokerId: 'jpm', brokerName: 'JP Morgan', accountId: `JPM-508${i+1}`, year: 2026, month: 2, status: 'ERRORS' as StatementStatus, errorCount: 1, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH', receivedAt: '2026-02-05T12:00:00Z', processedAt: '2026-02-05T12:02:05Z' })),

    // BNY Mellon (7 total): 6 OK, 1 MISSING
    ...Array.from({ length: 6 }, (_, i) => ({ id: `stmt_bny_BNY-60${String(i+1).padStart(2,'0')}`, brokerId: 'bny', brokerName: 'BNY Mellon', accountId: `BNY-60${String(i+1).padStart(2,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW' as Statement['priority'], receivedAt: '2026-02-06T10:00:00Z', processedAt: `2026-02-06T10:01:${String(10 + i).padStart(2,'0')}Z` })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_bny_BNY-605${i+2}`, brokerId: 'bny', brokerName: 'BNY Mellon', accountId: `BNY-605${i+2}`, year: 2026, month: 2, status: 'MISSING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM' })),
    
    // UBS (7 total): 4 OK, 3 PENDING
    ...Array.from({ length: 4 }, (_, i) => ({ id: `stmt_ubs_UBS-70${String(i+1).padStart(2,'0')}`, brokerId: 'ubs', brokerName: 'UBS', accountId: `UBS-70${String(i+1).padStart(2,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM' as Statement['priority'], receivedAt: '2026-02-07T11:00:00Z', processedAt: `2026-02-07T11:01:${String(10 + i).padStart(2,'0')}Z` })),
    ...Array.from({ length: 3 }, (_, i) => ({ id: `stmt_ubs_UBS-71${29+i}`, brokerId: 'ubs', brokerName: 'UBS', accountId: `UBS-71${29+i}`, year: 2026, month: 2, status: 'PENDING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW' as Statement['priority'], receivedAt: '2026-02-07T11:00:00Z' })),

    // Goldman Sachs (3 total): 2 OK, 1 ERRORS, 1 MISSING
    ...Array.from({ length: 2 }, (_, i) => ({ id: `stmt_gs_GS-800${i+1}`, brokerId: 'gs', brokerName: 'Goldman Sachs', accountId: `GS-800${i+1}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH' as Statement['priority'], receivedAt: '2026-02-08T12:00:00Z', processedAt: `2026-02-08T12:01:${String(10+i).padStart(2,'0')}Z` })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_gs_GS-801${i+1}`, brokerId: 'gs', brokerName: 'Goldman Sachs', accountId: `GS-801${i+1}`, year: 2026, month: 2, status: 'ERRORS' as StatementStatus, errorCount: 3, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH', receivedAt: '2026-02-08T12:00:00Z', processedAt: '2026-02-08T12:02:00Z' })),
    ...Array.from({ length: 1 }, (_, i) => ({ id: `stmt_gs_GS-802${i+2}`, brokerId: 'gs', brokerName: 'Goldman Sachs', accountId: `GS-802${i+2}`, year: 2026, month: 2, status: 'MISSING' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'HIGH' })),

    // Northern Trust (4 total): 4 OK
    ...Array.from({ length: 4 }, (_, i) => ({ id: `stmt_nt_NT-90${String(i+1).padStart(2,'0')}`, brokerId: 'nt', brokerName: 'Northern Trust', accountId: `NT-90${String(i+1).padStart(2,'0')}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'LOW' as Statement['priority'], receivedAt: '2026-02-09T13:00:00Z', processedAt: `2026-02-09T13:01:${String(10 + i).padStart(2,'0')}Z` })),
    
    // State Street (2 total): 2 OK
    ...Array.from({ length: 2 }, (_, i) => ({ id: `stmt_ss_SS-110${i+1}`, brokerId: 'ss', brokerName: 'State Street', accountId: `SS-110${i+1}`, year: 2026, month: 2, status: 'OK' as StatementStatus, errorCount: 0, slaDueAt: '2026-03-10T00:00:00Z', priority: 'MEDIUM' as Statement['priority'], receivedAt: '2026-02-10T14:00:00Z', processedAt: `2026-02-10T14:01:${String(10+i).padStart(2,'0')}Z` })),

].map(s => ({...s, assignedTo: ['Alex G.','Brian W.','Cathy L.'][Math.floor(Math.random()*3)]}));


const initialErrors: StatementError[] = [
    ...Array.from({ length: 1 }).flatMap((_, i) => [
        { id: `err_ms_104${i}_1`, statementId: `stmt_ms_MS-999`, errorCode: 'P101', message: 'CUSIP not found', severity: 'ERROR', status: 'New' },
        { id: `err_ms_104${i}_2`, statementId: `stmt_ms_MS-999`, errorCode: 'R205', message: 'Negative cash balance', severity: 'WARN', status: 'New' },
    ]),
    ...Array.from({ length: 1 }).flatMap((_, i) => [
        { id: `err_fidelity_207${i+1}_1`, statementId: `stmt_fidelity_FID-210${i+1}`, errorCode: 'V404', message: 'Unrecognized transaction type', severity: 'ERROR', status: 'New' },
    ]),

  ...Array.from({ length: 2 }).flatMap((_, i) => {
    const errors: StatementError[] = [];
    const errorCount = i % 4 === 0 ? 3 : i % 4 < 2 ? 1 : 2;
    const stmtId = `stmt_schwab_SCH-4${158+i}`;
    if (errorCount >= 1) errors.push({ id: `err_s_4${158+i}_1`, statementId: stmtId, errorCode: 'P101', message: 'CUSIP not found', severity: 'ERROR', status: 'New' });
    if (errorCount >= 2) errors.push({ id: `err_s_4${158+i}_2`, statementId: stmtId, errorCode: 'R205', message: 'Negative cash balance', severity: 'WARN', status: 'Investigating' });
    if (errorCount >= 3) errors.push({ id: `err_s_4${158+i}_3`, statementId: stmtId, errorCode: 'M999', message: 'Missing page 3', severity: 'INFO', status: 'New' });
    return errors;
  }),
  
  ...Array.from({ length: 2 }).flatMap((_, i) => {
    const errors: StatementError[] = [];
    const errorCount = (i % 2) + 1;
    const stmtId = `stmt_vanguard_VAN-50${72+i}`;
    if (errorCount >= 1) errors.push({ id: `err_v_50${72+i}_1`, statementId: stmtId, errorCode: 'V404', message: 'Unrecognized transaction type', severity: 'ERROR', status: 'New' });
    if (errorCount >= 2) errors.push({ id: `err_v_50${72+i}_2`, statementId: stmtId, errorCode: 'P101', message: 'CUSIP not found', severity: 'ERROR', status: 'Resolved' });
    return errors;
  }),

    ...Array.from({ length: 1 }).flatMap((_, i) => [
        { id: `err_jpm_506${i+1}_1`, statementId: `stmt_jpm_JPM-508${i+1}`, errorCode: 'P101', message: 'CUSIP not found', severity: 'ERROR', status: 'New' },
    ]),
    ...Array.from({ length: 1 }).flatMap((_, i) => [
        { id: `err_gs_801${i+1}_1`, statementId: `stmt_gs_GS-801${i+1}`, errorCode: 'V404', message: 'Unrecognized transaction type', severity: 'ERROR', status: 'New' },
        { id: `err_gs_801${i+1}_2`, statementId: `stmt_gs_GS-801${i+1}`, errorCode: 'M999', message: 'Missing page 1', severity: 'WARN', status: 'New' },
        { id: `err_gs_801${i+1}_3`, statementId: `stmt_gs_GS-801${i+1}`, errorCode: 'R205', message: 'Negative cash balance', severity: 'WARN', status: 'New' },
    ]),
].map(e => ({ ...e, assignedTo: ['Alex G.','Brian W.','Cathy L.'][Math.floor(Math.random()*3)]}));

const useStatementStore = () => {
    const [statements, setStatements] = React.useState<Statement[]>([]);
    const [errors, setErrors] = React.useState<StatementError[]>([]);
    const { toast } = useToast();

    const initialize = React.useCallback((year: number, month: number) => {
        // This is now deterministic for the demo. It will show the same data for Feb 2026.
        if (year === 2026 && month === 1) { // month is 0-indexed, so 1 is February
            setStatements(initialStatements);
            setErrors(initialErrors);
        } else {
             // For any other month, generate some random data to show interaction is possible
            const monthSeed = year * 12 + month;
            const random = (seed: number) => {
                let x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };
        
            const generatedStatements: Statement[] = [];
            const generatedErrors: StatementError[] = [];
            const users = ['Alex G.', 'Brian W.', 'Cathy L.'];
            const priorities: Statement['priority'][] = ['LOW', 'MEDIUM', 'HIGH'];
            let stmtIdCounter = 0;
            let errIdCounter = 0;
        
            BROKERS.forEach((broker, bIndex) => {
                const numAccounts = 8 + (monthSeed % 5) + (broker.id.length % 3);
        
                for (let i = 0; i < numAccounts; i++) {
                    stmtIdCounter++;
                    const accountId = `${broker.id.toUpperCase()}-${String(1000 + stmtIdCounter).padStart(4, '0')}`;
                    
                    const statusRoll = random(monthSeed + stmtIdCounter);
                    let status: StatementStatus;
                    let errorCount = 0;
        
                    if (statusRoll < 0.65) status = 'OK';
                    else if (statusRoll < 0.85) { status = 'ERRORS'; errorCount = (stmtIdCounter % 2) + 1; } 
                    else if (statusRoll < 0.95) status = 'PENDING';
                    else status = 'MISSING';
                    
                    const slaDueAt = new Date(year, month + 1, 10).toISOString();
                    const receivedAtDate = status !== 'MISSING' ? new Date(year, month, 5) : undefined;
                    const processedAtDate = (status === 'OK' || status === 'ERRORS') && receivedAtDate ? new Date(receivedAtDate.getTime() + (Math.random() * 5 * 60000)) : undefined;

                    const statement: Statement = {
                        id: `stmt_${broker.id}_${accountId}_${year}_${month + 1}`,
                        brokerId: broker.id,
                        brokerName: broker.name,
                        accountId,
                        year,
                        month: month + 1,
                        status,
                        receivedAt: receivedAtDate?.toISOString(),
                        processedAt: processedAtDate?.toISOString(),
                        errorCount,
                        assignedTo: users[stmtIdCounter % users.length],
                        slaDueAt: slaDueAt,
                        priority: priorities[stmtIdCounter % priorities.length],
                    };
                    generatedStatements.push(statement);
        
                    if (errorCount > 0) {
                         for (let j = 0; j < errorCount; j++) {
                            const errorMessages = [{ code: 'P101', msg: "CUSIP not found in security master." }, { code: 'R205', msg: 'Negative cash balance detected.' }];
                            const errIndex = errIdCounter++;
                            const errorTemplate = errorMessages[errIndex % errorMessages.length];
                            generatedErrors.push({
                                id: `err_${statement.id}_${j}`, statementId: statement.id, errorCode: errorTemplate.code,
                                message: `${errorTemplate.msg} (Acct: ${statement.accountId})`,
                                severity: (j % 2 === 0 ? 'ERROR' : 'WARN'), status: 'New',
                            });
                        }
                    }
                }
            });
            setStatements(generatedStatements);
            setErrors(generatedErrors);
        }
    }, []);

    const findStatement = (id: string) => statements.find(s => s.id === id);
    
    const updateStatement = (id: string, newStatus: StatementStatus, updates?: Partial<Statement>) => {
        setStatements(prev => prev.map(s => s.id === id ? { ...s, status: newStatus, ...updates } : s));
    };

    const updateError = (id: string, newStatus: StatementError['status']) => {
      setErrors(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    }

    const processStatement = (statementId: string) => {
        toast({ title: 'Processing Started', description: `Statement ${statementId} is now being processed.` });
        setTimeout(() => {
            const statement = findStatement(statementId);
            const failsProcessing = parseInt(statement!.accountId.slice(-1)) > 7; 

            if (failsProcessing && statement) {
                const errorCount = (parseInt(statement!.accountId.slice(-1)) % 2) + 1;
                updateStatement(statementId, 'ERRORS', { errorCount, processedAt: new Date(new Date(statement.receivedAt!).getTime() + (Math.random() * 5 * 60000)).toISOString() });
                const newErrors: StatementError[] = [];
                for (let i = 0; i < errorCount; i++) {
                    newErrors.push({
                        id: `err_${statement.id}_${i}`, statementId: statement.id, errorCode: 'P101',
                        message: `CUSIP not found in security master. (Acct: ${statement.accountId})`,
                        severity: 'ERROR', status: 'New',
                    });
                }
                setErrors(prev => [...prev, ...newErrors]);
                toast({ variant: 'destructive', title: 'Processing Failed', description: `Statement ${statementId} processed with ${errorCount} errors.` });
            } else {
                updateStatement(statementId, 'OK', { processedAt: new Date(new Date(statement!.receivedAt!).getTime() + (Math.random() * 5 * 60000)).toISOString() });
                toast({ title: 'Processing Successful', description: `Statement ${statementId} processed successfully.` });
            }
        }, 2000);
    };
    
    const linkUpload = (brokerId: string, year: number, month: number) => {
        const statement = statements.find(s => s.brokerId === brokerId && s.year === year && s.month === month + 1 && s.status === 'MISSING');
        if (statement) {
            updateStatement(statement.id, 'PENDING', { receivedAt: new Date().toISOString() });
            toast({ title: 'Upload Linked', description: `PDF linked to statement ${statement.id}. Starting processing...`});
            setTimeout(() => processStatement(statement.id), 500);
            return true;
        }
        toast({ variant: 'destructive', title: 'No matching statement found', description: `Could not find a missing statement for that broker and period.`});
        return false;
    }

    return { statements, errors, initialize, findStatement, updateStatement, processStatement, linkUpload, updateError };
}

// --- UI COMPONENTS ---

type Kpi = {
    title: "Statements Received" | "Successful" | "Errors" | "Pending" | "Missing" | "Open Exceptions";
};

const KpiDetailDialog = ({ kpi, statements, errors, open, onOpenChange }: { kpi: Kpi | null, statements: Statement[], errors: StatementError[], open: boolean, onOpenChange: (open: boolean) => void}) => {
  if (!kpi) return null;

  let relevantStatements: Statement[] = [];
  let relevantErrors: StatementError[] = [];
  let dialogDescription = "";
  let showErrors = false;
  const showProcessedColumn = kpi.title === 'Successful' || kpi.title === 'Errors';


  switch (kpi.title) {
    case 'Statements Received':
      relevantStatements = statements.filter(s => s.status !== 'MISSING');
      dialogDescription = `Showing all ${relevantStatements.length} statements that have been received.`;
      break;
    case 'Successful':
      relevantStatements = statements.filter(s => s.status === 'OK');
      dialogDescription = `Showing all ${relevantStatements.length} successfully processed statements.`;
      break;
    case 'Errors':
      relevantStatements = statements.filter(s => s.status === 'ERRORS');
      dialogDescription = `Showing all ${relevantStatements.length} statements that processed with errors.`;
      break;
    case 'Missing':
        relevantStatements = statements.filter(s => s.status === 'MISSING');
        dialogDescription = `Showing all ${relevantStatements.length} statements that are currently missing.`;
        break;
    case 'Pending':
        relevantStatements = statements.filter(s => s.status === 'PENDING');
        dialogDescription = `Showing all ${relevantStatements.length} statements that have been received and are pending processing.`;
        break;
    case 'Open Exceptions':
      showErrors = true;
      relevantErrors = errors.filter(e => e.status !== 'Resolved');
      dialogDescription = `Showing all ${relevantErrors.length} open exceptions across all statements.`;
      break;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-base">{kpi.title}</DialogTitle>
          <DialogDescription className="text-xs">{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {showErrors ? (
             <Table>
                <TableHeader><TableRow><TableHead className="p-2 text-xs">Statement ID</TableHead><TableHead className="p-2 text-xs">Error</TableHead><TableHead className="p-2 text-xs">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {relevantErrors.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="p-2 text-xs">{e.statementId}</TableCell>
                      <TableCell className="p-2 text-xs">{e.message}</TableCell>
                      <TableCell className="p-2 text-xs"><Badge variant="outline">{e.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead className="p-2 text-xs">Broker</TableHead>
                    <TableHead className="p-2 text-xs">Account</TableHead>
                    <TableHead className="p-2 text-xs">Status</TableHead>
                    <TableHead className="p-2 text-xs">Received</TableHead>
                    {showProcessedColumn && <TableHead className="p-2 text-xs">Processed</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {relevantStatements.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="p-2 text-xs">{s.brokerName}</TableCell>
                    <TableCell className="p-2 text-xs">{s.accountId}</TableCell>
                    <TableCell className="p-2"><StatusPill status={s.status} /></TableCell>
                    <TableCell className="p-2 text-xs">{s.receivedAt ? new Date(s.receivedAt).toLocaleString() : '-'}</TableCell>
                    {showProcessedColumn && <TableCell className="p-2 text-xs">{s.processedAt ? new Date(s.processedAt).toLocaleString() : '-'}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const KpiCards = ({ statements, errors, onKpiClick }: { statements: Statement[], errors: StatementError[], onKpiClick: (kpi: Kpi) => void }) => {
  const kpis = React.useMemo(() => {
    const expected = statements.length;
    if (expected === 0) {
        return { expected: 0, received: 0, receivedPercentage: 0, ok: 0, errors: 0, missing: 0, pending: 0, openExceptions: 0 };
    }
    const received = statements.filter(s => s.status !== 'MISSING').length;
    return {
        expected,
        received,
        receivedPercentage: (received / expected) * 100,
        ok: statements.filter(s => s.status === 'OK').length,
        errors: statements.filter(s => s.status === 'ERRORS').length,
        missing: statements.filter(s => s.status === 'MISSING').length,
        pending: statements.filter(s => s.status === 'PENDING').length,
        openExceptions: errors.filter(e => e.status !== 'Resolved').length,
    }
  }, [statements, errors]);

  return (
    <div className="grid grid-cols-6 gap-4 p-4 sm:p-6 border-b">
      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => onKpiClick({ title: "Statements Received" })}>
        <CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Statements Received <Activity className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold">{`${kpis.receivedPercentage.toFixed(0)}%`}</div>
           <p className="text-xs text-muted-foreground">{kpis.received} of {kpis.expected} expected</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => onKpiClick({ title: "Successful" })}>
        <CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Successful <CheckCircle2 className="h-4 w-4 text-green-500" /></CardTitle></CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-green-500">{kpis.ok}</div>
          <p className="text-xs text-muted-foreground">Successfully processed</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => onKpiClick({ title: "Errors" })}>
        <CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Errors <AlertCircle className="h-4 w-4 text-amber-500" /></CardTitle></CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-amber-500">{kpis.errors}</div>
          <p className="text-xs text-muted-foreground">Require intervention</p>
        </CardContent>
      </Card>
       <Card className="cursor-pointer hover:bg-muted/50" onClick={() => onKpiClick({ title: "Pending" })}>
        <CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Pending <FileCog className="h-4 w-4 text-blue-500" /></CardTitle></CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-blue-500">{kpis.pending}</div>
          <p className="text-xs text-muted-foreground">Received, not processed</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => onKpiClick({ title: "Missing" })}>
        <CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Missing <FileSearch className="h-4 w-4 text-red-500" /></CardTitle></CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-red-500">{kpis.missing}</div>
          <p className="text-xs text-muted-foreground">Not yet received</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => onKpiClick({ title: "Open Exceptions" })}>
        <CardHeader className="p-3 pb-2"><CardTitle className="text-sm font-medium flex items-center justify-between">Open Exceptions <Siren className="h-4 w-4 text-red-500" /></CardTitle></CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-red-500">{kpis.openExceptions}</div>
          <p className="text-xs text-muted-foreground">Unresolved errors</p>
        </CardContent>
      </Card>
    </div>
  );
};

const ChartsSection = ({ statements, errors }: { statements: Statement[], errors: StatementError[] }) => {
    const chartConfig: ChartConfig = {
        OCR: { label: 'OCR', color: 'hsl(var(--chart-1))' },
        Extract: { label: 'Extract', color: 'hsl(var(--chart-2))' },
        Normalize: { label: 'Normalize', color: 'hsl(var(--chart-3))' },
        QC: { label: 'QC', color: 'hsl(var(--chart-4))' },
        Output: { label: 'Output', color: 'hsl(var(--chart-5))' },
        INFO: { label: 'Info', color: 'hsl(var(--chart-1))' },
        WARN: { label: 'Warning', color: 'hsl(var(--chart-4))' },
        ERROR: { label: 'Error', color: 'hsl(var(--chart-2))' },
        aging: { label: 'Errors', color: 'hsl(var(--chart-4))' },
    };

    const pipelineEfficiencyData = React.useMemo(() => {
        if (statements.length === 0) return [];

        // Count statements per broker
        const brokerCounts = statements.reduce((acc, stmt) => {
            acc[stmt.brokerId] = (acc[stmt.brokerId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Get top 5 broker IDs
        const top5BrokerIds = Object.entries(brokerCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([brokerId]) => brokerId);
        
        return top5BrokerIds.map(brokerId => {
            const broker = BROKERS.find(b => b.id === brokerId);
            if (!broker) return null;
            const brokerName = broker.name.split(' ')[0];

            const seed = brokerId.length;
            const ocrTime = 3 + (seed % 4); // 3-6s
            const extractTime = 8 + (seed % 7); // 8-14s
            const normalizeTime = 5 + (seed % 5); // 5-9s
            const qcTime = 10 + (seed % 10); // 10-19s
            const outputTime = 2 + (seed % 3); // 2-4s

            return {
                broker: brokerName,
                OCR: ocrTime,
                Extract: extractTime,
                Normalize: normalizeTime,
                QC: qcTime,
                Output: outputTime,
            };
        }).filter(Boolean) as { broker: string; OCR: number; Extract: number; Normalize: number; QC: number; Output: number; }[];

    }, [statements]);

    const exceptionsByBrokerData = React.useMemo(() => {
        if (!statements.length || !errors.length) return [];
        
        const statementBrokerMap = new Map<string, string>();
        statements.forEach(stmt => {
            statementBrokerMap.set(stmt.id, stmt.brokerName.split(' ')[0]);
        });

        const aggregated = errors.reduce((acc, error) => {
            const brokerName = statementBrokerMap.get(error.statementId);
            if (!brokerName) return acc;
            
            if (!acc[brokerName]) {
                acc[brokerName] = { name: brokerName, INFO: 0, WARN: 0, ERROR: 0 };
            }
            
            acc[brokerName][error.severity]++;
            
            return acc;
        }, {} as Record<string, { name: string; INFO: number; WARN: number; ERROR: number; }>);
        
        return Object.values(aggregated).filter(b => b.INFO + b.WARN + b.ERROR > 0);
    }, [statements, errors]);
    
    const errorAgingData = React.useMemo(() => {
        const buckets = { '0-2d': 2, '3-5d': 3, '6-10d': 6, '10d+': 2 };
        const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
        return Object.entries(buckets).map(([name, count], index) => ({ name, count, fill: colors[index % colors.length] }));
    }, []);


    if (statements.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 sm:px-6 sm:pt-0">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><Layers /> Processing Pipeline Efficiency</CardTitle>
                    <CardDescription className="text-xs">Average time (seconds) per stage by broker.</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <ResponsiveContainer>
                            <BarChart data={pipelineEfficiencyData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="broker" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} interval={0} />
                                <YAxis unit="s" />
                                <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Legend content={<ChartLegendContent />} />
                                <Bar dataKey="OCR" stackId="a" fill="var(--color-OCR)" />
                                <Bar dataKey="Extract" stackId="a" fill="var(--color-Extract)" />
                                <Bar dataKey="Normalize" stackId="a" fill="var(--color-Normalize)" />
                                <Bar dataKey="QC" stackId="a" fill="var(--color-QC)" />
                                <Bar dataKey="Output" stackId="a" fill="var(--color-Output)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                 <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><BarChart3/> Exceptions Severity Breakdown</CardTitle>
                    <CardDescription className="text-xs">Helps identify systemic extraction issues.</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <ResponsiveContainer>
                            <BarChart data={exceptionsByBrokerData} layout="vertical" margin={{top: 10, right: 20, left: 10, bottom: 0}}>
                                <CartesianGrid horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={5} axisLine={false} interval={0} width={80}/>
                                <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="INFO" stackId="a" fill="var(--color-INFO)" />
                                <Bar dataKey="WARN" stackId="a" fill="var(--color-WARN)" />
                                <Bar dataKey="ERROR" stackId="a" fill="var(--color-ERROR)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><FileClock /> Error Aging Histogram</CardTitle>
                    <CardDescription className="text-xs">Shows whether issues are lingering unresolved.</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <ResponsiveContainer>
                            <BarChart data={errorAgingData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis />
                                <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                   <LabelList dataKey="count" position="top" offset={4} className="fill-foreground" fontSize={12} />
                                   {errorAgingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};


const StatusPill = ({ status }: { status: StatementStatus }) => {
    const config = {
        MISSING: { icon: X, className: 'bg-red-100 text-red-800' },
        PENDING: { icon: Inbox, className: 'bg-blue-100 text-blue-800' },
        OK: { icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
        ERRORS: { icon: AlertCircle, className: 'bg-amber-100 text-amber-800' },
    };
    const current = config[status];
    return <Badge variant="outline" className={cn("gap-1.5 text-[10px] font-bold py-0.5 px-2 leading-none", current.className)}><current.icon className="h-2.5 w-2.5"/>{statusDisplayNames[status]}</Badge>
}

const BrokerStatusCard = ({ broker, brokerStatements, onSelectBroker }: { broker: Broker; brokerStatements: Statement[]; onSelectBroker: (broker: Broker) => void }) => {
    const counts = brokerStatements.reduce((acc, s) => {
        if (s.status === 'OK') acc.ok++;
        else if (s.status === 'ERRORS') acc.err++;
        else if (s.status === 'PENDING') acc.pend++;
        else acc.miss++;
        return acc;
    }, { ok: 0, err: 0, pend: 0, miss: 0 });

    const total = brokerStatements.length;

    const overallStatus: StatementStatus = React.useMemo(() => {
        if (brokerStatements.some(s => s.status === 'MISSING')) return 'MISSING';
        if (brokerStatements.some(s => s.status === 'ERRORS')) return 'ERRORS';
        if (brokerStatements.some(s => s.status === 'PENDING')) return 'PENDING';
        return 'OK';
    }, [brokerStatements]);

    const ProgressBar = () => {
        const segments = [
            { status: 'OK', count: counts.ok, color: 'bg-green-500' },
            { status: 'ERRORS', count: counts.err, color: 'bg-amber-500' },
            { status: 'PENDING', count: counts.pend, color: 'bg-blue-500' },
            { status: 'MISSING', count: counts.miss, color: 'bg-red-500' }
        ].filter(s => s.count > 0);

        return (
             <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex h-2 w-full rounded-full overflow-hidden">
                        {segments.map(seg => (
                            <div key={seg.status} className={seg.color} style={{ width: `${(seg.count / total) * 100}%` }}></div>
                        ))}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="p-1 text-xs">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {segments.map(seg => (
                            <React.Fragment key={seg.status}>
                                <div className="flex items-center gap-1.5"><div className={cn("h-2 w-2 rounded-full", seg.color)}></div>{statusDisplayNames[seg.status as StatementStatus]}:</div>
                                <div className="font-bold text-right">{seg.count}</div>
                            </React.Fragment>
                        ))}
                    </div>
                </TooltipContent>
            </Tooltip>
        );
    };

    return (
        <Card onClick={() => onSelectBroker(broker)} className="cursor-pointer hover:bg-muted/50">
            <CardHeader className="p-3 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-sm font-semibold">{broker.name}</CardTitle>
                        <CardDescription className="text-xs">{total} accounts</CardDescription>
                    </div>
                    <StatusPill status={overallStatus} />
                </div>
            </CardHeader>
            <CardContent className="px-4 pt-2 pb-3">
                <ProgressBar />
                 <div className="flex justify-between text-xs mt-1.5 w-full text-muted-foreground">
                    <span>{counts.ok} OK</span>
                    <span>{counts.err} Err</span>
                    <span>{counts.pend} Pend</span>
                    <span>{counts.miss} Miss</span>
                </div>
            </CardContent>
        </Card>
    );
};

const StatusGrid = ({ statements, onSelectStatement }: { statements: Statement[], onSelectStatement: (stmt: Statement) => void }) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 text-xs">Broker</TableHead>
            <TableHead className="p-2 text-xs">Account ID</TableHead>
            <TableHead className="p-2 text-xs">Status</TableHead>
            <TableHead className="p-2 text-xs">Received</TableHead>
            <TableHead className="p-2 text-xs">Processed</TableHead>
            <TableHead className="p-2 text-xs">Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements.map(stmt => (
            <TableRow key={stmt.id} onClick={() => onSelectStatement(stmt)} className="cursor-pointer">
              <TableCell className="p-2 text-xs">{stmt.brokerName}</TableCell>
              <TableCell className="p-2 font-mono text-xs">{stmt.accountId}</TableCell>
              <TableCell className="p-2"><StatusPill status={stmt.status} /></TableCell>
              <TableCell className="p-2 text-xs">{stmt.receivedAt ? new Date(stmt.receivedAt).toLocaleString() : '-'}</TableCell>
              <TableCell className="p-2 text-xs">{stmt.processedAt ? new Date(stmt.processedAt).toLocaleString() : '-'}</TableCell>
              <TableCell className="p-2 text-xs">{stmt.assignedTo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const StatusMatrixTab = ({ statements, onSelectBroker, onSelectStatement }: { statements: Statement[], onSelectBroker: (broker: Broker) => void, onSelectStatement: (stmt: Statement) => void }) => {
  const [view, setView] = React.useState<'card' | 'grid'>('card');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Broker Status Matrix</CardTitle>
          <CardDescription>High-level broker statement status for the selected month.</CardDescription>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'card' | 'grid')} className="ml-auto">
          <TabsList className="h-9">
            <TabsTrigger value="card" className="h-7 text-xs gap-1.5"><Trello className="h-4 w-4" /> Cards</TabsTrigger>
            <TabsTrigger value="grid" className="h-7 text-xs gap-1.5"><Table2 className="h-4 w-4" /> Grid</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="py-6">
        {view === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {BROKERS.map(broker => {
              const brokerStatements = statements.filter(s => s.brokerId === broker.id);
              if (brokerStatements.length === 0) return null;
              
              return <BrokerStatusCard key={broker.id} broker={broker} brokerStatements={brokerStatements} onSelectBroker={onSelectBroker} />
            })}
          </div>
        ) : (
          <StatusGrid statements={statements} onSelectStatement={onSelectStatement} />
        )}
      </CardContent>
    </Card>
  )
}

const InboxTab = ({ onUpload, year, month }: { onUpload: (brokerId: string, year: number, month: number) => void; year: number; month: number; }) => {
    const { toast } = useToast();
    const [isUploadWizardOpen, setIsUploadWizardOpen] = React.useState(false);

    const inboxData = [
        { id: 'up1', filename: 'Schwab_Feb2026_Combined.pdf', broker: 'Charles Schwab', status: 'Auto-linking', uploadedAt: '2 mins ago' },
        { id: 'up2', filename: 'Statement_FID_202602.pdf', broker: 'Fidelity', status: 'Needs Review', uploadedAt: '5 mins ago' },
        { id: 'up3', filename: 'GS-Q1-2026-acct-GS-8005.pdf', broker: 'Goldman Sachs', status: 'Linked', uploadedAt: '1 hour ago' },
        { id: 'up4', filename: 'BNY_2026_Feb.pdf', broker: 'BNY Mellon', status: 'Auto-linking', uploadedAt: '2 hours ago' },
        { id: 'up5', filename: 'UBS_Wealth_Mgmt_022926.zip', broker: 'UBS', status: 'Needs Review', uploadedAt: '4 hours ago' },
        { id: 'up6', filename: 'NTrust-Statements-Feb26.pdf', broker: 'Northern Trust', status: 'Linked', uploadedAt: '1 day ago' },
    ];
    
    const handleAction = (message: string) => {
        toast({
            title: 'Action Triggered',
            description: message,
        });
    };

    const InboxStatusBadge = ({ status }: { status: string }) => {
        const config = {
            'Auto-linking': { icon: FileCog, className: 'bg-blue-100 text-blue-800' },
            'Needs Review': { icon: FileWarning, className: 'bg-amber-100 text-amber-800' },
            'Linked': { icon: FileCheck2, className: 'bg-green-100 text-green-800' },
        };
        const current = config[status as keyof typeof config];
        if (!current) return <Badge variant="outline">{status}</Badge>;

        return <Badge variant="outline" className={cn("gap-1.5 text-[10px] py-0.5 px-2", current.className)}><current.icon className="h-2.5 w-2.5"/>{status}</Badge>
    }

    return (
         <>
            <div className="grid grid-cols-3 gap-6">
                <Card className="col-span-1">
                    <CardHeader><CardTitle className="text-lg">Upload Zone</CardTitle></CardHeader>
                    <CardContent 
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-48 cursor-pointer hover:border-primary"
                        onClick={() => setIsUploadWizardOpen(true)}
                    >
                        <Upload className="h-8 w-8 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground mt-2">Drag & drop files here or click</p>
                    </CardContent>
                </Card>
                <Card className="col-span-2">
                    <CardHeader><CardTitle className="text-lg">Inbox Queue</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Filename</TableHead>
                                    <TableHead className="text-xs">Broker</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inboxData.length > 0 ? inboxData.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-xs">{item.filename}</TableCell>
                                        <TableCell className="text-xs">{item.broker}</TableCell>
                                        <TableCell><InboxStatusBadge status={item.status} /></TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleAction(`Manual linking process started for ${item.filename}...`)}>Link Manually</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction(`Showing details for ${item.filename}...`)}>View Details</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleAction(`${item.filename} has been deleted.`)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">No uploads in queue.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <UploadWizardModal isOpen={isUploadWizardOpen} onOpenChange={setIsUploadWizardOpen} onUpload={onUpload} year={year} month={month} />
        </>
    )
}

const ExceptionsTab = ({ errors, onSelectError }: { errors: StatementError[], onSelectError: (err: StatementError) => void }) => {
    const lanes: StatementError['status'][] = ["New", "Investigating", "Waiting for Re-send", "Resolved"];
    return (
        <div className="grid grid-cols-4 gap-4">
            {lanes.map(lane => (
                <Card key={lane} className="bg-muted/30">
                    <CardHeader className="p-2 border-b"><CardTitle className="text-sm text-center">{lane} ({errors.filter(e => e.status === lane).length})</CardTitle></CardHeader>
                    <CardContent className="p-2 space-y-2 h-[50vh] overflow-y-auto">
                        {errors.filter(e => e.status === lane).map(error => (
                            <Card key={error.id} className="cursor-pointer hover:bg-muted" onClick={() => onSelectError(error)}>
                                <CardContent className="p-2 text-xs space-y-1">
                                    <p className="font-semibold">{error.errorCode}: {error.message}</p>
                                    <p className="text-muted-foreground">{error.statementId}</p>
                                    <Badge variant={error.severity === 'ERROR' ? 'destructive' : 'secondary'}>{error.severity}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                         {errors.filter(e => e.status === lane).length === 0 && <p className="text-center text-xs text-muted-foreground py-4">Empty</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

const AuditSlaTab = ({ statements, errors }: { statements: Statement[], errors: StatementError[] }) => {
    // Mock audit log data. In a real app this would come from a database.
    const auditLogData = React.useMemo(() => {
        const logs: any[] = [];
        statements.slice(0, 20).forEach((s, i) => {
            if (s.receivedAt) {
                logs.push({
                    id: `log_rec_${s.id}`,
                    timestamp: s.receivedAt,
                    user: 'System',
                    action: 'File Ingested',
                    entity: s.accountId,
                    details: `File received from ${s.brokerName} portal.`
                });
            }
            if (s.processedAt) {
                logs.push({
                    id: `log_proc_${s.id}`,
                    timestamp: s.processedAt,
                    user: 'System',
                    action: s.status === 'OK' ? 'Processing Success' : 'Processing Failure',
                    entity: s.accountId,
                    details: `Automated processing finished with status ${s.status}.`
                });
            }
        });
        errors.slice(0, 10).forEach((e, i) => {
             logs.push({
                id: `log_err_${e.id}`,
                timestamp: new Date(new Date(statements.find(s => s.id === e.statementId)?.processedAt || Date.now()).getTime() + 1000).toISOString(),
                user: 'System',
                action: 'Exception Created',
                entity: e.statementId,
                details: `Error ${e.errorCode}: ${e.message}`
            });
            if (e.status !== 'New') {
                 logs.push({
                    id: `log_err_upd_${e.id}`,
                    timestamp: new Date(new Date(statements.find(s => s.id === e.statementId)?.processedAt || Date.now()).getTime() + 60000).toISOString(),
                    user: e.assignedTo || 'Alex G.',
                    action: `Status Change: ${e.status}`,
                    entity: e.id,
                    details: `Exception status updated to ${e.status}.`
                });
            }
        });
        return logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [statements, errors]);
    
    // Mock SLA data for the heatmap
    const slaHeatmapData = React.useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return BROKERS.map(broker => {
            const monthlySla = months.map(month => {
                const roll = Math.random();
                let status: 'MET' | 'AT_RISK' | 'BREACHED';
                if (broker.name === 'Charles Schwab' && month === 'Feb') status = 'BREACHED';
                else if (roll > 0.9) status = 'BREACHED';
                else if (roll > 0.75) status = 'AT_RISK';
                else status = 'MET';
                return { month, status };
            });
            return {
                brokerName: broker.name,
                data: monthlySla
            }
        });
    }, []);

    const SlaCell = ({ status }: { status: string }) => {
        const config = {
            'MET': { className: 'bg-green-500/70 hover:bg-green-500', tooltip: 'SLA Met' },
            'AT_RISK': { className: 'bg-amber-500/70 hover:bg-amber-500', tooltip: 'SLA At Risk' },
            'BREACHED': { className: 'bg-red-500/70 hover:bg-red-500', tooltip: 'SLA Breached' },
        };
        const current = config[status as keyof typeof config];
        if (!current) return <div className="h-full w-full bg-muted/20"></div>

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("h-full w-full rounded-sm transition-colors", current.className)}></div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{current.tooltip}</p>
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                 <CardHeader>
                    <CardTitle className="text-base font-headline flex items-center gap-2"><Activity /> SLA Heatmap</CardTitle>
                    <CardDescription>Monthly SLA compliance across all brokers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="p-2 text-xs">Broker</TableHead>
                                {slaHeatmapData[0].data.map(d => <TableHead key={d.month} className="p-1 text-center text-xs">{d.month}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {slaHeatmapData.map(brokerData => (
                                <TableRow key={brokerData.brokerName}>
                                    <TableCell className="p-2 text-xs font-medium">{brokerData.brokerName}</TableCell>
                                    {brokerData.data.map((monthData, i) => (
                                        <TableCell key={i} className="p-1 h-8 w-12"><SlaCell status={monthData.status} /></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base font-headline flex items-center gap-2"><History /> Global Audit Log</CardTitle>
                    <CardDescription>A record of all significant system and user actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                        <Input placeholder="Filter by user, action, entity..." className="h-9 max-w-xs" />
                        <Select><SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Filter by Action Type..." /></SelectTrigger><SelectContent><SelectItem value="all">All Actions</SelectItem><SelectItem value="ingest">File Ingested</SelectItem><SelectItem value="process">Processing</SelectItem><SelectItem value="exception">Exceptions</SelectItem></SelectContent></Select>
                    </div>
                     <div className="border rounded-md max-h-[60vh] overflow-y-auto">
                        <Table>
                             <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                                <TableRow>
                                    <TableHead className="p-2 text-xs">Timestamp</TableHead>
                                    <TableHead className="p-2 text-xs">User</TableHead>
                                    <TableHead className="p-2 text-xs">Action</TableHead>
                                    <TableHead className="p-2 text-xs">Entity</TableHead>
                                    <TableHead className="p-2 text-xs">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogData.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell className="p-2 text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                                        <TableCell className="p-2 text-xs">{log.user}</TableCell>
                                        <TableCell className="p-2 text-xs"><Badge variant="outline">{log.action}</Badge></TableCell>
                                        <TableCell className="p-2 font-mono text-xs">{log.entity}</TableCell>
                                        <TableCell className="p-2 text-xs text-muted-foreground">{log.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const StatementDetailDrawer = ({ statement, errors, isOpen, onOpenChange, onProcess, onResolveError }: { statement: Statement | null, errors: StatementError[], isOpen: boolean, onOpenChange: (open: boolean) => void, onProcess: (id: string) => void, onResolveError: (id: string, newStatus: StatementError['status']) => void }) => {
  if (!statement) return null;

  const statementErrors = errors.filter(e => e.statementId === statement.id);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-base">{statement.brokerName} - {statement.accountId}</SheetTitle>
          <SheetDescription className="text-xs">{statement.year}-{String(statement.month).padStart(2, '0')}</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="summary" className="flex-1 flex flex-col">
            <TabsList className="mx-3 mt-3">
                <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
                <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
                <TabsTrigger value="processing" className="text-xs">Processing</TabsTrigger>
                <TabsTrigger value="exceptions" className="text-xs">Exceptions <Badge className="ml-2 text-xs">{statementErrors.length}</Badge></TabsTrigger>
                <TabsTrigger value="audit" className="text-xs">Audit</TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
              <TabsContent value="summary" className="m-0">
                <Card>
                    <CardHeader className="p-2"><CardTitle className="text-sm">Status & Vitals</CardTitle></CardHeader>
                    <CardContent className="space-y-1 p-2 text-xs">
                        <div className="flex justify-between items-center"><span>Status:</span> <StatusPill status={statement.status} /></div>
                        <div className="flex justify-between items-center"><span>Priority:</span> <Badge variant="secondary" className="text-xs">{statement.priority}</Badge></div>
                        <div className="flex justify-between items-center"><span>SLA Due:</span> <span>{new Date(statement.slaDueAt).toLocaleDateString()}</span></div>
                        <div className="flex justify-between items-center"><span>Owner:</span> <span>{statement.assignedTo || 'Unassigned'}</span></div>
                    </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="documents" className="m-0">
                <Card>
                  <CardHeader className="p-2">
                    <CardTitle className="text-sm">Associated Files</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 text-sm space-y-2">
                    {statement.receivedAt && <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{statement.accountId}_statement.pdf</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                    </div>}
                    {statement.processedAt && <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <FileCog className="h-4 w-4" />
                        <span>processed_data.json</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                    </div>}
                    {statement.status === 'ERRORS' && (
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <FileWarning className="h-4 w-4 text-destructive" />
                          <span>exceptions_log.txt</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                      </div>
                    )}
                     {!statement.receivedAt && <p className="text-center text-xs text-muted-foreground p-4">No documents found.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="processing" className="m-0">
                <Card>
                  <CardHeader className="p-2">
                    <CardTitle className="text-sm">Processing Run Details</CardTitle>
                  </CardHeader>
                   <CardContent className="p-2 text-xs space-y-2">
                      {statement.receivedAt ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Time:</span>
                            <span>{new Date(new Date(statement.receivedAt).getTime() + 2000).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">End Time:</span>
                            <span>{statement.processedAt ? new Date(statement.processedAt).toLocaleString() : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Result:</span>
                            <Badge variant={statement.status === 'OK' ? 'secondary' : statement.status === 'ERRORS' ? 'destructive' : 'outline'} className={cn(statement.status==='OK' && 'text-green-700 border-green-300')}>{statement.status}</Badge>
                          </div>
                        </>
                      ) : (
                        <p className="text-center text-muted-foreground text-xs py-4">Not processed yet.</p>
                      )}
                    </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="exceptions" className="m-0 space-y-2">
                 {statementErrors.length > 0 ? statementErrors.map(err => (
                    <Card key={err.id}>
                        <CardHeader className="p-2">
                          <CardTitle className="text-sm flex justify-between items-center">
                            <span>{err.errorCode}: {err.message}</span>
                            <Badge variant={err.severity === 'ERROR' ? 'destructive' : 'secondary'}>{err.severity}</Badge>
                          </CardTitle>
                          <CardDescription className="text-xs">Status: {err.status}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-2 border-t">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="sm" variant="outline" className="h-8 text-xs">Change Status</Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => onResolveError(err.id, 'Investigating')}>Investigating</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onResolveError(err.id, 'Waiting for Re-send')}>Waiting for Re-send</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onResolveError(err.id, 'Resolved')}>Resolved</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                 )) : <div className="py-8 text-center text-muted-foreground text-xs">No Exceptions</div>}
              </TabsContent>
              <TabsContent value="audit" className="m-0">
                <Card>
                  <CardHeader className="p-2"><CardTitle className="text-sm">Audit Log</CardTitle></CardHeader>
                  <CardContent className="p-2 text-sm space-y-3">
                     {!statement.receivedAt && <p className="text-center text-xs text-muted-foreground py-4">No events yet.</p>}
                    {statement.receivedAt && (
                        <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div className="p-1.5 bg-muted rounded-full"><History className="h-3 w-3"/></div>
                            <div className="w-px flex-1 bg-border my-1"></div>
                        </div>
                        <div>
                            <p className="text-xs">
                            Statement <span className="font-semibold">{statement.id}</span> received from broker portal.
                            </p>
                            <p className="text-xs text-muted-foreground">{new Date(statement.receivedAt).toLocaleString()}</p>
                        </div>
                        </div>
                    )}
                    {statement.receivedAt && (
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                          <div className="p-1.5 bg-muted rounded-full"><FileCog className="h-3 w-3"/></div>
                          {statement.processedAt && <div className="w-px flex-1 bg-border my-1"></div>}
                      </div>
                      <div>
                        <p className="text-xs">
                          Automated processing started by system.
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(new Date(statement.receivedAt).getTime() + 2000).toLocaleString()}</p>
                      </div>
                    </div>
                    )}
                    {statement.status === 'ERRORS' && statement.processedAt && (
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="p-1.5 bg-red-100 rounded-full"><Siren className="h-3 w-3 text-red-700"/></div>
                        </div>
                        <div>
                          <p className="text-xs">
                            Processing completed with <span className="font-semibold text-red-600">{statement.errorCount} exceptions</span>.
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(statement.processedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                     {statement.status === 'OK' && statement.processedAt && (
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="p-1.5 bg-green-100 rounded-full"><CheckCircle2 className="h-3 w-3 text-green-700"/></div>
                        </div>
                        <div>
                          <p className="text-xs">
                            Processing completed successfully.
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(statement.processedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              </div>
            </ScrollArea>
        </Tabs>
        <SheetFooter className="p-4 border-t">
            <Button size="sm" className="h-8 text-xs" disabled={statement.status !== 'PENDING'} onClick={() => onProcess(statement.id)}>Process Statement</Button>
            <SheetClose asChild><Button variant="outline" size="sm" className="h-8 text-xs">Close</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const BrokerDetailDrawer = ({ broker, statements, isOpen, onOpenChange, onSelectStatement }: { broker: Broker | null, statements: Statement[], isOpen: boolean, onOpenChange: (open: boolean) => void, onSelectStatement: (stmt: Statement) => void }) => {
  if (!broker) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[800px] sm:max-w-none p-0 flex flex-col">
        <SheetHeader className="p-3 border-b">
          <SheetTitle className="flex items-center gap-2 text-base">{broker.name}</SheetTitle>
          <SheetDescription className="text-xs">
            {statements.length} statements for {statements.length > 0 ? new Date(statements[0].year, statements[0].month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'the selected period'}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
            <div className="p-3">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="p-2 text-xs">Account ID</TableHead>
                    <TableHead className="p-2 text-xs">Status</TableHead>
                    <TableHead className="p-2 text-xs">Errors</TableHead>
                    <TableHead className="p-2 text-xs">Received</TableHead>
                    <TableHead className="p-2 text-xs">Owner</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {statements.map(stmt => (
                    <TableRow key={stmt.id} onClick={() => onSelectStatement(stmt)} className="cursor-pointer">
                    <TableCell className="p-2 font-mono text-xs">{stmt.accountId}</TableCell>
                    <TableCell className="p-2"><StatusPill status={stmt.status} /></TableCell>
                    <TableCell className="p-2 text-xs">{stmt.errorCount > 0 ? <Badge variant="destructive">{stmt.errorCount}</Badge> : <CheckCircle2 className="h-5 w-5 text-green-500" />}</TableCell>
                    <TableCell className="p-2 text-xs">{stmt.receivedAt ? new Date(stmt.receivedAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="p-2 text-xs">{stmt.assignedTo}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </ScrollArea>
        <SheetFooter className="p-3 border-t">
          <SheetClose asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};


const UploadWizardModal = ({ isOpen, onOpenChange, onUpload, year, month }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onUpload: (brokerId: string, year: number, month: number) => void, year: number, month: number }) => {
    const [selectedBroker, setSelectedBroker] = React.useState<string>("");

    const handleUpload = () => {
        if (selectedBroker) {
            onUpload(selectedBroker, year, month);
            onOpenChange(false);
            setSelectedBroker("");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Wizard</DialogTitle>
                    <DialogDescription>Link uploaded PDF files to statement records for {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm">This is a mock upload. Select a broker to simulate linking a PDF to its "Missing" statement record.</p>
                     <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                        <SelectTrigger><SelectValue placeholder="Select a broker..." /></SelectTrigger>
                        <SelectContent>
                            {BROKERS.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-32 cursor-pointer hover:border-primary">
                        <Upload className="h-8 w-8 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground mt-2">Simulate Drag & Drop</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleUpload} disabled={!selectedBroker}>Link Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function BrokerTrackingPage() {
    const { statements, errors, initialize, processStatement, findStatement, updateError, linkUpload } = useStatementStore();
    const [selectedStatement, setSelectedStatement] = React.useState<Statement | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [selectedKpi, setSelectedKpi] = React.useState<Kpi | null>(null);
    const [selectedBroker, setSelectedBroker] = React.useState<Broker | null>(null);

    const [brokerFilter, setBrokerFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('all');
    
    const monthOptions = React.useMemo(() => {
        const options: { value: string; label: string }[] = [];
        const demoCurrentDate = new Date('2026-02-01');
        for (let i = 0; i < 6; i++) {
            const date = new Date(demoCurrentDate.getFullYear(), demoCurrentDate.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
            const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            options.push({ value, label });
        }
        return options;
    }, []);

    const [selectedPeriod, setSelectedPeriod] = React.useState(monthOptions[0].value);

    React.useEffect(() => {
        const [year, month] = selectedPeriod.split('-').map(Number);
        initialize(year, month);
    }, [selectedPeriod, initialize]);

    const filteredStatements = React.useMemo(() => {
        return statements.filter(s => {
            const brokerMatch = brokerFilter === 'all' || s.brokerId === brokerFilter;
            const statusMatch = statusFilter === 'all' || s.status === statusFilter;
            return brokerMatch && statusMatch;
        });
    }, [statements, brokerFilter, statusFilter]);

    const filteredErrors = React.useMemo(() => {
        const statementIds = new Set(filteredStatements.map(s => s.id));
        return errors.filter(e => statementIds.has(e.statementId));
    }, [errors, filteredStatements]);

    const handleSelectStatement = (statement: Statement) => {
        setSelectedStatement(statement);
        setIsDrawerOpen(true);
    }
    
    const handleSelectBroker = (broker: Broker) => {
        setSelectedBroker(broker);
    };

    const handleSelectError = (error: StatementError) => {
        const stmt = findStatement(error.statementId);
        if (stmt) {
            setSelectedStatement(stmt);
            setIsDrawerOpen(true);
        }
    }
    
    const handleProcess = (id: string) => {
        processStatement(id);
    }

    const handleResolveError = (errorId: string, newStatus: StatementError['status']) => {
        updateError(errorId, newStatus);
    }
    
    const [year, month] = React.useMemo(() => selectedPeriod.split('-').map(Number), [selectedPeriod]);


  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 border-b flex justify-between items-center">
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <Image src="https://firstrateaugmentedintelligence.com/document-tracking/deloitte.svg" alt="Deloitte Logo" width={96} height={20} />
                </h1>
                <div className="flex items-center gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {monthOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={brokerFilter} onValueChange={setBrokerFilter}>
                        <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Filter by Broker..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Brokers</SelectItem>
                            {BROKERS.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Filter by Status..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {Object.entries(statusDisplayNames).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <KpiCards statements={filteredStatements} errors={filteredErrors} onKpiClick={setSelectedKpi} />
             <div className="p-4 sm:p-6">
                <StatusMatrixTab 
                    statements={filteredStatements} 
                    onSelectBroker={handleSelectBroker}
                    onSelectStatement={handleSelectStatement}
                />
            </div>
            <ChartsSection statements={filteredStatements} errors={filteredErrors} />
        </main>
        <StatementDetailDrawer 
            statement={selectedStatement}
            errors={errors}
            isOpen={isDrawerOpen} 
            onOpenChange={setIsDrawerOpen}
            onProcess={handleProcess}
            onResolveError={handleResolveError}
        />
        <BrokerDetailDrawer
          broker={selectedBroker}
          statements={statements.filter(s => s.brokerId === selectedBroker?.id)}
          isOpen={!!selectedBroker}
          onOpenChange={(open) => !open && setSelectedBroker(null)}
          onSelectStatement={handleSelectStatement}
        />
          <KpiDetailDialog
          kpi={selectedStatement ? null : selectedKpi}
          statements={filteredStatements}
          errors={filteredErrors}
          open={!!selectedKpi && !selectedStatement}
          onOpenChange={() => setSelectedKpi(null)}
        />
      </div>
    </TooltipProvider>
  );
}
