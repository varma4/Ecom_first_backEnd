
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
    const cachedData = await redisClient.get(cacheKey); // Use await to wait for the result

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
    console.log(userId);
    const myproducts = await Product.find({ userId });

    console.log("-------------------", myproducts);
    res.status(200).json({
      status: "success",
      myproducts,
      message: "Your items retrieved",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user products",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
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
