import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
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
import { LoggerMiddleware } from './utils/logger'

@Module({
	imports: [
		// TESTING deploy
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		// PrismaModule.forRootAsync({
		// 	isGlobal: true,
		// 	useFactory: async (configService: ConfigService) => {
		// 		return {
		// 			prismaOptions: {
		// 				datasources: {
		// 					db: {
		// 						url: configService.get('DATABASE_URL')
		// 					}
		// 				}
		// 			},
		// 			explicitConnect: true
		// 		}
		// 	},
		// 	inject: [ConfigService]
		// }),
		// ConfigModule.forRoot({
		// 	isGlobal: true
		// }),
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
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
