const mongoose = require(`mongoose`)

const cartSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        unique: false
    },
    price: {
        type: Number
    },
    images: {
        type: Array
    },
    actualId: {
        type: String,
        unique: true
    },
    currentUser: String
})

const cartProducts = mongoose.model('cart', cartSchema)
module.exports = cartProducts


