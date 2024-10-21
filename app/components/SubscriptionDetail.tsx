import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Subscription, ibmPlexMonoBold, ibmPlexMonoRegular } from '../utils/Types'
import { X, Calendar, DollarSign, Clock, BarChart2 } from 'lucide-react'

interface DetailedSubscriptionViewProps {
  subscription: Subscription
  onClose: () => void
  isDarkMode: boolean
  position: { x: number; y: number }
}

const DetailedSubscriptionView: React.FC<DetailedSubscriptionViewProps> = ({
  subscription,
  onClose,
  isDarkMode,
  position,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Función para ajustar la posición del popup
    const adjustPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Calcular las nuevas coordenadas
        let newX = position.x
        let newY = position.y

        // Ajustar horizontalmente si se sale de la pantalla
        if (newX + rect.width > viewportWidth) {
          newX = viewportWidth - rect.width - 10 // 10px de margen
        }

        // Ajustar verticalmente si se sale de la pantalla
        if (newY + rect.height > viewportHeight) {
          newY = viewportHeight - rect.height - 10 // 10px de margen
        }

        // Aplicar las nuevas coordenadas
        containerRef.current.style.left = `${newX}px`
        containerRef.current.style.top = `${newY}px`
      }
    }

    // Ajustar la posición inicial
    adjustPosition()

    // Agregar event listener para ajustar la posición en caso de que cambie el tamaño de la ventana
    window.addEventListener('resize', adjustPosition)

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', adjustPosition)
    }
  }, [position])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 w-80 rounded-lg shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
        overflow: 'auto',
      }}
    >
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl ${ibmPlexMonoBold.className}`}>{subscription.name}</h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <X size={24} />
          </button>
        </div>
        <div className="flex items-center mb-4">
          <Image
            src={subscription.image}
            alt={subscription.name}
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
          <div>
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>{subscription.name}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Próximo pago: {new Date(subscription.startDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Monto: €{subscription.amount.toFixed(2)} / {subscription.frequency}</p>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Frecuencia: {subscription.frequency}</p>
          </div>
          <div className="flex items-center">
            <BarChart2 className="mr-2" size={16} />
            <p className={`${ibmPlexMonoRegular.className} text-sm`}>Gasto total: €{subscription.totalSpent.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800'}`}>
            Cancelar Suscripción
          </button>
          <button className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'}`}>
            Pausar Suscripción
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default DetailedSubscriptionView