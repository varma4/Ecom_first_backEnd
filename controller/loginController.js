const LoginDetail = require(`../model/loginModel`)
const jwt = require(`jsonwebtoken`)
require('dotenv').config()


const tokencreation = (id, user) => {
    return jwt.sign({id, user}, process.env.SECURITY, {
        expiresIn: 100000000
    })
}

const createUser = async(req, res) => {
    const newUser = await LoginDetail.create(req.body)
    // const token = tokencreation(newUser._id, newUser.name);
    // console.log(token);
    res.status(201).json({
        status: 'success',
        // token        
    })
}

const loginUser = async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        return res.status(200).json({
            status: 'failed',
            message: "no mail id or password"
        })
    }

    const user = await LoginDetail.findOne({email})
    const pass = await user.checkpassword(password, user.password)
    if(!user || !pass){
        return res.status(400).json({
            status: "failed",
        })
    }
    
    const userId = user._id.toString()
    const token = tokencreation(user._id, user.name)
    
    res.cookie('userData', JSON.stringify({ token: token, name: user.name, id: userId }, { httpOnly : true, secure: true}))
    console.log(user._id);
    res.status(200).json({
        status: 'success',
        userName: user.name,
        token: token,
        id: userId  
    })
}


protectMiddleware = async (req, res, next) => {
    const testToken = req.headers.authorization;
    // console.log(testToken);
    let token;
    if(testToken && testToken.startsWith("Bearer")){
        token = await testToken.split(" ")[1]
    }
    if(!testToken){
        return res.status(401).json({
            status: 'failed',
            message: 'Invalid Token 1'
        })
    }
    jwt.verify(token, process.env.SECURITY, (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: 'failed',
                message: 'Invalid Token gfdgfe'
            })
        }
        req.user = decoded
        next()
    })
}

module.exports = {
    createUser,
    loginUser,
    protectMiddleware
}