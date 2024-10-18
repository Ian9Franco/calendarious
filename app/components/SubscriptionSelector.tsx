import React from 'react'
import { Subscription, availableSubscriptions, ibmPlexMonoBold, ibmPlexMonoRegular } from './Types'
import { X } from 'lucide-react'
import Image from 'next/image'

type SubscriptionSelectorProps = {
  selectedDate: number | null
  addSubscription: (subscription: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>, date: number) => void
  onClose: () => void
  isDarkMode: boolean
}

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  selectedDate,
  addSubscription,
  onClose,
  isDarkMode,
}) => {
  if (!selectedDate) return null

  const handleSubscriptionClick = (sub: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>) => {
    addSubscription(sub, selectedDate)
    onClose()
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-200 bg-opacity-75'}`}>
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 w-96 max-w-full`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${ibmPlexMonoBold.className}`}>
            Add subscription for day {selectedDate}
          </h3>
          <button
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {availableSubscriptions.map((sub) => (
            <button
              key={sub.name}
              className={`flex flex-col items-center p-2 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              } rounded-lg transition-colors`}
              onClick={() => handleSubscriptionClick(sub)}
            >
              <Image
                src={sub.image}
                alt={sub.name}
                width={40}
                height={40}
                className="rounded-full mb-2"
              />
              <p className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'} ${ibmPlexMonoBold.className}`}>{sub.name}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${ibmPlexMonoRegular.className}`}>${sub.amount}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionSelector