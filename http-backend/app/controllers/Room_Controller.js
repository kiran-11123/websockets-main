import { CreateRoomService , DeleteRoomService , exitingRoomService } from "../services/Room_Service.js";

export const CreateRoomController = async(req,res)=>{
    try{

        const {name} = req.body;
        const user_id = req.user.user_id;    
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
        const user_id = req.user.user_id;    
        await DeleteRoomService(name , user_id); 

        return res.status(200).json({
            message : "Room Deleted Successfully"
        })      

    }
    catch(er){  

        if(er.message ==='Room not found'){
              return res.status(400).json({
                message : "Room not found"
              })
        }
        if(er.message === "You dont have ownership to delete the room"){  
            return res.status(400).json({   
                message : "You dont have ownership to delete the room"
            })  

        }
        return res.status(500).json({
            message : 'Internal Server Error',
            error:er
        })
    }   

}

export const exitingRoomController = async(req,res)=>{
      
    try{

        const name = req.body.name;
        const user_id = req.user.user_id;    

        const result  = await exitingRoomService(name , user_id);

        return res.status(200).json({
            message : `User Successfully exited from the room ${name}`
        })

    }
    catch(er){

        if(er.message === 'Room Not found'){
            return res.status(400).json({
                message : "Room Not found"
            })
        }
        else if(er.message === 'You are not found in this room'){
            return res.status(400).json({
                message : "You are not found in this room"
            })
        }
        else if(er.message === 'You cannot exit from the room since you are the admin'){
            return res.status(400).json({
                message : "You cannot exit from the room since you are the admin"
            })
        }
       
        return res.status(500).json({
            message : "Internal Server Error",
            error:er
        })
    }
}