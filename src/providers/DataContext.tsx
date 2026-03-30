import type { ReactNode } from 'react'
import type { DataProvider } from './types'
import { MockDataProvider } from './MockDataProvider'
import { DataContext } from './context'

export function DataProviderComponent({ provider, children }: { provider?: DataProvider; children: ReactNode }) {
  const value = provider ?? new MockDataProvider()
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
