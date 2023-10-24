import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { Auth } from '../../src/auth/decorators/auth.decorator'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@HttpCode(200)
	@Auth('admin')
	@Delete(':fileKey')
	async deleteFile(@Param() { fileKey: fileKey }) {
		return this.uploadService.delete(fileKey)
	}
}
