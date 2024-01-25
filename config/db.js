const mongoose = require("mongoose");
const colors = require("colors");

const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to DATABASE ${mongoose.connection.host}`.bgGreen.bgWhite
    );
  } catch (error) {
    console.log(`Error in Connection db ${error}`.bgRed.bgWhite);
  }
};

module.exports = ConnectDb;
