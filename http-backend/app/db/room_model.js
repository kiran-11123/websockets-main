import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  room_name: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;