const Product = require('../model/productModel')
const getAll = async(req, res) => {
    const products = await Product.find()
    res.status(200).json({
        status: 'success',
        data: products
    })
}

const createProduct = async(req, res) => {
    const newProduct = await Product.create(req.body)
    console.log(newProduct);
    res.status(201).json({
        data: 'success',
        product: newProduct
    })
}

const addToCart = async(req, res) => {
    const id = req.body._id
    console.log(id);
    res.json({
        status: 'success'
    })
}

module.exports = {
    getAll,
    createProduct,
    addToCart
}