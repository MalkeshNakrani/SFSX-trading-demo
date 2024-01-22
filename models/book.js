const { model, Schema } = require("mongoose");

const bookSchema = new Schema(
  {
    stock: {
      type: Schema.Types.ObjectId,
      ref: "Stock", // Reference to the Stock model
      required: true,
    },
    side: {
      type: String,
      enum: ["buy", "sell"],
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

module.exports = model("Book", bookSchema);
