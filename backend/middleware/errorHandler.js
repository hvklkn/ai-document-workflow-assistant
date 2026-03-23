/**
 * Global Express error handler.
 * Must have 4 parameters (err, req, res, next) for Express to recognise it.
 */
function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(`[${req.method} ${req.path}] ${status}: ${message}`);

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
