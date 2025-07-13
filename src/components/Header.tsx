import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Heart, 
  User, 
  LogIn, 
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { t, i18n } = useTranslation()
  const { user, signOut, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {t('appName')}
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* {isAuthenticated && (
              <Link
                to="/favorites"
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">{t('favorites')}</span>
              </Link>
            )} */}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.firstName || t('profile')}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                >
                  <span className="hidden sm:inline">{t('signOut')}</span>
                  <LogOut className="h-4 w-4 sm:hidden" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link
                  to="/signin"
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <span className="hidden sm:inline">{t('signIn')}</span>
                  <LogIn className="h-4 w-4 sm:hidden" />
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t('signUp')}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header