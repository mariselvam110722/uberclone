/**
 * Google Maps Service (Maps Integration, Places Autocomplete, Geocoding & Route Telemetry)
 * Encapsulates Google Maps JavaScript API loading, DirectionsService, Places Autocomplete,
 * dynamic distance/ETA/fare calculations, and live driver GPS simulation.
 * Includes intelligent local fallback simulation if API key is in demo mode or network is restricted.
 */

// Known reference coordinates for popular Bay Area landmarks (Fallback / Demo mode)
const LANDMARK_COORDS = {
  'san francisco international airport': { lat: 37.6213, lng: -122.3790, name: 'San Francisco International Airport (SFO)' },
  'sfo': { lat: 37.6213, lng: -122.3790, name: 'San Francisco International Airport (SFO)' },
  'union square': { lat: 37.7879, lng: -122.4074, name: 'Union Square, Downtown SF' },
  'downtown sf': { lat: 37.7879, lng: -122.4074, name: 'Union Square, Downtown SF' },
  '742 evergreen terrace': { lat: 37.7694, lng: -122.4862, name: '742 Evergreen Terrace, San Francisco, CA' },
  'home': { lat: 37.7694, lng: -122.4862, name: '742 Evergreen Terrace, San Francisco, CA' },
  'work': { lat: 37.7922, lng: -122.3965, name: '100 Market St, Floor 14, San Francisco, CA' },
  '100 market st': { lat: 37.7922, lng: -122.3965, name: '100 Market St, Floor 14, San Francisco, CA' },
  'golden gate bridge': { lat: 37.8199, lng: -122.4783, name: 'Golden Gate Bridge, Toll Plaza, SF' },
  'oracle park': { lat: 37.7786, lng: -122.3893, name: 'Oracle Park, Willie Mays Plaza, SF' },
  'twin peaks': { lat: 37.7544, lng: -122.4477, name: 'Twin Peaks, Summit Lookout, SF' },
  'silicon valley': { lat: 37.3861, lng: -122.0839, name: 'Silicon Valley Tech Campus, CA' },
  'fisherman': { lat: 37.8080, lng: -122.4177, name: "Fisherman's Wharf, San Francisco, CA" },
  'chinatown': { lat: 37.7941, lng: -122.4078, name: 'Chinatown, Grant Ave, SF' },
  'default_pickup': { lat: 37.7749, lng: -122.4194, name: 'San Francisco City Center, CA' },
  'default_dest': { lat: 37.7858, lng: -122.4065, name: 'Market Street & 4th St, SF' }
}

let isApiLoaded = false
let apiLoadPromise = null

