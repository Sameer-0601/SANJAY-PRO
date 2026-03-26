const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// @route   POST api/auth/register
router.post('/register', authController.register);

// @route   POST api/auth/login
router.post('/login', authController.login);

// @route   GET api/auth/user
router.get('/user', auth, authController.getUser);

module.exports = router;
