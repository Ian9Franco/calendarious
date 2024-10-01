'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CalendarView from './CalendarView'
import WheelView from './WheelView'
import SubscriptionSelector from './SubscriptionSelector'
import { Subscription, ibmPlexMonoThin, ibmPlexMonoBold, ibmPlexMonoThinItalic } from './Types'

export default function SubscriptionCalendar() {
  const [isWheelView, setIsWheelView] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [hoveredSubscription, setHoveredSubscription] = useState<Subscription | null>(null)
  const [isSubscriptionSelectorOpen, setIsSubscriptionSelectorOpen] = useState(false)

  useEffect(() => {
    const fetchCurrentDate = async () => {
      const apiDate = new Date()
      setCurrentDate(apiDate)
    }
    fetchCurrentDate()
  }, [])

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

  const monthlySpend = subscriptions.reduce((total, sub) => total + sub.amount, 0)

  const toggleView = () => setIsWheelView(!isWheelView)

  const addSubscription = (subscription: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>, date: number) => {
    const startDate = new Date(currentDate)
    startDate.setDate(date)
    const newSub: Subscription = {
      ...subscription,
      date,
      frequency: `Every ${date}${date === 1 ? 'st' : date === 2 ? 'nd' : date === 3 ? 'rd' : 'th'}`,
      totalSpent: 0,
      startDate: startDate.toISOString().split('T')[0],
    }
    setSubscriptions([...subscriptions, newSub])
  }

  const deleteSubscription = (subscriptionToDelete: Subscription) => {
    setSubscriptions(subscriptions.filter(sub => sub !== subscriptionToDelete))
  }

  const getMonthAcronym = (date: Date) => {
    return date.toLocaleString('default', { month: 'short' }).toUpperCase()
  }

  const handleDateClick = (date: number | null) => {
    setSelectedDate(date)
    setIsSubscriptionSelectorOpen(!!date)
  }

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
          <p className={`text-sm text-gray-400 ${ibmPlexMonoThinItalic.className}`}>Monthly spend</p>
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