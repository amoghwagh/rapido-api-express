const Joi = require('joi');

const validations = Joi.object({
  user_name: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string()
    .required()
    .min(3)
    .max(20),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
});

module.exports = validations;
