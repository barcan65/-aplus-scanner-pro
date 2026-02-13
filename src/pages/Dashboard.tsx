import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { profile } = useAuthStore()

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome to A+ Scanner Pro
        </h2>
        <p className="text-blue-200 text-lg">
          Your professional stock screening tool powered by Polygon.io
        </p>
      </div>

      {!profile?.is_premium && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-blue-900">
          <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
          <p className="mb-4">
            Get unlimited scans, auto-refresh, export to CSV, and more!
          </p>
          <button className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            Upgrade Now - $29/month
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/scanner"
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Run Scanner</h3>
          <p className="text-blue-200">
            Scan for A+ setup stocks with our advanced criteria
          </p>
        </Link>

        <Link
          to="/history"
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">Scan History</h3>
          <p className="text-blue-200">
            Review your previous scans and results
          </p>
        </Link>

        <Link
          to="/watchlist"
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="text-xl font-bold text-white mb-2">Watchlist</h3>
          <p className="text-blue-200">
            Track your favorite stocks and setups
          </p>
        </Link>

        <Link
          to="/settings"
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <div className="text-4xl mb-3">⚙️</div>
          <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
          <p className="text-blue-200">
            Configure your API key and preferences
          </p>
        </Link>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">A+ Screening Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-200">
          <div>
            <strong className="text-green-400">Market Cap:</strong> Greater than $10B
          </div>
          <div>
            <strong className="text-green-400">Avg Volume:</strong> Greater than 5M shares
          </div>
          <div>
            <strong className="text-green-400">Price:</strong> Greater than $5
          </div>
          <div>
            <strong className="text-green-400">Price vs VWAP:</strong> Price above VWAP
          </div>
          <div>
            <strong className="text-green-400">RSI Range:</strong> Between 50-70
          </div>
          <div>
            <strong className="text-green-400">Trading Hours:</strong> Pre-market + Regular hours
          </div>
        </div>
      </div>
    </div>
  )
}
