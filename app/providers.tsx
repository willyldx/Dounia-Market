'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { useCart } from '@/stores/cart'
import { useAuth } from '@/stores/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchRates = useCart((s) => s.fetchRates)
  const checkSession = useAuth((s) => s.checkSession)

  useEffect(() => {
    fetchRates()
    checkSession()
  }, [fetchRates, checkSession])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  )
}
