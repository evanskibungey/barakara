
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { type TierName } from "@/lib/pricing";

// Interfaces
export interface FineRule {
  enabled: boolean;
  amount: number;
  type?: "FIXED" | "PERCENTAGE";
  recurrence?: "ONCE" | "DAILY";
  gracePeriodDays?: number;
  minutesThreshold?: number;
  name?: string; // Added for flexible custom rules
}

export interface FineCriteria {
  latePayment: FineRule;
  missedMeeting: FineRule;
  lateArrival: FineRule;
  customRule: FineRule; // Added General Violation Rule
}

export interface Chama {
  id: string;
  name: string;
  members: number;
  poolValue: number;
  status: string;
  nextMeeting: string;
  subscriptionStatus: 'Active' | 'Overdue' | 'Suspended';
  tier: TierName;
  renewalDate: string;
  totalTransactions: number;
}

// Main Chamas List
export const chamas: Chama[] = [
  {
    id: "nairobi-founders-group",
    name: "Nairobi Founders Group",
    members: 12,
    poolValue: 1250000,
    status: "Active",
    nextMeeting: "2024-08-15",
    subscriptionStatus: 'Active',
    tier: 'Scale',
    renewalDate: '2024-08-31',
    totalTransactions: 157,
  },
  {
    id: "mombasa-traders",
    name: "Mombasa Traders",
    members: 8,
    poolValue: 95000,
    status: "Active",
    nextMeeting: "2024-08-20",
    subscriptionStatus: 'Active',
    tier: 'Growth',
    renewalDate: '2024-08-31',
    totalTransactions: 72,
  },
  {
    id: "kisumu-innovators",
    name: "Kisumu Innovators",
    members: 15,
    poolValue: 210000,
    status: "Active",
    nextMeeting: "2024-08-22",
    subscriptionStatus: 'Overdue',
    tier: 'Scale',
    renewalDate: '2024-07-31',
    totalTransactions: 210,
  },
  {
    id: "eldoret-visionaries",
    name: "Eldoret Visionaries",
    members: 10,
    poolValue: 120000,
    status: "Pending Payout",
    nextMeeting: "2024-09-01",
    subscriptionStatus: 'Active',
    tier: 'Growth',
    renewalDate: '2024-08-31',
    totalTransactions: 95,
  },
  {
    id: "nakuru-hustlers",
    name: "Nakuru Hustlers",
    members: 20,
    poolValue: 300000,
    status: "Active",
    nextMeeting: "2024-08-18",
    subscriptionStatus: 'Active',
    tier: 'Scale',
    renewalDate: '2024-08-31',
    totalTransactions: 250,
  },
  {
    id: "kiambu-farmers",
    name: "Kiambu Farmers Co-op",
    members: 4,
    poolValue: 45000,
    status: "Active",
    nextMeeting: "2024-09-05",
    subscriptionStatus: 'Active',
    tier: 'Starter',
    renewalDate: '2024-08-31',
    totalTransactions: 35,
  },
];

