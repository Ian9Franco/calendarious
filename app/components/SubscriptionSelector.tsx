import React from 'react'
import { motion } from 'framer-motion'
import { IconContext } from 'react-icons'
import { Subscription } from './Types'

interface SubscriptionSelectorProps {
  selectedDate: number | null
  subscriptions: Subscription[]
  addSubscription: (subscription: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>, date: number) => void
  onClose: () => void
  availableSubscriptions: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>[]
}

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  selectedDate,
  addSubscription,
  onClose,
  availableSubscriptions,
}) => {
  const handleAddSubscription = (subscription: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>) => {
    if (selectedDate) {
      addSubscription(subscription, selectedDate)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Add Subscription</h2>
        <div className="space-y-2">
          {availableSubscriptions.map((subscription) => (
            <button
              key={subscription.name}
              onClick={() => handleAddSubscription(subscription)}
              className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-between transition-colors"
            >
              <div className="flex items-center">
                <IconContext.Provider value={{ size: '1.5em', color: subscription.color }}>
                  <subscription.icon />
                </IconContext.Provider>
                <span className="text-white ml-2">{subscription.name}</span>
              </div>
              <div className="text-right">
                <span className="text-green-400">€{subscription.amount.toFixed(2)}</span>
                <span className="text-gray-400 text-sm block">{subscription.frequency}</span>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

export default SubscriptionSelector