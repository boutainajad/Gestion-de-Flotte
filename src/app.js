const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const camionRoutes = require('./routes/camionRoutes');
const remorqueRoutes = require('./routes/remorqueRoutes');
const pneuRoutes = require('./routes/pneuRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const regleRoutes = require('./routes/regleRoutes');

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
app.use('/api/camions', camionRoutes);
app.use('/api/remorques', remorqueRoutes);
app.use('/api/pneus', pneuRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/regles', regleRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

app.use(errorHandler);

module.exports = app;