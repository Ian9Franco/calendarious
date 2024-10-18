import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Subscription, ibmPlexMonoBold, ibmPlexMonoRegular } from './Types'
import { X, Calendar, DollarSign, Clock, BarChart2 } from 'lucide-react'

interface DetailedSubscriptionViewProps {
  subscription: Subscription
  onClose: () => void
  isDarkMode: boolean
  position: { x: number; y: number }
}

const DetailedSubscriptionView: React.FC<DetailedSubscriptionViewProps> = ({
  subscription,
  onClose,
  isDarkMode,
  position,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 w-80 rounded-lg shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
        overflow: 'auto',
      }}
    >
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl ${ibmPlexMonoBold.className}`}>{subscription.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center mb-4">
          <Image
            src={subscription.image}
            alt={subscription.name}
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
          <div>
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>{subscription.name}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Next payment: {new Date(subscription.startDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Amount: €{subscription.amount.toFixed(2)} / {subscription.frequency}</p>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Frequency: {subscription.frequency}</p>
          </div>
          <div className="flex items-center">
            <BarChart2 className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Total spent: €{subscription.totalSpent.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800'}`}>
            Cancel Subscription
          </button>
          <button className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'}`}>
            Pause Subscription
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default DetailedSubscriptionView