// Detailed Chama Data
export const chamaDetails = [
  {
    id: "nairobi-founders-group",
    name: "Nairobi Founders Group",
    description: "Empowering local tech founders through collective investment.",
    poolId: "BC-2948",
    registrationNumber: "CS/2023/54321",
    manager: "David Kamau",
    memberCount: 12,
    membershipFee: 5000,
    membershipTarget: 20,
    branding: {
        logoUrl: "https://i.pravatar.cc/150?u=nairobi_founders_group_logo",
        address: "123 Equity Centre, Upper Hill, Nairobi, Kenya"
    },
    stats: {
      totalPoolValue: 1250000,
      poolValueChange: 12,
      nextPayout: { date: "Oct 30", recipient: "Jane Doe" },
      outstandingLoans: { amount: 300000, count: 3 },
      monthlyContribution: { amount: 50000, latePayments: -2 },
    },
    loans: [
      { id: 'loan-1', memberId: '1', amount: 50000, interestRate: 10, interestMethod: 'Amortized', status: 'Active' as const, applicationDate: '2024-06-01', approvalDate: '2024-06-02', disbursedDate: '2024-06-03', nextPaymentDate: '2024-08-01', amountPaid: 10000, repaymentPeriod: 6, paymentsMade: 1, guarantors: [{ memberId: '2', name: 'John Omondi', status: 'Signed' as 'Signed' | 'Pending' }] },
      { id: 'loan-2', memberId: '4', amount: 25000, interestRate: 12, interestMethod: 'Flat Rate', status: 'Pending' as const, applicationDate: '2024-07-29', approvalDate: null, disbursedDate: null, nextPaymentDate: null, amountPaid: 0, repaymentPeriod: 12, paymentsMade: 0, guarantors: [{ memberId: '1', name: 'Jane Doe', status: 'Pending' as 'Signed' | 'Pending' }, { memberId: '3', name: 'Sarah Wanjiku', status: 'Signed' as 'Signed' | 'Pending'}] },
      { id: 'loan-3', memberId: '2', amount: 100000, interestRate: 8, interestMethod: 'Amortized', status: 'Paid' as const, applicationDate: '2024-01-10', approvalDate: '2024-01-11', disbursedDate: '2024-01-12', nextPaymentDate: null, amountPaid: 108000, repaymentPeriod: 12, paymentsMade: 12, guarantors: [] },
      { id: 'loan-4', memberId: '3', amount: 75000, interestRate: 15, interestMethod: 'Amortized', status: 'Active' as const, applicationDate: '2024-07-01', approvalDate: '2024-07-02', disbursedDate: '2024-07-03', nextPaymentDate: '2024-09-01', amountPaid: 0, repaymentPeriod: 18, paymentsMade: 0, guarantors: [{ memberId: '1', name: 'Jane Doe', status: 'Signed' as 'Signed' | 'Pending' }] },
      { id: 'loan-5', memberId: '5', amount: 120000, interestRate: 11, interestMethod: 'Amortized', status: 'Active' as const, applicationDate: '2024-04-10', approvalDate: '2024-04-11', disbursedDate: '2024-04-12', nextPaymentDate: '2024-07-15', amountPaid: 30000, repaymentPeriod: 12, paymentsMade: 3, guarantors: [] },
      { id: 'loan-6', memberId: '6', amount: 40000, interestRate: 10, interestMethod: 'Flat Rate', status: 'Active' as const, applicationDate: '2024-02-01', approvalDate: '2024-02-02', disbursedDate: '2024-02-03', nextPaymentDate: '2024-06-01', amountPaid: 20000, repaymentPeriod: 6, paymentsMade: 3, guarantors: [] },
    ],
    welfareDrives: [
      {
        id: "welfare-drive-1",
        title: "Funeral Fund for John Doe",
        description: "Raising funds to support the family of our late member, John Doe. Your contributions will help cover funeral expenses and provide immediate support to his family during this difficult time.",
        goal: 150000,
        raised: 45000,
        backers: 8,
        daysLeft: 10,
        image: PlaceHolderImages.find(img => img.id === 'drive-funeral'),
        managers: [
            { id: '1', name: 'Jane Doe', role: 'Chairperson', avatarUrl: 'https://i.pravatar.cc/150?u=jane_doe' },
        ]
      }
    ],
    fundingGoal: { target: 600000, collected: 510000, deadline: "2024-08-31" },
    managementTeam: [
      { id: '1', name: 'Jane Doe', role: 'Chairperson', allowance: 5000, avatarUrl: 'https://i.pravatar.cc/150?u=jane_doe' },
      { id: '3', name: 'Sarah Wanjiku', role: 'Secretary', allowance: 4000, avatarUrl: 'https://i.pravatar.cc/150?u=sarah_wanjiku' },
    ],
     pendingApprovals: [
      { id: 'approval1', requestor: 'Peter Kimani', type: 'Loan', amount: 25000, date: '2024-07-29', description: 'Emergency personal loan.', approvals: 1, requiredApprovals: 3 },
    ],
    expenses: [
      { id: 'exp1', date: '2024-07-20', category: 'Meeting', description: 'Refreshments for monthly meeting', amount: 2500, status: 'Paid' },
    ],
    penalties: [
      { id: 'pen1', memberId: '4', reason: 'Late contribution for July 2024', amount: 500, dateIssued: '2024-08-01', status: 'Unpaid' },
    ],
    fineCriteria: {
      latePayment: { enabled: true, amount: 200, type: "FIXED", recurrence: "DAILY", gracePeriodDays: 3 },
      missedMeeting: { enabled: true, amount: 500 },
      lateArrival: { enabled: false, amount: 100, minutesThreshold: 15 },
      customRule: { enabled: false, name: "Disorderly Conduct", amount: 1000 }
    },
    payoutSchedule: [
        { id: 'payout1', recipient: 'Jane Doe', date: 'Oct 30, 2024', amount: 550000, avatarUrl: 'https://i.pravatar.cc/150?u=jane_doe' },
        { id: 'payout2', recipient: 'John Omondi', date: 'Nov 30, 2024', amount: 550000, avatarUrl: 'https://i.pravatar.cc/150?u=john_omondi' },
    ],
    members: [
      { id: '1', nationalId: '*****1234', name: 'Jane Doe', role: 'Chairperson', status: 'Paid', savedYtd: 150000, nextPayout: 'Oct 30, 2023', avatarUrl: 'https://i.pravatar.cc/150?u=jane_doe', phone: '+254 722 000 001', location: 'Nairobi', occupation: 'Business Owner', joiningDate: '2023-01-15', attendanceRate: 95, contributionStatus: 'Good Standing', revolvingFund: { balance: 1200, target: 2000, history: [{id: 'rf1', date: '2024-07-15', description: 'Top Up', type: 'credit', amount: 1000}, {id: 'rf2', date: '2024-07-20', description: 'Funeral Drive', type: 'debit', amount: 200}]} },
      { id: '2', nationalId: '*****2345', name: 'John Omondi', role: 'Treasurer', status: 'Paid', savedYtd: 140000, nextPayout: 'Nov 30, 2023', avatarUrl: 'https://i.pravatar.cc/150?u=john_omondi', phone: '+254 722 000 002', location: 'Nairobi', occupation: 'Software Engineer', joiningDate: '2023-01-15', attendanceRate: 98, contributionStatus: 'Good Standing', revolvingFund: { balance: 2000, target: 2000, history: []} },
      { id: '3', nationalId: '*****2346', name: 'Sarah Wanjiku', role: 'Secretary', status: 'Paid', savedYtd: 145000, nextPayout: 'Dec 30, 2023', avatarUrl: 'https://i.pravatar.cc/150?u=sarah_wanjiku', phone: '+254 722 000 003', location: 'Nairobi', occupation: 'Accountant', joiningDate: '2023-01-15', attendanceRate: 92, contributionStatus: 'Good Standing', revolvingFund: { balance: 1500, target: 2000, history: []} },
      { id: '4', nationalId: '*****3456', name: 'Peter Kimani', role: 'Member', status: 'Overdue', savedYtd: 100000, nextPayout: 'Jan 30, 2024', avatarUrl: 'https://i.pravatar.cc/150?u=peter_kimani', phone: '+254 722 000 004', location: 'Nakuru', occupation: 'Farmer', joiningDate: '2024-03-10', attendanceRate: 85, contributionStatus: 'Needs Attention', revolvingFund: { balance: 500, target: 2000, history: [{id: 'rf3', date: '2024-07-15', description: 'Top Up', type: 'credit', amount: 500}]} },
      { id: '5', name: 'Grace Akinyi', role: 'Member', status: 'Paid', savedYtd: 125000, nextPayout: 'Feb 30, 2024', avatarUrl: 'https://i.pravatar.cc/150?u=grace_akinyi', phone: '+254 722 000 005', location: 'Nairobi', occupation: 'Marketing Manager', joiningDate: '2023-02-20', attendanceRate: 90, contributionStatus: 'Good Standing', revolvingFund: { balance: 850, target: 5000, history: [{id: 'rf-g1', date: '2024-07-01', description: 'Manual Top Up', type: 'credit', amount: 1000}, {id: 'rf-g2', date: '2024-07-10', description: 'Welfare Drive: Hospital Bill', type: 'debit', amount: 150}]} },
      { id: '6', name: 'Samuel Kariuki', role: 'Member', status: 'Paid', savedYtd: 110000, nextPayout: 'Mar 30, 2024', avatarUrl: 'https://i.pravatar.cc/150?u=samuel_kariuki', phone: '+254 722 000 006', location: 'Nairobi', occupation: 'Lawyer', joiningDate: '2023-05-18', attendanceRate: 94, contributionStatus: 'Good Standing', revolvingFund: { balance: 3500, target: 5000, history: []} },
    ],
    upcomingMeeting: { description: "Monthly review meeting..." },
    activityStream: [
      { id: '1', description: '<span class="font-semibold">Jane Doe</span> made a contribution of <span class="font-semibold text-green-400">KES 50,000</span>.', timestamp: 'Today, 10:23 AM', referenceId: '#TRX-93821' },
      { id: '2', description: '<span class="font-semibold">David Kamau</span> approved a loan for <span class="font-semibold">John Omondi</span>.', timestamp: 'Yesterday, 4:45 PM', referenceId: '#LN-JO-0730' },
      { id: '3', description: 'Membership fee of <span class="font-semibold text-green-400">KES 1,000</span> received from <span class="font-semibold">Esther Mwangi</span>.', timestamp: '2 days ago', referenceId: '#TRX-93818' },
      { id: '4', description: 'Monthly payout to <span class="font-semibold">Sarah Wanjiku</span> was processed.', timestamp: '3 days ago', referenceId: '#PAY-SW-0728' },
    ],
    memberRequests: [
      { id: 'req1', name: 'Esther Mwangi', phone: '+254 722 123 456', applicationDate: '2024-07-28', documents: ['National ID'], avatarUrl: 'https://i.pravatar.cc/150?u=esther_mwangi' },
    ],
    meetings: [
      { id: 'meet1', date: '2024-07-26', agenda: 'Q3 Financial Review', minutesUrl: '#', attendees: ['1', '2', '5'], absentees: ['4'], apologies: ['3', '6'] },
      { id: 'meet2', date: '2024-06-28', agenda: 'Q2 Planning Session', minutesUrl: '#', attendees: ['1', '2', '3', '5', '6'], absentees: [], apologies: ['4'] },
    ],
    polls: [
      {
        id: 'poll-1627878',
        title: 'Q3 2024 Leadership Election',
        type: 'Election',
        status: 'active',
        startDate: '2024-07-15T09:00:00Z',
        endDate: '2024-08-15T17:00:00Z',
        voters: ['user-mock-id', '2', '3', '4', '5', '6', '7', '8'],
        options: [{ name: 'Jane Doe for Chairperson', votes: 5 }, { name: 'John Omondi for Chairperson', votes: 3 }, { name: 'Sarah Wanjiku for Treasurer', votes: 8 }]
      }
    ]
  },
  {
    id: "mombasa-traders",
    name: "Mombasa Traders",
    description: "A collective for traders in Mombasa.",
    poolId: "BC-3102",
    registrationNumber: "CS/2023/67890",
    manager: "Aisha Omar",
    memberCount: 8,
    membershipFee: 500,
    membershipTarget: 15,
    branding: { logoUrl: "https://i.pravatar.cc/150?u=mombasa_traders_logo", address: "Moi Avenue, Mombasa" },
    stats: { totalPoolValue: 95000, poolValueChange: 8, nextPayout: { date: "Nov 15", recipient: "Fatima Ali" },
      outstandingLoans: { amount: 20000, count: 1 }, monthlyContribution: { amount: 10000, latePayments: 0 },
    },
    loans: [],
    welfareDrives: [],
    fundingGoal: { target: 80000, collected: 75000, deadline: "2024-09-15" },
    managementTeam: [{ id: '7', name: 'Aisha Omar', role: 'Chairperson', allowance: 3000, avatarUrl: 'https://i.pravatar.cc/150?u=aisha_omar' }],
    pendingApprovals: [],
    expenses: [
         { id: 'exp4', date: '2024-07-22', category: 'Admin', description: 'Bank transaction fees', amount: 500, status: 'Paid' },
    ],
    penalties: [],
    fineCriteria: {
      latePayment: { enabled: true, amount: 100, type: "FIXED", recurrence: "ONCE", gracePeriodDays: 5 },
      missedMeeting: { enabled: true, amount: 250 },
      lateArrival: { enabled: true, amount: 50, minutesThreshold: 10 },
      customRule: { enabled: false, name: "General Penalty", amount: 500 }
    },
    payoutSchedule: [],
    members: [
        { id: '7', nationalId: '*****6789', name: 'Fatima Ali', role: 'Member', status: 'Paid', savedYtd: 12000, nextPayout: 'Nov 15, 2023', avatarUrl: 'https://i.pravatar.cc/150?u=fatima_ali', phone: '+254 722 000 007', location: 'Mombasa', occupation: 'Business Owner', joiningDate: '2023-03-12', attendanceRate: 99, contributionStatus: 'Good Standing', revolvingFund: { balance: 500, target: 5000, history: []} },
        { id: '8', nationalId: '*****1234', name: 'Hassan Juma', role: 'Member', status: 'Paid', savedYtd: 12000, nextPayout: 'Dec 15, 2023', avatarUrl: 'https://i.pravatar.cc/150?u=hassan_juma', phone: '+254 722 000 008', location: 'Mombasa', occupation: 'Fisherman', joiningDate: '2023-04-01', attendanceRate: 91, contributionStatus: 'Good Standing', revolvingFund: { balance: 1000, target: 5000, history: []} },
    ],
    activityStream: [],
    memberRequests: [],
    meetings: [],
    polls: []
  },
  {
    id: "kisumu-innovators",
    name: "Kisumu Innovators",
    description: "Fostering innovation in Lake Victoria region.",
    poolId: "BC-4511",
    registrationNumber: "CS/2023/11223",
    manager: "Kevin Ochieng",
    memberCount: 15,
    membershipFee: 800,
    membershipTarget: 25,
    branding: { logoUrl: "https://i.pravatar.cc/150?u=kisumu_innovators_logo", address: "Kisumu, Kenya" },
    stats: { totalPoolValue: 210000, poolValueChange: 15, nextPayout: { date: "Sep 22", recipient: "Beryl Achieng" }, outstandingLoans: { amount: 50000, count: 2 }, monthlyContribution: { amount: 20000, latePayments: 5 } },
    loans: [],
    welfareDrives: [],
    fundingGoal: { target: 240000, collected: 180000, deadline: "2024-09-30" },
    managementTeam: [{ id: '9', name: 'Kevin Ochieng', role: 'Chairperson', allowance: 4500, avatarUrl: 'https://i.pravatar.cc/150?u=kevin_ochieng' }],
    pendingApprovals: [],
    expenses: [],
    payoutSchedule: [],
    members: [],
    activityStream: [],
    memberRequests: [],
    meetings: [],
    polls: [],
    penalties: [],
    fineCriteria: {
      latePayment: { enabled: false, amount: 0, type: "FIXED", recurrence: "ONCE", gracePeriodDays: 0 },
      missedMeeting: { enabled: false, amount: 0 },
      lateArrival: { enabled: false, amount: 0, minutesThreshold: 0 },
      customRule: { enabled: false, name: "General Penalty", amount: 0 }
    },
  },
  {
    id: "eldoret-visionaries",
    name: "Eldoret Visionaries",
    description: "Supporting agricultural ventures.",
    poolId: "BC-5823",
    registrationNumber: "CS/2023/44556",
    manager: "Brenda Chepkoech",
    memberCount: 10,
    membershipFee: 1200,
    membershipTarget: 20,
    branding: { logoUrl: "https://i.pravatar.cc/150?u=eldoret_visionaries_logo", address: "Eldoret, Kenya" },
    stats: { totalPoolValue: 120000, poolValueChange: 10, nextPayout: { date: "Oct 01", recipient: "Isaac Kirui" }, outstandingLoans: { amount: 40000, count: 2 }, monthlyContribution: { amount: 15000, latePayments: -1 } },
    loans: [],
    welfareDrives: [],
    fundingGoal: { target: 150000, collected: 110000, deadline: "2024-10-15" },
    managementTeam: [{ id: '10', name: 'Brenda Chepkoech', role: 'Chairperson', allowance: 3500, avatarUrl: 'https://i.pravatar.cc/150?u=brenda_chepkoech' }],
    pendingApprovals: [],
    expenses: [],
    payoutSchedule: [],
    members: [],
    activityStream: [],
    memberRequests: [],
    meetings: [],
    polls: [],
    penalties: [],
     fineCriteria: {
      latePayment: { enabled: false, amount: 0, type: "FIXED", recurrence: "ONCE", gracePeriodDays: 0 },
      missedMeeting: { enabled: false, amount: 0 },
      lateArrival: { enabled: false, amount: 0, minutesThreshold: 0 },
      customRule: { enabled: false, name: "General Penalty", amount: 0 }
    },
  },
  {
    id: "nakuru-hustlers",
    name: "Nakuru Hustlers",
    description: "Young entrepreneurs in Nakuru.",
    poolId: "BC-6934",
    registrationNumber: "CS/2023/77889",
    manager: "Pauline Njeri",
    memberCount: 20,
    membershipFee: 500,
    membershipTarget: 30,
    branding: { logoUrl: "https://i.pravatar.cc/150?u=nakuru_hustlers_logo", address: "Nakuru Town, Kenya" },
    stats: { totalPoolValue: 300000, poolValueChange: 18, nextPayout: { date: "Sep 18", recipient: "Stephen Maina" }, outstandingLoans: { amount: 75000, count: 5 }, monthlyContribution: { amount: 25000, latePayments: 3 } },
    loans: [],
    welfareDrives: [],
    fundingGoal: { target: 300000, collected: 280000, deadline: "2024-09-20" },
    managementTeam: [{ id: '11', name: 'Pauline Njeri', role: 'Chairperson', allowance: 5000, avatarUrl: 'https://i.pravatar.cc/150?u=pauline_njeri' }],
    pendingApprovals: [],
    expenses: [],
    payoutSchedule: [],
    members: [],
    activityStream: [],
    memberRequests: [],
    meetings: [],
    polls: [],
    penalties: [],
     fineCriteria: {
      latePayment: { enabled: false, amount: 0, type: "FIXED", recurrence: "ONCE", gracePeriodDays: 0 },
      missedMeeting: { enabled: false, amount: 0 },
      lateArrival: { enabled: false, amount: 0, minutesThreshold: 0 },
      customRule: { enabled: false, name: "General Penalty", amount: 0 }
    },
  },
  {
    id: "kiambu-farmers",
    name: "Kiambu Farmers Co-op",
    description: "Cooperative for small-scale farmers.",
    poolId: "BC-7145",
    registrationNumber: "CS/2023/99001",
    manager: "Josephat Mwangi",
    memberCount: 4,
    membershipFee: 2000,
    membershipTarget: 10,
    branding: { logoUrl: "https://i.pravatar.cc/150?u=kiambu_farmers_logo", address: "Kiambu, Kenya" },
    stats: { totalPoolValue: 45000, poolValueChange: 5, nextPayout: { date: "Oct 05", recipient: "Mary Wambui" }, outstandingLoans: { amount: 10000, count: 1 }, monthlyContribution: { amount: 8000, latePayments: 0 } },
    loans: [],
    welfareDrives: [],
    fundingGoal: { target: 80000, collected: 40000, deadline: "2024-10-31" },
    managementTeam: [{ id: '12', name: 'Josephat Mwangi', role: 'Chairperson', allowance: 2500, avatarUrl: 'https://i.pravatar.cc/150?u=josephat_mwangi' }],
    pendingApprovals: [],
    expenses: [],
    payoutSchedule: [],
    members: [],
    activityStream: [],
    memberRequests: [],
    meetings: [],
    polls: [],
    penalties: [],
     fineCriteria: {
      latePayment: { enabled: false, amount: 0, type: "FIXED", recurrence: "ONCE", gracePeriodDays: 0 },
      missedMeeting: { enabled: false, amount: 0 },
      lateArrival: { enabled: false, amount: 0, minutesThreshold: 0 },
      customRule: { enabled: false, name: "General Penalty", amount: 0 }
    },
  }
];

