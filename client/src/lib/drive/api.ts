import {env} from '$lib/env'
import type {DriveFile} from './models'

export function listDirectory(id?: string): Promise<DriveFile[]> {
  id = id || ''

  return fetch(`${env.apiEndpoint}/drive/${id}`)
    .then(res => res.json())
}

export async function download(id: string): Promise<void> {
  const response = await fetch(`${env.apiEndpoint}/drive/${id}/download`)
  const blob = await response.blob()

  // Trigger download
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1]?.trim() || 'file'
  link.download = fileName
  link.click()
}
