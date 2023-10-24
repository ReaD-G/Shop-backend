import { Module } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { PrismaService } from '../../src/prisma.service'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	controllers: [StatisticsController],
	providers: [StatisticsService, PrismaService, UserService]
})
export class StatisticsModule {}
