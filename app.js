const express = require(`express`)
app = express()
const cors = require(`cors`)



app.use(cors())

const productRouter = require('./router/productRouter')
const signupRouter = require('./router/loginRouter')
const cartRouter = require('./router/cartRouter')
const mongoose = require('mongoose')
const port = 4040

require('dotenv').config()
app.use(express.json())
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://sellstuffonline.netlify.app'); 
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
mongoose.connect(process.env.URL, console.log('DB connected'))


app.use('/',signupRouter)
app.use('/', productRouter)
app.use('/', cartRouter)

app.get('/jobs', (req, res) => {
    return res.status(200).json('scheduledJobs');
  });




app.listen(port, () => {
    console.log(`up and runnin on port ${port}`);
})

