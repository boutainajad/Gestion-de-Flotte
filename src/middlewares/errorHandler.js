module.exports = (err, req, res, next) => {
  console.error('Erreur:', err);
  
  const status = err.status || 500;
  res.status(status).json({ 
    message: err.message || 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};