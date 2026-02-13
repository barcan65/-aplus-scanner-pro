import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Scan {
  id: string
  scan_data: any[]
  stock_count: number
  market_phase: string
  created_at: string
}

export default function History() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScans()
  }, [])

  const loadScans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setScans(data || [])
    } catch (error) {
      console.error('Error loading scans:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteScan = async (id: string) => {
    if (!confirm('Delete this scan?')) return

    const { error } = await supabase.from('scans').delete().eq('id', id)

    if (error) {
      alert('Failed to delete scan')
    } else {
      setScans(scans.filter(s => s.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
        <p className="text-blue-200 text-lg">Loading scan history...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-4">Scan History</h2>
        <p className="text-blue-200">View and manage your previous scans</p>
      </div>

      {scans.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <p className="text-blue-200 text-lg">
            No scan history yet. Run a scan and save it to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map((scan) => (
            <div key={scan.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {scan.stock_count} stocks found
                  </h3>
                  <p className="text-blue-200">
                    {new Date(scan.created_at).toLocaleString()} • {scan.market_phase}
                  </p>
                </div>
                <button
                  onClick={() => deleteScan(scan.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {scan.scan_data.slice(0, 12).map((stock: any) => (
                  <div key={stock.symbol} className="bg-white/20 rounded p-2">
                    <div className="font-bold text-white">{stock.symbol}</div>
                    <div className="text-sm text-blue-200">${stock.price?.toFixed(2)}</div>
                  </div>
                ))}
                {scan.scan_data.length > 12 && (
                  <div className="bg-white/20 rounded p-2 flex items-center justify-center">
                    <div className="text-blue-200">+{scan.scan_data.length - 12} more</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