export const transactions = [
    { id: "1", details: "Harvest Drive Contribution", date: "Oct 24, 2023", type: "Contribution", referenceId: "#TRX-93821", status: "Completed", amount: 5000.00, icon: ArrowDownLeft, iconColor: "text-green-500", bgColor: "bg-green-500/10" },
    { id: "2", details: "Loan Disbursal to S. Kariuki", date: "Oct 22, 2023", type: "Loan", referenceId: "#TRX-93820", status: "Completed", amount: -25000.00, icon: ArrowUpRight, iconColor: "text-red-500", bgColor: "bg-red-500/10" },
    { id: "3", details: "Monthly Membership Fee", date: "Oct 20, 2023", type: "Membership Fee", referenceId: "#TRX-93819", status: "Completed", amount: 1000.00, icon: ArrowDownLeft, iconColor: "text-green-500", bgColor: "bg-green-500/10" },
    { id: "4", details: "Investment in TechCorp", date: "Oct 18, 2023", type: "Investment", referenceId: "#TRX-93818", status: "Completed", amount: -150000.00, icon: ArrowUpRight, iconColor: "text-red-500", bgColor: "bg-red-500/10" },
    { id: "5", details: "Dividend from AgriFund", date: "Oct 15, 2023", type: "Dividend", referenceId: "#TRX-93817", status: "Completed", amount: 12500.00, icon: ArrowDownLeft, iconColor: "text-green-500", bgColor: "bg-green-500/10" },
];

