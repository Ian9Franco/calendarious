import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Subscription } from './Types'
import { X } from 'lucide-react'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  deleteSubscription: (subscription: Subscription) => void
  isDarkMode: boolean
  onSubscriptionClick: (subscriptions: Subscription[], date: number, event: React.MouseEvent) => void
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ 
  subscriptions, 
  deleteSubscription, 
  isDarkMode,
  onSubscriptionClick 
}) => {
  return (
    <AnimatePresence>
      {subscriptions.map((subscription) => (
        <motion.div
          key={`${subscription.name}-${subscription.date}`}
          className={`py-4 px-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} last:border-b-0 w-full`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`w-10 h-10 mr-3 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                <Image
                  src={subscription.image}
                  alt={subscription.name}
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{subscription.name}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cada {subscription.date}</p>
              </div>
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>€{subscription.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Próximo pago</p>
              <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {new Date(subscription.startDate).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className="text-right">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total desde {new Date(subscription.startDate).toLocaleDateString('es-ES')}</p>
              <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>€{subscription.totalSpent.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => deleteSubscription(subscription)}
              className={`px-4 py-2 ${isDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-100 text-red-600 hover:bg-red-200'} rounded-md text-sm transition-colors flex items-center`}
            >
              <X size={16} className="mr-1" />
              Cancelar Suscripción
            </button>
            <button
              onClick={(event) => onSubscriptionClick([subscription], subscription.date, event)}
              className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} rounded-md text-sm transition-colors flex items-center`}
            >
              Ver Detalles
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default SubscriptionList