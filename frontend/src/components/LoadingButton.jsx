import { Loader2 } from 'lucide-react'

const LoadingButton = ({ 
  children, 
  isLoading = false, 
  disabled = false, 
  className = '', 
  loadingText = 'Loading...',
  ...props 
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative ${className} ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          {loadingText}
        </span>
      )}
    </button>
  )
}

export default LoadingButton
