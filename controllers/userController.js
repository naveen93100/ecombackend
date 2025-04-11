import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    let userId = req.userId;
    let { id, price, qty } = req.body;

    if (!id || !price || !qty)
      return res.status(400).json({ success: false, message: "Error" });

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      await Cart.create({
        userId,
        items: [
          {
            productId: id,
            quantity: qty,
            price: price,
          },
        ],
      });
    } else {
      let exist = userCart.items.some((item) => item.productId.equals(id));

      if (exist) {
        userCart.items = userCart.items.map((item) => {
          if (item.productId.equals(id)) {
            return { ...item, quantity: qty, price: price };
          } else {
            return item;
          }
        });
      } else {
        userCart.items.push({
          productId: id,
          quantity: qty,
          price: price,
        });
      }
      await userCart.save();
    }
    return res.status(200).json({ success: true, message: "Product add" });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const getCart = async (req, res) => {
  try {
    let userId = req.userId;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });

    let cart = await Cart.findOne({ userId })
      .select("items totalPrice")
      .populate("items.productId");
    return res.status(200).json({ success: true, data: cart });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    let userId = req.userId;
    let { id } = req.body;

    if (!userId)
      return res.status(400).json({ success: false, message: "Error" });

    let userCart = await Cart.findOne({ userId })
      .select("items totalPrice")
      .populate("items.productId");

    if (!userCart)
      return res
        .status(400)
        .json({ success: false, message: "userCart not found" });

    userCart.items = userCart.items.filter(
      (item) => !item.productId._id.equals(id)
    );
    await userCart.save();

    return res
      .status(200)
      .json({ success: true, message: "Product Removed", data: userCart });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    let userId = req.userId;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    let userCart = await Cart.findOne({ userId })
      .select("items totalPrice")
      .populate("items.productId");

    if (!userCart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    userCart.items = [];
    await userCart.save();

    return res.status(200).json({
      success: true,
      message: "All products removed from cart",
      data: userCart,
    });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    let userId = req.userId;
    let {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault = false,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country
    )
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "Authentication error" });

    let user = await User.findOne({ _id: userId });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.addresses.push(req.body);

    await user.save();
    return res.status(200).json({ success: true, data: user.addresses });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    let userId = req.userId;

    let address = await User.findOne({ _id: userId }).select("addresses");

    return res.status(200).json({ success: true, data: address });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};


export const removeAddress = async (req, res) => {
  try {
    let { id } = req.params;
    let userId = req.userId;

    if (!id)
      return res
        .status(401)
        .json({ success: false, message: "ID not provided" });

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized: User ID not found" });

    let user = await User.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    let addressExist = user.addresses.some((item) => item._id.equals(id));

    if (!addressExist)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });

    user.addresses = user.addresses.filter((item) => !item._id.equals(id));

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address Removed",
      data: user.addresses,
    });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const setDefaultAddress=async(req,res)=>{
  try {
    
    let userId=req.userId;

    let {id}=req.params;

    if(!userId) return res.status(401).json({success:false,message:'Unauthorized Error!'});
    if(!id) return res.status(400).json({success:false,message:'ID not found'});

    let user=await User.findById(userId);

    if(!user) return res.status(404).json({success:false,message:'User not found'});

    user.addresses=user.addresses.map(item=>item.isDefault==true?{...item,isDefault:false}:item);
    user.addresses=user.addresses.map(item=>item._id.equals(id)?{...item,isDefault:true}:{...item,isDefault:false});

    await user.save();


    return res.status(200).json({success:true,message:'Address set to default',data:user.addresses});

  } catch (er) {
     return res.status(500).json({success:false,message:er.message});
  }
}

export const getWishlist = async (req, res) => {
  try {
    let userId = req.userId;
    let wishlist = await User.findOne({ _id: userId })
      .select("wishlist")
      .populate("wishlist.productId");
    return res.status(200).json({ success: true, data: wishlist });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const addProductWishlist = async (req, res) => {
  try {
    let userId = req.userId;
    let { id: productId } = req.params;

    if (!productId)
      return res
        .status(401)
        .json({ success: false, message: "productId is not provided" });

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User Id is not found" });

    let user = await User.findOne({ _id: userId });

    if (user.wishlist.length > 0) {
      let wishlistExist = user.wishlist.some((item) =>
        item.productId.equals(productId)
      );

      if (wishlistExist) {
        return res
          .status(200)
          .json({ success: true, message: "Product already in wishlist" });
      }
    }
    user.wishlist.push({ productId });
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Product add to Wishlist" });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const removeProductFromWishlist = async (req, res) => {
  try {
    let { id } = req.params;
    let userId = req.userId;
    if (!id || !userId)
      return res
        .status(401)
        .json({ success: false, message: "Id is not provided" });

    let user = await User.findOne({ _id: userId });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.wishlist.length > 0) {
      user.wishlist = user.wishlist.filter(
        (item) => !item.productId.equals(id)
      );
    }

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Remove from wishlist" });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};
