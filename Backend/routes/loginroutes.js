import express from "express";
import { login,register,getUser } from "../controllers/logincontrollers.js";
import {validateUserLogin,validateUserRegister} from "../middleware/validateuser.js";
import { get } from "mongoose";
import auth from "../middleware/auth.js";
const router=express.Router();  

router.post("/login",validateUserLogin,login);
router.post("/register",validateUserRegister,register);

  router.get("/me", auth, getUser);
export default router