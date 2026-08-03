const express = require('express');
const router = express.Router();
const { processAIQuery } = require('../controllers/aiController');

router.post('/query', processAIQuery);

module.exports = router;
