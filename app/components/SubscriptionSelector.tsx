import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconContext } from 'react-icons'
import { Subscription, availableSubscriptions, ibmPlexMonoBold, ibmPlexMonoBoldItalic } from './Types'

type SubscriptionSelectorProps = {
  selectedDate: number | null
  subscriptions: Subscription[]
  addSubscription: (subscription: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>, date: number) => void
  deleteSubscription: (subscription: Subscription) => void
  onClose: () => void
}

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  selectedDate,
  subscriptions,
  addSubscription,
  deleteSubscription,
  onClose,
}) => {
  if (!selectedDate) return null

  const handleSubscriptionClick = (sub: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>) => {
    const existingSub = subscriptions.find(s => s.name === sub.name && s.date === selectedDate)
    if (existingSub) {
      deleteSubscription(existingSub)
    } else {
      addSubscription(sub, selectedDate)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-90 p-4 rounded-lg shadow-lg z-20 max-w-md w-full"
      style={{ border: '2px solid #5E6AD2' }}
    >
      <h3 className={`text-lg font-bold mb-4 ${ibmPlexMonoBoldItalic.className}`}>
        Manage subscriptions for {selectedDate}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
        <AnimatePresence>
          {availableSubscriptions.map(sub => {
            const existingSub = subscriptions.find(s => s.name === sub.name && s.date === selectedDate)
            return (
              <motion.button
                key={sub.name}
                className={`p-2 rounded-lg text-center text-white ${existingSub ? 'bg-red-500' : ''}`}
                style={{ backgroundColor: existingSub ? undefined : sub.color }}
                onClick={() => handleSubscriptionClick(sub)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <IconContext.Provider value={{ size: '1.5em' }}>
                  <sub.icon />
                </IconContext.Provider>
                <p className={`mt-1 text-xs ${ibmPlexMonoBold.className}`}>{sub.name}</p>
                <p className="text-xs">${sub.amount}</p>
                {existingSub && <p className="text-xs">Remove</p>}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
      <motion.button
        className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg"
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Close
      </motion.button>
    </motion.div>
  )
}

export default SubscriptionSelector