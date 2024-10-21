import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Subscription } from '../utils/Types'

interface CalendarGridProps {
  subscriptions: Subscription[]
  currentDate: Date
  onDayClick: (date: number | null) => void
  onSubscriptionClick: (subscriptions: Subscription[], date: number, event: React.MouseEvent) => void
  isDarkMode: boolean
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  subscriptions,
  currentDate,
  onDayClick,
  onSubscriptionClick,
  isDarkMode,
}) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, () => null)

  const allDays = [...emptyDays, ...days]

  const getSubscriptionsForDay = (day: number) => {
    return subscriptions.filter(subscription => {
      const subStartDate = new Date(subscription.startDate)
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      
      // Check if the subscription starts on or before the current day
      if (subStartDate <= checkDate) {
        // For monthly subscriptions, check if the day matches
        if (subscription.frequency === 'Monthly' && subStartDate.getDate() === day) {
          return true
        }
        // Add more conditions here for other frequencies if needed
      }
      return false
    })
  }

  const isPausedDay = (day: number, subscription: Subscription) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return subscription.pausedUntil ? new Date(subscription.pausedUntil) > checkDate : false
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {allDays.map((day, index) => (
        <motion.div
          key={index}
          className={`aspect-square rounded-lg p-2 ${
            day
              ? isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-100'
              : 'bg-transparent'
          } cursor-pointer transition-colors`}
          onClick={() => day && onDayClick(day)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {day && (
            <>
              <div className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {day}
              </div>
              <div className="flex flex-wrap gap-1">
                {getSubscriptionsForDay(day).map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    className="w-6 h-6 rounded-full overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSubscriptionClick([sub], day, e)
                    }}
                  >
                    <Image
                      src={sub.image}
                      alt={sub.name}
                      width={24}
                      height={24}
                      className={`w-full h-full object-cover ${isPausedDay(day, sub) ? 'opacity-50' : ''}`}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default CalendarGrid