/**
 * Admin Module Mock Data
 * Contains platform-wide user/driver statistics, fleet analytics, verification requests,
 * financial revenue breakdowns, and system reports.
 */

export const mockAdminOverview = {
  totalUsers: 24580,
  totalDrivers: 3420,
  activeDrivers: 1850,
  activeRiders: 8940,
  todaysTrips: 4210,
  weeklyRevenue: 148500.00,
  monthlyRevenue: 620400.00,
  platformRating: 4.91,
  userGrowthRate: '+14.2%',
  driverGrowthRate: '+8.7%',
  tripCompletionRate: '97.6%',
  avgResponseTime: '2.4 mins'
}

export const mockUsers = [
  {
    id: 'usr-1001',
    name: 'Mariselvam S',
    email: 'mariselvam110722@gmail.com',
    role: 'Rider',
    status: 'Active',
    trips: 48,
    rating: 4.92,
    phone: '+1 (555) 382-9102',
    joined: '2024-03-15',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    walletBalance: 145.50
  },
  {
    id: 'usr-1002',
    name: 'Michael Thornton',
    email: 'm.thornton@drive.uber.com',
    role: 'Driver',
    status: 'Active',
    trips: 1420,
    rating: 4.95,
    phone: '+1 (555) 234-5678',
    joined: '2023-11-02',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Toyota Camry (7ABC123)'
  },
  {
    id: 'usr-1003',
    name: 'Sarah Jenkins',
    email: 's.jenkins@gmail.com',
    role: 'Driver',
    status: 'Active',
    trips: 890,
    rating: 4.89,
    phone: '+1 (555) 876-5432',
    joined: '2024-01-20',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Honda Civic (5XYZ890)'
  },
  {
    id: 'usr-1004',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@tech.co',
    role: 'Rider',
    status: 'Active',
    trips: 34,
    rating: 4.92,
    phone: '+1 (555) 321-7654',
    joined: '2025-06-10',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    walletBalance: 82.00
  },
  {
    id: 'usr-1005',
    name: 'David Lopez',
    email: 'dlopez.moto@uber.com',
    role: 'Driver',
    status: 'Suspended',
    trips: 310,
    rating: 4.65,
    phone: '+1 (555) 345-6789',
    joined: '2024-08-01',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Yamaha MT-07 (9MTO456)'
  },
  {
    id: 'usr-1006',
    name: 'Marcus Brody',
    email: 'mbrody@academic.edu',
    role: 'Rider',
    status: 'Active',
    trips: 112,
    rating: 4.88,
    phone: '+1 (555) 654-0987',
    joined: '2023-05-19',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    walletBalance: 210.00
  },
  {
    id: 'usr-1007',
    name: 'Elena Rostova',
    email: 'elena.rostova@ev.drive',
    role: 'Driver',
    status: 'Active',
    trips: 2150,
    rating: 4.98,
    phone: '+1 (555) 901-2345',
    joined: '2022-09-14',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Tesla Model 3 (3TSL789)'
  },
  {
    id: 'usr-1008',
    name: 'Chloe Bennett',
    email: 'chloe.b@design.io',
    role: 'Rider',
    status: 'Suspended',
    trips: 12,
    rating: 3.85,
    phone: '+1 (555) 789-0123',
    joined: '2026-02-11',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    walletBalance: 0.00
  }
]

