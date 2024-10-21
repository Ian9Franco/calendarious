import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Subscription } from '../utils/Types'

interface SubscriptionManagerProps {
  subscriptions: Subscription[]
  selectedDate: number
  onCancel: (subscription: Subscription) => void
  onPause: (subscription: Subscription) => void
  onClose: () => void
  isDarkMode: boolean
  position: { x: number; y: number }
  isFromCalendar: boolean
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ 
  subscriptions, 
  selectedDate, 
  onCancel, 
  onPause, 
  onClose,
  isDarkMode,
  position,
  isFromCalendar
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const bottomMargin = 20;
        const rightMargin = 20;
    
        const newTop = Math.min(position.y, windowHeight - rect.height - bottomMargin);
        const newLeft = Math.min(position.x, windowWidth - rect.width - rightMargin);
    
        containerRef.current.style.top = `${newTop}px`;
        containerRef.current.style.left = `${newLeft}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial position

    return () => window.removeEventListener('resize', handleResize);
  }, [position, subscriptions]);

  const getBorderGradient = () => {
    if (subscriptions.length === 0) return 'linear-gradient(to right, #ccc, #ccc)';
    if (subscriptions.length === 1) return `linear-gradient(to right, ${subscriptions[0].color}, ${subscriptions[0].color})`;
    return `linear-gradient(to right, ${subscriptions.map(sub => sub.color).join(', ')})`;
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50"
        style={{ 
          left: `${position.x}px`,
          maxHeight: '300px',
          width: '250px',
          maxWidth: 'calc(100vw - 40px)',
          backgroundImage: getBorderGradient(),
          borderRadius: '12px',
          padding: '2px',
        }}
      >
        <div className={`w-full h-full rounded-[10px] ${isDarkMode ? 'bg-black' : 'bg-white'} overflow-hidden`}>
          <div className="p-4">
            <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedDate} de {new Date().toLocaleString('es-ES', { month: 'long' })}
            </h2>
            <div className="max-h-[200px] overflow-y-auto">
              {subscriptions.map((subscription, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-center mb-2">
                    <Image
                      src={subscription.image}
                      alt={subscription.name}
                      width={32}
                      height={32}
                      className="rounded-full mr-3"
                    />
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{subscription.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>€{subscription.amount.toFixed(2)} / {subscription.frequency}</p>
                    </div>
                  </div>
                  {!isFromCalendar && (
                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => onCancel(subscription)}
                        className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800'}`}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => onPause(subscription)}
                        className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'}`}
                      >
                        Pausar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SubscriptionManager