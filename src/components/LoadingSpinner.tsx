
import { useTranslation } from 'react-i18next'
import { LoadingSpinnerProps } from '../types'

const LoadingSpinner = ({ size = 'large', message = null }: LoadingSpinnerProps) => {
  const { t } = useTranslation()
  
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8', 
    large: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
      {(message || size === 'large') && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {message || t('loading')}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner