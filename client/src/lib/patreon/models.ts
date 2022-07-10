export const PATREON_OAUTH_ENDPOINT = 'https://www.patreon.com/oauth2'
export const PATREON_OAUTH_API_ENDPOINT =
  'https://www.patreon.com/api/oauth2/v2'
export const PATREON_OAUTH_API_IDENTITY_ENDPOINT = `${PATREON_OAUTH_API_ENDPOINT}/identity`

export enum PatreonEntityType {
  User = 'user',
  Tier = 'tier',
  Member = 'member'
}

export interface PatreonEntity<TAttributes> {
  data: {
    id: string
    attributes: TAttributes
  }
  type: PatreonEntityType
}

export interface PatreonIncludedEntity {
  id: string
  type: PatreonEntityType
  attributes: Record<string, string>
  relationships: Record<string, PatreonEntity<unknown>>
}

export interface PatreonIdentityAttributes {
  email: string
  first_name: string
  full_name: string
}

export interface PatreonIdentity
  extends PatreonEntity<PatreonIdentityAttributes> {
  included: PatreonIncludedEntity[]
}
