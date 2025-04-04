import express from 'express';
import upload from '../middleware/upload.js';
import { addProducts, removeProduct , getAllProducts,editProduct, getImage, getProducts,getProductById,addProductWishlist, getWishlist} from '../controllers/productsController.js';
import { isAuth } from '../middleware/isAuth.js';

const router=express();

router.get('/get_image/:filename',getImage);
router.get('/get_products',getProducts);
router.get('/get_product_by_id/:id',getProductById);
router.get('/get_wishlist',isAuth,getWishlist);
router.post('/add_product_wishlist/:id',isAuth,addProductWishlist);

// admin route
// --------------
router.get('/get_all_products',getAllProducts);

router.post('/add_products',upload.fields([
    {name:'image',maxCount:4}
]),addProducts);

router.delete("/remove_product/:id",removeProduct);

router.patch('/edit_product/:id',upload.fields([
    {name:'image',maxCount:4}
]),editProduct);
// ------------

export default router;