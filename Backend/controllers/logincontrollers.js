import Dental_User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";   
import jwt from "jsonwebtoken";

// import { generateAuthToken } from "../tokens/generateauthToken.js";
export const login = async (req, res) => {
     try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Check if user exists
      const user = await Dental_User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Check password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Create token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  
}

export const register = async (req, res) => {
    {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, role } = req.body
        
      // Check if user exists
      let user = await Dental_User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: "User already exists" })
      }

      // Create user
      user = new Dental_User({
        name,
        email,
        password,
        role: role || "doctor",
      })

      await user.save()

      // Create token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  }
}

export const getUser = async (req, res) => {
  
  try {
   
    const user = await Dental_User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }

}
