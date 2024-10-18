import React from 'react'
import { motion } from 'framer-motion'
import { Subscription } from './Types'
import Image from 'next/image'

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
  isDarkMode
}) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const renderSubscriptionIcons = (daySubscriptions: Subscription[], day: number) => {
    const maxVisibleIcons = 3
    const remainingCount = daySubscriptions.length - maxVisibleIcons

    return (
      <div className="flex flex-wrap justify-center items-center mt-1">
        {daySubscriptions.slice(0, maxVisibleIcons).map((sub, index) => (
          <motion.div
            key={index}
            className="rounded-full flex items-center justify-center relative"
            style={{ 
              marginLeft: index > 0 ? '-8px' : '0',
              zIndex: maxVisibleIcons - index
            }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onSubscriptionClick(daySubscriptions, day, e)
            }}
          >
            <Image
              src={sub.image}
              alt={sub.name}
              width={20}
              height={20}
              className="rounded-full object-contain"
            />
          </motion.div>
        ))}
        {remainingCount > 0 && (
          <div className={`flex items-center justify-center rounded-full text-xs w-5 h-5 ml-1 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 42 }, (_, i) => {
        const day = i - firstDayOfMonth + 1
        const isCurrentMonth = day > 0 && day <= daysInMonth
        const daySubscriptions = subscriptions.filter(sub => sub.date === day)
        return (
          <motion.div
            key={i}
            className={`aspect-square flex flex-col items-center justify-between p-1 rounded-lg ${
              isCurrentMonth 
                ? isDarkMode 
                  ? 'bg-[#1e1e1e] text-white' 
                  : 'bg-white text-gray-800 border border-gray-200' 
                : isDarkMode
                  ? 'bg-zinc-800 text-gray-500'
                  : 'bg-gray-100 text-gray-400'
            } cursor-pointer`}
            onClick={() => isCurrentMonth && onDayClick(day)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCurrentMonth && (
              <>
                <span className="text-xs sm:text-sm self-start">{day}</span>
                {renderSubscriptionIcons(daySubscriptions, day)}
              </>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default CalendarGrid