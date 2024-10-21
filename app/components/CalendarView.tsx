import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Subscription, ibmPlexMonoBold, ibmPlexMonoBoldItalic } from '../utils/Types'

type CalendarViewProps = {
  currentDate: Date
  subscriptions: Subscription[]
  setSelectedDate: (date: number | null) => void
  setHoveredSubscription: (subscription: Subscription | null) => void
  hoveredSubscription: Subscription | null
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  subscriptions,
  setSelectedDate,
  setHoveredSubscription,
  hoveredSubscription,
}) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const today = new Date().getDate()

  const renderSubscriptionIcons = (daySubscriptions: Subscription[]) => {
    return (
      <div className="flex flex-wrap justify-center items-center gap-1 mt-1">
        {daySubscriptions.slice(0, 4).map((sub, index) => (
          <motion.div
            key={index}
            className="rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: sub.color,
              width: '16px',
              height: '16px'
            }}
            onMouseEnter={() => setHoveredSubscription(sub)}
            onMouseLeave={() => setHoveredSubscription(null)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            layout
          >
            <Image
              src={sub.image}
              alt={sub.name}
              width={10}
              height={10}
            />
          </motion.div>
        ))}
        {daySubscriptions.length > 4 && (
          <div className="text-xs text-gray-400">+{daySubscriptions.length - 4}</div>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} className={`text-center text-xs sm:text-sm p-1 sm:p-2 bg-gray-700 rounded-full ${ibmPlexMonoBoldItalic.className}`}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: 42 }, (_, i) => {
          const day = i - firstDayOfMonth + 1
          const isCurrentMonth = day > 0 && day <= daysInMonth
          const isToday = day === today
          const daySubscriptions = subscriptions.filter(sub => sub.date === day)
          return (
            <motion.div
              key={i}
              className={`aspect-square flex flex-col items-center justify-between p-1 sm:p-2 rounded-lg ${
                isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900'
              } ${isToday ? 'ring-2 ring-white' : ''} cursor-pointer relative overflow-hidden`}
              onClick={() => isCurrentMonth && setSelectedDate(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {isCurrentMonth && (
                <>
                  <span className={`text-xs sm:text-base ${ibmPlexMonoBold.className}`}>{day}</span>
                  {renderSubscriptionIcons(daySubscriptions)}
                </>
              )}
            </motion.div>
          )
        })}
      </div>
      {hoveredSubscription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-4 rounded-lg shadow-lg z-10 text-sm"
          style={{ border: `2px solid ${hoveredSubscription.color}` }}
        >
          <div className="flex items-center mb-2">
            <Image
              src={hoveredSubscription.image}
              alt={hoveredSubscription.name}
              width={32}
              height={32}
            />
            <span className={`ml-2 text-lg ${ibmPlexMonoBold.className}`}>{hoveredSubscription.name}</span>
          </div>
          <p className={`${ibmPlexMonoBold.className}`}>${hoveredSubscription.amount.toFixed(2)}</p>
          <p>{hoveredSubscription.frequency}</p>
          <p>Next payment: {hoveredSubscription.date}</p>
          <p>Total since {hoveredSubscription.startDate}</p>
          <p className={`${ibmPlexMonoBold.className}`}>${hoveredSubscription.totalSpent.toFixed(2)}</p>
        </motion.div>
      )}
    </div>
  )
}

export default CalendarView