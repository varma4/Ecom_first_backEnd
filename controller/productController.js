
// redis-16829.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:16829
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const redisClient = require('../redis/redis')




// const getAll = async (req, res) => {
//   const cacheKey = 'allProducts'
//   try {
//     const products = await Product.find();
//     res.status(200).json({
//       status: "success",
//       data: products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "An error occurred while fetching products",
//     });
//   }
// }



  

const getAll = async (req, res) => {
  const cacheKey = 'allProducts';

  try {
    // await redisClient.del(cacheKey)
    const cachedData = await redisClient.get(cacheKey); 

    if (cachedData) {
      const products = JSON.parse(cachedData);
      res.status(200).json({
        status: 'success',
        data: products,
        message: 'Products received from cache',
      });
    } else {

      const products = await Product.find();

      await redisClient.set(cacheKey, JSON.stringify(products)); 

      res.status(200).json({
        status: 'success',
        data: products,
        message: 'Data fetched from the database and cached',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching products',
    });
  }
};


// redis.quit();




const getUsersCreatedProducts = async (req, res) => {
  try {

    const userId = req.params.userId;
    const cacheKey = `myproducts/${userId}`
    const cacheData = await redisClient.get(cacheKey)

    if(cacheData){
      const myproducts = JSON.parse(cacheData)
      res.status(200).json({
        status: 'success',
        myproducts,
        message: 'Items retrived from cache'
      })
    }else{
      const myproducts = await Product.find({ userId })

      await redisClient.set(cacheKey, JSON.stringify(myproducts))

      res.status(200).json({
        status: "success",
        myproducts,
        message: "Your items retrieved from the database and cached",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user products",
    });
  }
};


const createProduct = async (req, res) => {
  
  try {
    const userId = req.body.userId
    const cacheKeyAllProducts = 'allProducts'
    const cacheKeyUserProducts = `myproducts/${userId}`
    await redisClient.del(cacheKeyAllProducts)
    await redisClient.del(cacheKeyUserProducts)

    const newProduct = await Product.create(req.body);
    
    // const cachedData = await redisClient.get(cacheKey);
    // let products = []

    // if(cachedData)
    // {
    //   products = JSON.parse(cachedData)
    // }

    // products = [newProduct, ...products]
    console.log(newProduct);
    res.status(201).json({
      status: "success",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the product",
    });
  }
};

const deleteUsersProduct = async (req, res) => {
  try {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    console.log(userId, itemId);
    await Product.findByIdAndDelete(itemId);
    // let item = await Cart.find(userId)
    // if(item){
    //   await Cart.findByIdAndDelete(itemId)
    // }
    let item = await Cart.findOne({ userId, actualId: itemId });
    if (item) {
      await Cart.findByIdAndDelete(item._id);
    }

    res.status(200).json({
      status: "success",
      message: "Deleted the product",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the product",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const id = req.body._id;
    console.log(id);
    res.json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding to the cart",
    });
  }
};

module.exports = {
  getAll,
  createProduct,
  getUsersCreatedProducts,
  deleteUsersProduct,
  addToCart,
  // cacheGetAllProducts
};
