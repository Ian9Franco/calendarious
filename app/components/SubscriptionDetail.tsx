import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Subscription, ibmPlexMonoBold, ibmPlexMonoRegular } from './Types'
import { Download } from 'lucide-react'

interface SubscriptionDetailProps {
  subscriptions: Subscription[]
  selectedDate: number
  onCancel: (subscription: Subscription) => void
  onPause: (subscription: Subscription) => void
  onClose: () => void
  isDarkMode: boolean
}

const SubscriptionDetail: React.FC<SubscriptionDetailProps> = ({ 
  subscriptions, 
  selectedDate, 
  onCancel, 
  onPause, 
  onClose,
  isDarkMode
}) => {
  const subscription = subscriptions[0] // Assuming we're showing details for the first subscription

  if (!subscription) return null

  const receipts = [
    { month: 'August 2024', amount: subscription.amount },
    { month: 'July 2024', amount: subscription.amount },
    { month: 'June 2024', amount: subscription.amount },
    { month: 'May 2024', amount: subscription.amount },
    { month: 'April 2024', amount: subscription.amount },
  ]

  const totalSpend = receipts.reduce((total, receipt) => total + receipt.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-200 bg-opacity-75'}`}
      onClick={onClose}
    >
      <div 
        className={`rounded-lg p-6 w-96 max-w-full relative ${isDarkMode ? 'bg-[#1e1e1e] text-white' : 'bg-white text-gray-800'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <Image src={subscription.image} alt={subscription.name} width={40} height={40} className="rounded-full mr-4" />
          <div>
            <h3 className={`text-lg ${ibmPlexMonoBold.className}`}>{subscription.name}</h3>
            <p className={`text-sm ${ibmPlexMonoRegular.className} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Every month on the {selectedDate}</p>
          </div>
        </div>
        <div className={`text-2xl ${ibmPlexMonoBold.className} mb-4`}>${subscription.amount.toFixed(2)}</div>
        <h4 className={`${ibmPlexMonoBold.className} mb-2`}>Receipts</h4>
        <div className="space-y-2 mb-4">
          {receipts.map((receipt, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className={`${ibmPlexMonoRegular.className} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{receipt.month}</span>
              <div className="flex items-center">
                <span className={`${ibmPlexMonoBold.className} mr-2`}>${receipt.amount.toFixed(2)}</span>
                <Download size={16} className="cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className={`${ibmPlexMonoRegular.className} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Spend</span>
          <span className={`${ibmPlexMonoBold.className}`}>${totalSpend.toFixed(2)}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onCancel(subscription)}
            className="flex-1 bg-red-600 text-white py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Cancel Subscription
          </button>
          <button
            onClick={() => onPause(subscription)}
            className={`flex-1 py-2 rounded-md text-sm transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Pause
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SubscriptionDetail