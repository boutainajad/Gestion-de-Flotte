const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Flotte opérationnelle 🚛' });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

app.use(errorHandler);

module.exports = app;