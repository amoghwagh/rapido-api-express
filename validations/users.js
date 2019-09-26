const Joi = require('joi');

const validation = Joi.object({
  user_name: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string()
    .required()
    .min(3)
    .max(20)
});

module.exports = validation;
