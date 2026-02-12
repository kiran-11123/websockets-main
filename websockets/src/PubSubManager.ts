import { publisher , subscriber } from "./redis/redis";


export class PubSubManager {
     
   private static instance: PubSubManager;
   private  roomsDetails: Map<string,Set<string>> = new Map();
    private constructor(){
         subscriber.on('message' , (channel , message)=>{
             this.forwardMessageToUsers(channel , message);
         })
    }
    
    public static getInstance() : PubSubManager{
        if(!this.instance){
             this.instance = new PubSubManager();
        }
        return this.instance;
    }

    public async AddRoomsToTheMap(roomId : string , userId:string){
         
        const findRoom = this.roomsDetails.has(roomId);

        if(!findRoom){
             this.roomsDetails.set(roomId ,new Set());
             await subscriber.subscribe(roomId);
         }

         this.roomsDetails.get(roomId)?.add(userId);
    }

    public async RemoveUserFromRoom(roomId : string, userId :string){
          
        const users = this.roomsDetails.get(roomId);

        if(!users){
            return;
        }

        users.delete(userId);

        if(users.size ===0){
            
            subscriber.unsubscribe(roomId);
            this.roomsDetails.delete(roomId);
        }
    }
    

    public  async forwardMessageToUsers(roomId:string , message :string){
           const users = this.roomsDetails.get(roomId);

           if(!users){
               return;
           }

            users?.forEach((u)=>{
              console.log(`Message sent to the users in the room ${roomId}`)
           })
    }



}



const PubSubObject:PubSubManager  = PubSubManager.getInstance();
export default PubSubObject;