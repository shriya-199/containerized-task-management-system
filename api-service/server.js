const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const { initializeTasksSchema } = require('./models/taskModel');

dotenv.config();

const app = express();
const port = process.env.API_SERVICE_PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'api-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((error, _req, res, _next) => {
  console.error('[api-service] unhandled error:', error);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error'
  });
});

async function startServer() {
  await initializeTasksSchema();
  app.listen(port, () => {
    console.log(`[api-service] listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('[api-service] failed to start:', error);
  process.exit(1);
});
