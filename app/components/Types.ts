import localFont from 'next/font/local'

// Definición del tipo Subscription
export type Subscription = {
  name: string
  image: string
  color: string
  amount: number
  date: number
  frequency: string
  totalSpent: number
  startDate: string
}

// Lista de suscripciones disponibles
export const availableSubscriptions: Omit<Subscription, 'date' | 'totalSpent' | 'startDate'>[] = [
  { name: 'Netflix', image: '/brand/Netflix.png', color: '#E50914', amount: 12.99, frequency: 'Monthly' },
  { name: 'Spotify', image: '/brand/Spotify.png', color: '#1DB954', amount: 9.99, frequency: 'Monthly' },
  { name: 'LinkedIn', image: '/brand/LinkedIn.png', color: '#0A66C2', amount: 8.99, frequency: 'Monthly' },
  { name: 'Amazon', image: '/brand/Amazon.png', color: '#FF9900', amount: 7.99, frequency: 'Monthly' },
  { name: 'Disney', image: '/brand/Disney.png', color: '#113CCF', amount: 7.99, frequency: 'Monthly' },
  { name: 'HBO Max', image: '/brand/hbomax.png', color: '#5E2DEB', amount: 5, frequency: 'Monthly' },
  { name: 'Paramount', image: '/brand/paramount.png', color: '#0064FF', amount: 0.99, frequency: 'Monthly' },
  { name: 'Apple TV', image: '/brand/AppleTV.png', color: '#000000', amount: 6.99, frequency: 'Monthly' },
  { name: 'Discord', image: '/brand/discord.png', color: '#5865F2', amount: 7.99, frequency: 'Monthly' },
]

// Definición de fuentes personalizadas
export const ibmPlexMonoThin = localFont({ src: '../fonts/IBMPlexMono-Thin.ttf' })
export const ibmPlexMonoRegular = localFont({ src: '../fonts/IBMPlexMono-Regular.ttf' })
export const ibmPlexMonoBold = localFont({ src: '../fonts/IBMPlexMono-Bold.ttf' })
export const ibmPlexMonoThinItalic = localFont({ src: '../fonts/IBMPlexMono-ThinItalic.ttf' })
export const ibmPlexMonoBoldItalic = localFont({ src: '../fonts/IBMPlexMono-BoldItalic.ttf' })