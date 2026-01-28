import Room from "../db/room_model.js";
import prisma from "../../../database.js";


export const CreateRoomService = async(room_name , user_id)=>{
     
     try{   

        const find_room = await prisma.Room.findUnique({
             
            where:{
                name : room_name,
            }
        })

        if(find_room){
            throw new Error("Room already exists with this name for this user");
        }

        const room = await prisma.room.create({
    data: {
      name: room_name,
      users: {
        connect: { userId: user_id }, // Connect the existing user
      },
    },
    include: {
      users: true, // Optional: return the users in the room
    },
  });

  return room;



  

     }

     catch(er){

        throw er;

     }
}

export const DeleteRoomService = async(room_name , user_id)=>{

    try{   
        
        const delete_room = await prisma.Room.deleteMany({
               
            where:{
                name: room_name,
                users: {
                    some: {
                        userId: user_id
                    }
                }
            }
        });

        if(!delete_room){
            throw new Error("Room not found or you don't have permission to delete this room");
        }   

        return;

    }

    catch(er){
        
        throw er;

    }


}