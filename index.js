import 'dotenv/config';
import express from 'express';
import authRoute from './routes/authRoute.js';
import productsRoute from './routes/productsRoute.js';
import userRoute from './routes/userRoute.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectDB();

app.use('/api/products/image',express.static(path.join(__dirname,'/uploads/images')))
app.use('/api/auth',authRoute);

app.use('/api/user',userRoute);

app.use('/api/products',productsRoute);


app.listen(3000,()=>{   
    console.log('Server is running on port 3000');
});
