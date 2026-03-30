import { createContext, useContext } from 'react'
import type { DataProvider } from './types'
import { MockDataProvider } from './MockDataProvider'

export const DataContext = createContext<DataProvider>(new MockDataProvider())

export function useDataProvider(): DataProvider {
  return useContext(DataContext)
}
