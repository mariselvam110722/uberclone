import React, { useState, useEffect } from 'react'
import { driverService } from '../../services/driverService'
import './VehicleSelector.css'

/**
 * VehicleSelector Component
 * Reusable component displaying available ride options with real-time fare calculation.
 * Subscribes via onSnapshot to live online/offline driver availability updates.
 */
const VehicleSelector = ({
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle,
  distance = 8,
  duration = 15
}) => {
  const [onlineDriversCount, setOnlineDriversCount] = useState(0)
  const [loadingDrivers, setLoadingDrivers] = useState(true)

  useEffect(() => {
    const unsubscribe = driverService.subscribeToAllDrivers(
      (drivers) => {
        const activeCount = drivers.filter((d) => d.isOnline || d.status === 'Active').length
        setOnlineDriversCount(activeCount)
        setLoadingDrivers(false)
      },
      (err) => {
        console.error('Realtime driver availability error in VehicleSelector:', err)
        setLoadingDrivers(false)
      }
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const calculateFare = (vehicle) => {
    const base = vehicle.basePrice || 5
    const distCost = distance * (vehicle.pricePerKm || 1.5)
    const timeCost = duration * (vehicle.pricePerMin || 0.3)
    const total = base + distCost + timeCost
    return total.toFixed(2)
  }

  return (
    <div className="vehicle-selector-container">
      <div className="vehicle-selector-header">
        <div>
          <span>🚘 Select a Ride</span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: onlineDriversCount > 0 ? '#2e7d32' : '#e65100', marginTop: '2px' }}>
            {loadingDrivers ? '⏳ Scanning live driver availability...' : `🟢 ${onlineDriversCount} Active Driver${onlineDriversCount === 1 ? '' : 's'} Online & Ready for Pickup`}
          </div>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#666' }}>
          Estimated based on {distance} km • {duration} mins
        </span>
      </div>

      <div className="vehicle-list">
        {vehicles.map((veh) => {
          const isSelected = veh.id === selectedVehicleId
          const calculatedPrice = calculateFare(veh)

          return (
            <div
              key={veh.id}
              className={`vehicle-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectVehicle(veh, parseFloat(calculatedPrice))}
              role="button"
              tabIndex={0}
            >
              <div className="vehicle-card-left">
                <div className="vehicle-img-box">
                  <img src={veh.image} alt={veh.name} className="vehicle-img" />
                </div>
                <div className="vehicle-details">
                  <div className="vehicle-title-row">
                    <span className="vehicle-name">{veh.name}</span>
                    <span className="vehicle-capacity">👤 {veh.capacity}</span>
                    {veh.badge && <span className="vehicle-badge">{veh.badge}</span>}
                  </div>
                  <div className="vehicle-desc">{veh.desc}</div>
                  <div className="vehicle-meta-row">
                    <span>⏱️ {veh.eta} {onlineDriversCount > 0 ? `(${onlineDriversCount} nearby)` : '(Fleet searching)'}</span>
                    <span>• {veh.co2}</span>
                  </div>
                </div>
              </div>

              <div className="vehicle-card-right">
                <div className="vehicle-price">${calculatedPrice}</div>
                <div className="vehicle-price-est">Est. Total Fare</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VehicleSelector
