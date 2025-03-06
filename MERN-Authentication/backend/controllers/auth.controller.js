import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendPasswordResetConfirmationEmail,
} from "../mailtrap/emails.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const now = new Date();
  try {
    if (!email || !password || !name) {
      throw new Error("Please provide all the details");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const tokenExpirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: tokenExpirationDate,
    });

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id);

    //send verification email
    await sendVerificationEmail(user.email, verificationCode);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        //    name: user.name,
        //    email: user.email,
        ...user._doc,
        password: undefined, //to not send password to client
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    //once verified, set isVerified to true and remove verificationToken and verificationTokenExpiresAt
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined, //to not send password to client
      },
    });
  } catch (error) {
    console.log("Error verifying email: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  // res.send("signin");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    user.save();

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        ...user._doc,
        password: undefined, //to not send password to client
      },
    });
  } catch (error) {
    console.error(`Error while logging in : ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  // res.send("logout");

  res.clearCookie("token");
  res.status(200).json({ success: true, message: "User logged out" });
};

export const forgotPassword = async (req, res) => {
  // res.send("forgot password");
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 3600000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // await sendResetPasswordEmail(
    //   user.email,
    //   `http://localhost:5173/reset-password/${resetToken}`
    // );
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(`Error while forgot password : ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, //check if token is not expired
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    //update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendPasswordResetConfirmationEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(`Error while reset password : ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User authenticated",
      user,
    });
  } catch (error) {
    console.error(`Error while checking auth : ${error.message}`);
  }
};