export const financialReportData = [
  {
    transactionId: 'TXN729401',
    date: '2023-10-01',
    description: 'Nairobi Founders Group Contribution',
    category: 'Chama Contribution',
    amount: 10000,
    type: 'Income',
  },
  {
    transactionId: 'TXN950274',
    date: '2023-10-02',
    description: 'Office Supplies',
    category: 'Operating Expense',
    amount: -3500,
    type: 'Expense',
  },
  {
    transactionId: 'TXN102847',
    date: '2023-10-05',
    description: 'Loan Disbursal to J. Omondi',
    category: 'Loan',
    amount: -50000,
    type: 'Expense',
  },
  {
    transactionId: 'TXN482910',
    date: '2023-10-07',
    description: 'Mombasa Traders Contribution',
    category: 'Chama Contribution',
    amount: 7500,
    type: 'Income',
  },
  {
    transactionId: 'TXN349102',
    date: '2023-10-10',
    description: 'Dividend Payout - Q3',
    category: 'Investment',
    amount: 25000,
    type: 'Income',
  },
  {
    transactionId: 'TXN692013',
    date: '2023-10-12',
    description: 'Cloud Server Subscription',
    category: 'Operating Expense',
    amount: -12000,
    type: 'Expense',
  },
  {
    transactionId: 'TXN710234',
    date: '2023-10-15',
    description: 'Loan Repayment from S. Wanjiku',
    category: 'Loan Repayment',
    amount: 5000,
    type: 'Income',
  },
  {
    transactionId: 'TXN823491',
    date: '2023-10-20',
    description: 'Kisumu Innovators Contribution',
    category: 'Chama Contribution',
    amount: 15000,
    type: 'Income',
  },
];