export const mockVerificationRequests = [
  {
    id: 'ver-501',
    name: 'Robert Langdon',
    email: 'r.langdon@drive.uber.com',
    phone: '+1 (555) 443-3221',
    submissionDate: '2026-07-26',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    vehicle: {
      model: 'Hyundai Sonata Hybrid (2025)',
      color: 'Oxford Blue',
      plate: '8HYN442',
      type: 'Uber Premier'
    },
    documents: [
      { name: 'Driver License', status: 'Verified', previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
      { name: 'Vehicle Insurance', status: 'Pending Review', previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Vehicle Registration', status: 'Verified', previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Background Check', status: 'Passed', previewUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  {
    id: 'ver-502',
    name: 'Amara Okafor',
    email: 'amara.okafor@gmail.com',
    phone: '+1 (555) 887-1122',
    submissionDate: '2026-07-25',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
    vehicle: {
      model: 'Toyota Prius (2023)',
      color: 'Silver',
      plate: '4PRS901',
      type: 'Uber Go'
    },
    documents: [
      { name: 'Driver License', status: 'Verified', previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
      { name: 'Vehicle Insurance', status: 'Verified', previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Vehicle Registration', status: 'Verified', previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Background Check', status: 'Pending Review', previewUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  {
    id: 'ver-503',
    name: 'Kevin Zhao',
    email: 'kzhao.drive@yahoo.com',
    phone: '+1 (555) 665-4332',
    submissionDate: '2026-07-24',
    status: 'Rejected',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    vehicle: {
      model: 'Honda Accord (2018)',
      color: 'White',
      plate: '1HND223',
      type: 'Uber Go'
    },
    documents: [
      { name: 'Driver License', status: 'Verified', previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
      { name: 'Vehicle Insurance', status: 'Expired (Rejected)', previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Vehicle Registration', status: 'Verified', previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Background Check', status: 'Passed', previewUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80' }
    ]
  }
]

export const mockFleetStats = {
  vehiclesOnline: 1850,
  vehiclesOffline: 1570,
  totalFleet: 3420,
  categories: [
    { name: 'Uber Go (Compact)', count: 1640, online: 920, share: '48%', icon: '🚗' },
    { name: 'Uber Premier (Sedan)', count: 820, online: 480, share: '24%', icon: '🚘' },
    { name: 'Uber Auto (3-Wheel)', count: 610, online: 310, share: '18%', icon: '🛺' },
    { name: 'Uber Moto (Bike)', count: 350, online: 140, share: '10%', icon: '🏍️' }
  ],
  heatMapZones: [
    { zone: 'San Francisco International Airport (SFO)', demand: 'Very High (Surge 1.8x)', activeCabs: 310, avgWait: '2 mins', status: 'High Demand' },
    { zone: 'Union Square & Financial District', demand: 'High (Surge 1.4x)', activeCabs: 420, avgWait: '3 mins', status: 'High Demand' },
    { zone: 'Silicon Valley Tech Campus Hub', demand: 'High (Surge 1.3x)', activeCabs: 280, avgWait: '4 mins', status: 'High Demand' },
    { zone: 'Oakland Downtown & Marina', demand: 'Moderate (Normal)', activeCabs: 190, avgWait: '5 mins', status: 'Balanced' },
    { zone: 'Golden Gate Park & Sunset District', demand: 'Moderate (Normal)', activeCabs: 150, avgWait: '6 mins', status: 'Balanced' },
    { zone: 'San Jose Residential Suburbs', demand: 'Low (Normal)', activeCabs: 110, avgWait: '8 mins', status: 'Low Demand' }
  ]
}

export const mockAnalytics = {
  dailyTrips: [
    { label: 'Mon', trips: 3420, revenue: 112000 },
    { label: 'Tue', trips: 3890, revenue: 125000 },
    { label: 'Wed', trips: 3650, revenue: 118000 },
    { label: 'Thu', trips: 4120, revenue: 139000 },
    { label: 'Fri', trips: 4980, revenue: 172000 },
    { label: 'Sat', trips: 5410, revenue: 194000 },
    { label: 'Sun', trips: 4210, revenue: 148500 }
  ],
  monthlyTrips: [
    { label: 'Jan', trips: 92000, revenue: 510000 },
    { label: 'Feb', trips: 98000, revenue: 540000 },
    { label: 'Mar', trips: 105000, revenue: 580000 },
    { label: 'Apr', trips: 112000, revenue: 605000 },
    { label: 'May', trips: 118000, revenue: 615000 },
    { label: 'Jun', trips: 124000, revenue: 620400 }
  ],
  userDriverGrowth: [
    { month: 'Jan', riders: 18000, drivers: 2600 },
    { month: 'Feb', riders: 19500, drivers: 2780 },
    { month: 'Mar', riders: 21000, drivers: 2950 },
    { month: 'Apr', riders: 22400, drivers: 3100 },
    { month: 'May', riders: 23600, drivers: 3260 },
    { month: 'Jun', riders: 24580, drivers: 3420 }
  ],
  cancellationRate: '2.4%',
  cancellationReasons: [
    { reason: 'Driver took too long to arrive', pct: '42%' },
    { reason: 'Rider plans changed / mistake', pct: '31%' },
    { reason: 'Driver requested cancellation', pct: '18%' },
    { reason: 'Wrong pickup location pin', pct: '9%' }
  ],
  peakHours: [
    { time: '07:00 - 09:30 AM', type: 'Morning Rush (Work Commute)', volume: 'Very High' },
    { time: '04:30 - 07:30 PM', type: 'Evening Rush (Return Commute)', volume: 'Peak Volume' },
    { time: '10:00 PM - 02:00 AM', type: 'Weekend Nightlife (Fri/Sat)', volume: 'Surge Peak' }
  ]
}

export const mockReports = {
  summary: {
    totalEarningsReport: '$620,400.00 (This Month)',
    driverPayouts: '$483,912.00 (78% Net to Drivers)',
    platformCommission: '$136,488.00 (22% Platform Fee)',
    activeComplaints: 14,
    resolvedTicketsToday: 32
  },
  complaintTickets: [
    { id: 'tkt-901', reporter: 'Eleanor Vance (Rider)', target: 'David Lopez (Driver)', issue: 'Route Detour & Delay', date: '2026-07-26', status: 'Under Review', priority: 'Medium' },
    { id: 'tkt-902', reporter: 'Michael Thornton (Driver)', target: 'Chloe Bennett (Rider)', issue: 'Rider No-Show at Airport Gate', date: '2026-07-25', status: 'Resolved', priority: 'Low' },
    { id: 'tkt-903', reporter: 'Marcus Brody (Rider)', target: 'Sarah Jenkins (Driver)', issue: 'Lost Wallet Left on Rear Seat', date: '2026-07-25', status: 'Resolved (Returned)', priority: 'High' },
    { id: 'tkt-904', reporter: 'Mariselvam S (Rider)', target: 'System App', issue: 'Promo Code UBER5 failed to apply on second attempt', date: '2026-07-24', status: 'Resolved (Credited)', priority: 'Low' }
  ]
}
