import prisma from "../../../database.js";
import { SignUpService , SigninService ,deleteUserService } from "../services/Auth_Service.js";

export const SigninController = async(req,res)=>{
     try{

        const {email , password} = req.body;


        const message = await SigninService(email , password);
        
        if(message===null){
            return res.status(400).json({
                message : "Credentails Wrong"
            })
        }
        res.cookie("token" , message ,  {
            
            httpOnly:true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000
        })

        return res.status(200).json({
            message  : "User Login Successfully"
            
        })

     }
     catch(er){

        if(er.message==='Credentails Wrong'){
            return res.status(400).json({
                message : "Credentails Wrong"
            })
        }
        
        return res.status(500).json({
            message : 'Internal Server Error',
            error:er
        })

     }
}

export const SignUpController = async(req,res)=>{
      
    try{

        const {email , username , password} = req.body;

        const result = await SignUpService(email , username,  password);

        return res.status(200).json({
            message : "User Registred Successfully.."
        })

    }
    catch(er){

        if(er.message === 'Email Already registred...'){
            return res.status(400).json({
                message :'Email Already registred...'
            })
        }
        else if(er.message === 'Username already taken'){
             return res.status(400).json({
                message : 'Username already taken'
             })
        }

        return res.status(500).json({
            message :'Internal Server Error',
            error:er
        })
         
    }
}


export const deleteUserController = async(req,res)=>{
      
    try{

        const user_id = req.user.user_id;

        const result = await deleteUserService(user_id);

        return res.status(200).json({
            message : "User deleted successfully."
        })

    }
    catch(er){
        if(er.message === 'User not found'){
            return res.status(400).json({
                message : "User not found"
            })
        }
        else if(er.message ==='Cannot delete user: they are admin of room'){
            return res.status(400).json({
                message : "Cannot delete user: they are admin of room"
            })
        }

        return res.status(500).json({
            message : "Internal Server Error",
            error:er
        })
    }
}