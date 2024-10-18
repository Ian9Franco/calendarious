import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import { Subscription, ibmPlexMonoThin, ibmPlexMonoBold } from './Types'

interface WheelViewProps {
  subscriptions: Subscription[]
  setHoveredSubscription: (subscription: Subscription | null) => void
  isDarkMode: boolean
  onSubscriptionClick: (subscriptions: Subscription[], date: number, event: React.MouseEvent) => void
  monthlySpend: number
}

type CombinedSubscription = Subscription & { count: number }

const WheelView: React.FC<WheelViewProps> = ({
  subscriptions,
  setHoveredSubscription,
  isDarkMode,
  onSubscriptionClick,
  monthlySpend,
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

  const outerRadius = 200
  const innerRadius = 160
  const iconSize = 40
  const totalGapAngle = 0.2 // Ángulo total reservado para los espacios entre segmentos
  const gapAngle = totalGapAngle / combinedSubscriptions.length // Distribuir el espacio uniformemente

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

  // Función para crear el camino del arco con bordes redondeados
  const arcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const startOuter = polarToCartesian(250, 250, outerRadius, startAngle)
    const endOuter = polarToCartesian(250, 250, outerRadius, endAngle)
    const startInner = polarToCartesian(250, 250, innerRadius, endAngle)
    const endInner = polarToCartesian(250, 250, innerRadius, startAngle)

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1

    // NOTA: Los bordes aún parecen puntiagudos porque estamos usando arcos circulares simples.
    // Para lograr bordes verdaderamente redondeados, necesitaríamos implementar curvas de Bézier
    // en las esquinas internas y externas del segmento.
    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}
      Z
    `
  }

  return (
    <div className="relative h-[500px] w-full">
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 500 500">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {combinedSubscriptions.map((sub, index) => {
          const angle = (sub.amount / totalAmount) * (2 * Math.PI - totalGapAngle)
          const endAngle = startAngle + angle
          const midAngle = (startAngle + endAngle) / 2

          // Creamos el camino del arco con un pequeño espacio entre segmentos
          const path = arcPath(startAngle + gapAngle / 2, endAngle - gapAngle / 2, outerRadius, innerRadius)

          const iconPosition = polarToCartesian(250, 250, outerRadius + 30, midAngle)

          startAngle = endAngle + gapAngle

          return (
            <g 
              key={sub.name} 
              onMouseEnter={() => setHoveredSubscription(sub)} 
              onMouseLeave={() => setHoveredSubscription(null)}
              onClick={(event) => onSubscriptionClick(subscriptions.filter(s => s.name === sub.name), sub.date, event)}
              style={{ cursor: 'pointer' }}
            >
              <motion.path 
                d={path} 
                fill={sub.color}
                opacity={0}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={controls}
                custom={index}
                filter="url(#glow)"
              />
              <motion.foreignObject 
                x={iconPosition.x - iconSize / 2} 
                y={iconPosition.y - iconSize / 2} 
                width={iconSize} 
                height={iconSize}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    width={iconSize}
                    height={iconSize}
                    className="object-contain rounded-full"
                  />
                </div>
              </motion.foreignObject>
              {sub.count > 1 && (
                <text
                  x={iconPosition.x + iconSize / 2 + 5}
                  y={iconPosition.y + iconSize / 2 + 5}
                  fontSize="12"
                  fill={isDarkMode ? "#fff" : "#000"}
                  className={ibmPlexMonoBold.className}
                >
                  +{sub.count - 1}
                </text>
              )}
            </g>
          )
        })}
        <text
          x="250"
          y="230"
          textAnchor="middle"
          className={`${ibmPlexMonoThin.className} text-2xl`}
          fill={isDarkMode ? "#fff" : "#000"}
        >
          Monthly spend
        </text>
        <text
          x="250"
          y="270"
          textAnchor="middle"
          className={`${ibmPlexMonoBold.className} text-4xl`}
          fill={isDarkMode ? "#fff" : "#000"}
        >
          €{monthlySpend.toFixed(2)}
        </text>
      </svg>
    </div>
  )
}

export default WheelView