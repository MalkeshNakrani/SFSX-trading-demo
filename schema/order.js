const joi = require("joi");

const orderSchema = joi.object({
  stock: joi.string().required(),
  side: joi.string().valid("buy", "sell").required(),
  price: joi.number().required(),
  quantity: joi.number().required(),
});

module.exports = orderSchema;
