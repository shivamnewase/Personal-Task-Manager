const express = require("express");
const router = express.Router();
const countryController = require("../controller/country");
const {countryAddSchema} = require("../middleware/validationSchema/countryValidation");

router.post("/addCountry", countryAddSchema, countryController.addCountry);
router.get("/getCountries",  countryController.getCountry);
router.post("/updateCountries", countryController.updateCountry);
router.post("/deleteCountries", countryController.deleteCountry);

module.exports = router