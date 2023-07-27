const express = require(`express`)
const router = express.Router()
const loginController = require('../controller/loginController')
const productController = require('../controller/productController')

router.route('/products').get(loginController.protectMiddleware, productController.getAll).post( loginController.protectMiddleware , productController.createProduct)
router.route('/addtocart').post(loginController.protectMiddleware, productController.addToCart)

module.exports = router
