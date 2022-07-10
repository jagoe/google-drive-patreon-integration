import type { PatreonIdentity } from './models'
import { PATREON_OAUTH_API_IDENTITY_ENDPOINT } from '$lib/patreon/models'

export async function getIdentity(
  token: string
): Promise<PatreonIdentity | null> {
  const query = new URLSearchParams()
  query.append('fields[user]', 'email,full_name,first_name')
  query.append('fields[tier]', 'title')
  query.append('include', 'memberships.currently_entitled_tiers')
  const url = `${PATREON_OAUTH_API_IDENTITY_ENDPOINT}?${query.toString()}`

  const response = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    })
  })

  if (!response.ok) {
    console.error(
      'Error retrieving identity from Patreon',
      response.status,
      response.statusText,
      await response.text()
    )
    return null
  }

  return await response.json()
}
