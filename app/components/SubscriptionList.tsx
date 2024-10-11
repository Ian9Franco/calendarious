import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Subscription } from './Types'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  deleteSubscription: (subscription: Subscription) => void
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, deleteSubscription }) => {
  return (
    <AnimatePresence>
      {subscriptions.map((subscription) => (
        <motion.div
          key={`${subscription.name}-${subscription.date}`}
          className="py-4 px-4 border-b border-gray-800 last:border-b-0 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                {subscription.name === 'Spotify' ? (
                  <Image
                    src="/brand/spotify.png"
                    alt={subscription.name}
                    width={24}
                    height={24}
                  />
                ) : (
                  <subscription.icon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{subscription.name}</h3>
                <p className="text-sm text-gray-400">Every {subscription.date}th</p>
              </div>
            </div>
            <span className="text-xl font-bold text-white">€{subscription.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div>
              <p className="text-gray-400">Next payment</p>
              <p className="text-white">
                {new Date(subscription.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Total since {new Date(subscription.startDate).toLocaleDateString()}</p>
              <p className="text-white">€{subscription.totalSpent.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => deleteSubscription(subscription)}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              Cancel Subscription
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
            >
              Pause
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default SubscriptionList