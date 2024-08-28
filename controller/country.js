const mongoose = require("mongoose");
const Country = require("../db/Schema/Country");
const apiResponse = require("../helpers/apiResponse");
const { validationResult } = require("express-validator");

exports.addCountry = async (req, res) => {
  const { name, code, language, currencies } = req.body;
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const country = new Country({
      name: name,
      code: code,
      language: language,
      currencies: currencies,
    });
    await country.save();
    apiResponse.successResponseWithData(res, "Successfully....", country);
  } catch (error) {
    console.error("Error adding country:", error);
    apiResponse.errorResponse(res, "Failed to add country");
  }
};

exports.getCountry = async (req, res) => {
  try {
    const country = await Country.find();
    apiResponse.successResponseWithData(res, "success", country);
  } catch (error) {
    apiResponse.errorResponse(error, "Failed to fetch country Data");
    throw new Error(error);
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const { countryId, name, code, language, currencies } = req.body;
    // console.table({countryId,name,code,language});
    //  console.log(countryId);
    const countryUpdate = await Country.find({ _id: countryId });

    if (!countryUpdate) {
      console.log("country not Avilable");
      res.status(200).json({ message: "Country details not Exists" });
      return;
    }

    const updateData = {
      _id: countryId,
      name: name,
      code: code,
      language: language,
      currencies: currencies,
    };

    await Country.updateOne(updateData);

    apiResponse.successResponseWithData(res, "Successfully....", updateData);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Error to update country details" });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { countryId } = req.body;
    const deleteRes = await Country.deleteOne({ _id: countryId });

    if (deleteRes.deletedCount == 1) {
      const data = await Country.find();
      apiResponse.successResponseWithData(res, "success", data);
    } else {
      apiResponse.errorResponse(
        res,
        "Failed to delete country details or may be details not avilable"
      );
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error deleting country" });
  }
};
