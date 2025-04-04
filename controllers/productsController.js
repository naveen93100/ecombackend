import Product from "../models/productModel.js";
import path from "path";
import fs from "fs";
import User from "../models/userModel.js";

// get image
export const getImage = async (req, res) => {
  try {
    const filename = req.params?.filename;

    const pdfFolderPath = path.resolve("/uploads/images");

    const filePath = path.join(pdfFolderPath, filename);

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).send({
        success: false,
        message: "File not found",
      });
    }
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

// get all product
export const getProducts = async (req, res) => {
  try {
    let product = await Product.find({});

    return res.status(200).json({ success: true, data: product });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

// get single product by id
export const getProductById = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Id is not provided" });

    let product = await Product.findById(id);
    return res.status(200).json({ success: true, data: product });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const addProductWishlist = async (req, res) => {
  try {
    let userId = req.userId;
    let { id: productId } = req.params;

    if (!id)
      return res
        .status(401)
        .json({ success: false, message: "Id is not provided" });

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User Id is not found" });

    let user = await User.findOne({ _id: userId });

    if(user.wishlist.length>0){
      let wishlistExist = user.wishlist.some(item=>item.productId.equals(productId));

      if(wishlistExist){
          return res.status(200).json({success:true,message:'Product already in wishlist'})
      }

    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({ success: true, message:"Product add to Wishlist" });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

// admin----------------
export const addProducts = async (req, res) => {
  try {
    let { name, description, price, stock, body } = req.body;

    if (!name || !description || !price || !stock)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    let imgUrl;

    if (req.files && req.files.image) {
      imgUrl = req.files.image.map((item) => {
        return `http://localhost:3000/api/products/image/${item.filename}`;
      });
    }

    let createdProduct = await Product.create({
      name,
      description,
      price,
      stock,
      images: imgUrl,
      body,
    });

    return res.status(200).json({
      success: true,
      message: "Product Created",
      data: createdProduct,
    });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    let productId = req.params.id;

    if (!productId)
      return res
        .status(401)
        .json({ success: false, message: "Id is not provided" });

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ success: true, message: "Product Deleted" });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    return res.status(200).json({ success: true, data: products });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "Id is not provided" });

    let { name, description, price, stock, imageUrlArray, body } = req.body;

    imageUrlArray = imageUrlArray.split(",");

    let product = await Product.findOne({ _id: productId });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (name) product.name = name;

    if (description) product.description = description;

    if (price) product.price = price;

    if (stock) product.stock = stock;

    if (body) product.body = body;

    if (req.files && req.files.image) {
      let imgUrl = req.files.image.map((item) => {
        return `http://localhost:3000/api/products/image/${item.filename}`;
      });
      imageUrlArray = [...imageUrlArray, ...imgUrl];
    }
    product.images = imageUrlArray;
    await product.save();

    return res
      .status(200)
      .json({ success: true, message: "Product Update", data: product });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};
// -------------------
