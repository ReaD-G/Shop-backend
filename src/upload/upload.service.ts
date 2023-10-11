import { Injectable } from '@nestjs/common'
import { UTApi } from 'uploadthing/server'

@Injectable()
export class UploadService {
	private utaip: void
	constructor() {}
	async delete(fileKey: string) {
		const utapi = new UTApi({
			apiKey:
				'sk_live_8159aa14756b50463abaf55606b9cc096f9f19256bad6fad4dce11619d13a3b8'
		})

		const deleteFile = await utapi.deleteFiles(fileKey)

		console.log(deleteFile)

		return { message: 'Success' }
	}
}
