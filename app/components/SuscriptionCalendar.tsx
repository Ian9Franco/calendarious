'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CalendarView from './CalendarView'
import WheelView from './WheelView'
import SubscriptionSelector from './SubscriptionSelector'
import { Subscription, ibmPlexMonoThin, ibmPlexMonoBold, ibmPlexMonoThinItalic } from './Types'

export default function SubscriptionCalendar() {
  // Estado para controlar la vista (rueda o calendario)
  const [isWheelView, setIsWheelView] = useState(false)
  // Estado para almacenar las suscripciones
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  // Estado para almacenar la fecha actual
  const [currentDate, setCurrentDate] = useState(new Date())
  // Estado para almacenar la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  // Estado para almacenar la suscripción sobre la que se pasa el ratón
  const [hoveredSubscription, setHoveredSubscription] = useState<Subscription | null>(null)
  // Estado para controlar si el selector de suscripciones está abierto
  const [isSubscriptionSelectorOpen, setIsSubscriptionSelectorOpen] = useState(false)

  // Efecto para obtener la fecha actual
  useEffect(() => {
    const fetchCurrentDate = async () => {
      const apiDate = new Date()
      setCurrentDate(apiDate)
    }
    fetchCurrentDate()
  }, [])

  // Efecto para actualizar las fechas de pago de las suscripciones
  useEffect(() => {
    const updatedSubscriptions = subscriptions.map(sub => {
      const nextPaymentDate = new Date(sub.startDate)
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 30)
      while (nextPaymentDate < currentDate) {
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 30)
      }
      return { ...sub, date: nextPaymentDate.getDate() }
    })
    setSubscriptions(updatedSubscriptions)
  }, [currentDate, subscriptions])

  // Cálculo del gasto mensual total
  const monthlySpend = subscriptions.reduce((total, sub) => total + sub.amount, 0)

  // Función para cambiar entre la vista de rueda y calendario
  const toggleView = () => setIsWheelView(!isWheelView)

  // Función para añadir una nueva suscripción
  const addSubscription = useCallback((subscription: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>, date: number) => {
    // Crear una nueva fecha con el año y mes actuales, y el día seleccionado
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    const newSub: Subscription = {
      ...subscription,
      date, // Usar el día seleccionado directamente
      frequency: 'Every 30 days',
      totalSpent: 0,
      startDate: startDate.toISOString(),
    }
    setSubscriptions(prevSubscriptions => [...prevSubscriptions, newSub])
    setIsSubscriptionSelectorOpen(false)
    setSelectedDate(null)
  }, [currentDate])

  // Función para eliminar una suscripción
  const deleteSubscription = useCallback((subscriptionToDelete: Subscription) => {
    setSubscriptions(prevSubscriptions => prevSubscriptions.filter(sub => sub !== subscriptionToDelete))
  }, [])

  // Función para obtener el acrónimo del mes actual
  const getMonthAcronym = (date: Date) => {
    return date.toLocaleString('default', { month: 'short' }).toUpperCase()
  }

  // Función para manejar el clic en una fecha
  const handleDateClick = (date: number | null) => {
    setSelectedDate(date)
    setIsSubscriptionSelectorOpen(!!date)
  }

  // Función para cerrar el selector de suscripciones
  const closeSubscriptionSelector = () => {
    setIsSubscriptionSelectorOpen(false)
    setSelectedDate(null)
  }

  return (
    <div className={`min-h-screen bg-black text-white p-4 flex flex-col ${ibmPlexMonoThin.className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-3xl font-bold ${ibmPlexMonoBold.className}`}>
          {getMonthAcronym(currentDate)} <span className="text-gray-500">{currentDate.getFullYear()}</span>
        </h2>
        <motion.div 
          className="text-right cursor-pointer" 
          onClick={toggleView}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <p className={`text-sm text-gray-400 ${ibmPlexMonoThinItalic.className}`}>Gasto mensual</p>
          <p className={`text-2xl font-bold ${ibmPlexMonoBold.className}`}>${monthlySpend.toFixed(2)}</p>
        </motion.div>
      </div>

      <div className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          {isWheelView ? (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <WheelView
                subscriptions={subscriptions}
                monthlySpend={monthlySpend}
                setHoveredSubscription={setHoveredSubscription}
                hoveredSubscription={hoveredSubscription}
              />
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <CalendarView
                currentDate={currentDate}
                subscriptions={subscriptions}
                setSelectedDate={handleDateClick}
                setHoveredSubscription={setHoveredSubscription}
                hoveredSubscription={hoveredSubscription}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSubscriptionSelectorOpen && (
          <SubscriptionSelector
            selectedDate={selectedDate}
            subscriptions={subscriptions}
            addSubscription={addSubscription}
            deleteSubscription={deleteSubscription}
            onClose={closeSubscriptionSelector}
          />
        )}
      </AnimatePresence>
    </div>
  )
}