export const memberStatementData = [
    { transactionId: 'TXN729401', date: '2023-10-01', description: 'Monthly Contribution', category: 'Chama Contribution', amount: 5000, type: 'Income' },
    { transactionId: 'TXN102847', date: '2023-10-05', description: 'Loan Disbursal', category: 'Loan', amount: -50000, type: 'Expense' },
    { transactionId: 'TXN710234', date: '2023-10-15', description: 'Loan Repayment', category: 'Loan Repayment', amount: 5000, type: 'Income' },
    { transactionId: 'TXN349102', date: '2023-10-20', description: 'Dividend Payout - Q3', category: 'Investment', amount: 12500, type: 'Income' },
    { transactionId: 'PEN-001', date: '2023-10-22', description: 'Penalty for Late Contribution (Sept)', category: 'Penalty', amount: -500, type: 'Expense' },
];

export const memberBusinesses = [
  {
    id: "biz-1",
    name: "Akinyi's Fresh Grocers",
    owner: "Grace Akinyi",
    category: "Retail",
    location: "Kilimani, Nairobi",
    phone: "+254 722 000 005",
    email: "grace.akinyi@example.com",
    image: PlaceHolderImages.find(img => img.id === 'marketplace-1'),
  },
  {
    id: "biz-2",
    name: "Kariuki's Auto Garage",
    owner: "Samuel Kariuki",
    category: "Automotive",
    location: "Industrial Area, Nairobi",
    phone: "+254 722 000 006",
    email: "samuel.kariuki@example.com",
    image: PlaceHolderImages.find(img => img.id === 'marketplace-2'),
  },
  {
    id: "biz-3",
    name: "Fatima's Couture",
    owner: "Fatima Ali",
    category: "Fashion",
    location: "Westlands, Nairobi",
    phone: "+254 722 000 007",
    email: "fatima.ali@example.com",
    image: PlaceHolderImages.find(img => img.id === 'marketplace-3'),
  },
  {
    id: "biz-4",
    name: "Omondi's Tech Solutions",
    owner: "John Omondi",
    category: "IT Services",
    location: "CBD, Nairobi",
    phone: "+254 722 000 002",
    email: "john.omondi@example.com",
    image: PlaceHolderImages.find(img => img.id === 'marketplace-4'),
  },
    {
    id: "biz-5",
    name: "Wanjiku's Catering",
    owner: "Sarah Wanjiku",
    category: "Food & Beverage",
    location: "Lavington, Nairobi",
    phone: "+254 722 000 003",
    email: "sarah.wanjiku@example.com",
    image: PlaceHolderImages.find(img => img.id === 'marketplace-5'),
  },
    {
    id: "biz-6",
    name: "Kimani's Boda Service",
    owner: "Peter Kimani",
    category: "Transport",
    location: "Eastleigh, Nairobi",
    phone: "+254 722 000 004",
    email: "peter.kimani@example.com",
    image: PlaceHolderImages.find(img => img.id === 'marketplace-6'),
  },
];

