import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { tokenSchema } from '../../src/common/joi-schema/token'
import { verifyPhoneSchema } from '../../src/common/joi-schema/verify-phone'
import { JoiValidationPipe } from '../../src/common/pipes/joi'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refrech-token.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto.refreshToken)
	}

	@UsePipes(new JoiValidationPipe(tokenSchema))
	@Auth()
	@HttpCode(200)
	@Post('phone/verify/token')
	validatePhoneVerification(
		@CurrentUser('id') id: number,
		@Body() dto: { token: string }
	) {
		return this.authService.validatePhoneVerification(id, dto)
	}

	@UsePipes(new JoiValidationPipe(verifyPhoneSchema))
	@HttpCode(200)
	@Post('phone/verify')
	verifyPhone(@Body() dto: AuthDto) {
		console.log('dto', dto)
		return this.authService.verifyPhone(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}
}
