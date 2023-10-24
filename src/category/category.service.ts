import { Injectable, NotFoundException } from '@nestjs/common'
import { generateSlug } from '../../src/utils/generate.slug'
import { PrismaService } from '../../src/prisma.service'
import { CategoryDto } from './dto/category.dto'
import { returnCategoryObject } from './return-category.object'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return await this.prisma.category.findMany({
			select: returnCategoryObject
		})
	}

	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: { id },
			select: returnCategoryObject
		})

		if (!category) {
			throw new Error('Category not found')
		}
		return category
	}

	async bySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			select: returnCategoryObject
		})

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		return category
	}

	async create() {
		return this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async update(id: number, dto: CategoryDto) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug: generateSlug(dto.name)
			}
		})
	}

	async delete(id: number) {
		await this.prisma.category.delete({
			where: { id }
		})

		return { message: 'Success' }
	}
}
