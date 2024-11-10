const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const testRoutes = require('./routes/test.routes');
dotenv.config();  

const app = express();

app.use(express.json()); 
app.use(cors());  

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
