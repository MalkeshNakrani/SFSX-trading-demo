const { model, Schema } = require("mongoose");

const transactionSchema = new Schema(
  {
    ticker: {
      type: Schema.Types.ObjectId,
      ref: "Stock", // Reference to the Stock model
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Transaction", transactionSchema);
