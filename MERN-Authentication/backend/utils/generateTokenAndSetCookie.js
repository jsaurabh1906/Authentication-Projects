import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", //token expires in 7 days
  });

  res.cookie("token", token, {
    httpOnly: true, //THis prevent an attack called XSS (Cross Site Scripting) // cookkie cannot be accessed by client side javascript as it is httpOnly
    maxAge: 1000 * 60 * 60 * 24 * 7, //cookie expires in 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return token;
};
