export function parseCookies(cookieHeader: string) {
  if (!cookieHeader) {
    return {}
  }

  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=')
    acc[key.trim()] = value.trim()

    return acc
  }, {} as {[key: string]: string})
}
