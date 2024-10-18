'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Columns3, Grid, ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarGrid from './CalendarGrid'
import WheelView from './WheelView'
import SubscriptionList from './SubscriptionList'
import SubscriptionSelector from './SubscriptionSelector'
import SubscriptionManager from './SubscriptionManager'
import DetailedSubscriptionView from './DetailedSubscriptionView'
import DarkModeToggle from './DarkModeToggle'
import { Subscription } from './Types'

export default function SubscriptionCalendar() {
  // States
  const [isWheelView, setIsWheelView] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [isSubscriptionSelectorOpen, setIsSubscriptionSelectorOpen] = useState(false)
  const [moreView, setMoreView] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Subscription[]>([])
  const [subscriptionManagerPosition, setSubscriptionManagerPosition] = useState({ x: 0, y: 0 })
  const [isFromCalendar, setIsFromCalendar] = useState(false)
  const [detailedSubscription, setDetailedSubscription] = useState<Subscription | null>(null)
  const [detailedSubscriptionPosition, setDetailedSubscriptionPosition] = useState({ x: 0, y: 0 })
  const [direction, setDirection] = useState(0)

  // Calculate monthly spend
  const monthlySpend = useMemo(() => subscriptions.reduce((total, sub) => total + sub.amount, 0), [subscriptions])

  // Utility functions
  const toggleView = useCallback(() => setIsWheelView(prev => !prev), [])
  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), [])

  // Effect to apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Function to add a new subscription
  const addSubscription = useCallback((subscription: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>, date: number) => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    const newSub: Subscription = {
      ...subscription,
      date,
      frequency: 'Monthly',
      totalSpent: 0,
      startDate: startDate.toISOString(),
    }
    setSubscriptions(prevSubscriptions => [...prevSubscriptions, newSub])
    
    setIsSubscriptionSelectorOpen(false)
  }, [currentDate])

  // Function to delete a subscription
  const deleteSubscription = useCallback((subscriptionToDelete: Subscription) => {
    setSubscriptions(prevSubscriptions => prevSubscriptions.filter(sub => 
      !(sub.name === subscriptionToDelete.name && sub.date === subscriptionToDelete.date)
    ))
    setSelectedSubscriptions([])
  }, [])

  // Handler for clicking a subscription in the calendar
  const handleSubscriptionClick = useCallback((clickedSubscriptions: Subscription[], date: number, event: React.MouseEvent) => {
    setSelectedSubscriptions(clickedSubscriptions)
    const rect = event.currentTarget.getBoundingClientRect()
    setSubscriptionManagerPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY })
    setSelectedDate(date)
    setIsFromCalendar(true)
  }, [])

  // Handler for clicking a subscription in the list
  const handleSubscriptionListClick = useCallback((subscriptions: Subscription[], date: number, event: React.MouseEvent) => {
    setDetailedSubscription(subscriptions[0])
    const rect = event.currentTarget.getBoundingClientRect()
    setDetailedSubscriptionPosition({ x: rect.right + window.scrollX, y: rect.top + window.scrollY })
  }, [])

  // Function to change the month
  const changeMonth = useCallback((increment: number) => {
    setDirection(increment)
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + increment)
      return newDate
    })
  }, [])

  // Function to get the month acronym
  const getMonthAcronym = useCallback((date: Date) => {
    return date.toLocaleString('es-ES', { month: 'short' }).toUpperCase()
  }, [])

  // Handler for clicking a date
  const handleDateClick = useCallback((date: number | null) => {
    setSelectedDate(date)
    setIsSubscriptionSelectorOpen(!!date)
  }, [])

  // Handler for canceling a subscription
  const handleCancelSubscription = useCallback((subscription: Subscription) => {
    deleteSubscription(subscription)
  }, [deleteSubscription])

  // Handler for confirming a payment
  const handleConfirmPayment = useCallback((subscription: Subscription) => {
    console.log('Confirmed payment for subscription:', subscription)
  }, [])

  // Function to set the hovered subscription
  const setHoveredSubscription = useCallback((subscription: Subscription | null) => {
    console.log('Hovered subscription:', subscription)
  }, [])

  // Animation variants for month transition
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <main className={`w-full min-h-screen flex flex-col items-center justify-start md:justify-center px-4 py-10 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-gray-100'} font-sans`}>
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Calendario de Suscripciones</h1>
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div className="relative w-full flex-col lg:flex-row justify-center flex items-start gap-8">
            <motion.div layout className="w-full">
              <motion.div
                key="calendar-view"
                className="w-full flex-col flex gap-4"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center">
                    <button onClick={() => changeMonth(-1)} className={`mr-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} aria-label="Mes anterior">
                      <ChevronLeft />
                    </button>
                    <AnimatePresence custom={direction}>
                      <motion.h2
                        key={currentDate.getMonth()}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className={`text-4xl mb-2 font-bold tracking-wider ${isDarkMode ? 'text-zinc-300' : 'text-gray-800'}`}
                      >
                        {getMonthAcronym(currentDate)} <span className="opacity-50">{currentDate.getFullYear()}</span>
                      </motion.h2>
                    </AnimatePresence>
                    <button onClick={() => changeMonth(1)} className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} aria-label="Mes siguiente">
                      <ChevronRight />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.button
                      className={`flex items-center relative border rounded-lg py-1 px-1.5 gap-3 ${
                        isDarkMode ? 'text-[#323232] border-[#323232]' : 'text-gray-600 border-gray-300'
                      }`}
                      onClick={toggleView}
                      aria-label={isWheelView ? "Ver cuadrícula" : "Ver rueda"}
                    >
                      {isWheelView ? <Grid className="z-[2]" /> : <Columns3 className="z-[2]" />}
                    </motion.button>
                    <motion.button
                      className={`flex items-center relative border rounded-lg py-1 px-1.5 gap-3 ${
                        isDarkMode ? 'text-[#323232] border-[#323232]' : 'text-gray-600 border-gray-300'
                      }`}
                      onClick={() => setMoreView(!moreView)}
                      aria-label={moreView ? "Ver menos" : "Ver más"}
                    >
                      <Columns3 className="z-[2]" />
                      <Grid className="z-[2]" />
                      <motion.div
                        className={`absolute top-0 left-0 w-7 h-[85%] rounded-md ${isDarkMode ? 'bg-white' : 'bg-gray-800'}`}
                        animate={{
                          x: moreView ? 40 : 4,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>
                </div>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentDate.getMonth()}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    {isWheelView ? (
                      <WheelView
                        subscriptions={subscriptions}
                        setHoveredSubscription={setHoveredSubscription}
                        isDarkMode={isDarkMode}
                        onSubscriptionClick={handleSubscriptionClick}
                        monthlySpend={monthlySpend}
                      />
                    ) : (
                      <>
                        <div className="grid grid-cols-7 gap-2">
                          {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((day) => (
                            <div
                              key={day}
                              className={`text-xs text-center py-1 px-0.5 rounded-xl ${
                                isDarkMode ? 'bg-[#323232] text-white' : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                        <CalendarGrid
                          subscriptions={subscriptions}
                          currentDate={currentDate}
                          onDayClick={handleDateClick}
                          onSubscriptionClick={handleSubscriptionClick}
                          isDarkMode={isDarkMode}
                        />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
            <AnimatePresence>
              {moreView && (
                <motion.div
                  className="w-full max-w-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    key="more-view"
                    className="w-full flex-col flex gap-4 mt-4"
                  >
                    <div className="w-full flex flex-col items-start justify-between">
                      <motion.h2 className={`text-4xl mb-2 font-bold tracking-wider ${isDarkMode ? 'text-zinc-300' : 'text-gray-800'}`}>
                        Suscripciones
                      </motion.h2>
                      <p className={`font-medium ${isDarkMode ? 'text-zinc-300/50' : 'text-gray-600'}`}>
                        Ver suscripciones activas y próximos pagos.
                      </p>
                    </div>
                    <motion.div
                      className={`border-2 flex flex-col items-start justify-start overflow-hidden rounded-xl shadow-md h-[620px] overflow-y-auto ${
                        isDarkMode ? 'border-[#323232]' : 'border-gray-200'
                      }`}
                      layout
                    >
                      <SubscriptionList 
                        subscriptions={subscriptions}
                        deleteSubscription={deleteSubscription}
                        isDarkMode={isDarkMode}
                        onSubscriptionClick={handleSubscriptionListClick}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
        {isSubscriptionSelectorOpen && (
          <SubscriptionSelector
            selectedDate={selectedDate}
            addSubscription={addSubscription}
            onClose={() => setIsSubscriptionSelectorOpen(false)}
            isDarkMode={isDarkMode}
          />
        )}
        <AnimatePresence>
          {selectedSubscriptions.length > 0 && (
            <SubscriptionManager
              subscriptions={selectedSubscriptions}
              selectedDate={selectedDate || 1}
              onCancel={handleCancelSubscription}
              onPause={handleConfirmPayment}
              onClose={() => setSelectedSubscriptions([])}
              isDarkMode={isDarkMode}
              position={subscriptionManagerPosition}
              isFromCalendar={isFromCalendar}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {detailedSubscription && (
            <DetailedSubscriptionView
              subscription={detailedSubscription}
              onClose={() => setDetailedSubscription(null)}
              isDarkMode={isDarkMode}
              position={detailedSubscriptionPosition}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}