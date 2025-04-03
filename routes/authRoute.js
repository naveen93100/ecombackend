import express from 'express';
import { adminLogin, login, signup } from '../controllers/authController.js';

const router=express.Router();

// normal user login and signup
router.post('/login',login);
router.post('/signup',signup);


// admin login
router.post('/admin_login',adminLogin);

export default router;