export const investmentPortfolios = [
  {
    id: 'p1',
    name: 'Kenyan Blue-Chip Stocks',
    category: 'Equities',
    riskLevel: 'Medium',
    roi: 12.5,
    description: 'A diversified portfolio of top-performing companies listed on the Nairobi Securities Exchange (NSE).',
    image: PlaceHolderImages.find(img => img.id === 'learning-2'),
  },
  {
    id: 'p2',
    name: 'Government Infrastructure Bonds',
    category: 'Fixed Income',
    riskLevel: 'Low',
    roi: 8.2,
    description: 'Invest in government-backed bonds funding key infrastructure projects across Kenya, offering stable returns.',
    image: PlaceHolderImages.find(img => img.id === 'drive-6'),
  },
  {
    id: 'p3',
    name: 'Nairobi Real Estate Fund',
    category: 'Real Estate',
    riskLevel: 'Medium',
    roi: 15.0,
    description: 'Pooled investment in commercial and residential real estate projects in high-growth areas of Nairobi.',
    image: PlaceHolderImages.find(img => img.id === 'marketplace-4'),
  },
  {
    id: 'p4',
    name: 'East African Agri-Tech Ventures',
    category: 'Venture Capital',
    riskLevel: 'High',
    roi: 25.0,
    description: 'High-risk, high-reward fund focused on early-stage technology companies revolutionizing agriculture in East Africa.',
    image: PlaceHolderImages.find(img => img.id === 'drive-3'),
  },
   {
    id: 'p5',
    name: 'Clean Energy Co-op',
    category: 'Renewable Energy',
    riskLevel: 'Low',
    roi: 9.8,
    description: 'Community-owned solar and wind projects providing clean energy and consistent returns to investors.',
    image: PlaceHolderImages.find(img => img.id === 'drive-5'),
  },
  {
    id: 'p6',
    name: 'SME Lending Fund',
    category: 'Private Credit',
    riskLevel: 'Medium',
    roi: 18.0,
    description: 'Provide working capital loans to vetted small and medium-sized enterprises (SMEs) in the local market.',
    image: PlaceHolderImages.find(img => img.id === 'drive-2'),
  },
];

export const supportTickets = [
    {
        id: 'TKT-001',
        subject: 'Cannot access my account',
        chama: 'Nairobi Founders Group',
        lastUpdate: '2024-07-30',
        status: 'Answered'
    },
    {
        id: 'TKT-002',
        subject: 'M-PESA contribution not reflecting',
        chama: 'Mombasa Traders',
        lastUpdate: '2024-07-29',
        status: 'Open'
    },
    {
        id: 'TKT-003',
        subject: 'How to download financial report?',
        chama: 'All Chamas',
        lastUpdate: '2024-07-28',
        status: 'Closed'
    },
    {
        id: 'TKT-004',
        subject: 'Election voting process unclear',
        chama: 'Kisumu Innovators',
        lastUpdate: '2024-07-27',
        status: 'Open'
    },
];

export const knowledgeBaseCategories = [
    {
        id: 'kb-cat-1',
        title: 'Getting Started',
        description: 'Learn the basics of setting up your account and your first Chama.',
        icon: 'Rocket',
        articles: [
            { id: 'art-1', title: 'How to create a new Chama circle?' },
            { id: 'art-2', title: 'Onboarding new members to your Chama' },
            { id: 'art-3', title: 'Understanding your dashboard' },
        ]
    },
    {
        id: 'kb-cat-2',
        title: 'Payments & Contributions',
        description: 'Find help with M-PESA, bank transfers, and tracking payments.',
        icon: 'DollarSign',
        articles: [
            { id: 'art-4', title: 'Linking your M-PESA Paybill' },
            { id: 'art-5', title: 'Troubleshooting failed transactions' },
            { id: 'art-6', title: 'How are penalties for late payments calculated?' },
        ]
    },
    {
        id: 'kb-cat-3',
        title: 'Account & Security',
        description: 'Manage your profile, password, and security settings.',
        icon: 'ShieldCheck',
        articles: [
            { id: 'art-7', title: 'How to change your password?' },
            { id: 'art-8', title: 'Enabling Two-Factor Authentication (2FA)' },
            { id: 'art-9', title: 'Updating your personal information' },
        ]
    },
    {
        id: 'kb-cat-4',
        title: 'Reports & Analytics',
        description: 'Learn how to generate and interpret financial reports.',
        icon: 'LineChart',
        articles: [
            { id: 'art-10', title: 'Generating a monthly financial statement' },
            { id: 'art-11', title: 'Understanding the BI Dashboard' },
            { id: 'art-12', 'title': 'Exporting transaction data' },
        ]
    }
];

