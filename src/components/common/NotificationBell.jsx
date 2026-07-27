import React, { useState, useEffect, useRef } from 'react'
import { notificationService } from '../../services/notificationService'
import { useAuth } from '../../context/AuthContext'
import './NotificationBell.css'

/**
 * NotificationBell Component
 * Reusable real-time push alert menu subscribing to Firestore notifications via onSnapshot.
 * Displays unread badge instantly and allows marking items as read.
 */
const NotificationBell = () => {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = notificationService.subscribeToUserNotifications(
      currentUser?.uid,
      (notifs) => {
        setNotifications(notifs)
        setLoading(false)
      },
      (err) => {
        console.error('Realtime notification bell error:', err)
        setLoading(false)
      }
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [currentUser?.uid])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = async () => {
    const unreadList = notifications.filter((n) => !n.read)
    for (const item of unreadList) {
      try {
        await notificationService.markAsRead(item.id, true)
      } catch (err) {
        console.error('Error marking read:', err)
      }
    }
  }

  const handleItemClick = async (notif) => {
    if (!notif.read && notif.id) {
      try {
        await notificationService.markAsRead(notif.id, true)
      } catch (err) {
        console.error('Error marking item read:', err)
      }
    }
  }

  const getNotifIcon = (type) => {
    switch (type) {
      case 'ride':
        return '🚕'
      case 'alert':
        return '🚨'
      case 'promo':
        return '🎁'
      case 'info':
      default:
        return '🔔'
    }
  }

  return (
    <div className="notif-bell-container" ref={menuRef}>
      <button
        type="button"
        className="btn-notif-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Real-Time Notifications"
        aria-label="Notifications"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="notif-unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown-menu">
          <div className="notif-dropdown-header">
            <span className="notif-dropdown-title">
              <span>🔔</span>
              <span>Live Alerts ({unreadCount} New)</span>
            </span>
            {unreadCount > 0 && (
              <button type="button" className="btn-mark-all" onClick={handleMarkAllRead}>
                Mark All Read
              </button>
            )}
          </div>

          <div className="notif-list-body">
            {loading ? (
              <div className="notif-empty-state">⏳ Loading live alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty-state">No notifications right now. You're all caught up!</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleItemClick(notif)}
                >
                  <div className="notif-icon-box">{getNotifIcon(notif.type)}</div>
                  <div className="notif-content-box">
                    <div className="notif-item-title">
                      <span>{notif.title}</span>
                      <span className="notif-item-time">{notif.time || 'New'}</span>
                    </div>
                    <div className="notif-item-msg">{notif.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
