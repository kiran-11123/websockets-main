import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Users_models from '../db/user_model.js'
import dotenv from 'dotenv'
import prisma from '../../../database.js';
dotenv.config({ path: "../.env" });

const JWT_SECRET = process.env.JWT_SECRET

export const SigninService = async(email ,password)=>{
      
    try{

      
        const find_user = await prisma.User.findUnique({
            where: {
              email: email,
            },
          });
       

        if(!find_user){
             throw new Error("Credentails Wrong")
        }
        
        const password_check = await bcrypt.compare(password  , find_user.password);

        console.log("Password check: ", password_check);

        if(!password_check){
            throw new Error('Credentails Wrong')
        }

        const details = {user_id : find_user.userId , username : find_user.username , email : find_user.email}

       const token = jwt.sign(details , JWT_SECRET , {expiresIn : "7d"});

       return token;
       

    }
    catch(er){
         
        throw er;
    }
}


export const SignUpService = async(email , username , password)=>{
     
    try{

        const find_user  = await prisma.User.findUnique({
            where:{
                 email:email
            }
        })

        if(find_user){
            throw new Error(`Email Already registred...`)
        }

        const find_username = await prisma.User.findUnique({
             where:{
                username : username
             }
        });

        if(find_username){
             throw new Error(`Username already taken`)
        }

        const hashpassword = await bcrypt.hash(password , 10);

        const new_user =  await prisma.User.create({

            data :{

            email,
            username,
            password: hashpassword

            }
           
        })

        return new_user;

    }
    catch(er){
         
    }
}