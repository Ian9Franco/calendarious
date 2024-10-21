import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Subscription, ibmPlexMonoBold, ibmPlexMonoRegular } from '../utils/Types'
import { X, Calendar, DollarSign, Clock, BarChart2, Pause, Play } from 'lucide-react'
import { calculateTotalSpent, pauseSubscription, unpauseSubscription } from '../utils/expenseCalculations'

interface DetailedSubscriptionViewProps {
  subscription: Subscription
  onClose: () => void
  isDarkMode: boolean
  onUpdateSubscription: (updatedSubscription: Subscription) => void
  currentDate: Date
}

const DetailedSubscriptionView: React.FC<DetailedSubscriptionViewProps> = ({
  subscription,
  onClose,
  isDarkMode,
  onUpdateSubscription,
  currentDate,
}) => {
  const [monthsToPause, setMonthsToPause] = useState(1)

  const handlePauseSubscription = () => {
    const updatedSubscription = pauseSubscription(subscription, monthsToPause, currentDate)
    onUpdateSubscription(updatedSubscription)
    onClose()
  }

  const handleUnpauseSubscription = () => {
    const updatedSubscription = unpauseSubscription(subscription)
    onUpdateSubscription(updatedSubscription)
    onClose()
  }

  const isPaused = subscription.pausedUntil && new Date(subscription.pausedUntil) > currentDate

  const totalSpent = calculateTotalSpent(subscription, currentDate)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-200 bg-opacity-75'}`}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-md overflow-hidden rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl ${ibmPlexMonoBold.className}`}>{subscription.name}</h2>
              <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center mb-6">
              <Image
                src={subscription.image}
                alt={subscription.name}
                width={64}
                height={64}
                className="rounded-full mr-4"
              />
              <div>
                <p className={`${ibmPlexMonoRegular.className} text-sm opacity-75`}>{subscription.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-3" size={20} />
                <p className={`${ibmPlexMonoRegular.className} text-sm`}>Próximo pago: {new Date(subscription.startDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-3" size={20} />
                <p className={`${ibmPlexMonoRegular.className} text-sm`}>Monto: €{subscription.amount.toFixed(2)} / {subscription.frequency}</p>
              </div>
              <div className="flex items-center">
                <Clock className="mr-3" size={20} />
                <p className={`${ibmPlexMonoRegular.className} text-sm`}>Frecuencia: {subscription.frequency}</p>
              </div>
              <div className="flex items-center">
                <BarChart2 className="mr-3" size={20} />
                <p className={`${ibmPlexMonoRegular.className} text-sm`}>Gasto total: €{totalSpent.toFixed(2)}</p>
              </div>
              {isPaused && (
                <div className="flex items-center">
                  <Pause className="mr-3" size={20} />
                  <p className={`${ibmPlexMonoRegular.className} text-sm`}>Pausada hasta: {new Date(subscription.pausedUntil!).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className="mt-8 flex items-center justify-between">
              {isPaused ? (
                <button
                  onClick={handleUnpauseSubscription}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  <Play size={16} className="inline mr-2" />
                  Reanudar Suscripción
                </button>
              ) : (
                <>
                  <div className="flex items-center mr-4">
                    <label htmlFor="monthsToPause" className={`${ibmPlexMonoRegular.className} text-sm mr-2`}>Meses a pausar:</label>
                    <input
                      id="monthsToPause"
                      type="number"
                      min="1"
                      max="12"
                      value={monthsToPause}
                      onChange={(e) => setMonthsToPause(parseInt(e.target.value))}
                      className={`w-16 px-2 py-1 rounded ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                      } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <button
                    onClick={handlePauseSubscription}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    <Pause size={16} className="inline mr-2" />
                    Pausar Suscripción
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DetailedSubscriptionView