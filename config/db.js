const mongoose = require("mongoose");
// const uri = "mongodb://localhost:27017/secretsDB";
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/secretsDB?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`CONNECTED TO secretsDB on: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
// To use for session store
const connection = mongoose.connection;

module.exports = { connectDB, connection };
