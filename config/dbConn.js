const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect("mongodb://127.0.0.1:27017/inventory-management-system",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    .then(() => {
      console.log("Successfully connected to database...");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};