export const googleMapsService = {
  /**
   * Dynamically loads the Google Maps JavaScript API script with Places and Geometry libraries.
   */
  async loadGoogleMapsApi() {
    if (typeof window === 'undefined') return false
    if (window.google && window.google.maps) {
      isApiLoaded = true
      return true
    }
    if (apiLoadPromise) return apiLoadPromise

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_MAP_API_KEY
    if (!apiKey || apiKey === 'mock-map-key' || apiKey.includes('MOCK')) {
      console.warn('Google Maps API Key is in Demo/Mock mode. Using built-in intelligent telemetry engine.')
      isApiLoaded = false
      return false
    }

    apiLoadPromise = new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
      script.async = true
      script.defer = true
      script.onload = () => {
        isApiLoaded = true
        resolve(true)
      }
      script.onerror = (err) => {
        console.error('Failed to load Google Maps API script:', err)
        isApiLoaded = false
        resolve(false)
      }
      document.head.appendChild(script)
    })

    return apiLoadPromise
  },

  /**
   * Checks if Google Maps SDK is loaded and available.
   */
  isGoogleLoaded() {
    return Boolean(typeof window !== 'undefined' && window.google && window.google.maps && isApiLoaded)
  },

  /**
   * Geocodes an address string to latitude/longitude coordinates.
   */
  async geocodeAddress(address) {
    if (!address || !address.trim()) return LANDMARK_COORDS.default_pickup

    if (this.isGoogleLoaded()) {
      try {
        const geocoder = new window.google.maps.Geocoder()
        const res = await geocoder.geocode({ address })
        if (res.results && res.results.length > 0) {
          const loc = res.results[0].geometry.location
          return {
            lat: loc.lat(),
            lng: loc.lng(),
            name: res.results[0].formatted_address
          }
        }
      } catch (err) {
        console.warn('Google Geocoding API failed, using intelligent telemetry fallback:', err)
      }
    }

    // Intelligent Telemetry Fallback matching against Bay Area landmarks
    const lower = address.toLowerCase()
    for (const [key, val] of Object.entries(LANDMARK_COORDS)) {
      if (lower.includes(key)) {
        // Add tiny pseudo-random jitter based on string hash so distinct addresses have slightly distinct pins
        let hash = 0
        for (let i = 0; i < address.length; i++) hash = ((hash << 5) - hash) + address.charCodeAt(i)
        const jitterLat = (hash % 100) * 0.0001
        const jitterLng = ((hash >> 3) % 100) * 0.0001
        return { lat: val.lat + jitterLat, lng: val.lng + jitterLng, name: val.name }
      }
    }

    // General string hash geocoding in San Francisco downtown bounding box
    let hash = 0
    for (let i = 0; i < address.length; i++) hash = ((hash << 5) - hash) + address.charCodeAt(i)
    const lat = 37.75 + Math.abs(hash % 80) * 0.001
    const lng = -122.48 + Math.abs((hash >> 2) % 80) * 0.001
    return { lat, lng, name: address }
  },

  /**
   * Reverse geocodes latitude and longitude coordinates into a human-readable street address.
   */
  async reverseGeocode(lat, lng) {
    if (this.isGoogleLoaded()) {
      try {
        const geocoder = new window.google.maps.Geocoder()
        const res = await geocoder.geocode({ location: { lat, lng } })
        if (res.results && res.results.length > 0) {
          return res.results[0].formatted_address
        }
      } catch (err) {
        console.warn('Google Reverse Geocode failed:', err)
      }
    }

    // Find nearest landmark
    let nearest = 'Market St & 4th St, San Francisco, CA'
    let minDist = Infinity
    for (const val of Object.values(LANDMARK_COORDS)) {
      const d = Math.hypot(val.lat - lat, val.lng - lng)
      if (d < minDist) {
        minDist = d
        nearest = val.name
      }
    }
    if (minDist < 0.03) return nearest
    return `${Math.abs(lat.toFixed(4))}° N, ${Math.abs(lng.toFixed(4))}° W (San Francisco Area)`
  },

  /**
   * Places Autocomplete: Returns address predictions based on input query.
   */
  async getPlacePredictions(query) {
    if (!query || query.trim().length < 2) return []

    if (this.isGoogleLoaded() && window.google.maps.places) {
      try {
        const service = new window.google.maps.places.AutocompleteService()
        const res = await new Promise((resolve) => {
          service.getPlacePredictions({ input: query, componentRestrictions: { country: 'us' } }, (preds, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
              resolve(preds.map((p) => ({ label: p.description, placeId: p.place_id })))
            } else {
              resolve([])
            }
          })
        })
        if (res.length > 0) return res
      } catch (err) {
        console.warn('Google Places Autocomplete failed, falling back:', err)
      }
    }

    // Local Intelligent Autocomplete Suggestions
    const lower = query.toLowerCase()
    const matches = []
    const candidates = [
      { label: 'San Francisco International Airport (SFO), CA', icon: '✈️' },
      { label: 'Union Square, Downtown San Francisco, CA', icon: '🛍️' },
      { label: '742 Evergreen Terrace, San Francisco, CA', icon: '🏠' },
      { label: '100 Market St, Floor 14, San Francisco, CA', icon: '🏢' },
      { label: 'Golden Gate Bridge, Toll Plaza, San Francisco, CA', icon: '🌉' },
      { label: 'Oracle Park, Willie Mays Plaza, San Francisco, CA', icon: '⚾' },
      { label: 'Twin Peaks, Summit Lookout, San Francisco, CA', icon: '⛰️' },
      { label: 'Silicon Valley Tech Campus, Mountain View, CA', icon: '💻' },
      { label: "Fisherman's Wharf, Pier 39, San Francisco, CA", icon: '🦀' },
      { label: 'Chinatown, Grant Ave & Bush St, San Francisco, CA', icon: '🏮' },
      { label: 'Palace of Fine Arts, Baker St, San Francisco, CA', icon: '🏛️' },
      { label: 'Coit Tower, Telegraph Hill Blvd, San Francisco, CA', icon: '🗼' },
      { label: 'Alcatraz Landing, Pier 33, San Francisco, CA', icon: '⛴️' },
      { label: 'Embarcadero Center, Justin Herman Plaza, SF', icon: '🏬' }
    ]

    for (const c of candidates) {
      if (c.label.toLowerCase().includes(lower)) {
        matches.push(c)
      }
    }

    // If no direct matches, return general formatted query suggestions
    if (matches.length === 0) {
      return [
        { label: `${query}, San Francisco, CA`, icon: '📍' },
        { label: `${query} Blvd, San Francisco, CA`, icon: '🛣️' },
        { label: `${query} Ave, Downtown SF, CA`, icon: '🏢' }
      ]
    }
    return matches
  },

  /**
   * Haversine formula to compute geodesic distance in kilometers between two lat/lng coordinates.
   */
  getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  /**
   * Computes route distance, duration, ETA, and polyline waypoints between pickup and destination.
   */
  async calculateRouteMetrics(pickupAddress, destAddress) {
    const pickupCoords = await this.geocodeAddress(pickupAddress)
    const destCoords = await this.geocodeAddress(destAddress)

    // Try Google Directions API if SDK is loaded
    if (this.isGoogleLoaded()) {
      try {
        const directionsService = new window.google.maps.DirectionsService()
        const res = await directionsService.route({
          origin: pickupCoords,
          destination: destCoords,
          travelMode: window.google.maps.TravelMode.DRIVING
        })
        if (res.routes && res.routes.length > 0) {
          const leg = res.routes[0].legs[0]
          const distKm = Number((leg.distance.value / 1000).toFixed(1))
          const durMin = Math.ceil(leg.duration.value / 60)
          const polyline = res.routes[0].overview_path.map((p) => ({ lat: p.lat(), lng: p.lng() }))
          return {
            distanceKm: distKm,
            durationMin: durMin,
            etaText: `${durMin} mins`,
            pickupCoords: { lat: leg.start_location.lat(), lng: leg.start_location.lng(), name: leg.start_address },
            destCoords: { lat: leg.end_location.lat(), lng: leg.end_location.lng(), name: leg.end_address },
            polylineCoords: polyline
          }
        }
      } catch (err) {
        console.warn('Google Directions API failed, using geodesic route engine:', err)
      }
    }

    // Geodesic Route & Polyline Generator
    const rawDist = this.getHaversineDistance(pickupCoords.lat, pickupCoords.lng, destCoords.lat, destCoords.lng)
    const distKm = Number(Math.max(1.2, rawDist * 1.35).toFixed(1)) // 1.35x factor for Manhattan/city road routing
    const durMin = Math.max(3, Math.ceil((distKm / 28) * 60)) // Assuming ~28 km/h city average speed

    // Generate smooth polyline waypoints between start and end with realistic road curve inflection
    const numPoints = Math.max(15, Math.floor(distKm * 6))
    const polyline = []
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints
      // Linear interpolation plus a slight sinusoidal curve to mimic highway/avenue routing
      const curveLat = Math.sin(t * Math.PI) * 0.005 * (pickupCoords.lng > destCoords.lng ? 1 : -1)
      const curveLng = Math.sin(t * Math.PI) * 0.005 * (pickupCoords.lat > destCoords.lat ? -1 : 1)
      polyline.push({
        lat: pickupCoords.lat + (destCoords.lat - pickupCoords.lat) * t + curveLat,
        lng: pickupCoords.lng + (destCoords.lng - pickupCoords.lng) * t + curveLng
      })
    }

    return {
      distanceKm: distKm,
      durationMin: durMin,
      etaText: `${durMin} mins`,
      pickupCoords,
      destCoords,
      polylineCoords: polyline
    }
  },

  /**
   * Automatic Fare Calculation: Computes precise fare based on vehicle type and route distance/time.
   */
  calculateFare(vehicle, distanceKm = 8, durationMin = 15) {
    const base = vehicle?.basePrice || 5.00
    const pricePerKm = vehicle?.pricePerKm || 1.50
    const pricePerMin = vehicle?.pricePerMin || 0.30
    const total = base + distanceKm * pricePerKm + durationMin * pricePerMin
    return Number(total.toFixed(2))
  },

  /**
   * Generates a sequence of coordinates along a polyline for live driver movement simulation.
   */
  generateSimulationTrajectory(startCoords, endCoords, steps = 30) {
    const trajectory = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const lat = startCoords.lat + (endCoords.lat - startCoords.lat) * t
      const lng = startCoords.lng + (endCoords.lng - startCoords.lng) * t
      trajectory.push({ lat, lng, progress: Math.round(t * 100) })
    }
    return trajectory
  }
}

export default googleMapsService
