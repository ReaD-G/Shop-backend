import { faker } from '@faker-js/faker'
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma, User } from '@prisma/client'
import { UserService } from '../../src/user/user.service'
import { generateOTP } from '../../src/utils/codeGenerator'
import { getExpiry, isTokenExpired } from '../../src/utils/dateTimeUtility'
import { sendSMS } from '../../src/utils/twilio'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private userService: UserService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.userService.byId(result.id, {
			isAdmin: true
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	//New method

	async verifyPhone(dto: AuthDto) {
		const phone = '+447501038676'

		const oldUser = await this.prisma.user.findUnique({
			where: {
				phone: phone // dto.phone
			}
		})

		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.prisma.user.create({
			data: {
				phone: phone, // dto.phone
				name: faker.person.lastName(),
				lastName: faker.person.lastName(),
				firstName: faker.person.firstName(),
				avatarPath: faker.image.avatar()
			}
		})

		console.log('user', user)

		// const tokens = await this.issueTokens(user.id)

		const otp = generateOTP(6)
		const otpPayload: Prisma.OtpUncheckedCreateInput = {
			userId: user.id,
			code: otp,
			useCase: 'PHV',
			expiresAt: getExpiry()
		}

		await this.prisma.otp.create({
			data: otpPayload
		})

		await sendSMS(
			user.phone,
			`Use this code ${otp} to verify the phone number registered on your account`
		)
		return { success: true }
	}

	async validatePhoneVerification(id, dto) {
		// const userDetails = req['user']
		// find otp record
		const otpRecord = await this.prisma.otp.findFirst({
			where: { code: dto.token, useCase: 'PHV', userId: id }
		})
		if (!otpRecord) {
			throw new HttpException('Invalid OTP', HttpStatus.NOT_FOUND)
		}
		// check if otp is expired
		const isExpired = isTokenExpired(otpRecord.expiresAt)
		if (isExpired) {
			throw new HttpException('Expired token', HttpStatus.NOT_FOUND)
		}
		// update user isPhoneVerified to true
		await this.prisma.user.update({
			where: id, // user.id,
			data: { isPhoneVerified: true }
		})

		// delete the otp record
		await this.prisma.otp.delete({ where: { id: otpRecord.id } })
		return { success: true }
	}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				phone: dto.phone
			}
		})

		console.log('oldUser', oldUser)

		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.prisma.user.create({
			data: {
				phone: dto.phone,
				name: faker.person.lastName(),
				lastName: faker.person.lastName(),
				firstName: faker.person.firstName(),
				avatarPath: faker.image.avatar()
			}
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: Partial<User>) {
		return {
			id: user.id,
			phone: user.phone,
			isAdmin: user.isAdmin
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				phone: dto.phone
			}
		})

		if (!user) throw new NotFoundException('User not found')

		// const isValid = await verify(user.password, dto.password)

		// if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}
}
