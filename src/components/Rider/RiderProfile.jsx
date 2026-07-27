import { useState } from 'react'
import { mockRiderProfile } from '../../mock/riderMockData'
import './RiderProfile.css'

/**
 * RiderProfile Component (Page/Tab)
 * Displays user identity, rating, membership status, saved addresses, and interactive trip preferences.
 */
const RiderProfile = () => {
  const [profile] = useState(mockRiderProfile)
  const [addresses, setAddresses] = useState(mockRiderProfile.savedAddresses)
  const [preferences, setPreferences] = useState(mockRiderProfile.preferences)

  const handleAddAddress = () => {
    const title = prompt('Enter Location Title (e.g. Favorite Cafe):', 'Cafe')
    if (!title) return
    const address = prompt('Enter Full Address:', '123 Market St, San Francisco, CA')
    if (!address) return

    const newAddr = {
      id: `addr-${Date.now()}`,
      title,
      address,
      icon: '📍',
      note: 'Added via Rider Dashboard'
    }

    setAddresses([...addresses, newAddr])
  }

  const handleTogglePref = (id) => {
    const updated = preferences.map((pref) => {
      if (pref.id === id) {
        const nextVal = pref.value.includes('Preferred') || pref.value.includes('Required') || pref.value.includes('Cool')
          ? 'Standard / Any'
          : pref.title === 'Temperature' ? 'Cool (68°F)' : 'Preferred'
        return { ...pref, value: nextVal }
      }
      return pref
    })
    setPreferences(updated)
  }

  return (
    <div className="profile-container">
      <div className="profile-hero-card">
        <div className="profile-avatar-box">
          <img src={profile.photo} alt={profile.name} className="profile-avatar-img" />
          <span className="profile-tier-badge">Platinum</span>
        </div>
        <div className="profile-main-info">
          <div className="profile-name">{profile.name}</div>
          <div className="profile-email">{profile.email}</div>
          <div className="profile-phone">{profile.phone}</div>
          <div className="profile-stats-row">
            <div className="stat-box">
              <div className="stat-val">⭐ {profile.rating}</div>
              <div className="stat-lbl">Rider Rating</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">{profile.totalTrips}</div>
              <div className="stat-lbl">Total Trips</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">{profile.memberSince}</div>
              <div className="stat-lbl">Member Since</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-hdr-row">
        <span className="section-title">📍 Saved Addresses</span>
        <button type="button" className="btn-add-item" onClick={handleAddAddress}>
          + Add New Address
        </button>
      </div>

      <div className="addresses-grid">
        {addresses.map((addr) => (
          <div key={addr.id} className="addr-card">
            <div className="addr-top">
              <span className="addr-icon">{addr.icon}</span>
              <div>
                <div className="addr-title">{addr.title}</div>
                <div className="addr-text">{addr.address}</div>
                {addr.note && <div className="addr-note">📝 {addr.note}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-hdr-row">
        <span className="section-title">⚙️ Ride Preferences</span>
        <span style={{ fontSize: '13px', color: '#666' }}>Customizes driver experience before pickup</span>
      </div>

      <div className="preferences-list">
        {preferences.map((pref) => (
          <div key={pref.id} className="pref-row">
            <div className="pref-left">
              <span className="pref-icon">{pref.icon}</span>
              <div>
                <div className="pref-title">{pref.title}</div>
                <div className="pref-desc">{pref.desc}</div>
              </div>
            </div>
            <button
              type="button"
              className="btn-pref-toggle"
              onClick={() => handleTogglePref(pref.id)}
            >
              {pref.value}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiderProfile
