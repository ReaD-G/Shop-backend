import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum EnumProbuctSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class GetAllProbuctDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumProbuctSort)
	sort?: EnumProbuctSort

	@IsOptional()
	@IsString()
	searchTerm?: string
}
