// Base API configuration
// Set VITE_API_URL in .env to your backend URL, e.g. http://localhost:8000/api
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
    this.name = 'ApiError'
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('nexcv_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  // Don't set Content-Type for FormData (browser will set multipart boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  const config = {
    method: options.method || 'GET',
    headers,
    ...(options.body && { body: options.body instanceof FormData ? options.body : JSON.stringify(options.body) }),
    signal: options.signal,
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config)

    // No content
    if (res.status === 204) return null

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const message = data?.message || data?.detail || `HTTP ${res.status}`
      throw new ApiError(message, res.status, data)
    }

    return data
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err.name === 'AbortError') throw err
    throw new ApiError(err.message || 'Network error', 0, null)
  }
}

// Convenience methods
export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
  upload: (endpoint, formData, options) =>
    request(endpoint, { ...options, method: 'POST', body: formData }),
}

export { ApiError }
export default api