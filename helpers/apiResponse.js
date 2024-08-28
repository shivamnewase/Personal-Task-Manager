exports.normalResponse =(res, msg) =>{
   return res.json(msg)
}


exports.successResponse = (res, msg)=>{
   
    const data = {
         status: 200,
         message: msg
    }
    return res.status(200).json(data);
};

exports.loginSucssesResponseWithData = (res, msg, data, token)=>{
    
    const  resData = {
        status:200,
        message:msg,
        data:data,
        token:token
    }
    return res.status(200).json(resData);
}


exports.successResponseWithData = (res, msg, data) => {

    const  resData = {
        status:200,
        message:msg,
        data:data,
    }
    return res.status(200).json(resData);
}

exports.unauthorizedResponse = (res, message)=>{
    return res.status(401).json({message: message});
}


exports.errorResponse = (res, message)=>{
    return res.status(401).json({message: message});
}

