const nodemailer = require(`nodemailer`)
const LoginDetail = require('../model/loginModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to create a JWT token
const tokencreation = (id, user) => {
    return jwt.sign({ id, user }, process.env.SECURITY, {
        expiresIn: 100000000,
    });
};

// sending email when user signs in
async function sendEmail(email, name, userId)
{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Use 465 for SSL
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'buyandsellstuffonline8@gmail.com',
            pass: 'tulsbjrwtvvhninj'
        }
    })
    
    // write the content

    const mailOptions = {
        from: 'buyandsellstuffonline8@gmail.com',
        to: email,
        subject: `welcome ${name} `,
        // html: `<p>Click on the link to verify your email address <a href="https://sellshit.netlify.app/verify?userId=${userId}">approve</a></p>`,
        html :`<p>Click on the link to verify your email address <a [routerLink]="['/verify', userId]">approve</a></p>`

    }
    
    try{
        const res = transporter.sendMail(mailOptions)
        console.log('mail sent');
    }catch(err){
        console.log(err)
    }
}

//completed sending email

// when user clicks on verify link

const verifyEmail = async (req, res) =>{
    const userId = req.query.userId;
    // const user = await LoginDetail.findById(userId)

    if(!user) return res.status(404).json({status: 'failed'})
    // user.updateOne({_id: userId}, { $set:{isVerified : true} })
    // await user.save();
    await LoginDetail.updateOne({ _id: userId }, { $set: { isVerified: true } });


    res.status(200).json({
        status: 'success',
        message: 'verified email'
    })
} 





// Create a new user
const createUser = async (req, res) => {
    try {
        const newUser = await LoginDetail.create(req.body);
        sendEmail(newUser.email, newUser.name, newUser._id)
        res.status(201).json({
            status: 'success',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating user',
            error: error.message,
        });
    }
};

// User login
const loginUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({
            status: 'failed',
            message: 'Email and password are required.',
        });
    }

    try {
        const user = await LoginDetail.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        const isPasswordValid = await user.checkpassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid password',
            });
        }

        const userId = user._id.toString();
        const token = tokencreation(user._id, user.name);

        res.status(200).json({
            status: 'success',
            userName: user.name,
            token: token,
            id: userId,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Login failed',
            error: error.message,
        });
    }
};

// Middleware to protect routes with JWT token verification
protectMiddleware = async (req, res, next) => {
    const testToken = req.headers.authorization;
    console.log(testToken);

    if (!testToken) {
        return res.status(401).json({
            status: 'failed',
            message: 'No token provided',
        });
    }

    let token;
    if (testToken.startsWith('Bearer ')) {
        token = testToken.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            status: 'failed',
            message: 'Invalid token format',
        });
    }

    jwt.verify(token, process.env.SECURITY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid token',
            });
        }
        req.user = decoded;
        next();
    });
};

module.exports = {
    createUser,
    loginUser,
    protectMiddleware,
    verifyEmail
};
