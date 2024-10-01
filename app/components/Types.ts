import { IconType } from 'react-icons'
import { FaSpotify, FaLinkedin, FaAmazon, FaMedium, FaApple } from 'react-icons/fa'
import { SiLinear, SiNetflix, SiSupabase } from 'react-icons/si'
import localFont from 'next/font/local'

export type Subscription = {
  name: string
  icon: IconType
  color: string
  amount: number
  date: number
  frequency: string
  totalSpent: number
  startDate: string
}

export const availableSubscriptions: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>[] = [
  { name: 'Netflix', icon: SiNetflix, color: '#E50914', amount: 12.99, frequency: 'Monthly' },
  { name: 'Spotify', icon: FaSpotify, color: '#1DB954', amount: 9.99, frequency: 'Monthly' },
  { name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2', amount: 8.99, frequency: 'Monthly' },
  { name: 'Amazon', icon: FaAmazon, color: '#FF9900', amount: 7.99, frequency: 'Monthly' },
  { name: 'Medium', icon: FaMedium, color: '#00AB6C', amount: 5, frequency: 'Monthly' },
  { name: 'iCloud', icon: FaApple, color: '#A2AAAD', amount: 0.99, frequency: 'Monthly' },
  { name: 'Linear', icon: SiLinear, color: '#5E6AD2', amount: 6.99, frequency: 'Monthly' },
  { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E', amount: 7.99, frequency: 'Monthly' },
]

export const ibmPlexMonoThin = localFont({ src: '../fonts/IBMPlexMono-Thin.ttf' })
export const ibmPlexMonoRegular = localFont({ src: '../fonts/IBMPlexMono-Regular.ttf' })
export const ibmPlexMonoBold = localFont({ src: '../fonts/IBMPlexMono-Bold.ttf' })
export const ibmPlexMonoThinItalic = localFont({ src: '../fonts/IBMPlexMono-ThinItalic.ttf' })
export const ibmPlexMonoBoldItalic = localFont({ src: '../fonts/IBMPlexMono-BoldItalic.ttf' })