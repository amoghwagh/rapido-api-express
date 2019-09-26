const Joi = require('joi');

const validation = Joi.object({
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
  member_since: Joi.required()
});

module.exports = validation;