export const faqs = [
    {
        question: 'What is the fee for using the platform?',
        answer: 'Our platform has a tiered subscription model based on the number of active members in your Chamas. Please visit the billing section for more details.'
    },
    {
        question: 'How long does it take for M-PESA deposits to reflect?',
        answer: 'M-PESA deposits are typically reflected in your account within 5-10 minutes. If you experience a delay, please check the transaction status on your M-PESA app before creating a support ticket.'
    },
    {
        question: 'Can I belong to more than one Chama?',
        answer: 'Yes, you can be a member of multiple Chama circles. You can switch between your Chamas from the main dashboard.'
    },
    {
        question: 'How do I start a milestone drive?',
        answer: 'Navigate to the "Milestone Drives" page and click on "Start a New Drive". You will be guided through the process of setting your goal, description, and timeline.'
    }
];

export const allPermissions = [
  'Manage Chamas',
  'Manage Members',
  'Manage Contributions',
  'Manage Loans',
  'Start Crowdfunding Drives',
  'View BI Dashboard',
  'Generate Financial Reports',
  'Manage Communications',
  'Manage Platform Settings',
  'Manage Support Tickets',
];

export const roles = [
    {
        role: 'Administrator',
        permissions: [
            'Manage Chamas',
            'Manage Members',
            'Manage Contributions',
            'Manage Loans',
            'Start Crowdfunding Drives',
            'View BI Dashboard',
            'Generate Financial Reports',
            'Manage Communications',
            'Manage Platform Settings',
            'Manage Support Tickets',
        ]
    },
    {
        role: 'Chairperson',
        permissions: [
            'Manage Chamas',
            'Manage Members',
            'Manage Contributions',
            'Manage Loans',
            'Start Crowdfunding Drives',
            'View BI Dashboard',
            'Generate Financial Reports',
            'Manage Communications',
        ]
    },
    {
        role: 'Member',
        permissions: [
            'View BI Dashboard',
        ]
    },
];

export const documents = [
  {
    id: 'doc-001',
    title: 'Minutes from Q3 Financial Review',
    category: 'Meeting Minutes',
    chama: 'Nairobi Founders Group',
    uploadDate: '2024-07-27',
    uploadedBy: 'David Kamau',
    documentNumber: 'MM-NFG-2024-Q3-01',
    documentDate: '2024-07-26',
  },
  {
    id: 'doc-002',
    title: 'Mombasa Traders - June 2024 Statement',
    category: 'Financial Report',
    chama: 'Mombasa Traders',
    uploadDate: '2024-07-15',
    uploadedBy: 'Aisha Omar',
    documentNumber: 'FS-MT-2024-06',
    documentDate: '2024-06-30',
  },
  {
    id: 'doc-003',
    title: 'Chama Registration Certificate',
    category: 'Legal Document',
    chama: 'Nairobi Founders Group',
    uploadDate: '2024-01-20',
    uploadedBy: 'David Kamau',
    documentNumber: 'CERT-NFG-2024-01',
    documentDate: '2024-01-15',
  },
  {
    id: 'doc-004',
    title: 'Kisumu Innovators - KRA PIN',
    category: 'Legal Document',
    chama: 'Kisumu Innovators',
    uploadDate: '2024-02-10',
    uploadedBy: 'System',
    documentNumber: 'KRA-KI-A001234567B',
    documentDate: '2024-02-01',
  },
  {
    id: 'doc-005',
    title: 'Minutes from Q2 Review',
    category: 'Meeting Minutes',
    chama: 'Nairobi Founders Group',
    uploadDate: '2024-06-29',
    uploadedBy: 'David Kamau',
    documentNumber: 'MM-NFG-2024-Q2-01',
    documentDate: '2024-06-28',
  },
];

export const upcomingEvents: {
  id: string;
  title: string;
  type: 'Meeting' | 'Payout' | 'Deadline';
  date: string;
  chama: string;
  location?: string;
  amount?: number;
}[] = [
    {
        id: 'event-1',
        title: 'Nairobi Founders Group Monthly Meeting',
        type: 'Meeting',
        date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        chama: 'Nairobi Founders Group',
        location: 'Virtual',
    },
    {
        id: 'event-2',
        title: 'Your Next Payout from Mombasa Traders',
        type: 'Payout',
        date: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        chama: 'Mombasa Traders',
        amount: 11875,
    },
    {
        id: 'event-3',
        title: 'Contribution Deadline for Kisumu Innovators',
        type: 'Deadline',
        date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        chama: 'Kisumu Innovators',
    },
    {
        id: 'event-4',
        title: 'Eldoret Visionaries Bi-Weekly Sync',
        type: 'Meeting',
        date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        chama: 'Eldoret Visionaries',
        location: 'Physical',
    },
    {
        id: 'event-5',
        title: 'Nakuru Hustlers Project Vote',
        type: 'Deadline',
        date: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        chama: 'Nakuru Hustlers',
    },
     {
        id: 'event-6',
        title: 'Nairobi Founders Group - Project Alpha Pitch',
        type: 'Meeting',
        date: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        chama: 'Nairobi Founders Group',
        location: 'Virtual',
    },
    {
        id: 'event-7',
        title: 'Mombasa Traders Year-End Party',
        type: 'Meeting',
        date: '2024-12-20T18:00:00Z',
        chama: 'Mombasa Traders',
        location: 'Serena Beach Hotel'
    },
    {
        id: 'event-8',
        title: 'Kisumu Innovators Payout Day',
        type: 'Payout',
        date: new Date(new Date().getTime() + 17 * 24 * 60 * 60 * 1000).toISOString(),
        chama: 'Kisumu Innovators',
        amount: 25000,
    }
];

