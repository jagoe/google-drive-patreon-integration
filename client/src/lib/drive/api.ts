import { env } from '$lib/env'
import { authorizedFetch } from '$lib/http/auth-fetch'
import type { DriveFile } from './models'

export async function listDirectory(id?: string): Promise<DriveFile[]> {
  id = id || ''

  const response = await authorizedFetch(`${env.apiEndpoint}/drive/${id}`)
  if (!response) {
    return []
  }

  return response.json()
}

export async function download(id: string): Promise<void> {
  const response = await authorizedFetch(
    `${env.apiEndpoint}/drive/${id}/download`
  )
  if (!response) {
    return
  }

  const blob = await response.blob()

  // Trigger download
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const fileName =
    response.headers
      .get('Content-Disposition')
      ?.split('filename=')[1]
      ?.trim() || 'file'
  link.download = fileName
  link.click()
}
