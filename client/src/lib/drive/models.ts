export interface DriveFile {
  id: string
  name: string
  type: DriveFileTypes,
  iconLink: string
  files?: DriveFile[]
}

export enum DriveFileTypes {
  Folder = 'folder',
  File = 'file',
  GoogleDocument = 'google-document',
}
