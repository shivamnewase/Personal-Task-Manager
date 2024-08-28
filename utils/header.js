const apiResponse = require("../helpers/apiResponse");

const auth_Key = process.env.AUTH_KEY;
const user_Client_Service = process.env.USER_CLIENT_SERVICE;
const version =  process.env.VERSION;

const header = async(req, res, next) => {
    
    const header_client_service = req.header("Client-Service");
    const header_auth_key = req.header("Auth-Key");
    const header_api_version = req.header("x-api-version");

     try {
        if(header_client_service === user_Client_Service && header_auth_key === auth_Key && header_api_version === version){
            
             next();
        }else{
            console.table({ header_client_service, auth_key, header_auth_key,user_Client_Service, header_api_version, version });
            return apiResponse.unauthorizedResponse(res, "Please Authenticate");
        }

     } catch (error) {
        
     }

}

module.exports = header;