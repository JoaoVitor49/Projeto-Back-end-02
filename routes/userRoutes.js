const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.get('/login', userController.showLoginPage)
router.get('/register', userController.showRegisterPage)
router.post('/login', userController.loginUser)
router.post('/register', userController.registerUser)
router.get('/logout', userController.logoutUser)

module.exports = router