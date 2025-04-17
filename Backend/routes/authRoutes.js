const express = require('express');
const { register, login, registerClient } = require('../controllers/authController');

const router = express.Router();

router.post('/registerClient', registerClient);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
