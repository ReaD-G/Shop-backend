import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UserDto {
	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()ckout 
	@IsString()
	password?: string

	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	avatarPath: string

	@IsString()
	phone: string
}
