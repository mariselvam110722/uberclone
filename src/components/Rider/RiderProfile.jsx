import { useState, useEffect } from 'react'
import { mockRiderProfile } from '../../mock/riderMockData'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import './RiderProfile.css'

/**
 * RiderProfile Component (Page/Tab)
 * Displays user identity, rating, membership status, saved addresses, and Firestore-synced interactive trip preferences.
 */
const RiderProfile = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth()
  const [profile, setProfile] = useState(mockRiderProfile)
  const [addresses, setAddresses] = useState(userProfile?.savedAddresses || mockRiderProfile.savedAddresses)
  const [preferences, setPreferences] = useState(userProfile?.preferencesList || mockRiderProfile.preferences)

  useEffect(() => {
    if (userProfile) {
      setProfile({
        ...mockRiderProfile,
        name: userProfile.displayName || mockRiderProfile.name,
        email: userProfile.email || mockRiderProfile.email,
        phone: userProfile.phone || mockRiderProfile.phone,
        rating: userProfile.rating || mockRiderProfile.rating,
        photo: userProfile.photoURL || mockRiderProfile.photo
      })
      if (userProfile.savedAddresses) setAddresses(userProfile.savedAddresses)
      if (userProfile.preferencesList) setPreferences(userProfile.preferencesList)
    }
  }, [userProfile])

  const handleAddAddress = async () => {
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

    const updatedAddresses = [...addresses, newAddr]
    setAddresses(updatedAddresses)

    if (currentUser?.uid) {
      try {
        await userService.updateUserProfile(currentUser.uid, { savedAddresses: updatedAddresses })
        await refreshProfile()
      } catch (err) {
        console.error('Error updating addresses in Firestore:', err)
      }
    }
  }

  const handleTogglePref = async (id) => {
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

    if (currentUser?.uid) {
      try {
        await userService.updateUserProfile(currentUser.uid, { preferencesList: updated })
        await refreshProfile()
      } catch (err) {
        console.error('Error updating preferences in Firestore:', err)
      }
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-hero-card">
        <div className="profile-avatar-box">
          <img src={profile.photo} alt={profile.name} className="profile-avatar-img" />
          <span className="profile-tier-badge">Platinum</span>
        </div>
        <div className="profile-main-info">
          <div className="profile-name">{profile.name} (Firestore Synced)</div>
          <div className="profile-email">{profile.email}</div>
          <div className="profile-phone">{profile.phone}</div>
          <div className="profile-stats-row">
            <div className="stat-box">
              <div className="stat-val">⭐ {profile.rating}</div>
              <div className="stat-lbl">Rider Rating</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">{userProfile?.tripHistory?.length || profile.totalTrips}</div>
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
