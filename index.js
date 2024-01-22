const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connect = require("./utils/mongoose");
const routes = require("./routes/index");

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connect();

// CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
