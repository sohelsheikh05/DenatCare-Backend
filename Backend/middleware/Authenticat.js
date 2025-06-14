import jwt from "jsonwebtoken";
import Dental_User from "../model/user.model.js";

const authenticateUser = async (req, res, next) => {
  try {
  
    const token =  req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    req.user = await Dental_User.findById(decoded.userId).select("-password"); 
     // attach user info to request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticateUser;
