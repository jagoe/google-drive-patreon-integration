import { session } from '$app/stores'
import type { OAuthTokens, User } from '$lib/auth/models'
import { writable, type Writable } from 'svelte/store'

export interface Auth {
  isAuthenticated: boolean
  tokens: OAuthTokens | null
  user: User | null
}

const store: Writable<Auth> = writable({
  isAuthenticated: false,
  tokens: null,
  user: null
})

export const authStore = {
  subscribe: store.subscribe,
  login(user: User, tokens: OAuthTokens) {
    store.set({
      isAuthenticated: true,
      tokens,
      user
    })
  },
  logout() {
    session.set({ tokens: null, user: null })
    store.set({
      isAuthenticated: false,
      tokens: null,
      user: null
    })
    deleteCookies()
  }
}

function deleteCookies() {
  const cookies = document.cookie.split(';')
  cookies.forEach((cookie) => {
    const [name] = cookie.split('=')
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  })
}
