const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes')

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route middleware
app.use('/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('DB connection error:', err));
