import { CreateRoomService , DeleteRoomService } from "../services/Room_Service.js";

export const CreateRoomController = async(req,res)=>{
    try{

        const {name} = req.body;
        const user_id = req.user_id;    
        await CreateRoomService(name , user_id);

        return res.status(200).json({
            message : "Room Created Successfully"
        })

    }
    catch(er){  
        if(er.message === "Room already exists with this name for this user"){  
            return res.status(400).json({
                message : er.message
            })
        }   
        return res.status(500).json({
            message : 'Internal Server Error',
            error:er
        })
    }       

}

export const DeleteRoomController = async(req,res)=>{
    try{            

        const {name} = req.body;
        const user_id = req.user_id;    
        await DeleteRoomService(name , user_id); 

        return res.status(200).json({
            message : "Room Deleted Successfully"
        })      

    }
    catch(er){  
        if(er.message === "Room not found or you don't have permission to delete this room"){  
            return res.status(400).json({   
                message : er.message
            })  

        }
        return res.status(500).json({
            message : 'Internal Server Error',
            error:er
        })
    }   

}