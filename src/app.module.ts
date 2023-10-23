import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { PaginationModule } from './pagination/pagination.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { StatisticsModule } from './statistics/statistics.module'
import { UploadModule } from './upload/upload.module'
import { UserModule } from './user/user.module'

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
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ProductModule,
		ReviewModule,
		CategoryModule,
		OrderModule,
		StatisticsModule,
		PaginationModule,
		UploadModule,
		PrismaModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
