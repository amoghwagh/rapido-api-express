const Joi = require('joi');

const validator = Joi.object({
  first_name: Joi.string()
    .alphanum()
    .required(),
  last_name: Joi.string()
    .alphanum()
    .required(),
  gender: Joi.string()
    .valid('M', 'F')
    .required(),
  dob: Joi.date()
    .iso()
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  date_joined: Joi.required()
});

module.exports = validator;
