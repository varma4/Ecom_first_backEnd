const mongoose = require(`mongoose`)
const validator = require('validator')
const bcrypt = require(`bcryptjs`)


const loginSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must have a Name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "User must have a email Id"],
        unique: true,
        validate: [validator.isEmail, 'Email is not valid']
    },
    password: {
        type : String,
        required: [true, "User must have password"],
        trim: true
    },
    role: {
        type: String,
        default: 'user'
    },
    confirmpassword:{
        type: String,
        required: [true, 'User should have a confirm password'],
        validate: {
            validator: function(val){
                return val === this.password;
            },
            message: 'password and confirm password should be the same'
        }
    },
    passwordChangedAt: Date
})

loginSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmpassword = undefined
    next()
})


loginSchema.methods.checkpassword = async function(pwd, pwdDb){
    return await bcrypt.compare(pwd, pwdDb)
}

const LoginModel = mongoose.model('loginDetails', loginSchema)

module.exports = LoginModel
