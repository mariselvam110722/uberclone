/**
 * Rider Module Mock Data
 * Contains mock vehicles, ride history trips, wallet balance/transactions, and user profile data.
 */

export const mockVehicles = [
  {
    id: 'uber-go',
    name: 'Uber Go',
    desc: 'Affordable, compact rides for everyday trips',
    capacity: 4,
    basePrice: 8.00,
    pricePerKm: 1.50,
    pricePerMin: 0.35,
    image: '/images/uber-go.png',
    eta: '3 mins away',
    badge: 'Popular',
    co2: '120g CO₂/km'
  },
  {
    id: 'uber-auto',
    name: 'Uber Auto',
    desc: 'Quick and economical three-wheel auto rickshaw rides',
    capacity: 3,
    basePrice: 5.00,
    pricePerKm: 1.00,
    pricePerMin: 0.20,
    image: '/images/uber-auto.png',
    eta: '2 mins away',
    badge: 'Best Value',
    co2: '90g CO₂/km'
  },
  {
    id: 'uber-bike',
    name: 'Uber Moto / Bike',
    desc: 'Beat the traffic with solo motorcycle rides',
    capacity: 1,
    basePrice: 3.50,
    pricePerKm: 0.80,
    pricePerMin: 0.15,
    image: '/images/uber-bike.png',
    eta: '1 min away',
    badge: 'Fastest',
    co2: '60g CO₂/km'
  },
  {
    id: 'uber-premier',
    name: 'Uber Premier',
    desc: 'Comfortable sedans with top-rated drivers',
    capacity: 4,
    basePrice: 14.00,
    pricePerKm: 2.20,
    pricePerMin: 0.50,
    image: '/images/uber-go.png',
    eta: '5 mins away',
    badge: 'Luxury',
    co2: '140g CO₂/km'
  }
]

export const mockTrips = [
  {
    id: 'trip-101',
    pickup: 'San Francisco International Airport (SFO)',
    destination: 'Union Square, Downtown SF',
    date: '2026-07-26 14:30',
    status: 'Completed',
    distance: '14.2 km',
    duration: '28 mins',
    fare: 34.50,
    vehicle: 'Uber Premier',
    paymentMethod: 'Visa •••• 4242',
    driver: {
      name: 'Michael Thornton',
      rating: 4.95,
      car: 'Toyota Camry (Midnight Black)',
      plate: '7ABC123',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 234-5678'
    }
  },
  {
    id: 'trip-102',
    pickup: 'Oracle Park, 24 Willie Mays Plaza',
    destination: 'Fisherman\'s Wharf, Pier 39',
    date: '2026-07-24 19:15',
    status: 'Completed',
    distance: '6.8 km',
    duration: '16 mins',
    fare: 18.20,
    vehicle: 'Uber Go',
    paymentMethod: 'Uber Cash',
    driver: {
      name: 'Sarah Jenkins',
      rating: 4.89,
      car: 'Honda Civic (Silver)',
      plate: '5XYZ890',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 876-5432'
    }
  },
  {
    id: 'trip-103',
    pickup: 'Golden Gate Park, Conservatory of Flowers',
    destination: 'Palace of Fine Arts, SF',
    date: '2026-07-22 11:00',
    status: 'Cancelled',
    distance: '4.5 km',
    duration: '12 mins',
    fare: 0.00,
    vehicle: 'Uber Moto',
    paymentMethod: 'Apple Pay',
    driver: {
      name: 'David Lopez',
      rating: 4.92,
      car: 'Yamaha MT-07',
      plate: '9MTO456',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 345-6789'
    }
  },
  {
    id: 'trip-104',
    pickup: '742 Evergreen Terrace, Residential',
    destination: 'Silicon Valley Tech Hub, Building 4',
    date: '2026-07-18 08:45',
    status: 'Completed',
    distance: '22.1 km',
    duration: '42 mins',
    fare: 52.80,
    vehicle: 'Uber Premier',
    paymentMethod: 'Visa •••• 4242',
    driver: {
      name: 'Elena Rostova',
      rating: 4.98,
      car: 'Tesla Model 3 (Pearl White)',
      plate: '3TSL789',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 901-2345'
    }
  }
]

export const mockWallet = {
  balance: 145.50,
  currency: '$',
  paymentMethods: [
    { id: 'pm-1', type: 'Credit Card', label: 'Visa ending in •••• 4242', expiry: '08/28', isDefault: true, icon: '💳' },
    { id: 'pm-2', type: 'Uber Cash', label: 'Uber Cash Balance ($145.50)', expiry: 'Never', isDefault: false, icon: '💰' },
    { id: 'pm-3', type: 'Apple Pay', label: 'Apple Pay (Connected Device)', expiry: 'Active', isDefault: false, icon: '🍎' },
    { id: 'pm-4', type: 'Cash', label: 'Cash on Delivery / Driver', expiry: 'N/A', isDefault: false, icon: '💵' }
  ],
  transactions: [
    { id: 'tx-1', description: 'Ride to Union Square (SFO)', amount: -34.50, date: 'Jul 26, 2026', type: 'debit', status: 'Completed' },
    { id: 'tx-2', description: 'Added Uber Cash via Visa •••• 4242', amount: 50.00, date: 'Jul 25, 2026', type: 'credit', status: 'Completed' },
    { id: 'tx-3', description: 'Ride to Fisherman\'s Wharf', amount: -18.20, date: 'Jul 24, 2026', type: 'debit', status: 'Completed' },
    { id: 'tx-4', description: 'Promotional Ride Discount applied', amount: 5.00, date: 'Jul 20, 2026', type: 'credit', status: 'Completed' },
    { id: 'tx-5', description: 'Ride to Silicon Valley Tech Hub', amount: -52.80, date: 'Jul 18, 2026', type: 'debit', status: 'Completed' }
  ]
}

export const mockRiderProfile = {
  name: 'Mariselvam S',
  email: 'mariselvam110722@gmail.com',
  phone: '+1 (555) 382-9102',
  rating: 4.92,
  totalTrips: 48,
  memberSince: 'March 2024',
  membershipTier: 'Uber One Platinum',
  photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  savedAddresses: [
    { id: 'addr-1', title: 'Home', address: '742 Evergreen Terrace, San Francisco, CA', icon: '🏠', note: 'Leave at front gate' },
    { id: 'addr-2', title: 'Work', address: '100 Market St, Floor 14, San Francisco, CA', icon: '🏢', note: 'Use visitor lobby elevator' },
    { id: 'addr-3', title: 'Gym', address: '24 Hour Fitness, Van Ness Ave, SF', icon: '🏋️', note: 'Corner entrance' }
  ],
  preferences: [
    { id: 'pref-1', title: 'Quiet Ride', value: 'Preferred', desc: 'Prefer minimal conversation during trips for reading or working', icon: '🤫' },
    { id: 'pref-2', title: 'Temperature', value: 'Cool (68°F)', desc: 'Prefer air conditioning on comfortable cool setting', icon: '❄️' },
    { id: 'pref-3', title: 'Luggage Assistance', value: 'Required for Trunk', desc: 'May need help loading bags into trunk at airport', icon: '🧳' }
  ]
}
