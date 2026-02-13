import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Settings() {
  const { profile, updateProfile } = useAuthStore()
  const [polygonApiKey, setPolygonApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profile?.polygon_api_key) {
      setPolygonApiKey(profile.polygon_api_key)
    }
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      await updateProfile({ polygon_api_key: polygonApiKey })
      setMessage('Settings saved successfully!')
    } catch (error) {
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-4">Settings</h2>
        <p className="text-blue-200">Configure your preferences and API keys</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
        <div className="space-y-2 text-blue-200">
          <div>
            <strong>Email:</strong> {profile?.email}
          </div>
          <div>
            <strong>Status:</strong>{' '}
            {profile?.is_premium ? (
              <span className="text-green-400">Pro Member</span>
            ) : (
              <span>Free Tier</span>
            )}
          </div>
          {profile?.premium_expires_at && (
            <div>
              <strong>Premium Expires:</strong>{' '}
              {new Date(profile.premium_expires_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Polygon.io API Key</h3>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-blue-200 mb-2">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={polygonApiKey}
              onChange={(e) => setPolygonApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Polygon.io API key"
            />
            <p className="mt-2 text-sm text-blue-300">
              Get your API key from{' '}
              <a
                href="https://polygon.io/dashboard/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                Polygon.io Dashboard
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg font-semibold transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {!profile?.is_premium && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">Upgrade to Pro</h3>
          <ul className="space-y-2 text-blue-900 mb-4">
            <li>✓ Scan 100+ stocks (vs 20 in free)</li>
            <li>✓ Auto-refresh every 5 minutes</li>
            <li>✓ Export to CSV / TradeZella</li>
            <li>✓ Advanced RSI/VWAP analysis</li>
            <li>✓ Pre-market + Regular hours</li>
            <li>✓ Unlimited scan history</li>
          </ul>
          <button className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors">
            Upgrade Now - $29/month
          </button>
        </div>
      )}
    </div>
  )
}
