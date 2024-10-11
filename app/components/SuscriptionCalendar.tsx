'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Columns3, Grid, ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarGrid from './CalendarGrid'
import WheelView from './WheelView'
import SubscriptionList from './SubscriptionList'
import SubscriptionSelector from './SubscriptionSelector'
import SubscriptionManagerBar from './SubscriptionManagerBar'
import { Subscription, availableSubscriptions } from './Types'

export default function SubscriptionCalendar() {
  const [isWheelView, setIsWheelView] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [hoveredSubscription, setHoveredSubscription] = useState<Subscription | null>(null)
  const [isSubscriptionSelectorOpen, setIsSubscriptionSelectorOpen] = useState(false)
  const [moreView, setMoreView] = useState(false)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  const monthlySpend = useMemo(() => subscriptions.reduce((total, sub) => total + sub.amount, 0), [subscriptions])

  const toggleView = useCallback(() => setIsWheelView(!isWheelView), [isWheelView])

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
    setSelectedDate(null)
  }, [currentDate])

  const deleteSubscription = useCallback((subscriptionToDelete: Subscription) => {
    setSubscriptions(prevSubscriptions => prevSubscriptions.filter(sub => 
      !(sub.name === subscriptionToDelete.name && sub.date === subscriptionToDelete.date)
    ))
  }, [])

  const updateSubscription = useCallback((oldSubscription: Subscription, newSubscription: Subscription) => {
    setSubscriptions(prevSubscriptions => prevSubscriptions.map(sub =>
      (sub.name === oldSubscription.name && sub.date === oldSubscription.date) ? newSubscription : sub
    ))
  }, [])

  const getMonthAcronym = useCallback((date: Date) => {
    return date.toLocaleString('default', { month: 'short' }).toUpperCase()
  }, [])

  const handleDateClick = useCallback((date: number | null) => {
    setSelectedDate(date)
    
    setIsSubscriptionSelectorOpen(!!date)
  }, [])

  const handleDayHover = useCallback((day: string | null) => {
    setHoveredDay(day)
  }, [])

  const changeMonth = useCallback((increment: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + increment)
      return newDate
    })
  }, [])

  const sortedSubscriptions = useMemo(() => {
    if (!hoveredDay) return subscriptions
    return [...subscriptions].sort((a, b) => {
      if (a.date.toString() === hoveredDay) return -1
      if (b.date.toString() === hoveredDay) return 1
      return 0
    })
  }, [hoveredDay, subscriptions])

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-start md:justify-center px-4 py-10 bg-black font-sans">
      <AnimatePresence mode="wait">
        <motion.div className="relative mx-auto my-10 w-full flex-col lg:flex-row justify-center flex items-start gap-8">
          <motion.div layout className="w-full max-w-lg">
            <motion.div
              key="calendar-view"
              className="w-full flex-col flex gap-4"
            >
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center">
                  <button onClick={() => changeMonth(-1)} className="text-white mr-2" aria-label="Previous month">
                    <ChevronLeft />
                  </button>
                  <motion.h2 className="text-4xl mb-2 font-bold tracking-wider text-zinc-300">
                    {getMonthAcronym(currentDate)} <span className="opacity-50">{currentDate.getFullYear()}</span>
                  </motion.h2>
                  <button onClick={() => changeMonth(1)} className="text-white ml-2" aria-label="Next month">
                    <ChevronRight />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    className="flex items-center text-[#323232] relative border rounded-lg py-1 px-1.5 border-[#323232] gap-3"
                    onClick={toggleView}
                    aria-label={isWheelView ? "View grid" : "View wheel"}
                  >
                    {isWheelView ? <Grid className="z-[2]" /> : <Columns3 className="z-[2]" />}
                  </motion.button>
                  <motion.button
                    className="flex items-center text-[#323232] relative border rounded-lg py-1 px-1.5 border-[#323232] gap-3"
                    onClick={() => setMoreView(!moreView)}
                    aria-label={moreView ? "View less" : "View more"}
                  >
                    <Columns3 className="z-[2]" />
                    <Grid className="z-[2]" />
                    <motion.div
                      className="absolute top-0 left-0 w-7 h-[85%] bg-white rounded-md"
                      animate={{
                        x: moreView ? 40 : 4,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </div>
              {isWheelView ? (
                <WheelView
                  subscriptions={subscriptions}
                  monthlySpend={monthlySpend}
                  setHoveredSubscription={setHoveredSubscription}
                  hoveredSubscription={hoveredSubscription}
                />
              ) : (
                <>
                  <div className="grid grid-cols-7 gap-2">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                      <div
                        key={day}
                        className="text-xs text-white text-center bg-[#323232] py-1 px-0.5 rounded-xl"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <CalendarGrid
                    subscriptions={subscriptions}
                    currentDate={currentDate}
                    onHover={handleDayHover}
                    onDateClick={handleDateClick}
                    hoveredDay={hoveredDay}
                  />
                </>
              )}
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
                    <motion.h2 className="text-4xl mb-2 font-bold tracking-wider text-zinc-300">
                      Subscriptions
                    </motion.h2>
                    <p className="font-medium text-zinc-300/50">
                      View active subscriptions and upcoming payments.
                    </p>
                  </div>
                  <motion.div
                    className="border-2 border-[#323232] flex flex-col items-start justify-start overflow-hidden rounded-xl shadow-md h-[620px] overflow-y-scroll"
                    layout
                  >
                    <SubscriptionList 
                      subscriptions={sortedSubscriptions}
                      deleteSubscription={deleteSubscription}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
      <SubscriptionManagerBar
        subscriptions={subscriptions}
        deleteSubscription={deleteSubscription}
        updateSubscription={updateSubscription}
      />
      <AnimatePresence>
        {isSubscriptionSelectorOpen && (
          <SubscriptionSelector
            selectedDate={selectedDate}
            subscriptions={subscriptions}
            addSubscription={addSubscription}
            onClose={() => setIsSubscriptionSelectorOpen(false)}
            availableSubscriptions={availableSubscriptions}
          />
        )}
      </AnimatePresence>
    </main>
  )
}