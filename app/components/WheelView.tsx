import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import { Subscription, ibmPlexMonoThin, ibmPlexMonoBold, ibmPlexMonoRegular } from '../utils/Types'
import { getLastThreeMonthsPayments, calculateMonthlySpend, isSubscriptionPaused } from '../utils/expenseCalculations'
import { DollarSign } from 'lucide-react'

interface WheelViewProps {
  subscriptions: Subscription[]
  setHoveredSubscription: (subscription: Subscription | null) => void
  isDarkMode: boolean
  onSubscriptionClick: (subscriptions: Subscription[], date: number, event: React.MouseEvent) => void
  currentDate: Date
  onPayMonth: () => void
}

type CombinedSubscription = Subscription & { count: number; isPaused: boolean }

const WheelView: React.FC<WheelViewProps> = ({
  subscriptions,
  setHoveredSubscription,
  isDarkMode,
  onSubscriptionClick,
  currentDate,
  onPayMonth,
}) => {
  const [showLastThreeMonths, setShowLastThreeMonths] = useState(false)
  const lastThreeMonthsPayments = getLastThreeMonthsPayments(subscriptions, currentDate)

  const combinedSubscriptions = subscriptions.reduce((acc, sub) => {
    const startDate = new Date(sub.startDate)
    const isPaused = isSubscriptionPaused(sub, currentDate)
    
    if (startDate <= currentDate) {
      const existingSub = acc.find(s => s.name === sub.name && s.date === sub.date)
      if (existingSub) {
        existingSub.amount += sub.amount
        existingSub.count += 1
      } else {
        acc.push({ ...sub, count: 1, isPaused })
      }
    }
    return acc
  }, [] as CombinedSubscription[])

  const totalAmount = calculateMonthlySpend(subscriptions, currentDate)
  let startAngle = 0

  const centerX = 250
  const centerY = 250
  const radius = 200
  const strokeWidth = 40
  const gapAngle = 0.02 // radians
  const iconOffset = 30 // Distance of icons from the ring

  const controls = useAnimation()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    controls.start(i => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1, delay: i * 0.1 },
    }))
  }, [controls])

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInRadians: number) => {
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  const arcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  }

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <svg ref={svgRef} width="500" height="500" viewBox="0 0 500 500" className="transform -rotate-90">
        {combinedSubscriptions.map((subscription, index) => {
          const percentage = subscription.amount / totalAmount
          const angle = 2 * Math.PI * percentage
          const endAngle = startAngle + angle - gapAngle

          const path = arcPath(startAngle, endAngle)

          const midAngle = (startAngle + endAngle) / 2
          const iconRadius = radius + strokeWidth / 2 + iconOffset
          const iconX = centerX + iconRadius * Math.cos(midAngle)
          const iconY = centerY + iconRadius * Math.sin(midAngle)

          const segment = (
            <g key={index}>
              <motion.path
                d={path}
                fill="none"
                stroke={subscription.isPaused ? `rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, 0.3)` : subscription.color}
                strokeWidth={strokeWidth}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={controls}
                custom={index}
                onMouseEnter={() => setHoveredSubscription(subscription)}
                onMouseLeave={() => setHoveredSubscription(null)}
                onClick={(event) => onSubscriptionClick([subscription], subscription.date, event)}
                style={{ cursor: 'pointer' }}
              />
              <foreignObject x={iconX - 15} y={iconY - 15} width={30} height={30}>
                <div className="flex items-center justify-center w-full h-full">
                  <Image
                    src={subscription.image}
                    alt={subscription.name}
                    width={24}
                    height={24}
                    className={`rounded-full ${subscription.isPaused ? 'opacity-50' : ''}`}
                  />
                </div>
              </foreignObject>
            </g>
          )

          startAngle = endAngle + gapAngle
          return segment
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'} cursor-pointer mb-2`}
          onClick={() => setShowLastThreeMonths(!showLastThreeMonths)}
        >
          <p className={`text-4xl font-bold ${ibmPlexMonoBold.className}`}>€{totalAmount.toFixed(2)}</p>
          <p className={`text-sm ${ibmPlexMonoThin.className}`}>Total para {currentDate.toLocaleString('es-ES', { month: 'long' })}</p>
        </div>
        <button
          onClick={onPayMonth}
          className={`flex items-center justify-center px-4 py-2 rounded-full ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors duration-200`}
        >
          <DollarSign size={18} className="mr-2" />
          <span className={`${ibmPlexMonoRegular.className}`}>Pagar Mes</span>
        </button>
      </div>
      {showLastThreeMonths && (
        <div className={`absolute top-full mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <h3 className={`text-lg font-bold mb-2 ${ibmPlexMonoBold.className}`}>Últimos 3 meses</h3>
          <table className={`w-full ${ibmPlexMonoRegular.className}`}>
            <thead>
              <tr>
                <th className="text-left">Mes</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lastThreeMonthsPayments.map(({ month, total }) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td className="text-right">€{total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default WheelView