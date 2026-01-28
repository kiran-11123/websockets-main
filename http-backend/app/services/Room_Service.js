import Room from "../db/room_model.js";



export const CreateRoomService = async(room_name , user_id)=>{
     
     try{   

        const find_room = await Room.findOne({room_name  : room_name , user_id : user_id});

        if(find_room){
            throw new Error("Room already exists with this name for this user");
        }

        const new_room = new Room({
            room_name,
            user_id
        });


        await new_room.save();

        return;


     }

     catch(er){

        throw er;

     }
}

export const DeleteRoomService = async(room_id , user_id)=>{

    try{   
        
        const delete_room = await Room.findOneAndDelete({_id : room_id , user_id : user_id});

        if(!delete_room){
            throw new Error("Room not found or you don't have permission to delete this room");
        }   

        return;

    }

    catch(er){
        
        throw er;

    }


}