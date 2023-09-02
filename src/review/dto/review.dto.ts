import { IsNumber, IsString, Max, Min } from 'class-validator'

export class ReviewDto {
	@IsString()
	text: string

	@IsNumber()
	@Min(1)
	@Max(5)
	rating: number
}
