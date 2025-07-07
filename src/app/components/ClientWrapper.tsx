"use client"

import React from 'react'
import { LoadingProvider } from '@/app/context/LoadingContext'
import GlobalLoader from '@/app/components/ui/GlobalLoader'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <GlobalLoader />
      {children}
    </LoadingProvider>
  )
}
