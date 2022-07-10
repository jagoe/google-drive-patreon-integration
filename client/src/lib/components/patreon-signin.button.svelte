<script lang="ts">
  import { env } from '$lib/env'
  import { PATREON_OAUTH_ENDPOINT } from '$lib/patreon/models'

  const redirectUri = `${env.apiEndpoint}/auth/callback`
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: env.patreonOAuthClientId,
    redirect_uri: redirectUri,
    scope: 'identity',
  })
  const patreonOAuthUrl = `${PATREON_OAUTH_ENDPOINT}/authorize?${query.toString()}`
</script>

<a class="rounded-full bg-sky-500 p-2" href={patreonOAuthUrl}
  >Sign in with Patreon</a
>
