import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
      },
      stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        min: [0, 'Stock cannot be negative'],
      },
      images: [{}],
      body:{
        type:String
      },
      wattage:{
         type:Number,
         min:0
      },
      type:String
    },
    { timestamps: true }
  );
  
  const Product = mongoose.model('product', productSchema);
  
  export default Product;