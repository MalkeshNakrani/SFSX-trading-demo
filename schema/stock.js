const joi = require("joi");

const stockSchema = joi.object({
  name: joi.string().required(),
  ticker: joi.string().required(),
});

module.exports = stockSchema;
