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

type CombinedSubscription = Subscription & { count: number }

const WheelView: React.FC<WheelViewProps> = ({
  subscriptions,
  monthlySpend,
  setHoveredSubscription,
  hoveredSubscription,
}) => {
  const combinedSubscriptions = subscriptions.reduce((acc, sub) => {
    const existingSub = acc.find(s => s.name === sub.name)
    if (existingSub) {
      existingSub.amount += sub.amount
      existingSub.count += 1
    } else {
      acc.push({ ...sub, count: 1 })
    }
    return acc
  }, [] as CombinedSubscription[])

  const totalAmount = combinedSubscriptions.reduce((sum, sub) => sum + sub.amount, 0)
  let startAngle = 0

  const outerCircleRadius = 270

  return (
    <div className="relative h-[300px] sm:h-[600px] w-full">
      <svg width="100%" height="100%" viewBox="0 0 600 600">
        <motion.circle 
          cx="300" 
          cy="300" 
          r={outerCircleRadius} 
          fill="none" 
          stroke="transparent" 
          strokeWidth="30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {combinedSubscriptions.map((sub, index) => {
          const angle = (sub.amount / totalAmount) * 360
          const endAngle = startAngle + angle
          const largeArcFlag = angle > 180 ? 1 : 0
          const gapAngle = 8
          const adjustedStartAngle = startAngle + gapAngle / 2
          const adjustedEndAngle = endAngle - gapAngle / 2
          const startX = 300 + outerCircleRadius * Math.cos((adjustedStartAngle * Math.PI) / 180)
          const startY = 300 + outerCircleRadius * Math.sin((adjustedStartAngle * Math.PI) / 180)
          const endX = 300 + outerCircleRadius * Math.cos((adjustedEndAngle * Math.PI) / 180)
          const endY = 300 + outerCircleRadius * Math.sin((adjustedEndAngle * Math.PI) / 180)
          const path = `M ${startX} ${startY} A ${outerCircleRadius} ${outerCircleRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
          const iconX = 300 + 320 * Math.cos(((adjustedStartAngle + adjustedEndAngle) / 2) * (Math.PI / 180))
          const iconY = 300 + 320 * Math.sin(((adjustedStartAngle + adjustedEndAngle) / 2) * (Math.PI / 180))

          startAngle = endAngle

          return (
            <g key={sub.name} onMouseEnter={() => setHoveredSubscription(sub)} onMouseLeave={() => setHoveredSubscription(null)}>
              <motion.path 
                d={path} 
                fill="none" 
                stroke={sub.color} 
                strokeWidth="30"
                strokeLinecap="round"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-4 rounded-lg shadow-lg"
        style={{ border: hoveredSubscription ? `2px solid ${hoveredSubscription.color}` : '2px solid rgba(255, 255, 255, 0.1)' }}
      >
        {hoveredSubscription ? (
          <>
            <div className="flex items-center mb-2">
              <IconContext.Provider value={{ size: '2em', color: hoveredSubscription.color }}>
                <hoveredSubscription.icon />
              </IconContext.Provider>
              <span className={`ml-2 text-lg ${ibmPlexMonoBold.className}`}>{hoveredSubscription.name}</span>
            </div>
            <p className={`${ibmPlexMonoRegular.className}`}>
              ${hoveredSubscription.amount.toFixed(2)} / {hoveredSubscription.frequency}
            </p>
            {(hoveredSubscription as CombinedSubscription).count > 1 && (
              <p className={`${ibmPlexMonoRegular.className}`}>
                {(hoveredSubscription as CombinedSubscription).count} subscriptions
              </p>
            )}
          </>
        ) : (
          <>
            <p className={`${ibmPlexMonoThin.className} text-sm text-white`}>Gasto mensual total</p>
            <p className={`${ibmPlexMonoBold.className} text-2xl text-white`}>${monthlySpend.toFixed(2)}</p>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default WheelView