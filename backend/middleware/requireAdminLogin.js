const jwt = require('jsonwebtoken');
require('dotenv').config();

const Usermodel = require('../schema/user.model');
const JWT_KEYS = process.env.JWT_KEYS

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(400).json({statuscode:2, message: "No Token"})
    }
    const token = authorization.replace("Bearer ", "")
    try {
        jwt.verify(token, JWT_KEYS, (err, payload) => {
            if(err){
                return res.status(400).json({statuscode:2, message: "Invalid Token"})
            }
            if(!payload){
                return res.status(400).json({statuscode:2, message: "Token Expired, login again"})
            }
            fetchData(payload.email).then(
                function(dataa) {
                    if (req.admin === null) {return res.status(500).json({statuscode:2, message: "Internal Server Error"})}
                    req.admin = dataa
                    next()
                }
            );
        });
    } catch (error) {
        console.log('Error in Require admin login middleware', error)
        res.status(500).json({statuscode:2, message: "Internal Server Error"})
    }
}
const fetchData = async (id) => {
    try {
        const userData1 =  await Usermodel.getUser(id);
        var savedData = userData1[0]
        let adminDetails = {
            id          : savedData.id,
            name        : savedData.name,
            emptype     : savedData.emptype,
            email       : savedData.email,
            empid       : savedData.empid,
        }
        return adminDetails
    } catch (error) {
        console.log('Error in fetchData function', error);
        return null
    }
}

