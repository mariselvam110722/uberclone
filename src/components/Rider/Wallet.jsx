import { useState, useEffect } from 'react'
import { mockWallet } from '../../mock/riderMockData'
import { paymentService } from '../../services/paymentService'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import './Wallet.css'

/**
 * Wallet Component (Page/Tab)
 * Manages rider Uber Cash balance, quick deposit simulation, payment methods, and real-time Firestore transaction ledger.
 * Subscribes via onSnapshot so whenever payments change, balance and transaction list update automatically without page refresh.
 */
const Wallet = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth()
  const [balance, setBalance] = useState(userProfile?.wallet !== undefined ? userProfile.wallet : mockWallet.balance)
  const [paymentMethods, setPaymentMethods] = useState(mockWallet.paymentMethods)
  const [transactions, setTransactions] = useState([])
  const [loadingTx, setLoadingTx] = useState(true)
  const [errorTx, setErrorTx] = useState(null)

  useEffect(() => {
    if (userProfile?.wallet !== undefined) {
      setBalance(userProfile.wallet)
    }
  }, [userProfile?.wallet])

  useEffect(() => {
    setLoadingTx(true)
    setErrorTx(null)

    // REAL-TIME ONSNAPSHOT LISTENER for user payments
    const unsubscribe = paymentService.subscribeToUserPayments(
      currentUser?.uid,
      (userTxs) => {
        const formatted = userTxs.map((t) => ({
          id: t.id,
          description: t.desc || t.description || 'Wallet Transaction',
          amount: Number(t.amount || 0),
          date: t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent'),
          type: t.type || 'debit',
          status: t.status || 'Completed'
        }))
        setTransactions(formatted)
        setLoadingTx(false)
      },
      (err) => {
        console.error('Realtime error loading wallet transactions:', err)
        setErrorTx('Failed to sync live wallet transactions.')
        setLoadingTx(false)
      }
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [currentUser?.uid])

  const handleAddFunds = async (amount) => {
    const newBalance = balance + amount
    setBalance(newBalance)

    try {
      // Record transaction in Firestore (onSnapshot will automatically refresh transaction list and generate push notification!)
      await paymentService.createPayment({
        userId: currentUser?.uid || 'usr-1001',
        amount: amount,
        type: 'credit',
        method: 'Visa •••• 4242',
        desc: `Added Uber Cash Top-Up`,
        status: 'Completed'
      })

      // Update wallet balance on user profile in Firestore
      if (currentUser?.uid) {
        await userService.updateUserProfile(currentUser.uid, { wallet: newBalance })
        await refreshProfile()
      }

      alert(`🎉 Successfully added $${amount.toFixed(2)} to your Uber Cash Wallet in Firestore! New balance: $${newBalance.toFixed(2)}`)
    } catch (err) {
      console.error('Error adding funds in Firestore:', err)
      alert(`🎉 Added $${amount.toFixed(2)} to your wallet! (Local state mode)`)
    }
  }

  const handleSetDefaultPM = (id) => {
    const updated = paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id
    }))
    setPaymentMethods(updated)
  }

  return (
    <div className="wallet-container">
      <div className="wallet-header">💳 Uber Wallet & Payment Methods (Real-Time Live Sync)</div>
      {errorTx && <div style={{ color: '#d32f2f', fontSize: '14px', marginBottom: '8px' }}>⚠️ {errorTx}</div>}

      <div className="wallet-balance-card">
        <div className="balance-left">
          <span className="balance-label">Uber Cash Balance (Live)</span>
          <span className="balance-amount">${balance.toFixed(2)}</span>
        </div>
        <div className="add-funds-box">
          {[20, 50, 100].map((amt) => (
            <button
              key={amt}
              type="button"
              className="btn-add-fund"
              onClick={() => handleAddFunds(amt)}
            >
              + ${amt}
            </button>
          ))}
          <button
            type="button"
            className="btn-add-fund"
            style={{ background: '#0070f3', color: '#fff' }}
            onClick={() => {
              const custom = prompt('Enter custom amount to add ($):', '25')
              if (custom && !isNaN(custom) && Number(custom) > 0) {
                handleAddFunds(Number(custom))
              }
            }}
          >
            + Custom
          </button>
        </div>
      </div>

      <div className="wallet-section-title">Saved Payment Methods</div>
      <div className="payment-methods-grid">
        {paymentMethods.map((pm) => (
          <div key={pm.id} className={`pm-card ${pm.isDefault ? 'default' : ''}`}>
            <div className="pm-left">
              <span className="pm-icon">{pm.icon}</span>
              <div>
                <div className="pm-label">{pm.label}</div>
                <div className="pm-sub">Expires: {pm.expiry}</div>
              </div>
            </div>
            <div>
              {pm.isDefault ? (
                <span className="pm-default-badge">Default</span>
              ) : (
                <button
                  type="button"
                  className="btn-set-default"
                  onClick={() => handleSetDefaultPM(pm.id)}
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="wallet-section-title">Recent Transactions (Real-Time Ledger)</div>
      <div className="transactions-list">
        {loadingTx ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>⏳ Syncing transactions via onSnapshot...</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No recent transactions found.</div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="tx-row">
              <div>
                <div className="tx-desc">{tx.description}</div>
                <div className="tx-date">{tx.date} • {tx.status}</div>
              </div>
              <div className={`tx-amount ${tx.type}`}>
                {tx.type === 'credit' || tx.type === 'topup' ? `+$${Math.abs(tx.amount).toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Wallet
