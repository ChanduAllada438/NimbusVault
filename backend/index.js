require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));

// Basic rate limiting
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100 }); // 100 requests per minute
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
function shutdown() {
  console.log('Shutting down server...');
  server.close(async () => {
    try {
      await mongoose.connection.close(false);
      console.log('MongoDb connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during mongoose disconnect:', err);
      process.exit(1);
    }
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
