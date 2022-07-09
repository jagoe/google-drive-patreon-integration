import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DriveModule } from './drive/drive.module'

@Module({
  imports: [ConfigModule.forRoot(), DriveModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
