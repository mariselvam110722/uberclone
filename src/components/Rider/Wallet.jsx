import { useState } from 'react'
import { mockWallet } from '../../mock/riderMockData'
import './Wallet.css'

/**
 * Wallet Component (Page/Tab)
 * Manages rider Uber Cash balance, quick deposit simulation, payment methods, and transaction log.
 */
const Wallet = () => {
  const [balance, setBalance] = useState(mockWallet.balance)
  const [paymentMethods, setPaymentMethods] = useState(mockWallet.paymentMethods)
  const [transactions, setTransactions] = useState(mockWallet.transactions)

  const handleAddFunds = (amount) => {
    const newBalance = balance + amount
    setBalance(newBalance)

    const newTx = {
      id: `tx-${Date.now()}`,
      description: `Added Uber Cash via Visa •••• 4242`,
      amount: amount,
      date: 'Just now',
      type: 'credit',
      status: 'Completed'
    }

    setTransactions([newTx, ...transactions])
    alert(`🎉 Successfully added $${amount.toFixed(2)} to your Uber Cash Wallet! New balance: $${newBalance.toFixed(2)}`)
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
      <div className="wallet-header">💳 Uber Wallet & Payment Methods</div>

      <div className="wallet-balance-card">
        <div className="balance-left">
          <span className="balance-label">Uber Cash Balance</span>
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

      <div className="wallet-section-title">Recent Transactions</div>
      <div className="transactions-list">
        {transactions.map((tx) => (
          <div key={tx.id} className="tx-row">
            <div>
              <div className="tx-desc">{tx.description}</div>
              <div className="tx-date">{tx.date} • {tx.status}</div>
            </div>
            <div className={`tx-amount ${tx.type}`}>
              {tx.type === 'credit' ? `+$${Math.abs(tx.amount).toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wallet
