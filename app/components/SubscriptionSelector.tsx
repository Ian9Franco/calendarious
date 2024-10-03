import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconContext } from 'react-icons'
import { Subscription, availableSubscriptions, ibmPlexMonoBold, ibmPlexMonoBoldItalic } from './Types'
import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'

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
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <Dialog.Panel className="fixed inset-0 bg-black opacity-30" />

        <motion.div
          className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Dialog.Title
            as="h3"
            className={`text-lg font-bold mb-4 text-white ${ibmPlexMonoBoldItalic.className}`}
          >
            Manage subscriptions for {selectedDate}
          </Dialog.Title>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {availableSubscriptions.map(sub => {
                const existingSub = subscriptions.find(s => s.name === sub.name && s.date === selectedDate)
                return (
                  <motion.button
                    key={sub.name}
                    className={`p-4 rounded-lg text-center text-white ${
                      existingSub ? 'bg-red-500 hover:bg-red-600' : 'hover:opacity-80'
                    }`}
                    style={{ backgroundColor: existingSub ? undefined : sub.color }}
                    onClick={() => handleSubscriptionClick(sub)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    <IconContext.Provider value={{ size: '2em' }}>
                      <sub.icon />
                    </IconContext.Provider>
                    <p className={`mt-2 text-xs ${ibmPlexMonoBold.className}`}>{sub.name}</p>
                    <p className="text-xs">${sub.amount}</p>
                    {existingSub && <p className="text-xs mt-1">Remove</p>}
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Dialog>
  )
}

export default SubscriptionSelector