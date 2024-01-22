const { model, Schema } = require("mongoose");

const stockSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ticker: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate tickers
    },
  },
  { timestamps: true }
);

module.exports = model("Stock", stockSchema);
