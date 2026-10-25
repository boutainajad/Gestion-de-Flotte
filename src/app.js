const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// ==================== ROUTES V1 ====================
const authRoutes = require('./routes/v1/authRoutes');
const camionRoutes = require('./routes/v1/camionRoutes');
const remorqueRoutes = require('./routes/v1/remorqueRoutes');
const pneuRoutes = require('./routes/v1/pneuRoutes');
const trajetRoutes = require('./routes/v1/trajetRoutes');
const maintenanceRoutes = require('./routes/v1/maintenanceRoutes');
const regleRoutes = require('./routes/v1/regleRoutes');

// ==================== ROUTES V2 ====================
const analyticsRoutes = require('./routes/v2/analyticsRoutes');

// ==================== MIDDLEWARES ====================
const errorHandler = require('./middlewares/errorHandler');
const apiVersionHeaders = require('./middlewares/apiVersionHeaders');

const app = express();

// ==================== MIDDLEWARES GLOBAUX ====================
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
// ==================== ROUTE DE TEST ====================
app.get('/', (req, res) => {
  res.json({ message: 'FleetTrackPRO 2.0 🚛', version: '2.0.0' });
});

// ==================== ROUTES API v1 ====================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/camions', camionRoutes);
app.use('/api/v1/remorques', remorqueRoutes);
app.use('/api/v1/pneus', pneuRoutes);
app.use('/api/v1/trajets', trajetRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/regles', regleRoutes);

// ==================== ROUTES API v2 ====================
app.use('/api/v2/analytics', analyticsRoutes);

// ==================== 404 ====================
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// ==================== GESTION D'ERREURS ====================
app.use(errorHandler);

module.exports = app;