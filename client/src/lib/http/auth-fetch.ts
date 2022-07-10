import { authStore } from '$lib/auth/auth.store'
import { get } from 'svelte/store'

export async function authorizedFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response | null> {
  const token = get(authStore).tokens?.accessToken

  if (!token) {
    authStore.logout()
    return null
  }

  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')

  const response = await fetch(input, { ...(init ?? {}), headers })

  if (response.status === 401) {
    authStore.logout()
    return null
  }

  return response
}
