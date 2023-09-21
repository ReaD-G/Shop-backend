import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto } from 'src/product/dto/product.dto'

import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { generateSlug } from 'src/utils/generate.slug'
import { EnumProbuctSort, GetAllProbuctDto } from './dto/get-all.product.dto'
import {
	returnProductObject,
	returnProductObjectFullest
} from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllProbuctDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		if (sort === EnumProbuctSort.LOW_PRICE) prismaSort.push({ price: 'asc' })
		else if (sort === EnumProbuctSort.HIGH_PRICE) {
			prismaSort.push({ price: 'desc' })
		} else if (sort === EnumProbuctSort.NEWEST) {
			prismaSort.push({ createdAt: 'desc' })
		} else if (sort === EnumProbuctSort.OLDEST) {
			prismaSort.push({ createdAt: 'asc' })
		} else {
			prismaSort.push({ createdAt: 'desc' })
		}

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
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
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: returnProductObject
		})

		return {
			products,
			length: await this.prisma.product.count({
				where: prismaSearchTermFilter
			})
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
		return products
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

		return products
	}

	async create() {
		const product = await this.prisma.product.create({
			data: {
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
