import React, { useState, useEffect, useRef } from 'react'
import googleMapsService from '../../services/googleMapsService'
import './UberMap.css'

/**
 * UberMap Component
 * Reusable Google Maps JavaScript API component with Places, Markers, Polyline routing,
 * distance/ETA metrics, and live driver GPS movement simulation.
 * Gracefully renders high-fidelity interactive simulation if Google Maps SDK is in demo/mock mode.
 */
const UberMap = ({
  pickup = '742 Evergreen Terrace, San Francisco, CA',
  destination = 'Union Square, Downtown SF',
  vehicle,
  rideStatus = 'requested',
  showDriverSimulation = true,
  driver,
  isDriverView = false,
  distance,
  duration
}) => {
  const mapRef = useRef(null)
  const googleMapInstance = useRef(null)
  const [isSdkLoaded, setIsSdkLoaded] = useState(false)
  const [routeMetrics, setRouteMetrics] = useState({
    distanceKm: parseFloat(distance) || 8.4,
    durationMin: parseInt(duration) || 16,
    etaText: duration || '16 mins',
    pickupCoords: { lat: 37.7694, lng: -122.4862, name: pickup },
    destCoords: { lat: 37.7879, lng: -122.4074, name: destination },
    polylineCoords: []
  })

  // Driver Simulation Trajectory State
  const [simProgress, setSimProgress] = useState(15) // percentage 0 to 100
  const [isSimulating, setIsSimulating] = useState(showDriverSimulation)

  useEffect(() => {
    let mounted = true
    const initMap = async () => {
      const loaded = await googleMapsService.loadGoogleMapsApi()
      if (mounted) {
        setIsSdkLoaded(loaded)
      }
    }
    initMap()
    return () => { mounted = false }
  }, [])

  // Recalculate route distance, duration, ETA, and polyline coordinates whenever addresses change
  useEffect(() => {
    let mounted = true
    const updateRoute = async () => {
      const metrics = await googleMapsService.calculateRouteMetrics(pickup, destination)
      if (mounted) {
        setRouteMetrics({
          ...metrics,
          distanceKm: parseFloat(distance) || metrics.distanceKm,
          durationMin: parseInt(duration) || metrics.durationMin,
          etaText: duration || metrics.etaText
        })
      }
    }
    updateRoute()
    return () => { mounted = false }
  }, [pickup, destination, distance, duration])

  // Live Driver Movement Simulation Engine
  useEffect(() => {
    if (!showDriverSimulation && rideStatus !== 'accepted' && rideStatus !== 'trip_started' && !isDriverView) {
      return () => {}
    }

    // Advance driver along the polyline path
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 95) {
          // Loop or settle near target
          return rideStatus === 'completed' ? 100 : 10
        }
        return prev + (rideStatus === 'trip_started' ? 4 : 2)
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [showDriverSimulation, rideStatus, isDriverView])

  // Initialize Native Google Maps instance if SDK loaded and DOM ref ready
  useEffect(() => {
    if (!isSdkLoaded || !mapRef.current || !window.google || !window.google.maps) return

    try {
      const center = routeMetrics.pickupCoords
      if (!googleMapInstance.current) {
        googleMapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
            { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }
          ]
        })
      }

      // Draw route directions if DirectionsService available
      const directionsService = new window.google.maps.DirectionsService()
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: googleMapInstance.current,
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#00e676', strokeWeight: 5 }
      })

      directionsService.route({
        origin: routeMetrics.pickupCoords,
        destination: routeMetrics.destCoords,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (res, status) => {
        if (status === 'OK' && res) {
          directionsRenderer.setDirections(res)
        }
      })
    } catch (err) {
      console.warn('Native Google Maps rendering fallback:', err)
    }
  }, [isSdkLoaded, routeMetrics])

  const formatAddressShort = (addr) => {
    if (!addr) return 'Location'
    return addr.split(',')[0]
  }

  const getStatusText = () => {
    if (isDriverView) return `Live GPS Navigation • ${rideStatus}`
    if (rideStatus === 'requested') return '📡 Broadcasting to nearby cabs...'
    if (rideStatus === 'accepted') return `🟢 Driver En Route (${driver?.name || 'Driver'})`
    if (rideStatus === 'driver_arrived') return '🚖 Driver Arrived at Pickup!'
    if (rideStatus === 'trip_started') return '🚀 Trip in Progress to Destination'
    if (rideStatus === 'completed') return '🏁 Trip Completed'
    return '⚡ Smart Route Optimization'
  }

  return (
    <div className="uber-map-container">
      {/* Top Telemetry Header Overlay */}
      <div className="uber-map-header-overlay">
        <div className="map-status-pill">
          <span className="map-live-dot"></span>
          <span>{getStatusText()}</span>
        </div>
        <div className="map-metrics-pill">
          {routeMetrics.distanceKm} km • {routeMetrics.etaText}
        </div>
      </div>

      {/* Native Google Map or High-Fidelity Interactive Simulation Canvas */}
      {isSdkLoaded ? (
        <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '280px' }} />
      ) : (
        <div className="uber-map-canvas-area">
          <div className="map-bg-grid-layer"></div>
          
          <div className="map-road-network">
            <div className="map-road-line horizontal"></div>
            <div className="map-road-line vertical"></div>
            <div className="map-road-line diagonal"></div>
          </div>

          <div className="map-interactive-content">
            {/* Pickup Marker */}
            <div className="map-pin-marker" title={`Pickup: ${pickup}`}>
              <span className="map-pin-icon">📍</span>
              <div className="map-pin-label">{formatAddressShort(pickup)}</div>
            </div>

            {/* Route Polyline Track with Animated Live Driver Car */}
            <div className="map-route-track-box">
              <div className="map-route-fill-line" style={{ width: `${simProgress}%` }}>
                {(showDriverSimulation || isDriverView || rideStatus !== 'requested') && (
                  <div className="map-animated-driver-car" style={{ left: '100%' }}>
                    <div className="map-driver-tooltip">
                      {isDriverView ? 'YOU 🚙' : `${driver?.name || 'Driver'} 🚕`}
                    </div>
                    <span>🚕</span>
                  </div>
                )}
              </div>
            </div>

            {/* Destination Marker */}
            <div className="map-pin-marker" title={`Destination: ${destination}`}>
              <span className="map-pin-icon" style={{ animationDelay: '1.5s' }}>🏁</span>
              <div className="map-pin-label">{formatAddressShort(destination)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Footer Bar */}
      <div className="uber-map-footer-bar">
        <div className="map-footer-loc" title={`${pickup} -> ${destination}`}>
          <span>🗺️ Route:</span>
          <span style={{ color: '#fff' }}>{formatAddressShort(pickup)}</span>
          <span style={{ color: '#0070f3' }}>&rarr;</span>
          <span style={{ color: '#fff' }}>{formatAddressShort(destination)}</span>
        </div>
        <div className="map-footer-badge">
          {isSdkLoaded ? 'Google Maps JS API' : 'Live Simulation SDK'}
        </div>
      </div>
    </div>
  )
}

export default UberMap
