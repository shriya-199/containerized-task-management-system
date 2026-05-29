const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { ensureUsersTable } = require('./models/userModel');

dotenv.config();

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((error, _req, res, _next) => {
  console.error('[auth-service] unhandled error:', error);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error'
  });
});

async function startServer() {
  await ensureUsersTable();
  app.listen(port, () => {
    console.log(`[auth-service] listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('[auth-service] failed to start:', error);
  process.exit(1);
});
