import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface StockData {
  symbol: string
  price: number
  prevClose: number
  change: number
  gap: number
  volume: number
  avgVolume: number
  marketCap: number
  float: number
  rsi: number
  vwap: number
}

interface ScannerState {
  results: StockData[]
  loading: boolean
  scanning: boolean
  error: string | null
  runScan: () => Promise<void>
  saveScan: (results: StockData[], marketPhase: string) => Promise<void>
  clearResults: () => void
}

export const useScannerStore = create<ScannerState>((set) => ({
  results: [],
  loading: false,
  scanning: false,
  error: null,

  runScan: async () => {
    set({ scanning: true, error: null })

    try {
      const { data, error } = await supabase.functions.invoke('scan-stocks', {
        body: {}
      })

      if (error) throw error

      set({ results: data.results, scanning: false })
    } catch (error: any) {
      set({ error: error.message, scanning: false })
    }
  },

  saveScan: async (results: StockData[], marketPhase: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('scans')
      .insert({
        user_id: user.id,
        scan_data: results,
        stock_count: results.length,
        market_phase: marketPhase
      })

    if (error) throw error
  },

  clearResults: () => {
    set({ results: [], error: null })
  }
}))
