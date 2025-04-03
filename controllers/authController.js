import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// ----------
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });

    let user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

export const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });

    let user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    let hashPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashPassword,
    });

    return res.status(200).json({ success: true, message: "User Created" });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};
// ----------


// admin login function
export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });

    let user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "not found" });

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};
