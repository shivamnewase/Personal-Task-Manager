const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");

const header = async (req, res, next) => {

  const token = req.headers["authorization"].split(" ")[1];
  
  try {
    const isVerify = jwt.verify(token, process.env.SECRET_KEY);
    
    if (isVerify) {
      next();
    } else {
      return apiResponse.unauthorizedResponse(res, "Please Authenticate");
    }
  } catch (error) {
    console.log(error);
    return apiResponse.unauthorizedResponse(res, "Please Authenticate");
  }
};

module.exports = header;
