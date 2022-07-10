import type { RequestEvent, ResolveOptions } from '@sveltejs/kit'
import { getIdentity } from '$lib/patreon/api'
import { parseCookies } from '$util/parseCookies'
import { PatreonEntityType } from '$lib/patreon/models'
import type { OAuthTokens, User } from '$lib/auth/models'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({
  event,
  resolve
}: {
  event: RequestEvent
  resolve(event: RequestEvent, opts?: ResolveOptions): Promise<Response>
}) {
  const cookies = parseCookies(event.request.headers.get('cookie') || '')

  const accessToken = cookies.access_token
  const refreshToken = cookies.refresh_token
  const expiresIn = parseInt(cookies.expires_in)
  const tokenType = cookies.token_type

  if (!accessToken || !refreshToken || !expiresIn || !tokenType) {
    event.locals.user = null
    event.locals.tokens = null

    return resolve(event)
  }

  if (accessToken === event.locals.tokens?.accessToken) {
    return resolve(event)
  }

  const identity = await getIdentity(accessToken)
  if (!identity) {
    return resolve(event)
  }

  if (identity) {
    const user: User = {
      id: identity.data.id,
      email: identity.data.attributes.email,
      firstName: identity.data.attributes.first_name,
      fullName: identity.data.attributes.full_name,
      patreonTier:
        identity.included.find((entry) => entry.type === PatreonEntityType.Tier)
          ?.attributes.title || 'Unknown'
    }

    const tokens: OAuthTokens = {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType
    }

    event.locals.user = user
    event.locals.tokens = tokens
  }

  return resolve(event)
}

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(event: RequestEvent) {
  const user = event.locals.user
  const tokens = event.locals.tokens

  return { user, tokens }
}
