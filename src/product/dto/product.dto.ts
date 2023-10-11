import { Prisma } from '@prisma/client'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class ProductDto implements Prisma.ProductUpdateInput {
	@IsString()
	name: string

	@IsNumber()
	price: number

	@IsOptional()
	@IsString()
	description: string

	@IsArray()
	images: string[]

	@IsNumber()
	categoryId: number
}
