const { checkSchema } = require("express-validator");
const Country = require("../../db/Schema/Country"); 

exports.countryAddSchema = checkSchema({
  name: {
    in: ['body'],
    exists: {
      errorMessage: 'Name is required',
      bail: true 
    },
    custom: {
      options: async (value, { req }) => {
        console.log(13)
       
        const existingCountry = await Country.findOne({ name: value });
       
        if (existingCountry) {
          throw new Error('Country with this name already exists');
        }
        return true;
      }
    }
  },
  code: {
    in: ['body'],
    exists: {
      errorMessage: 'code is required',
      bail: true 
    },
    custom: {
      options: async (value, { req }) => {
        console.log(13)
       
        const existingCountry = await Country.findOne({ code: value });
        console.log("🚀 ~ options: ~ existingCountry:", existingCountry)
        if (existingCountry) {
          throw new Error('Country with this Code already exists');
        }
        return true;
      }
    }
  }
});
