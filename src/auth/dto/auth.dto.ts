import { IsString } from 'class-validator'

export class AuthDto {
	// @IsOptional()
	// @IsEmail()
	// email: string

	@IsString()
	phone: string

	// @IsOptional()
	// @MinLength(6, {
	// 	message: 'Password must be at least 6 characters long'
	// })
	// @IsString()
	// password: string
}
