const router = require("express").Router();
const { Stock, Book, Transaction } = require("../models");
const orderSchema = require("../schema/order");
const stockSchema = require("../schema/stock");

router.post("/stock", async (req, res) => {
  try {
    const { error, value } = stockSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const stock = await Stock.create(value);
    res.status(201).json(stock);
  } catch (error) {
    console.log("Error while creating stock", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get stock list API
router.get("/stocks", async (req, res) => {
  try {
    const stock = await Stock.find().select("name ticker").lean();
    res.status(200).json(stock);
  } catch (error) {
    console.log("Error while getting stocks", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create order API
router.post("/order", async (req, res) => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    // Check if stock exists
    const stock = await Stock.findOne({ ticker: value.stock });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    // Create order
    const order = await Book.create(value); // Create order

    // Full order execution
    const orders = await Book.find({ stock: stock._id })
      .sort({
        price: order.side === "buy" ? -1 : 1,
        side: order.side === "buy" ? "sell" : "buy",
      })
      .limit(1);

    if (orders.length > 0) {
      const condition =
        order.side === "buy"
          ? order.price >= orders[0].price
          : order.price <= orders[0].price;
      if (condition) {
        // Execute order and log transaction
        // Check if order can be fully executed
        if (order.quantity === orders[0].quantity) {
          await Book.findByIdAndDelete(orders[0]._id);
          await Book.findByIdAndDelete(order._id);
          const log = new Transaction({
            ticker: stock._id,
            price: order.price,
            quantity: order.quantity,
          });
          await log.save();
        }
        // Check if order can be partially executed
        else if (order.quantity > orders[0].quantity) {
          const log = new Transaction({
            ticker: stock._id,
            price: orders[0].price,
            quantity: orders[0].quantity,
          });
          await log.save();
          await Book.findByIdAndDelete(orders[0]._id);
          await Book.findByIdAndUpdate(order._id, {
            quantity: order.quantity - orders[0].quantity,
          });
        } else {
          const log = new Transaction({
            ticker: stock._id,
            price: orders[0].price,
            quantity: order.quantity,
          });
          await log.save();
          await Book.findByIdAndDelete(order._id);
          await Book.findByIdAndUpdate(orders[0]._id, {
            quantity: orders[0].quantity - order.quantity,
          });
        }
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.log("Error while creating order", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get transactions logs API
router.get("/transactions", async (req, res) => {
  try {
    const stock = req.query.ticker; // Get ticker from query
    if (stock) {
      // Get transactions for a particular stock
      const transactions = await Transaction.find({ ticker: stock }).lean();
      res.status(200).json(transactions);
    } else {
      // Get all transactions
      const transactions = await Transaction.find().lean();
      res.status(200).json(transactions);
    }
  } catch (error) {
    console.log("Error while getting transactions", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// stock order details
router.get("/stock/:id", async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    const orders = await Book.find({ stock: stock._id })
      .sort({
        createdAt: -1,
      })
      .lean();
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error while getting stock", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
