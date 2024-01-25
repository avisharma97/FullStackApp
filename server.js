const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const ConnectDb = require("./config/db");

// DOTENV
dotenv.config();

// MONGODB CONNECTION
ConnectDb();

// REST OBJECT
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ROUTES
app.use("/api/v1/auth", require("./routes/UserRoutes"));
app.use("/api/v1/post", require("./routes/PostRoutes"));

// Home
app.get("/",(req,resp)=>{
  resp.status(200).send({
    success:true,
    msg:"Node server running",
  })
  

// PORT
const PORT = process.env.PORT || 5000;

// listen
app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`.bgGreen.bgYellow);
});
