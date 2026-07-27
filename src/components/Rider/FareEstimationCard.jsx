import { useState } from 'react'
import './FareEstimationCard.css'

/**
 * FareEstimationCard Component
 * Reusable component presenting a detailed cost breakdown, promo code application, and final ride confirmation trigger.
 */
const FareEstimationCard = ({
  vehicle,
  distance = 8,
  duration = 15,
  onConfirmBooking,
  disabled = false
}) => {
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoMsg, setPromoMsg] = useState({ text: '', type: '' })

  if (!vehicle) {
    return (
      <div className="fare-card-container" style={{ textAlign: 'center', color: '#888', padding: '32px' }}>
        <span>👈 Please select a vehicle above to view fare estimation breakdown</span>
      </div>
    )
  }

  const basePrice = vehicle.basePrice || 5.00
  const distCharge = distance * (vehicle.pricePerKm || 1.5)
  const timeCharge = duration * (vehicle.pricePerMin || 0.3)
  const subtotal = basePrice + distCharge + timeCharge
  const surgeMultiplier = 1.0 // Normal demand
  const totalBeforeDiscount = subtotal * surgeMultiplier
  const finalTotal = Math.max(0, totalBeforeDiscount - discount)

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase()
    if (code === 'UBER5' || code === 'WELCOME' || code === 'SMART5') {
      setDiscount(5.00)
      setPromoMsg({ text: '🎉 Promo code applied! $5.00 discount added.', type: 'success' })
    } else if (code === 'VIP10') {
      setDiscount(10.00)
      setPromoMsg({ text: '🌟 VIP Promo applied! $10.00 discount added.', type: 'success' })
    } else {
      setDiscount(0)
      setPromoMsg({ text: '❌ Invalid or expired promo code.', type: 'error' })
    }
  }

  return (
    <div className="fare-card-container">
      <div className="fare-card-header">
        <span>🧾 Fare Estimation ({vehicle.name})</span>
        <span style={{ fontSize: '13px', color: '#0070f3', fontWeight: 600 }}>Surge: 1.0x (Normal)</span>
      </div>

      <div className="fare-breakdown-list">
        <div className="fare-item-row">
          <span>Base Fare</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>
        <div className="fare-item-row">
          <span>Distance Charge ({distance} km)</span>
          <span>${distCharge.toFixed(2)}</span>
        </div>
        <div className="fare-item-row">
          <span>Time Charge ({duration} mins)</span>
          <span>${timeCharge.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="fare-item-row discount">
            <span>Promo Discount ({promoCode.toUpperCase()})</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="fare-total-row">
        <span>Estimated Total</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>

      <div className="promo-section">
        <input
          type="text"
          className="promo-input"
          placeholder="Promo code (try UBER5 or VIP10)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button type="button" className="promo-apply-btn" onClick={handleApplyPromo}>
          Apply
        </button>
      </div>

      {promoMsg.text && (
        <div className={`promo-msg ${promoMsg.type}`}>{promoMsg.text}</div>
      )}

      <button
        type="button"
        className="book-ride-action-btn"
        disabled={disabled}
        onClick={() => onConfirmBooking({
          vehicle,
          basePrice,
          distCharge,
          timeCharge,
          discount,
          total: finalTotal.toFixed(2),
          promoCode: discount > 0 ? promoCode.toUpperCase() : null
        })}
      >
        <span>🚗</span>
        <span>Confirm & Book {vehicle.name} (${finalTotal.toFixed(2)})</span>
      </button>
    </div>
  )
}

export default FareEstimationCard
