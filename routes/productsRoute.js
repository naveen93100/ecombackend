import express from 'express';
import upload from '../middleware/upload.js';
import { addProducts, removeProduct , getAllProducts,editProduct, getImage, getProducts,getProductByName} from '../controllers/productsController.js';

const router=express();

router.get('/get_image/:filename',getImage);

router.get('/get_products',getProducts);
router.get('/get_product_by_name/:name',getProductByName);



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