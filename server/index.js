const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
console.log('Starting Invoice Generator API (Production Ready)...');

const app = express();
const PORT = parseInt(process.env.PORT || '5001', 10);

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/invoices', require('./routes/invoices'));

app.get('/', (req, res) => {
  res.send('Invoice Generator API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ msg: 'Something broke!', error: err.message });
});

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/invoiceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Successfully');
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is in use. Trying port ${PORT + 1}`);
        setTimeout(() => {
          server.close();
          app.listen(PORT + 1, () => {
            console.log(`Server successfully started on alternative port ${PORT + 1}`);
          });
        }, 1000);
      } else {
        console.error('Server error:', e);
      }
    });

  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
