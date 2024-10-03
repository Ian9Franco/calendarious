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
  // Calcular el monto total de todas las suscripciones
  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)
  let startAngle = 0

  // Definir el radio del círculo interno para el monto mensual
  const innerCircleRadius = 150

  return (
    <div className="relative h-[300px] sm:h-[600px] w-full">
      {/* SVG para dibujar el círculo y los arcos de las suscripciones */}
      <svg width="100%" height="100%" viewBox="0 0 600 600">
        {/* Círculo base (ahora transparente) */}
        <motion.circle 
          cx="300" 
          cy="300" 
          r="250" 
          fill="none" 
          stroke="transparent" 
          strokeWidth="30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {/* Mapear las suscripciones para crear los arcos */}
        {subscriptions.map((sub, index) => {
          const angle = (sub.amount / totalAmount) * 360
          const endAngle = startAngle + angle
          const largeArcFlag = angle > 180 ? 1 : 0

          // Añadir un espacio más grande entre las suscripciones
          const gapAngle = 10 // Aumentado de 2 a 10 grados
          const adjustedStartAngle = startAngle + gapAngle / 2
          const adjustedEndAngle = endAngle - gapAngle / 2

          const startX = 300 + 250 * Math.cos((adjustedStartAngle * Math.PI) / 180)
          const startY = 300 + 250 * Math.sin((adjustedStartAngle * Math.PI) / 180)
          const endX = 300 + 250 * Math.cos((adjustedEndAngle * Math.PI) / 180)
          const endY = 300 + 250 * Math.sin((adjustedEndAngle * Math.PI) / 180)

          const path = `M ${startX} ${startY} A 250 250 0 ${largeArcFlag} 1 ${endX} ${endY}`

          const iconX = 300 + 290 * Math.cos(((adjustedStartAngle + adjustedEndAngle) / 2) * (Math.PI / 180))
          const iconY = 300 + 290 * Math.sin(((adjustedStartAngle + adjustedEndAngle) / 2) * (Math.PI / 180))

          startAngle = endAngle

          return (
            <g key={sub.name} onMouseEnter={() => setHoveredSubscription(sub)} onMouseLeave={() => setHoveredSubscription(null)}>
              {/* Arco de la suscripción */}
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
              {/* Icono de la suscripción */}
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
        {/* Círculo interno para el monto mensual */}
        <circle
          cx="300"
          cy="300"
          r={innerCircleRadius}
          fill="rgba(0, 0, 0, 0.7)"
        />
      </svg>
      {/* Contenedor del gasto mensual total */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        style={{
          width: `${innerCircleRadius * 2}px`,
          height: `${innerCircleRadius * 2}px`,
          flexDirection: 'column',
        }}
        >
        <p className={`${ibmPlexMonoThin.className} text-sm`}>Gasto mensual</p>
        <p className={`${ibmPlexMonoBold.className} text-2xl`}>${monthlySpend.toFixed(2)}</p>
      </motion.div>


      {/* Información de la suscripción al pasar el ratón */}
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