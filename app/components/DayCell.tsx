import React from 'react'
import { motion } from 'framer-motion'
import { IconContext } from 'react-icons'
import { Subscription } from './Types'

interface DayCellProps {
  day: number
  isCurrentMonth: boolean
  subscriptions: Subscription[]
  onClick: () => void
  onHover: (day: string | null) => void
}

const DayCell: React.FC<DayCellProps> = ({ day, isCurrentMonth, subscriptions, onClick, onHover }) => {
  const borderColors = subscriptions.map(sub => sub.color).join(', ')

  return (
    <motion.div
      className={`aspect-square flex flex-col items-center justify-between p-1 sm:p-2 rounded-lg ${
        isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900'
      } cursor-pointer relative overflow-hidden`}
      onClick={onClick}
      onMouseEnter={() => onHover(day.toString())}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      {isCurrentMonth && (
        <>
          <span className="text-xs sm:text-base text-white">{day}</span>
          <div className="flex flex-wrap justify-center items-center gap-1 mt-1">
            {subscriptions.slice(0, 2).map((sub, index) => (
              <motion.div
                key={index}
                className="rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: sub.color,
                  width: '16px',
                  height: '16px'
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                layout
              >
                <IconContext.Provider value={{ size: '10px', color: 'white' }}>
                  <sub.icon />
                </IconContext.Provider>
              </motion.div>
            ))}
            {subscriptions.length > 2 && (
              <div className="text-xs text-gray-400">+{subscriptions.length - 2}</div>
            )}
          </div>
        </>
      )}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(45deg, ${borderColors})`,
          filter: 'blur(10px)',
          zIndex: -1,
        }}
      />
    </motion.div>
  )
}

export default DayCell