import express from 'express';
import { addAddress, addProductWishlist, addToCart, getAddress, getCart, getWishlist, removeAddress, removeAllFromCart, removeFromCart, removeProductFromWishlist, setDefaultAddress } from '../controllers/userController.js';
import { isAuth } from '../middleware/isAuth.js';

const router=express();

router.post('/add_to_cart',isAuth,addToCart);
router.get('/get_cart',isAuth,getCart);
router.delete('/remove_from_cart',isAuth,removeFromCart);
router.delete('/remove_all_from_cart',isAuth,removeAllFromCart);

router.post('/add_address',isAuth,addAddress);
router.get('/get_address',isAuth,getAddress);
router.delete('/remove_address/:id',isAuth,removeAddress);
router.patch('/set_default_address/:id',isAuth,setDefaultAddress);


router.get('/get_wishlist',isAuth,getWishlist);
router.post('/add_product_wishlist/:id',isAuth,addProductWishlist);
router.delete('/remove_product_from_wishlist/:id',isAuth,removeProductFromWishlist);


export default router;