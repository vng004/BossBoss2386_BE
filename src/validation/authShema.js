import Joi from 'joi'
const authSchema = Joi.object({
    email: Joi.string().required().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be a valid email",
    }),
    password: Joi.string().required().min(6).max(255).messages({
        "string.base": "Pasword must be a string",
        "string.empty": "Pasword cannot be empty",
        "string.min": "Password must have at least 6 characters",
        "string.max": "Password must have at most 255 characters",
    }),
    userName: Joi.string().min(3).allow('').optional().messages({
        "string.base": "userName must be a string",
        "string.empty": "userName cannot be empty",
        "string.min": "userName must have at least 3 characters"
    }),

})
export default authSchema