import React from 'react'
import { motion } from 'framer-motion'
import { IconContext } from 'react-icons'
import { Subscription, ibmPlexMonoThin, ibmPlexMonoBold, ibmPlexMonoRegular } from './Types'

type WheelViewProps = {
  subscriptions: Subscription[]
  monthlySpend: number
  setHoveredSubscription: (subscription: Subscription | null) => void
  hoveredSubscription: Subscription | null
}

const WheelView: React.FC<WheelViewProps> = ({
  subscriptions,
  monthlySpend,
  setHoveredSubscription,
  hoveredSubscription,
}) => {
  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)
  let startAngle = 0

  return (
    <div className="relative h-[300px] sm:h-[600px] w-full">
      <svg width="100%" height="100%" viewBox="0 0 600 600">
        <motion.circle 
          cx="300" 
          cy="300" 
          r="250" 
          fill="none" 
          stroke="#333" 
          strokeWidth="40"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {subscriptions.map((sub, index) => {
          const angle = (sub.amount / totalAmount) * 360
          const endAngle = startAngle + angle
          const largeArcFlag = angle > 180 ? 1 : 0

          const startX = 300 + 250 * Math.cos((startAngle * Math.PI) / 180)
          const startY = 300 + 250 * Math.sin((startAngle * Math.PI) / 180)
          const endX = 300 + 250 * Math.cos((endAngle * Math.PI) / 180)
          const endY = 300 + 250 * Math.sin((endAngle * Math.PI) / 180)

          const path = `M ${startX} ${startY} A 250 250 0 ${largeArcFlag} 1 ${endX} ${endY}`

          const iconX = 300 + 290 * Math.cos(((startAngle + endAngle) / 2) * (Math.PI / 180))
          const iconY = 300 + 290 * Math.sin(((startAngle + endAngle) / 2) * (Math.PI / 180))

          startAngle = endAngle

          return (
            <g key={sub.name} onMouseEnter={() => setHoveredSubscription(sub)} onMouseLeave={() => setHoveredSubscription(null)}>
              <motion.path 
                d={path} 
                fill="none" 
                stroke={sub.color} 
                strokeWidth="40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
              <motion.foreignObject 
                x={iconX - 15} 
                y={iconY - 15} 
                width="30" 
                height="30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <IconContext.Provider value={{ size: '1.2em', color: sub.color }}>
                    <sub.icon />
                  </IconContext.Provider>
                </div>
              </motion.foreignObject>
            </g>
          )
        })}
      </svg>
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <p className={`${ibmPlexMonoThin.className} text-sm`}>Monthly spend</p>
        <p className={`${ibmPlexMonoBold.className} text-2xl`}>${monthlySpend.toFixed(2)}</p>
      </motion.div>
      {hoveredSubscription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-4 rounded-lg shadow-lg"
          style={{ border: `2px solid ${hoveredSubscription.color}` }}
        >
          <div className="flex items-center mb-2">
            <IconContext.Provider value={{ size: '2em', color: hoveredSubscription.color }}>
              <hoveredSubscription.icon />
            </IconContext.Provider>
            <span className={`ml-2 text-lg ${ibmPlexMonoBold.className}`}>{hoveredSubscription.name}</span>
          </div>
          <p className={`${ibmPlexMonoRegular.className}`}>
            ${hoveredSubscription.amount.toFixed(2)} / {hoveredSubscription.frequency}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default WheelView