import * as Joi from 'joi'

export const signupSchema = Joi.object({
	phone: Joi.string().required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required()
})
