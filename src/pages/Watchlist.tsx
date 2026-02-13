import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface WatchlistItem {
  id: string
  symbol: string
  notes: string | null
  target_price: number | null
  stop_loss: number | null
  created_at: string
}

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [symbol, setSymbol] = useState('')
  const [notes, setNotes] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setWatchlist(data || [])
    } catch (error) {
      console.error('Error loading watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('watchlist').insert({
      user_id: user.id,
      symbol: symbol.toUpperCase(),
      notes: notes || null,
      target_price: targetPrice ? parseFloat(targetPrice) : null,
      stop_loss: stopLoss ? parseFloat(stopLoss) : null
    })

    if (error) {
      alert('Failed to add to watchlist')
    } else {
      setSymbol('')
      setNotes('')
      setTargetPrice('')
      setStopLoss('')
      setShowAddForm(false)
      loadWatchlist()
    }
  }

  const removeFromWatchlist = async (id: string) => {
    if (!confirm('Remove this stock from your watchlist?')) return

    const { error } = await supabase.from('watchlist').delete().eq('id', id)

    if (error) {
      alert('Failed to remove from watchlist')
    } else {
      setWatchlist(watchlist.filter(item => item.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
        <p className="text-blue-200 text-lg">Loading watchlist...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Watchlist</h2>
            <p className="text-blue-200">Track your favorite stocks</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Stock'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={addToWatchlist} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Symbol *
                </label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white/90 rounded-lg"
                  placeholder="AAPL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-white/90 rounded-lg"
                  placeholder="Optional notes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Target Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full px-4 py-2 bg-white/90 rounded-lg"
                  placeholder="150.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Stop Loss
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full px-4 py-2 bg-white/90 rounded-lg"
                  placeholder="140.00"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Add to Watchlist
            </button>
          </form>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <p className="text-blue-200 text-lg">
            Your watchlist is empty. Add stocks to track them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white">{item.symbol}</h3>
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              {item.notes && (
                <p className="text-blue-200 mb-3">{item.notes}</p>
              )}

              <div className="space-y-2 text-sm">
                {item.target_price && (
                  <div className="text-green-400">
                    Target: ${item.target_price.toFixed(2)}
                  </div>
                )}
                {item.stop_loss && (
                  <div className="text-red-400">
                    Stop Loss: ${item.stop_loss.toFixed(2)}
                  </div>
                )}
                <div className="text-blue-300 text-xs">
                  Added {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
