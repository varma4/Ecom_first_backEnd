const mongoose = require(`mongoose`)

productSchema = mongoose.Schema({
    userId: String,
    name: {
        type: String,
        required: [true, 'product must have a name'],
    },
    price: {
        type: Number,
        required: [true, "product must have a price"]
    },
    images:{
        type: Array,
        required: [true, "product must have a image"]
    },
    description: {
        type: String,
        required: [true, "Product must have a description"]
    }
})


const products = mongoose.model('products', productSchema)

module.exports = products