import prisma from "../../../database.js";

export const CreateRoomService = async (room_name, user_id) => {
  try {
    console.log(room_name, user_id);

    // 1️⃣ check if room already exists
    const existingRoom = await prisma.room.findUnique({
      where: {
        name: room_name
      }
    });

    if (existingRoom) {
      throw new Error("Room already exists with this name");
    }

    // 2️⃣ create room
    const room = await prisma.room.create({
      data: {
        name: room_name,
         created_by: {
          connect: { userId: user_id }
        }
      }
    });

  await prisma.roomMember.create({
      data: {
        userId: user_id,
        roomId: room.roomId,
        role: "admin"
      }
    });

    return room;

  } catch (er) {
    console.log(er);
    throw er;
  }
};


export const DeleteRoomService = async(room_name , user_id)=>{

    try{   
        
        const find_room = await prisma.room.findUnique({
            where:{
                name  : room_name
            }
        })

       

      if (!find_room) {
      throw new Error("Room not found");
    }

    // verify the requester is an admin of the room using the compound unique
    const adminMember = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: user_id,
          roomId: find_room.roomId,
        },
      },
    });

    if (!adminMember || adminMember.role !== 'admin') {
      throw new Error('You dont have ownership to delete the room');
    }

    // delete all members of the room
    await prisma.roomMember.deleteMany({
      where: { roomId: find_room.roomId },
    });



    
    await prisma.room.delete({
        where :{
            roomId : find_room.roomId
        }
    })

        
        
        return;

    }

    catch(er){
        
        console.log(er);
        throw er;

    }


}