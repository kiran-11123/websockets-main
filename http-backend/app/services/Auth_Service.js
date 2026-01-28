import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Users_models from '../db/user_model.js'
import dotenv from 'dotenv'
import e from 'express';
dotenv.config({ path: "../.env" });

const JWT_SECRET = process.env.JWT_SECRET

export const SigninService = async(email ,password)=>{
      
    try{

      
        const find_user = await Users_models.findOne({email});
       
        console.log("User found: ", find_user);

        if(!find_user){
             throw new Error("Credentails Wrong")
        }
        
        const password_check = await bcrypt.compare(password  , find_user.password);

        console.log("Password check: ", password_check);

        if(!password_check){
            throw new Error('Credentails Wrong')
        }

        const details = {user_id : find_user._id , username : find_user.username , email : find_user.email}

       const token = jwt.sign(details , JWT_SECRET , {expiresIn : "7d"});

       return token;
       

    }
    catch(er){
         
        throw er;
    }
}


export const SignUpService = async(email , username , password)=>{
     
    try{

        const find_user  = await Users_models.findOne({email  :email});

        if(find_user){
            throw new Error(`Email Already registred...`)
        }

        const find_username = await Users_models.findOne({username : username});

        if(find_username){
             throw new Error(`Username already taken`)
        }

        const hashpassword = await bcrypt.hash(password , 10);

        const new_user =  new Users_models({
            email,
            username,
            password: hashpassword
        })

        await new_user.save();

        return new_user;

    }
    catch(er){
         
    }
}