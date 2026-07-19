const TOKEN_KEY = 'examSysToken'

export { TOKEN_KEY }

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

export function decodeJwtPayload(token = getAuthToken()) {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    )

    return JSON.parse(json)
  } catch {
    return null
  }
}
