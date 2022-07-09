import { Injectable } from '@nestjs/common'
import {google} from 'googleapis'
import {Readable} from 'stream'
import {DriveFile} from './drive-file.entity'

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

    return file?.id !== undefined && !this.isFolder(file?.mimeType)
  }

  public async folderExists(fileId: string): Promise<boolean> {
    const file = await this.getDetails(fileId, 'id, mimeType')

    return file?.id !== undefined && this.isFolder(file?.mimeType)
  }

  public async getFiles({directoryId, recurse}: {directoryId: string, recurse: boolean}): Promise<DriveFile[]> {
    directoryId = directoryId || this.ROOT_DIRECTORY_ID

    const response = await this.drive.files.list({
      orderBy: 'name asc',
      q: `'${directoryId}' in parents`,
    })
    const rootFolders = response.data.files
    const fileStructure = rootFolders.map(async ({id, name, mimeType, thumbnailLink}) => {
      const file: DriveFile = {
        id,
        name,
        mimeType,
        thumbnailLink,
      }

      if (recurse && this.isFolder(mimeType)) {
        file.files = await this.getFiles({directoryId: id, recurse})
      }

      return file
    })

    return Promise.all(fileStructure)
  }

  public async getDetails(fileId: string, fields: string): Promise<Partial<DriveFile>> {
    const response = await this.drive.files.get({
      fileId,
      fields,
    }).catch(() => {
      return null
    })

    return response?.data as Partial<DriveFile>
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

  private isFolder(mimeType: string): boolean {
    return mimeType === 'application/vnd.google-apps.folder'
  }
}
