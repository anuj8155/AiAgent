const express = require('express');
const router = express.Router();
const constrollers = require('../controllers/ai.controller')

router.post('/get-review', constrollers.getReview)

module.exports = router;