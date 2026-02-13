import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { user, profile, signOut } = useAuthStore()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Scanner', href: '/scanner' },
    { name: 'History', href: '/history' },
    { name: 'Watchlist', href: '/watchlist' },
    { name: 'Settings', href: '/settings' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">
                  A+ Scanner Pro
                  {profile?.is_premium && (
                    <span className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 text-xs rounded-full font-bold">
                      PRO
                    </span>
                  )}
                </h1>
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-white border-b-2 border-white'
                      : 'text-blue-200 hover:text-white hover:border-b-2 hover:border-blue-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-200 text-sm">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
