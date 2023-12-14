const Joi = require('joi');

const user = Joi.string().max(20).required();
const pwd = Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/).max(12).required();

const userSchema = Joi.object({
  username: user,
  password: pwd
});

module.exports = { userSchema };
