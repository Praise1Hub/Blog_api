import jwt from "jsonwebtoken";
import { User } from "../models/index.js"



export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ 
                message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });

        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const user = await User.create({ 
            name, 
            email: email ? email.toLowerCase().trim() : email,
            password });

        res.status(201).json({ 
            message: "Account created", 
            user,
            token: createToken(user) 
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
       

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // findOne = "get the first row that matches"
        const user = await User.findOne({ 
            where: { email: email.toLowerCase().trim() } 
        });

        // Same message for both cases, so attackers cannot tell which part was wrong
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });

        res.json({ 
            message: "Logged in", 
            user,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};