import User from './models/userModel.js';
import bcrypt from 'bcrypt';

export const seed=async()=>{
   try {
      let pass=await bcrypt.hash('admin@123',12);
     let createAdmin=await User.create({
        name:'admin',
        email:'admin@gmail.com',
        password:pass,
        role:'admin'
     })

     console.log(createAdmin);

   } catch (er) {
       console.log(er.message);
   }
}