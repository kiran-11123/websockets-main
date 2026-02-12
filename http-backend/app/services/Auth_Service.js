import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import prisma from '../../../database.js';
import { DeleteRoomService } from './Room_Service.js';
dotenv.config({ path: "../.env" });

const JWT_SECRET = process.env.JWT_SECRET
export const SigninService = async (email, password) => {
  try {
    const find_user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!find_user) {
      throw new Error("Credentails Wrong")
    }

    const password_check = await bcrypt.compare(password, find_user.password)


    if (!password_check) {
      throw new Error("Credentails Wrong")
    }

    const details = {
      user_id: find_user.userId,
      username: find_user.username,
      email: find_user.email,
    }

    const token = jwt.sign(details, JWT_SECRET, { expiresIn: "7d" })

    return token
  } catch (er) {
    throw er
  }
}

export const SignUpService = async (email, username, password) => {

  try {

    const find_user = await prisma.user.findUnique({
      where: {
        email,
      },
    })


    if (find_user) {
      throw new Error("Email Already registred...")
    }

    const find_username = await prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (find_username) {
      throw new Error("Username already taken")
    }

    const hashpassword = await bcrypt.hash(password, 10)

    const new_user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashpassword,
      },
    })

    return new_user
  } catch (er) {
    throw er
  }
}



export const deleteUserService = async(user_id)=>{

      
    try{
        
        const find_user = await prisma.user.findUnique({
            where:{
                userId : user_id
            }
        })

        if(!find_user){

            throw new Error(`User not found`)
        }

         const memberships = await prisma.roomMember.findMany({
      where: { userId: user_id },
      include: { room: true }
    });


     for (const m of memberships) {
      // Optionally: block if admin
      if (m.role === "admin") {
        const result = await DeleteRoomService(m.room.name, user_id);

        if(!result){
            throw new Error('Cannot delete user: they are admin of room')
        }
      }
      else{

          await prisma.roomMember.delete({
        where: { userId_roomId: { userId: user_id, roomId: m.room.roomId } }
      });

      }
    
    }

      
        await prisma.user.delete({
            where:{
                userId : user_id
            }
        })


    }
    catch(er){
      console.log(er);
        throw er;
    }
}