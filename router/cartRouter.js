const express = require(`express`)

const cartController = require('../controller/cartController')
const loginController = require('../controller/loginController')
const router = express.Router()



router.route('/additem').post(loginController.protectMiddleware,cartController.storeInCart)
router.route('/getCartItems/:currentUser').get(loginController.protectMiddleware,cartController.retrieveCart)
router.route('/deleteItem/:userId/:item').delete(loginController.protectMiddleware,cartController.deleteItem)

module.exports = router
