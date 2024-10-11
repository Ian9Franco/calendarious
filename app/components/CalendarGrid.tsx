import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconContext } from 'react-icons'
import { Subscription } from './Types'
import { Plus, Pause, X } from 'lucide-react'

interface CalendarGridProps {
  subscriptions: Subscription[]
  currentDate: Date
  onDateClick: (date: number | null) => void
  onHover: (day: string | null) => void
  hoveredDay: string | null
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  subscriptions,
  currentDate,
  onDateClick,
  onHover,
  hoveredDay,
}) => {
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Subscription[] | null>(null)

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const renderSubscriptionIcons = (daySubscriptions: Subscription[], day: number) => {
    return (
      <div className="flex justify-center items-center mt-1 relative h-6 w-full">
        <div className="flex items-center justify-center relative">
          {daySubscriptions.slice(0, 2).map((sub, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center absolute cursor-pointer"
              style={{ 
                backgroundColor: sub.color,
                width: '20px',
                height: '20px',
                left: `${index * 12 - 12}px`,
                zIndex: 2 - index
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedSubscriptions(daySubscriptions)
              }}
            >
              <IconContext.Provider value={{ size: '12px', color: 'white' }}>
                <sub.icon />
              </IconContext.Provider>
            </motion.div>
          ))}
          {daySubscriptions.length > 2 && (
            <motion.div
              className="flex items-center justify-center absolute bg-gray-600 text-white text-xs font-bold cursor-pointer"
              style={{ 
                width: '20px',
                height: '20px',
                left: '12px',
                zIndex: 3
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedSubscriptions(daySubscriptions)
              }}
            >
              <Plus size={12} />
              {daySubscriptions.length - 2}
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  const renderSubscriptionDetail = (daySubscriptions: Subscription[]) => {
    const borderGradient = getBorderGradient(daySubscriptions)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-lg z-50 w-80 sm:w-96 max-h-[80vh] overflow-y-auto"
        style={{ 
          boxShadow: `0 0 0 2px ${borderGradient}, 0 4px 16px rgba(0,0,0,0.1)`
        }}
      >
        <div className="max-h-[calc(3*5.5rem)] overflow-y-auto pr-2">
          {daySubscriptions.map((sub, index) => (
            <React.Fragment key={index}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IconContext.Provider value={{ size: '1.5em', color: sub.color }}>
                      <sub.icon />
                    </IconContext.Provider>
                    <span className="ml-2 font-bold text-white">{sub.name}</span>
                  </div>
                  <span className="text-green-400 font-bold">${sub.amount.toFixed(2)}</span>
                </div>
                <div className="text-gray-400 text-sm">
                  <p><span className="font-semibold">Every</span> {sub.date}th</p>
                  <p><span className="font-semibold">Next payment:</span> {new Date(sub.startDate).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Total since</span> {new Date(sub.startDate).toLocaleDateString()}: <span className="text-white">${sub.totalSpent.toFixed(2)}</span></p>
                </div>
                <div className="flex justify-between mt-2">
                  <button className="text-red-500 hover:text-red-600 transition-colors">
                    <X size={16} className="inline mr-1" />
                    Cancel
                  </button>
                  <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
                    <Pause size={16} className="inline mr-1" />
                    Pause
                  </button>
                </div>
              </div>
              {index < daySubscriptions.length - 1 && (
                <hr className="border-gray-600 my-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    )
  }

  const getBorderGradient = (daySubscriptions: Subscription[]) => {
    if (daySubscriptions.length === 0) return 'transparent'
    const colors = daySubscriptions.map(sub => sub.color).join(', ')
    return `linear-gradient(45deg, ${colors})`
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 42 }, (_, i) => {
          const day = i - firstDayOfMonth + 1
          const isCurrentMonth = day > 0 && day <= daysInMonth
          const daySubscriptions = subscriptions.filter(sub => sub.date === day)
          const borderGradient = getBorderGradient(daySubscriptions)
          
          return (
            <motion.div
              key={i}
              className={`aspect-square flex flex-col items-center justify-between p-1 sm:p-2 rounded-lg ${
                isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900'
              } cursor-pointer relative overflow-hidden`}
              style={{
                boxShadow: borderGradient !== 'transparent' ? `inset 0 0 0 2px ${borderGradient}` : 'none'
              }}
              onClick={() => isCurrentMonth && onDateClick(day)}
              onMouseEnter={() => onHover(day.toString())}
              onMouseLeave={() => onHover(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCurrentMonth && (
                <>
                  <span className="text-xs sm:text-base text-white">{day}</span>
                  {renderSubscriptionIcons(daySubscriptions, day)}
                </>
              )}
            </motion.div>
          )
        })}
      </div>
      <AnimatePresence>
        {selectedSubscriptions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={() => setSelectedSubscriptions(null)}
            />
            {renderSubscriptionDetail(selectedSubscriptions)}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CalendarGrid