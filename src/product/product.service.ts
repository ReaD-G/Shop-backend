import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductDto } from '../../src/product/dto/product.dto'

import { Prisma } from '@prisma/client'
import { CategoryService } from '../../src/category/category.service'
import { PaginationService } from '../../src/pagination/pagination.service'
import { convertToNumber } from '../../src/utils/convert-to-number'
import { generateSlug } from '../../src/utils/generate.slug'
import { PrismaService } from '../prisma/prisma.service'
import { EnumProbuctSort, GetAllProbuctDto } from './dto/get-all.product.dto'
import {
	returnProductObject,
	returnProductObjectFullest
} from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
		private categoryService: CategoryService
	) {}

	async getAll(dto: GetAllProbuctDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const products = await this.prisma.product.findMany({
			where: filters,
			orderBy: this.getSortOptions(dto.sort),
			skip,
			take: perPage,
			select: returnProductObject
		})

		return {
			products,
			length: await this.prisma.product.count({
				where: filters
			})
		}
	}

	private createFilter(dto: GetAllProbuctDto): Prisma.ProductWhereInput {
		const filter: Prisma.ProductWhereInput[] = []

		if (dto.searchTerm) filter.push(this.getSearchTermFilter(dto.searchTerm))
		if (dto.ratings)
			filter.push(
				this.getRatingFilter(dto.ratings.split('|').map(rating => +rating))
			)

		if (dto.minPrice || dto.maxPrice)
			filter.push(
				this.getPriceFilter(
					convertToNumber(dto.minPrice),
					convertToNumber(dto.maxPrice)
				)
			)

		if (dto.categoryId) filter.push(this.getCategoryFilter(+dto.categoryId))

		return filter.length
			? {
					AND: filter
			  }
			: {}
	}

	private getSortOptions(
		sort: EnumProbuctSort
	): Prisma.ProductOrderByWithRelationInput[] {
		switch (sort) {
			case EnumProbuctSort.LOW_PRICE:
				return [{ price: 'asc' }]
			case EnumProbuctSort.HIGH_PRICE:
				return [{ price: 'desc' }]
			case EnumProbuctSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
		return {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}

	private getRatingFilter(ratings: number[]): Prisma.ProductWhereInput {
		return {
			reviews: {
				some: {
					rating: {
						in: ratings
					}
				}
			}
		}
	}

	private getCategoryFilter(categoryId: number): Prisma.ProductWhereInput {
		return {
			categoryId
		}
	}

	private getPriceFilter(
		minPrice?: number,
		maxPrice?: number
	): Prisma.ProductWhereInput {
		let priceFilter: Prisma.IntFilter | undefined = undefined

		if (minPrice) {
			priceFilter = {
				...priceFilter,
				gte: minPrice
			}
		}

		if (maxPrice) {
			priceFilter = {
				...priceFilter,
				lte: maxPrice
			}
		}

		return {
			price: priceFilter
		}
	}

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: returnProductObject
		})

		if (!product) {
			throw new NotFoundException('Product not found')
		}
		return product
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			select: returnProductObjectFullest
		})

		if (!product) {
			throw new NotFoundException('Product not found')
		}

		return product
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnProductObjectFullest
		})

		if (!products) throw new NotFoundException('Products not found!')
		return products.map(product => product)
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id)

		if (!currentProduct)
			throw new NotFoundException('Current product not found!')

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: returnProductObject
		})

		return products.map(product => product)
	}

	async create() {
		const product = await this.prisma.product.create({
			data: {
				images: [],
				name: '',
				price: 0,
				description: '',
				slug: ''
			}
		})

		return product.id
	}

	async update(id: number, dto: ProductDto) {
		const { description, images, price, name, categoryId } = dto

		await this.categoryService.byId(categoryId)

		return this.prisma.product.update({
			where: { id },
			data: {
				description,
				images,
				price,
				name,
				slug: generateSlug(dto.name),
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})
	}

	async delete(id: number) {
		await this.prisma.product.delete({
			where: { id }
		})

		return { message: 'Success' }
	}
}
