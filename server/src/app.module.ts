import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DriveModule } from './drive/drive.module'
import { PatreonController } from './auth/auth.controller'

@Module({
  imports: [ConfigModule.forRoot(), DriveModule],
  controllers: [PatreonController],
  providers: [],
})
export class AppModule {}
