/// <reference types="@sveltejs/kit" />

import type { User } from '$lib/patreon/models'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    user: User
    tokens: OAuthTokens
  }
  // interface Platform {}
  interface Session {
    user: User
    tokens: OAuthTokens
  }
  // interface Stuff {}
}
