import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Subscription } from './Types'

interface DayProps {
  classNames: string
  day: {
    day: string
    subscriptions: Subscription[]
  }
  onHover: (day: string | null) => void
  onDayClick: () => void
  onSubscriptionClick: (subscription: Subscription) => void
}

const Day: React.FC<DayProps> = ({ classNames, day, onHover, onDayClick, onSubscriptionClick }) => {
  return (
    <motion.div
      className={`aspect-square flex flex-col items-center justify-between p-1 sm:p-2 rounded-lg ${classNames} cursor-pointer relative overflow-hidden`}
      onClick={onDayClick}
      onMouseEnter={() => onHover(day.day)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-xs sm:text-base text-white">{day.day}</span>
      {day.subscriptions.length > 0 && (
        <div className="flex justify-start items-center mt-1 relative h-6 w-full">
          {day.subscriptions.slice(0, 3).map((sub, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center absolute cursor-pointer rounded-full overflow-hidden"
              style={{ 
                left: `${index * 16}px`,
                zIndex: 3 - index,
                width: '20px',
                height: '20px'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onSubscriptionClick(sub)
              }}
            >
              <Image
                src={sub.image}
                alt={sub.name}
                width={20}
                height={20}
                className="object-cover"
              />
            </motion.div>
          ))}
          {day.subscriptions.length > 3 && (
            <motion.div
              className="flex items-center justify-center absolute bg-gray-600 text-white text-xs font-bold cursor-pointer rounded-full"
              style={{ 
                left: '48px',
                zIndex: 4,
                width: '20px',
                height: '20px'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              +{day.subscriptions.length - 3}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default Day