import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	// @Post()
	// create(@Body() createAuthDto: CreateAuthDto) {
	//   return this.authService.create(createAuthDto);
	// }

	// @Get()
	// findAll() {
	//   return this.authService.findAll();
	// }

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	//   return this.authService.findOne(+id);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
	//   return this.authService.update(+id, updateAuthDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.authService.remove(+id);
	// }
}
