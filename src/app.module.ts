import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		// TypeOrmModule.forRoot({
		// 	type: 'postgres',
		// 	host: process.env.DATABASE_HOST,
		// 	port: parseInt(process.env.DATABASE_PORT),
		// 	username: process.env.DATABASE_NAME,
		// 	password: process.env.DATABASE_PASSWORD,
		// 	database: process.env.DATABASE_NAME,
		// 	autoLoadEntities: true,
		// 	ssl: false,
		// 	// Only enable this option if your application is in development,
		// 	// otherwise use TypeORM migrations to sync entity schemas:
		// 	// https://typeorm.io/#/migrations
		// 	synchronize: true
		// }),
		//
		// TESTING deploy
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
		// UploadModule,
		// PrismaModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
