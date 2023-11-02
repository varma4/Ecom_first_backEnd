const express = require(`express`)
const router = express.Router()
const loginController = require('../controller/loginController')
const productController = require('../controller/productController')

router.route('/products').get(loginController.protectMiddleware, productController.cacheGetAllProducts).post( loginController.protectMiddleware , productController.createProduct)
// router.route('/addtocart').post(loginController.protectMiddleware, productController.addToCart)
router.route('/myproducts/:userId').get(loginController.protectMiddleware, productController.getUsersCreatedProducts)
router.route('/deleteuserItem/:userId/:itemId').delete(loginController.protectMiddleware, productController.deleteUsersProduct)

module.exports = router
