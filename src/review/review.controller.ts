import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../../src/auth/decorators/auth.decorator'
import { CurrentUser } from '../../src/auth/decorators/user.decorator'
import { ReviewDto } from './dto/review.dto'
import { ReviewService } from './review.service'

@Controller('reviews')
export class ReviewController {
	constructor(private reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@Auth('admin')
	async getAll() {
		return this.reviewService.getAll()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('leave/:productId')
	@Auth()
	async leaveReview(
		@CurrentUser('id') userId: number,
		@Param('productId') productId: string,
		@Body() dto: ReviewDto
	) {
		return this.reviewService.create(userId, +productId, dto)
	}

	@Get('average-by-product/:productId')
	async getAverageByProduct(@Param('productId') productId: string) {
		return this.reviewService.getAverageValueByProductId(+productId)
	}
}
