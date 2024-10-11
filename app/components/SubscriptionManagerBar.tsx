import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Subscription, ibmPlexMonoBold, ibmPlexMonoRegular, availableSubscriptions } from './Types'
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash, FaSave } from 'react-icons/fa'

type SubscriptionManagerBarProps = {
  subscriptions: Subscription[]
  deleteSubscription: (subscription: Subscription) => void
  updateSubscription: (oldSubscription: Subscription, newSubscription: Subscription) => void
}

const SubscriptionManagerBar: React.FC<SubscriptionManagerBarProps> = ({
  subscriptions,
  deleteSubscription,
  updateSubscription,
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [selectedNewSubscription, setSelectedNewSubscription] = useState<string>('')
  const [editedDate, setEditedDate] = useState<string>('')

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setSelectedNewSubscription(subscription.name)
    setEditedDate(subscription.date.toString())
  }

  const handleSave = () => {
    if (editingSubscription) {
      const newSubscriptionData = availableSubscriptions.find(sub => sub.name === selectedNewSubscription)
      if (newSubscriptionData) {
        const updatedSubscription: Subscription = {
          ...newSubscriptionData,
          date: parseInt(editedDate, 10),
          totalSpent: editingSubscription.totalSpent,
          startDate: editingSubscription.startDate
        }
        updateSubscription(editingSubscription, updatedSubscription)
      }
      setEditingSubscription(null)
    }
  }

  const handleDelete = (subscription: Subscription) => {
    if (window.confirm(`Are you sure you want to delete the ${subscription.name} subscription?`)) {
      deleteSubscription(subscription)
    }
  }

  const sortedSubscriptions = [...subscriptions].sort((a, b) => a.date - b.date)

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-gray-900 z-50 flex"
      initial={{ x: isOpen ? 0 : '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-64 lg:w-80 p-4 overflow-y-auto">
        <h2 className={`text-xl ${ibmPlexMonoBold.className} mb-4`}>Subscription Manager</h2>
        <AnimatePresence>
          {sortedSubscriptions.map((sub) => (
            <motion.div
              key={`${sub.name}-${sub.date}`}
              className="bg-gray-800 rounded-lg p-3 mb-3 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center mb-2">
                <sub.icon size="1.5em" color={sub.color} />
                <span className={`ml-2 ${ibmPlexMonoBold.className}`}>{sub.name}</span>
              </div>
              {editingSubscription === sub ? (
                <>
                  <div className="flex items-center mb-2">
                    <select
                      value={selectedNewSubscription}
                      onChange={(e) => setSelectedNewSubscription(e.target.value)}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full mb-2"
                    >
                      {availableSubscriptions.map((availableSub) => (
                        <option key={availableSub.name} value={availableSub.name}>
                          {availableSub.name} - ${availableSub.amount}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-16 mr-2"
                    />
                    <span className={`${ibmPlexMonoRegular.className} text-sm`}>Day of month</span>
                  </div>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white rounded px-2 py-1 text-sm flex items-center"
                  >
                    <FaSave className="mr-1" /> Save
                  </button>
                </>
              ) : (
                <>
                  <p className={`${ibmPlexMonoRegular.className} text-sm mb-1`}>${sub.amount.toFixed(2)}</p>
                  <p className={`${ibmPlexMonoRegular.className} text-sm mb-2`}>Due: Day {sub.date}</p>
                  <button
                    onClick={() => handleEdit(sub)}
                    className="bg-blue-500 text-white rounded px-2 py-1 text-sm flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(sub)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <FaTrash size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 bg-gray-900 text-white p-2 rounded-r-md"
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </motion.div>
  )
}

export default SubscriptionManagerBar