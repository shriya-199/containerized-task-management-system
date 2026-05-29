const express = require('express');
const {
  getLastJobRun,
  triggerPendingTaskProcessing
} = require('../controllers/workerController');

const router = express.Router();

router.get('/jobs/latest', getLastJobRun);
router.post('/jobs/process-pending-tasks', triggerPendingTaskProcessing);

module.exports = router;
