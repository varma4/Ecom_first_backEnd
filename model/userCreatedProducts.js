const mongoose = require(`mongoose`)

const userCreatedSchema = mongoose.Schema({
    _id: String,
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
    }
})

const userCreatedProducts = mongoose.model('usersCreatedProducts', userCreatedSchema)
module.exports = userCreatedProducts

