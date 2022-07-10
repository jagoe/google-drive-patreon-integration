<script context="module" lang="ts">
  export async function load({ session }: { session: App.Session }) {
    const { tokens, user } = session

    return {
      props: { tokens, user },
    }
  }
</script>

<script lang="ts">
  import Drive from './drive.svelte'
  import PatreonSignInButton from '$lib/components/patreon-signin.button.svelte'
  import { authStore } from '$lib/auth/auth.store'
  import type { User, OAuthTokens } from '$lib/auth/models'

  export let user: User
  export let tokens: OAuthTokens

  if (user && tokens) {
    authStore.login(user, tokens)
  }
</script>

<div class="p-1">
  {#if $authStore.user}
    <div class="pb-1">
      Welcome, {$authStore.user.firstName}. Your tier is "{$authStore.user
        .patreonTier}".
      <a
        class="cursor-pointer underline decoration-sky-500"
        href="/"
        on:click={authStore.logout}>Logout?</a
      >
    </div>
    <Drive />
  {:else}
    <PatreonSignInButton />
  {/if}
</div>
