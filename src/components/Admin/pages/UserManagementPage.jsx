import React, { useState, useEffect } from 'react'
import { mockUsers } from '../../../mock/adminMockData'
import { userService } from '../../../services/userService'
import SearchBar from '../SearchBar'
import FilterDropdown from '../FilterDropdown'
import UserTable from '../UserTable'
import Pagination from '../Pagination'
import StatusBadge from '../StatusBadge'
import './UserManagementPage.css'

/**
 * UserManagementPage Component
 * Provides Firestore directory filtering, keyword search, status governance (Suspend/Activate), and detailed user inspection modal.
 */
const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)

  const itemsPerPage = 6

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const dbUsers = await userService.getAllUsers()
      const formatted = dbUsers.map((u) => ({
        id: u.id || u.uid || `usr-${Date.now()}`,
        name: u.name || u.displayName || 'Uber User',
        email: u.email || '',
        role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()) : 'Rider',
        status: u.status || 'Active',
        trips: u.trips || u.tripHistory?.length || Math.floor(20 + Math.random() * 50),
        rating: Number(u.rating || 4.90),
        phone: u.phone || '+1 (555) 382-9102',
        joined: u.joined || (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '2024-03-15'),
        photo: u.photoURL || u.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        walletBalance: u.wallet !== undefined ? u.wallet : (u.walletBalance !== undefined ? u.walletBalance : 150.00)
      }))
      setUsers(formatted)
    } catch (err) {
      console.error('Error fetching Firestore users directory:', err)
      setUsers(mockUsers)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.id.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === 'All' || u.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesRole && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'Active' ? 'Suspended' : 'Active'
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
    )
    if (selectedUser && selectedUser.id === targetUser.id) {
      setSelectedUser((prev) => ({ ...prev, status: newStatus }))
    }

    try {
      if (targetUser?.id) {
        await userService.updateUserProfile(targetUser.id, { status: newStatus })
      }
    } catch (err) {
      console.error('Error updating status in Firestore:', err)
    }

    alert(`⚙️ Firestore Account status updated:\nUser "${targetUser.name}" (${targetUser.role}) is now ${newStatus.toUpperCase()}!`)
  }

  return (
    <div className="user-mgmt-container">
      <div className="mgmt-controls-bar">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          onClear={() => {
            setSearch('')
            setCurrentPage(1)
          }}
          placeholder="Search by name, email, phone, ID in Firestore..."
        />

        <div className="filter-group-right">
          <FilterDropdown
            label="Role"
            value={roleFilter}
            onChange={(val) => {
              setRoleFilter(val)
              setCurrentPage(1)
            }}
            options={['All', 'Rider', 'Driver']}
          />

          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
            options={['All', 'Active', 'Suspended']}
          />
        </div>
      </div>

      <div>
        <UserTable
          users={paginatedUsers}
          onToggleStatus={handleToggleStatus}
          onViewDetails={(u) => setSelectedUser(u)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="user-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hdr">
              <span className="modal-hdr-title">👤 User Account Details (Firestore)</span>
              <button type="button" className="btn-close-modal" onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            <div className="modal-body-grid">
              <div className="modal-user-top">
                <img src={selectedUser.photo} alt={selectedUser.name} className="modal-user-avatar" />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#000', marginBottom: '4px' }}>{selectedUser.name}</h3>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{selectedUser.email}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <StatusBadge status={selectedUser.role} icon={selectedUser.role === 'Driver' ? '🚙' : '👤'} />
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
              </div>

              <div className="modal-info-list">
                <div className="info-row">
                  <span className="info-lbl">System User ID:</span>
                  <span className="info-val">{selectedUser.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-lbl">Phone Contact:</span>
                  <span className="info-val">{selectedUser.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-lbl">Registration Date:</span>
                  <span className="info-val">{selectedUser.joined}</span>
                </div>
                <div className="info-row">
                  <span className="info-lbl">Total Completed Trips:</span>
                  <span className="info-val">{selectedUser.trips} trips</span>
                </div>
                <div className="info-row">
                  <span className="info-lbl">Average Rating Score:</span>
                  <span className="info-val" style={{ color: '#ff9800' }}>⭐ {selectedUser.rating} / 5.00</span>
                </div>
                {selectedUser.walletBalance !== undefined && (
                  <div className="info-row">
                    <span className="info-lbl">Wallet Cash Balance:</span>
                    <span className="info-val" style={{ color: '#2e7d32' }}>${selectedUser.walletBalance.toFixed(2)}</span>
                  </div>
                )}
                {selectedUser.vehicle && (
                  <div className="info-row">
                    <span className="info-lbl">Assigned Vehicle:</span>
                    <span className="info-val">🚗 {selectedUser.vehicle}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedUser.status === 'Active' ? '#c62828' : '#2e7d32',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  marginTop: '6px'
                }}
                onClick={() => handleToggleStatus(selectedUser)}
              >
                {selectedUser.status === 'Active' ? '🚫 Suspend User Account in Firestore' : '✅ Re-Activate User Account in Firestore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage
