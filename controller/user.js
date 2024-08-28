const express = require("express");
const router = express.Router();
const User = require("../db/Schema/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");
require("dotenv").config();

exports.createUser = async (req, res) => {
  const { name, email, password, role, phone, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Username and Email are required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      console.error("Error generating salt:", err);
      return;
    }
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) {
        console.error("Error hashing password:", err);
        return;
      }
      const user = new User({
        name: name,
        email: email,
        password: hash,
        role: role,
        phone: phone,
        status: status,
      });

      await user.save();

      res.status(200).json(user);
    });
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ message: "User Not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(404).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIREIN,
    });
    apiResponse.loginSucssesResponseWithData(
      res,
      "user Logged in successfully",
      user,
      token
    );
  } catch (error) {
    console.log("error finding for user", error);
    res.status(500).json({ message: "Error finding user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, status } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email Required to update User Details" });
    }
    const userDetail = await User.findOne({ email: email });

    const userBody = {
      name: name,
      email: email,
      password: password,
      role: role,
      phone: phone,
      status: status,
    };

    if (!userDetail) {
      return res.status(400).json({ message: "User Not Exists" });
    } else {
      
      bcrypt.genSalt(10, (err, salt)=>{
        if(err){
          console.log("error generating salt", error);
        }

        bcrypt.hash(password, salt,(err, hash)=>{
            if(err){
              console.log("error hashing password", error);
            }
        })
      })
      await User.updateOne(userBody);
      apiResponse.successResponseWithData(
        res,
        "User update Successfully..",
        userBody
      );
    }
  } catch (error) {
    console.log("error", error);
  }
};
