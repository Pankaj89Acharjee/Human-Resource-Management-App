const jwt = require('jsonwebtoken');
const { getAllUsers } = require('../schema/project.model');
require('dotenv').config();
const adminUsername = process.env.ADMINUSERNAME;
//const adminPassword = process.env.ADMINPASSWORD;
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
                return res.status(400).json({statuscode:2, message: "You must be logged in"})
            }
            if(!payload){
                return res.status(400).json({statuscode:2, message: "Token Expire login again"})
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
const fetchData = async () => {
    try {
        const savedData =  {
            email: adminUsername,
            name: 'ADMIN',
        }
        let adminDetails = {
            name        : savedData.name,
            email       : savedData.email,
            title       : savedData.ticket_title
        }
        //console.log(adminDetails)
        return adminDetails
    } catch (error) {
        console.log('Error in fetchData function', error);
        return null
    }
}