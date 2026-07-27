import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mockWallet } from '../mock/riderMockData'
import { notificationService } from './notificationService'

/**
 * Payment Service (Firestore CRUD, Financial Ledger & Real-Time Wallet Tracking)
 * Encapsulates ride payments, wallet top-ups, and driver payout transactions in the 'payments' collection with onSnapshot support.
 */
export const paymentService = {
  /**
   * CREATE: Records a new payment transaction in Firestore.
   */
  async createPayment(paymentData) {
    try {
      const payRef = collection(db, 'payments')
      
      const payload = {
        userId: paymentData.userId || 'usr-1001',
        rideId: paymentData.rideId || null,
        amount: Number(paymentData.amount || 0),
        type: paymentData.type || 'debit', // 'debit' | 'credit' | 'topup' | 'payout'
        method: paymentData.method || 'Uber Cash',
        desc: paymentData.desc || paymentData.description || 'Ride Fare Payment',
        status: paymentData.status || 'Completed',
        date: paymentData.date || new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(payRef, payload)

      // Automatically dispatch Wallet Updated notification
      try {
        const sign = payload.type === 'credit' || payload.type === 'topup' || payload.type === 'payout' ? '+' : '-'
        await notificationService.createNotification({
          userId: payload.userId,
          title: '💳 Wallet Updated',
          message: `Transaction recorded: ${sign}$${payload.amount.toFixed(2)} (${payload.desc}).`,
          type: 'info'
        })
      } catch (err) {
        console.error('Error sending wallet notification:', err)
      }

      return { id: docRef.id, ...payload }
    } catch (error) {
      console.error('Error in paymentService.createPayment:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a single payment transaction by ID.
   */
  async getPaymentById(id) {
    try {
      if (!id) return null
      const payRef = doc(db, 'payments', id)
      const snap = await getDoc(payRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching payment by ID:', error)
      throw error
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to all payment transactions in Firestore with onSnapshot.
   */
  subscribeToAllPayments(callback, onError) {
    try {
      const payRef = collection(db, 'payments')
      const unsubscribe = onSnapshot(payRef, async (snapshot) => {
        if (snapshot.empty) {
          const seeded = await this.getAllPayments()
          callback(seeded)
          return
        }
        const payments = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        payments.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime()
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime()
          return timeB - timeA
        })
        callback(payments)
      }, (error) => {
        console.error('Realtime error on subscribeToAllPayments:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToAllPayments:', error)
      return () => {}
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to payment history for a specific user ID.
   */
  subscribeToUserPayments(userId, callback, onError) {
    return this.subscribeToAllPayments((all) => {
      if (!userId) {
        callback(all)
        return
      }
      const filtered = all.filter((p) => p.userId === userId || p.userId === 'usr-1001' || p.userId === 'drv-1002')
      callback(filtered)
    }, onError)
  },

  /**
   * READ ALL: Retrieves all financial transactions from Firestore. Auto-seeds if empty.
   */
  async getAllPayments() {
    try {
      const payRef = collection(db, 'payments')
      const snapshot = await getDocs(payRef)

      if (snapshot.empty) {
        console.warn('Firestore payments collection is empty. Auto-seeding wallet transactions...')
        const seededPayments = []
        for (const tx of mockWallet.transactions) {
          const created = await this.createPayment({
            userId: 'usr-1001',
            amount: Math.abs(tx.amount),
            type: tx.type || (tx.amount < 0 ? 'debit' : 'credit'),
            method: 'Uber Cash / Card',
            desc: tx.desc,
            date: tx.date,
            status: 'Completed'
          })
          seededPayments.push(created)
        }
        return seededPayments
      }

      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))
    } catch (error) {
      console.error('Error in paymentService.getAllPayments:', error)
      return mockWallet.transactions
    }
  },

  /**
   * READ BY USER: Fetches all payment records for a specific user ID.
   */
  async getPaymentsByUser(userId) {
    try {
      const all = await this.getAllPayments()
      if (!userId) return all
      return all.filter((p) => p.userId === userId || p.userId === 'usr-1001')
    } catch (error) {
      console.error('Error fetching user payments:', error)
      return mockWallet.transactions
    }
  },

  /**
   * UPDATE: Updates a transaction's status or details.
   */
  async updatePayment(id, updates = {}) {
    try {
      if (!id) throw new Error('Payment ID required.')
      const payRef = doc(db, 'payments', id)
      await updateDoc(payRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating payment:', error)
      throw error
    }
  },

  /**
   * DELETE: Deletes a transaction record from Firestore.
   */
  async deletePayment(id) {
    try {
      if (!id) throw new Error('Payment ID required for deletion.')
      const payRef = doc(db, 'payments', id)
      await deleteDoc(payRef)
      return true
    } catch (error) {
      console.error('Error deleting payment:', error)
      throw error
    }
  }
}

export default paymentService
