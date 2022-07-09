import {Exclude, Expose} from 'class-transformer'

export class DriveFile {
  constructor(
    public id: string,
    public name: string,
    mimeType: string,
    public iconLink: string,
    public files?: DriveFile[],
  ) {
    this.mimeType = mimeType
  }

  @Exclude()
  public mimeType: string

  @Expose()
  public get type(): DriveFileTypes {
    return this.getFileTypeFromMimeType(this.mimeType)
  }

  private getFileTypeFromMimeType(mimeType: string): DriveFileTypes {
    if (mimeType.startsWith('application/vnd.google-apps.folder')) {
      return DriveFileTypes.Folder
    }

    if (mimeType.startsWith('application/vnd.google-apps.document')) {
      return DriveFileTypes.GoogleDocument
    }

    return DriveFileTypes.File
  }
}

export enum DriveFileTypes {
  Folder = 'folder',
  File = 'file',
  GoogleDocument = 'google-document',
}
