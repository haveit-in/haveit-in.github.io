const DEFAULT_TIMEOUT = 30000 // 30 seconds
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second

/**
 * API call with timeout and retry logic
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Timeout in milliseconds (default: 30000)
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.retryDelay - Delay between retries in milliseconds (default: 1000)
 * @param {Function} options.onRetry - Callback when retrying
 * @returns {Promise} - The API response
 */
export const apiCallWithRetry = async (apiCall, options = {}) => {
  const {
    timeout = DEFAULT_TIMEOUT,
    maxRetries = DEFAULT_MAX_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    onRetry = null
  } = options

  let lastError = null
  let attempt = 0

  while (attempt <= maxRetries) {
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      })

      // Race between API call and timeout
      const response = await Promise.race([apiCall(), timeoutPromise])
      
      return response
    } catch (error) {
      lastError = error
      
      // Check if it's a timeout error
      if (error.message === 'Request timeout') {
        console.warn(`API call timeout (attempt ${attempt + 1}/${maxRetries + 1})`)
      } else {
        console.error(`API call failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error)
      }

      // If we've exhausted retries, throw the last error
      if (attempt >= maxRetries) {
        throw new Error(`API call failed after ${maxRetries + 1} attempts: ${lastError.message}`)
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      
      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, maxRetries)
      }

      attempt++
    }
  }

  throw lastError
}

/**
 * Fetch with timeout wrapper
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} - The fetch response
 */
export const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

/**
 * Exponential backoff retry delay
 * @param {number} attempt - Current attempt number
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {number} - Delay in milliseconds
 */
export const exponentialBackoff = (attempt, baseDelay = DEFAULT_RETRY_DELAY) => {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000) // Max 30 seconds
}
