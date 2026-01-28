import mongoose from "mongoose";


const User_Schema  = new mongoose.Schema({
      
    email  :{type :String , required : true},
    username : {type : String , required:true},
    password : {type : String  , required : true}
})

const Users_models = mongoose.model ("Users" , User_Schema);




export default Users_models;