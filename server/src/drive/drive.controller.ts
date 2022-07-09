import { ClassSerializerInterceptor, Controller, Get, HttpException, Param, StreamableFile, UseInterceptors } from '@nestjs/common'
import { DriveService } from './drive.service'
import { DriveFile } from './drive-file.entity'

@Controller('drive')
@UseInterceptors(ClassSerializerInterceptor)
export class DriveController {
  constructor(private _driveService: DriveService) {}

  @Get(':directoryId?')
  async navigate(@Param('directoryId') directoryId: string): Promise<DriveFile[]> {
    directoryId = directoryId || this._driveService.ROOT_DIRECTORY_ID

    if (!await this._driveService.folderExists(directoryId)) {
      throw new HttpException(`Directory "${directoryId}" not found`, 404)
    }

    const files = await this._driveService.getFiles({directoryId, recurse: false})

    return files
  }

  @Get(':fileId/download')
  async download(@Param('fileId') fileId: string): Promise<StreamableFile> {
    if (!await this._driveService.fileExists(fileId)) {
      throw new HttpException(`File "${fileId}" not found`, 404)
    }

    const file = await this._driveService.getDetails(fileId, 'name, mimeType')
    const stream = await this._driveService.download(fileId)

    return new StreamableFile(stream, {
      disposition: `attachment; filename=${file.name}`,
      type: file.mimeType,
    })
  }
}
