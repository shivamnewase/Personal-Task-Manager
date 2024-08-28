const User = require("../db/Schema/User");
const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");

const auth = async(req, res, next) => {
  const jwtSecret = process.env.SECRET_KEY;
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new Error("Please Enter token for Authentication");
    }
    const decode = jwt.verify(token, jwtSecret);

    const user = await User.findOne({ _id: decode.id }).lean();

    if (!user) {
      console.log("User not Found");
      throw new Error("User not found");
    }
    req.user = user;
   
    next();
  } catch (error) {
    console.log("error", error);
    return apiResponse.unauthorizedResponse(res, "Please Authenticate.");
  }
};

module.exports = auth;
