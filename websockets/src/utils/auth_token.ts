import dotenv from 'dotenv'
dotenv.config({ path: "../.env" });

import jwt from 'jsonwebtoken';
const JWT_SECRET :any = process.env.JWT_SECRET

function checkUser(token:string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") return null;

    if(!decoded.user_id) return null;

    return decoded ;
  } catch (er) {
    return null;
  }
}

export default checkUser;