const { default: mongoose } = require("mongoose");
const Cart = require(`../model/cartModel`);
const redisClient = require('../redis/redis')


// Add an item to the cart
const storeInCart = async (req, res) => {
    try {
        console.log(req.body);
        const newItem = await Cart.create(req.body);
            return res.status(200).json({
                status: 'success',
                message: 'Item stored in cart'
            });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to store item in cart',
            error: error.message,
        });
    }
}





// Retrieve items from the cart
const retriveCart = async (req, res) => {
  const cacheKey = `cartItems:${currentUser}`
  const currentUser = req.params.currentUser;
  try {
    const cacheData = await redisClient.get(cacheKey)

    if(cacheData){
      const cartItems = JSON.parse(cacheData)
      res.status(200).json({
        status: "success",
        cartItems,
        message: "Items retrieved From cache",
      });
    }else{
      const cartItems = await Cart.find({ currentUser })
      await redisClient.set(cacheKey, JSON.stringify(cartItems))
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



// const currentUser = req.params.currentUser;
//     console.log(currentUser);
//     const cartItems = await Cart.find({ currentUser });
//     console.log(cartItems)
//     res.status(200).json({
//       status: "success",
//       cartItems,
//       message: "Items retrieved",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to retrieve items from the cart",
//       error: error.message,
//     });
//   }

// Delete an item from the cart
const deleteItem = async (req, res) => {
    try {
      const id = req.params.item;
      await Cart.deleteOne({ _id: id });
  
      res.status(200).json({
        status: "success",
        message: "Item deleted",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to delete item from the cart",
        error: error.message,
      });
    }
  };
  

module.exports = {
  storeInCart,
  retriveCart,
  deleteItem,
};
