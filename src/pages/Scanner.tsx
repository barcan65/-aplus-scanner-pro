import { useState } from 'react'
import { useScannerStore } from '../store/scannerStore'
import { useAuthStore } from '../store/authStore'

export default function Scanner() {
  const { results, scanning, error, runScan, saveScan, clearResults } = useScannerStore()
  const { profile } = useAuthStore()
  const [autoRefresh, setAutoRefresh] = useState(false)

  const handleScan = async () => {
    await runScan()
  }

  const handleSaveScan = async () => {
    if (results.length === 0) return
    const marketPhase = isPreMarket() ? 'pre-market' : 'regular'
    await saveScan(results, marketPhase)
    alert('Scan saved to history!')
  }

  const isPreMarket = () => {
    const now = new Date()
    const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
    const hour = etTime.getHours()
    const minute = etTime.getMinutes()
    return hour >= 4 && (hour < 9 || (hour === 9 && minute < 30))
  }

  const formatCurrency = (num: number) => `$${num.toFixed(2)}`
  const formatNumber = (num: number) => num.toLocaleString('en-US')
  const formatMarketCap = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    return `$${(num / 1e6).toFixed(2)}M`
  }

  const maxStocks = profile?.is_premium ? 100 : 20
  const displayResults = results.slice(0, maxStocks)
  const isLimited = results.length > maxStocks

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-4">Stock Scanner</h2>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg font-semibold transition-colors"
          >
            {scanning ? 'Scanning...' : 'Run Scan'}
          </button>

          <button
            onClick={clearResults}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            Clear Results
          </button>

          {results.length > 0 && (
            <button
              onClick={handleSaveScan}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Save Scan
            </button>
          )}

          {!profile?.is_premium && (
            <label className="flex items-center gap-2 text-blue-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => {
                  if (e.target.checked) {
                    alert('Auto-refresh is a Pro feature!')
                    return
                  }
                  setAutoRefresh(e.target.checked)
                }}
                className="w-5 h-5"
              />
              <span>Auto-Refresh (Pro Only)</span>
            </label>
          )}

          <div className="ml-auto text-blue-200">
            <span className="font-semibold">
              {displayResults.length} stocks found
              {isLimited && ` (showing ${maxStocks} of ${results.length})`}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-red-200">
          Error: {error}
        </div>
      )}

      {isLimited && !profile?.is_premium && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 text-yellow-200">
          Free tier: Showing top {maxStocks} results. Upgrade to Pro to see all {results.length} stocks!
        </div>
      )}

      {displayResults.length > 0 && (
        <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-blue-900">
                <th className="text-left py-3 px-4 text-blue-900 font-bold">Symbol</th>
                <th className="text-left py-3 px-4 text-blue-900 font-bold">Price</th>
                <th className="text-left py-3 px-4 text-blue-900 font-bold">Change %</th>
                <th className="text-left py-3 px-4 text-blue-900 font-bold">Gap %</th>
                <th className="text-left py-3 px-4 text-blue-900 font-bold">Volume</th>
                <th className="text-left py-3 px-4 text-blue-900 font-bold">Market Cap</th>
                <th className="text-left py-3 px-4 text-blue-900 font-bold">RSI</th>
                <th className="text-left py-3 px-4 text-blue-900 font-bold">VWAP</th>
              </tr>
            </thead>
            <tbody>
              {displayResults.map((stock) => (
                <tr key={stock.symbol} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-blue-900">{stock.symbol}</td>
                  <td className="py-3 px-4">{formatCurrency(stock.price)}</td>
                  <td className={`py-3 px-4 font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </td>
                  <td className={`py-3 px-4 font-semibold ${stock.gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.gap >= 0 ? '+' : ''}{stock.gap.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4">{formatNumber(Math.round(stock.volume))}</td>
                  <td className="py-3 px-4">{formatMarketCap(stock.marketCap)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold">
                      {stock.rsi.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatCurrency(stock.vwap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!scanning && displayResults.length === 0 && !error && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <p className="text-blue-200 text-lg">
            No results yet. Click "Run Scan" to find A+ setup stocks.
          </p>
        </div>
      )}
    </div>
  )
}
