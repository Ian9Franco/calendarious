import { IconType } from 'react-icons'
import { FaSpotify, FaLinkedin, FaAmazon, FaMedium, FaApple } from 'react-icons/fa'
import { SiLinear, SiNetflix, SiSupabase } from 'react-icons/si'
import localFont from 'next/font/local'

// Definición del tipo Subscription
export type Subscription = {
  name: string // Nombre de la suscripción
  icon: IconType // Icono de la suscripción (fallback)
  image?: string // Ruta de la imagen PNG para el icono
  color: string // Color asociado a la suscripción
  amount: number // Monto de la suscripción
  date: number // Fecha de pago (día del mes)
  frequency: string // Frecuencia de pago (ej. "Monthly")
  totalSpent: number // Total gastado en esta suscripción
  startDate: string // Fecha de inicio de la suscripción
}

// Lista de suscripciones disponibles
export const availableSubscriptions: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>[] = [
  { name: 'Netflix', icon: SiNetflix, image: '/brand/netflix.png', color: '#E50914', amount: 12.99, frequency: 'Monthly' },
  { name: 'Spotify', icon: FaSpotify, image: '../public/brand/Spotify.png', color: '#1DB954', amount: 9.99, frequency: 'Monthly' },
  { name: 'LinkedIn', icon: FaLinkedin, image: '/brand/linkedin.png', color: '#0A66C2', amount: 8.99, frequency: 'Monthly' },
  { name: 'Amazon', icon: FaAmazon, image: '/brand/amazon.png', color: '#FF9900', amount: 7.99, frequency: 'Monthly' },
  { name: 'Medium', icon: FaMedium, image: '/brand/medium.png', color: '#00AB6C', amount: 5, frequency: 'Monthly' },
  { name: 'iCloud', icon: FaApple, image: '/brand/icloud.png', color: '#A2AAAD', amount: 0.99, frequency: 'Monthly' },
  { name: 'Linear', icon: SiLinear, image: '/brand/linear.png', color: '#5E6AD2', amount: 6.99, frequency: 'Monthly' },
  { name: 'Supabase', icon: SiSupabase, image: '/brand/supabase.png', color: '#3ECF8E', amount: 7.99, frequency: 'Monthly' },
]

// Definición de fuentes personalizadas
export const ibmPlexMonoThin = localFont({ src: '../fonts/IBMPlexMono-Thin.ttf' })
export const ibmPlexMonoRegular = localFont({ src: '../fonts/IBMPlexMono-Regular.ttf' })
export const ibmPlexMonoBold = localFont({ src: '../fonts/IBMPlexMono-Bold.ttf' })
export const ibmPlexMonoThinItalic = localFont({ src: '../fonts/IBMPlexMono-ThinItalic.ttf' })
export const ibmPlexMonoBoldItalic = localFont({ src: '../fonts/IBMPlexMono-BoldItalic.ttf' })