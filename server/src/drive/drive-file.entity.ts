export interface DriveFile {
  name: string
  id: string
  mimeType: string,
  thumbnailLink: string
  files?: DriveFile[]
}
