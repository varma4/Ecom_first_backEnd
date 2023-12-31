const express = require(`express`)
const router = express.Router()
const signupController = require('../controller/loginController')

router.route('/signup').post(signupController.createUser)
router.route('/login').post(signupController.loginUser)
router.route('/verify/:userId').get(signupController.verifyEmail)

module.exports = router