const jwt = require('jsonwebtoken');
require('dotenv').config();

const AdminModel = require('../schema/adminUser.model');
const JWT_KEYS = process.env.JWT_KEYS

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(400).json({ statuscode: 2, message: "No Token" })
    }
    const token = authorization.replace("Bearer ", "")
    try {
        jwt.verify(token, JWT_KEYS, (err, payload) => {
            if (err) {
                return res.status(400).json({ statuscode: 2, message: "Invalid Token" })
            }
            if (!payload) {
                return res.status(400).json({ statuscode: 2, message: "Token Expired, login again" })
            }
            fetchAdminData(payload.email)
                .then(function (dataa) {
                    if (req.admin === null) { return res.status(500).json({ statuscode: 2, message: "Internal Server Error" }) }
                    req.admin = dataa
                    next()
                }
                );
        });
    } catch (error) {
        console.log('Error in Admin Middleware', error)
        res.status(500).json({ statuscode: 2, message: "Internal Server Error" })
    }
}
const fetchAdminData = async (id) => {
    try {
        const userDetails = await AdminModel.getAdmin(id);
        var savedData = userDetails[0]        
        return savedData
    } catch (error) {
        console.log('Error in fetchData function', error);
        return null
    }
}

