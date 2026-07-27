/**
 * Driver Module Mock Data
 * Contains mock driver identity, vehicle details, daily/weekly earnings, active trips,
 * incoming ride requests, ratings, and performance statistics.
 */

export const mockDriverProfile = {
  id: 'drv-8821',
  name: 'Mariselvam S (Driver)',
  email: 'mariselvam110722@gmail.com',
  phone: '+1 (555) 492-8172',
  rating: 4.98,
  totalTrips: 1420,
  yearsDriving: '2.5 Years',
  membershipTier: 'Uber Pro Diamond',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  vehicle: {
    model: 'Toyota Camry Hybrid (2024)',
    color: 'Midnight Black',
    plate: '7ABC123',
    type: 'Uber Premier / Uber Go',
    capacity: 4,
    photo: '/images/uber-go.png',
    status: 'Verified & Active'
  },
  documents: [
    { id: 'doc-1', name: 'Driver License', status: 'Verified', expiry: 'May 2028', icon: '🪪' },
    { id: 'doc-2', name: 'Vehicle Insurance', status: 'Verified', expiry: 'Oct 2026', icon: '📄' },
    { id: 'doc-3', name: 'Vehicle Registration', status: 'Verified', expiry: 'Jan 2027', icon: '📋' },
    { id: 'doc-4', name: 'Background Check', status: 'Passed', expiry: 'Annual Review', icon: '✅' }
  ]
}

export const mockTodaysStats = {
  onlineHours: '6h 45m',
  tripsCompleted: 12,
  acceptanceRate: '96%',
  cancellationRate: '1.2%',
  todayEarnings: 184.50,
  targetEarnings: 250.00,
  tipsReceived: 28.50,
  fuelSpent: 22.00
}

export const mockWeeklyEarnings = {
  totalWeek: 1245.80,
  currency: '$',
  weekRange: 'Jul 21 – Jul 27, 2026',
  cashOutAvailable: true,
  dailyBreakdown: [
    { day: 'Mon', date: 'Jul 21', amount: 165.20, trips: 10, hours: '6.2h' },
    { day: 'Tue', date: 'Jul 22', amount: 192.40, trips: 13, hours: '7.1h' },
    { day: 'Wed', date: 'Jul 23', amount: 148.00, trips: 9, hours: '5.5h' },
    { day: 'Thu', date: 'Jul 24', amount: 210.50, trips: 15, hours: '7.8h' },
    { day: 'Fri', date: 'Jul 25', amount: 245.20, trips: 18, hours: '8.5h' },
    { day: 'Sat', date: 'Jul 26', amount: 284.50, trips: 20, hours: '9.2h' },
    { day: 'Sun (Today)', date: 'Jul 27', amount: 184.50, trips: 12, hours: '6.8h' }
  ],
  recentTransactions: [
    { id: 'earning-1', tripId: 'trip-991', desc: 'Ride from SFO Airport to Downtown SF', amount: 38.50, tip: 7.00, time: '2:15 PM', type: 'Card' },
    { id: 'earning-2', tripId: 'trip-990', desc: 'Ride from Union Square to Pier 39', amount: 16.80, tip: 3.00, time: '1:30 PM', type: 'Uber Cash' },
    { id: 'earning-3', tripId: 'trip-989', desc: 'Ride from Mission District to Oracle Park', amount: 22.40, tip: 4.50, time: '12:10 PM', type: 'Apple Pay' },
    { id: 'earning-4', tripId: 'trip-988', desc: 'Ride from Castro to Golden Gate Park', amount: 19.20, tip: 2.00, time: '11:05 AM', type: 'Card' }
  ]
}

export const mockRideRequests = [
  {
    id: 'req-201',
    passenger: {
      name: 'Eleanor Vance',
      rating: 4.92,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 321-7654',
      tripsCount: 34
    },
    pickup: 'Palace of Fine Arts, 3301 Lyon St, SF',
    dropoff: 'San Francisco Museum of Modern Art (SFMOMA)',
    distance: '5.4 km',
    estTime: '16 mins',
    fare: 24.50,
    surge: '1.2x Surge',
    pickupDistance: '0.8 km (3 mins away)',
    note: 'Waiting near the main entrance columns'
  },
  {
    id: 'req-202',
    passenger: {
      name: 'Marcus Brody',
      rating: 4.88,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 654-0987',
      tripsCount: 112
    },
    pickup: 'Salesforce Tower, 415 Mission St, SF',
    dropoff: 'Oakland International Airport (OAK)',
    distance: '31.2 km',
    estTime: '38 mins',
    fare: 58.00,
    surge: '1.5x Airport Surge',
    pickupDistance: '1.2 km (4 mins away)',
    note: 'Have 2 medium suitcases, thank you!'
  },
  {
    id: 'req-203',
    passenger: {
      name: 'Chloe Bennett',
      rating: 4.96,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 789-0123',
      tripsCount: 67
    },
    pickup: 'Lombard Street (Crookedest Street), SF',
    dropoff: 'Ghirardelli Square, 900 North Point St',
    distance: '2.1 km',
    estTime: '8 mins',
    fare: 14.20,
    surge: 'Normal Fare',
    pickupDistance: '0.4 km (1 min away)',
    note: 'Standing by the corner bookstore'
  }
]

export const mockActiveTrip = {
  id: 'active-301',
  passenger: {
    name: 'Eleanor Vance',
    rating: 4.92,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+1 (555) 321-7654',
    note: 'Waiting near the main entrance columns'
  },
  pickup: 'Palace of Fine Arts, 3301 Lyon St, SF',
  dropoff: 'San Francisco Museum of Modern Art (SFMOMA)',
  distance: '5.4 km',
  estTime: '16 mins',
  fare: 24.50,
  status: 'Heading to Pickup', // 'Heading to Pickup' | 'Arrived at Pickup' | 'Trip in Progress' | 'Completed'
  currentInstruction: 'In 300m, turn right onto Marina Blvd toward Lombard St',
  etaToPickup: '3 mins'
}

export const mockDriverRatings = {
  overall: 4.98,
  totalRatedTrips: 1380,
  fiveStarCount: 1345,
  fourStarCount: 28,
  threeStarCount: 5,
  twoStarCount: 1,
  oneStarCount: 1,
  compliments: [
    { id: 'comp-1', title: 'Excellent Service', count: 480, icon: '🏆' },
    { id: 'comp-2', title: 'Clean & Tidy Car', count: 412, icon: '✨' },
    { id: 'comp-3', title: 'Great Conversation', count: 320, icon: '💬' },
    { id: 'comp-4', title: 'Smooth Navigation', count: 295, icon: '🗺️' },
    { id: 'comp-5', title: 'Great Music / Vibes', count: 180, icon: '🎵' }
  ],
  recentReviews: [
    { id: 'rev-1', author: 'Jessica M.', rating: 5, date: 'Jul 26', comment: 'Mariselvam was fantastic! Super clean car and got us to SFO early.' },
    { id: 'rev-2', author: 'Brian K.', rating: 5, date: 'Jul 25', comment: 'Very smooth driving through downtown traffic. Highly recommend!' },
    { id: 'rev-3', author: 'Anita R.', rating: 5, date: 'Jul 23', comment: 'Friendly driver, offered water and phone charger. 10/10!' }
  ]
}
