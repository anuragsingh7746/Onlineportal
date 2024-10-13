const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const questionRoutes = require("./api/questionRoutes");
const testRoutes = require("./api/testRoutes");
const taketestRoutes = require("./api/taketestRoutes");
const loginRoutes = require("./api/loginroutes");
const logRoutes = require("./api/logRoutes");
dotenv.config();  

const app = express();

app.use(express.json()); 
app.use(cors());  

connectDB();

app.use("/api/questions", questionRoutes);
app.use("/api/dashboard", testRoutes);
app.use("/api/test", taketestRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/testlog", logRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
