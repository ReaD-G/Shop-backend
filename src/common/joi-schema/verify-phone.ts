import * as Joi from 'joi'

export const verifyPhoneSchema = Joi.object({
	phone: Joi.string()
		.regex(/^[0-9]/)
		.messages({ 'string.pattern.base': `Phone number is invalid` })
		.required()
})
