import { useNavigate } from 'react-router-dom'

import { logger } from '../lib/logger'

export const useRoleRedirect = () => {
  const navigate = useNavigate()

  const redirectByRole = (userRole) => {
    logger.debug('Redirecting based on role:', userRole)

    switch (userRole) {
      case 'admin':
        navigate('/admin/dashboard')
        break
      case 'restaurant_owner':
        navigate('/partner/dashboard')
        break
      case 'user':
        navigate('/user/dashboard')
        break
      default:
        navigate('/')
        break
    }
  }

  const handleLoginRedirect = (loginResult) => {
    if (loginResult.user) {
      redirectByRole(loginResult.user.role)
    }
  }

  return { redirectByRole, handleLoginRedirect }
}
