const Redis = require('ioredis');
const redis = new Redis({
  host: 'https://pitstop-80pm.onrender.com',
  port: 6379,
});

const Product = require("../model/productModel");
const Cart = require("../model/cartModel");




const getAll = async (req, res) => {
  const cacheKey = 'allProducts'
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching products",
    });
  }
}
//   try {
//     // Check if data is cached
//     const cachedData = await redis.get(cacheKey);

//     if (cachedData) {
//       // Data is cached, return the cached result
//       const products = JSON.parse(cachedData);
//       res.status(200).json({
//         status: 'success',
//         message: 'Data retrieved from cache',
//         data: products,
//       });
//     } else {
//       // Data is not cached, fetch from the database
//       const products = await Product.find();
      
//       // Store the result in Redis with expirytime
//       await redis.set(cacheKey, JSON.stringify(products), 'EX', 3600);

//       res.status(200).json({
//         status: 'success',
//         data: products,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: 'An error occurred while fetching products',
//     });
//   }
// }

// redis.quit();

// middleware for cache
// const cacheGetAllProducts = (req, res, next) => {
//   const cacheVal = `getAll:${req.url}`;

//   const cacheData = req.cache.get(cacheVal);

//   if (cacheData) {
//     res.json(JSON.parse(cacheData));
//   } else {
//     // Invoke the getAll function and handle the response
//     getAll(req, res)
//       .then((data) => {
//         req.cache.put(cacheVal, JSON.stringify(data), cacheDuration);
//         res.json(data);
//       })
//       .catch((error) => {
//         // Handle errors if necessary
//         res.status(500).json({
//           status: "error",
//           message: "An error occurred while fetching products",
//         });
//       });
//   }
// };



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
