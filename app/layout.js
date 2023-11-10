import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { Inter } from 'next/font/google'
import './globals.css'

import "@maptiler/sdk/dist/maptiler-sdk.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Wander',
  description: 'Wandering about your next destination? Start exploring and plan at the same time.',
  icons: {
    icon: '/logo.svg'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>{children}</body>
    </html>
  )
}
