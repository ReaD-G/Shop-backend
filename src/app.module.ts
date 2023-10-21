import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		// ServeStaticModule.forRoot({
		// 	rootPath: `${path}/uploads`,
		// 	serveRoot: '/uploads'
		// }),
		// ConfigModule.forRoot(),
		// AuthModule,
		// UserModule,
		// ProductModule,
		// ReviewModule,
		// CategoryModule,
		// OrderModule,
		// StatisticsModule,
		// PaginationModule,
		// UploadModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
