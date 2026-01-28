import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({ path: "../.env" });

const JWT_SECRET = process.env.JWT_SECRET


async function Authentication_token_function(req,res,next){
     

   const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) 
    console.log("Decoded token in middleware: ", JWT_SECRET);

    if (!decoded.user_id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded ; 

    next();

    }
    catch(er){

        return res.status(500).json({
            message : 'Internal Server Error',
            error:er
        })

    }
}

export default Authentication_token_function;