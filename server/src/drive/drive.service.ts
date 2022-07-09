import { Injectable } from '@nestjs/common'
import {google} from 'googleapis'
import {Readable} from 'stream'
import {DriveFile, DriveFileTypes} from './drive-file.entity'

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive'
const DRIVE_VERSION = 'v3'

@Injectable()
export class DriveService {
  public get ROOT_DIRECTORY_ID(): string {
    return process.env.DRIVE_ROOT_DIRECTORY_ID
  }

  private auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [DRIVE_SCOPE],
  })

  private drive = google.drive({
    version: DRIVE_VERSION,
    auth: this.auth,
  })

  public async fileExists(fileId: string): Promise<boolean> {
    const file = await this.getDetails(fileId, 'id, mimeType')

    return file?.id !== undefined && file?.type !== DriveFileTypes.Folder
  }

  public async folderExists(fileId: string): Promise<boolean> {
    const file = await this.getDetails(fileId, 'id, mimeType')

    return file?.id !== undefined && file?.type === DriveFileTypes.Folder
  }

  public async getFiles({directoryId, recurse}: {directoryId: string, recurse: boolean}): Promise<DriveFile[]> {
    directoryId = directoryId || this.ROOT_DIRECTORY_ID

    const response = await this.drive.files.list({
      q: `'${directoryId}' in parents`,
    })
    const files = response.data.files
    const fileStructure = files.map(async (file) => {
      const details = await this.getDetails(file.id, 'iconLink')

      const driveFile = new DriveFile(
        file.id,
        file.name,
        file.mimeType,
        details?.iconLink,
      )

      if (recurse && driveFile.type === DriveFileTypes.Folder) {
        driveFile.files = await this.getFiles({directoryId: file.id, recurse})
      }

      return driveFile
    })

    return (await Promise.all(fileStructure)).sort((a, b) => {
      if (a.type === DriveFileTypes.Folder && b.type !== DriveFileTypes.Folder) {
        return -1
      }

      if (a.type !== DriveFileTypes.Folder && b.type === DriveFileTypes.Folder) {
        return 1
      }

      return a.name.localeCompare(b.name)
    })
  }

  public async getDetails(fileId: string, fields: string): Promise<Partial<DriveFile>> {
    const response = await this.drive.files.get({
      fileId,
      fields,
    }).catch((err) => {
      console.error(err)

      return null
    })

    if (response === null) {
      return null
    }

    return new DriveFile(fileId, response.data.name, response.data.mimeType, response.data.iconLink)
  }

  public async download(fileId: string): Promise<Readable> {
    if (!await this.fileExists(fileId)) {
      return null
    }

    const response = await this.drive.files.get({
      fileId,
      alt: 'media',
    }, {
      responseType: 'stream',
    })

    return response.data
  }
}
