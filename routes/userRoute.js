import express from 'express';
import { addProductWishlist, addToCart, getCart, getWishlist, removeAllFromCart, removeFromCart, removeProductFromWishlist } from '../controllers/userController.js';
import { isAuth } from '../middleware/isAuth.js';

const router=express();

router.post('/add_to_cart',isAuth,addToCart);
router.get('/get_cart',isAuth,getCart);
router.delete('/remove_from_cart',isAuth,removeFromCart);
router.delete('/remove_all_from_cart',isAuth,removeAllFromCart);


router.get('/get_wishlist',isAuth,getWishlist);
router.post('/add_product_wishlist/:id',isAuth,addProductWishlist);
router.delete('/remove_product_from_wishlist/:id',isAuth,removeProductFromWishlist);


export default router;