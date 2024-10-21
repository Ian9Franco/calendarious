import { Subscription } from './Types'

export function calculateMonthlySpend(subscriptions: Subscription[], currentDate: Date): number {
  return subscriptions.reduce((total, sub) => {
    if (isSubscriptionActive(sub, currentDate)) {
      return total + sub.amount
    }
    return total
  }, 0)
}

export function calculateTotalSpent(subscription: Subscription, currentDate: Date): number {
  const startDate = new Date(subscription.startDate)
  let totalSpent = 0
  const currentMonth = new Date(startDate)

  while (currentMonth <= currentDate) {
    if (isSubscriptionActive(subscription, currentMonth)) {
      totalSpent += subscription.amount
    }
    currentMonth.setMonth(currentMonth.getMonth() + 1)
  }

  return totalSpent
}

export function pauseSubscription(subscription: Subscription, monthsToPause: number, currentDate: Date): Subscription {
  const pauseStartDate = new Date(currentDate)
  pauseStartDate.setDate(subscription.date) // Set to the subscription's payment date
  if (pauseStartDate < currentDate) {
    pauseStartDate.setMonth(pauseStartDate.getMonth() + 1)
  }

  const pauseEndDate = new Date(pauseStartDate)
  pauseEndDate.setMonth(pauseEndDate.getMonth() + monthsToPause)

  // Calculate the next payment date
  const nextPaymentDate = new Date(pauseEndDate)
  nextPaymentDate.setDate(subscription.date)
  if (nextPaymentDate <= pauseEndDate) {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
  }

  return {
    ...subscription,
    pausedUntil: pauseEndDate.toISOString(),
    nextPaymentDate: nextPaymentDate.toISOString()
  }
}

export function unpauseSubscription(subscription: Subscription): Subscription {
  return {
    ...subscription,
    pausedUntil: undefined,
    nextPaymentDate: undefined
  }
}

export function isSubscriptionActive(subscription: Subscription, date: Date): boolean {
  const subscriptionDate = new Date(subscription.startDate)
  if (subscriptionDate > date) {
    return false
  }

  if (subscription.pausedUntil) {
    const pausedUntil = new Date(subscription.pausedUntil)
    if (date >= subscriptionDate && date < pausedUntil) {
      return false
    }
  }

  return true
}

export function isSubscriptionPaused(subscription: Subscription, date: Date): boolean {
  if (subscription.pausedUntil) {
    const pausedUntil = new Date(subscription.pausedUntil)
    const subscriptionDate = new Date(subscription.startDate)
    return date >= subscriptionDate && date < pausedUntil
  }
  return false
}

export function getLastThreeMonthsPayments(subscriptions: Subscription[], currentDate: Date): { month: string, total: number }[] {
  const result = []
  for (let i = 1; i <= 3; i++) {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() - i)
    const total = calculateMonthlySpend(subscriptions, date)
    result.push({
      month: date.toLocaleString('default', { month: 'long' }),
      total
    })
  }
  return result.reverse()
}