import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'
import { AppModule } from './app.module'

export interface NestConfig {
	port: number
}

export interface CorsConfig {
	enabled: boolean
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// app.setGlobalPrefix('')

	app.enableShutdownHooks()

	// Cors
	// app.enableCors()

	const { httpAdapter } = app.get(HttpAdapterHost)
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

	await app.listen(process.env.PORT || 4200)
}
bootstrap()
