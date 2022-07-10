import {NestFactory} from '@nestjs/core'
import {env} from 'process'
import {AppModule} from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: process.env.CLIENT_ENDPOINT,
    exposedHeaders: ['Content-Disposition'],
  })

  await app.listen(env.PORT ?? 8000)
}
bootstrap()
