<script lang="ts">
  import { onMount } from 'svelte'
  import { download, listDirectory } from '$lib/drive/api'
  import { DriveFileTypes, type DriveFile } from '$lib/drive/models'

  let parentDirectories: Partial<DriveFile>[] = []
  let currentDirectory: Partial<DriveFile> = {
    id: '',
    name: 'Root',
  }
  let files: DriveFile[] = []
  let loading: Promise<void> | null = null
  let finishLoading: () => void

  onMount(async () => {
    startLoading()

    files = await listDirectory()

    stopLoading()
  })

  async function clickEntry(file: DriveFile) {
    startLoading()

    if (file.type === DriveFileTypes.Folder) {
      parentDirectories.push({ ...currentDirectory })
      currentDirectory = file
      files = await listDirectory(file.id)
    } else if (file.type === DriveFileTypes.File) {
      // TODO: different loading display (should not hide everything just to pop right back)
      await download(file.id)
    } else {
      console.error('Export not implemented yet')
    }

    stopLoading()
  }

  async function navigateToParent() {
    startLoading()

    if (parentDirectories.length > 0) {
      currentDirectory = parentDirectories.pop()!
      files = await listDirectory(currentDirectory.id)
    }

    stopLoading()
  }

  function startLoading() {
    loading = new Promise((resolve) => (finishLoading = resolve))
  }

  function stopLoading() {
    if (loading) {
      finishLoading()
      loading = null
    }
  }
</script>

<h1>{currentDirectory.name}</h1>

{#await loading}
  <div>Loading...</div>
{:then}
  <ul>
    {#if parentDirectories.length > 0}
      <li>
        <span class="link" on:click={() => navigateToParent()}>...</span>
      </li>
    {/if}
    {#each files as file (file.id)}
      <li>
        <span class="link" on:click={() => clickEntry(file)}>
          <img src={file.iconLink} alt={file.name} />
          {file.name}
        </span>
      </li>
    {/each}
  </ul>
{/await}

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  .link {
    cursor: pointer;
    color: darkblue;
  }
</style>