export const walletTransactions = [
    { id: 'wt-1', date: '2024-08-01', description: 'Payout from Nairobi Founders Group', type: 'deposit', amount: 550000.00 },
    { id: 'wt-2', date: '2024-08-02', description: 'Withdrawal to M-Pesa (*******678)', type: 'withdrawal', amount: -50000.00 },
    { id: 'wt-3', date: '2024-07-25', description: 'Emergency Fund Refund', type: 'deposit', amount: 1500.00 },
    { id: 'wt-4', date: '2024-07-26', description: 'Withdrawal to KCB Bank (********4492)', type: 'withdrawal', amount: -200000.00 },
];

export const awards = [
  {
    id: 'award-1',
    title: 'Top Contributor (Q2)',
    category: 'Performance',
    description: 'Awarded for the highest total contributions in the second quarter.',
    status: 'Active',
  },
  {
    id: 'award-2',
    title: 'Perfect Attendance (2023)',
    category: 'Engagement',
    description: 'Awarded for attending all official meetings in the year 2023.',
    status: 'Active',
  },
  {
    id: 'award-3',
    title: 'Community Champion',
    category: 'Community',
    description: 'Awarded for outstanding contributions to community projects.',
    status: 'Archived',
  },
];
    
export const crowdfundingDrives = [
  {
    id: 'drive-1',
    title: 'New Library for Kilimani Primary',
    description: 'Help us build a modern library to foster a love for reading among our students.',
    creator: 'Jane Doe',
    goal: 500000,
    raised: 125000,
    image: PlaceHolderImages.find(img => img.id === 'drive-1'),
    managers: [
        { id: 'manager-1', name: 'Jane Doe', contactType: 'Email' as 'Phone' | 'Email', contactInfo: 'jane.doe@example.com' },
        { id: 'manager-2', name: 'Kilimani School Board', contactType: 'Phone' as 'Phone' | 'Email', contactInfo: '+254 712 345 678' }
    ]
  },
  {
    id: 'drive-2',
    title: 'Seed Funding for Boda Boda Cooperative',
    description: 'Empowering local Boda Boda riders by providing seed capital for bike maintenance and safety gear.',
    creator: 'Nairobi Founders Group',
    goal: 250000,
    raised: 250000,
    image: PlaceHolderImages.find(img => img.id === 'drive-2'),
    managers: [
        { id: 'manager-3', name: 'David Kamau', contactType: 'Email' as 'Phone' | 'Email', contactInfo: 'david.kamau@example.com' },
    ]
  },
  {
    id: 'drive-3',
    title: 'Modernize Equipment for Eldoret Farmers',
    description: 'Upgrade farming equipment to increase yield and efficiency for small-scale farmers in the Eldoret area.',
    creator: 'Eldoret Visionaries',
    goal: 1200000,
    raised: 850000,
    image: PlaceHolderImages.find(img => img.id === 'drive-3'),
    managers: []
  },
  {
    id: 'drive-4',
    title: 'Community Health Clinic in Kibera',
    description: 'Establish a community health clinic to provide accessible and affordable healthcare services.',
    creator: 'Amina Yusuf',
    goal: 3500000,
    raised: 900000,
    image: PlaceHolderImages.find(img => img.id === 'drive-4'),
    managers: []
  },
];
export const failedDrivesData = [
  { id: 'failed-1', title: 'Kiambu Green Energy Project', endDate: '2024-06-30', refundDeadline: '2024-07-02', amountToRefund: 45000, status: 'Pending' },
  { id: 'failed-2', title: 'Kisumu Tech Hub Equipment', endDate: '2024-05-15', refundDeadline: '2024-05-17', amountToRefund: 82000, status: 'Processed' },
];
export const learningCourses = [
  { id: 'course-1', title: 'Fundamentals of Budgeting', description: 'Learn to manage your personal and business finances effectively.', category: 'Personal Finance', progress: 100, image: PlaceHolderImages.find(img => img.id === 'learning-1') },
  { id: 'course-2', title: 'Introduction to Investing', description: 'Discover the basics of stocks, bonds, and other investment vehicles.', category: 'Investing', progress: 40, image: PlaceHolderImages.find(img => img.id === 'learning-2') },
  { id: 'course-3', title: 'Understanding Debt Management', description: 'Strategies for managing and reducing debt.', category: 'Personal Finance', progress: 100, image: PlaceHolderImages.find(img => img.id === 'learning-3') },
  { id: 'course-4', title: 'Advanced Investment Strategies', description: 'Dive deeper into derivatives, options, and portfolio diversification.', category: 'Investing', progress: 0, image: PlaceHolderImages.find(img => img.id === 'learning-4') },
  { id: 'course-5', title: 'Retirement Planning', description: 'Secure your future with effective retirement planning.', category: 'Financial Planning', progress: 0, image: PlaceHolderImages.find(img => img.id === 'learning-5') },
  { id: 'course-6', title: 'Small Business Financing', description: 'Explore various options for funding your small business.', category: 'Business', progress: 50, image: PlaceHolderImages.find(img => img.id === 'learning-6') },
];
