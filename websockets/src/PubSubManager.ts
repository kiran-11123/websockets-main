import { publisher , subscriber } from "./redis/redis";


export class PubSubManager {
     
   private static instance: PubSubManager;

   

    private constructor(){
         
    }
    
    public static getInstance() : PubSubManager{
         
        if(!this.instance){
             this.instance = new PubSubManager();
        }

        return this.instance;
    }


}



const PubSubObject:PubSubManager  = PubSubManager.getInstance();
export default PubSubObject;