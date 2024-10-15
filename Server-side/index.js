const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const userRouter = require("./router/UserRouter");
const connectDB = require("./config/db");
const server = express();

//middlewares
const corsOptions = {
  origin: "https://registration-process.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
server.use(cors(corsOptions));
server.use(express.json());

server.use("/api/user", userRouter);

server.get('/hello',(rea,res)=>{
  res.send("hi")
})

//database connection
connectDB();

//listening
let PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
