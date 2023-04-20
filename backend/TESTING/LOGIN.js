const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');
var cron = require('node-cron');
const requireAdminLogin = require('../middleware/requireAdminLogin');
const { getUserLogin, getUserOtp, updateUserOtp, getUsers, updateUserPassword, deleteUserOtp } = require('../schema/project.model');
const verifyEmail = require('../email/verifyThroughOtp');
require('dotenv').config();
router.use(express.json())
const cors = require("cors");
router.use(cors());
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';
const JWT_KEYS = process.env.JWT_KEYS
const SALTKEY = process.env.SALTKEY
const PSALTKEY = process.env.PSALTKEY
///////////////////////////For LOGIN///////////////////////////////////////////////////////
router.post('/login', async (req, res) => {
    let { email, password } = req.body
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    const userData1 = await getUserLogin(email, hashedPassword)
    var userData = userData1[0]
    let otp = Math.floor(Math.random() * 900000) + 100000;
    var tomail = email
    var subject = `Your OTP for Log In to Server Monitor Admin`
    var items = {
        otp: otp,
        useremail: email,
    }
    if (userData) {
        let saltedOTP = SALTKEY.concat(otp)
        let hashedOTP = sha1(saltedOTP)
        const userData1 = await updateUserOtp(email, hashedOTP)
        var userData = userData1[0]
        setTimeout(async () => {
            const userData2 = await deleteUserOtp(email, hashedOTP)
            var otpData = userData2[0]
                console.log("Otp expires in 2 minutes")
        },120000)
        // cron.schedule('*/2 * * * *', async () => {
        //     {
        //        const userData2 = await deleteUserOtp(email, hashedOTP)
        //        var otpData = userData2[0]
        //            console.log("cron running")
        //                 }
        //               });
        info = {
            statuscode: 1,
            message: "otp send successfully",
        }
        await verifyEmail(tomail, subject, subject, items)
        res.json(info)
    } else {
        return res.status(400).json({ statuscode: 0, message: "Invalid username or password" })
    }
})
router.post('/verifyemailotp', async (req, res) => {
    let { email, password, otp } = req.body
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    const userData1 = await getUserLogin(email, hashedPassword)
    let userData = userData1[0]
    if (!userData) {
        return res.status(400).json({ statuscode: 0, message: "Invalid UserName or Password" })
    } else {
        if (userData.status === 1) {
            return res.json({ statuscode: 0, message: "This user is not active" })
        }
                let saltedOTP = SALTKEY.concat(otp)
                let hashedOTP = sha1(saltedOTP)
        if (userData.otp === hashedOTP) {
            var emailid = userData.email
            var datetime = moment().format('DD MMM YYYY, hh:mm A');
            const token = jwt.sign({ email: emailid }, JWT_KEYS)
            info = {
                statuscode: 1,
                message: "login successfully",
                token: token,
            }
            console.log('Login successfully', userData.email, userData.name, datetime)
            res.json(info)
        } else {
            return res.status(400).json({ statuscode: 0, message: "Otp Expired or Invalid Otp" })
        }
    }
})
////////////////////For Password RESET///////////////////////////////////////////////
router.post('/sendotp', async (req, res) => {
    let { email } = req.body
    const userData1 = await getUsers(email)
    var userData = userData1[0]
    let otp = Math.floor(Math.random() * 900000) + 100000;
    var tomail = email
    var subject = `Your otp for Password Reset for Server Monitoring Admin`
    var items = {
        otp: otp,
        useremail: email,
    }
    if (userData) {
        let saltedOTP = SALTKEY.concat(otp)
        let hashedOTP = sha1(saltedOTP)
        const updateData1 = await updateUserOtp(email, hashedOTP)
        var updateData = updateData1[0]
        setTimeout(async ()=>{
            const deleteData2 = await deleteUserOtp(email, hashedOTP)
            var deleteData = deleteData2[0]
                console.log("Otp Expired after 2 minutes")
        },120000)
        // cron.schedule('*/2 * * * *', async () => {
        //      {
        //         const userData2 = await deleteUserOtp(email, hashedOTP)
        //         var otpData = userData2[0]
        //             console.log("cron running")
        //                  }
        //                });
        info = {
            statuscode: 1,
            message: "otp send successfully",
        }
        await verifyEmail(tomail, subject, subject, items)
        res.json(info)
    } else {
        return res.status(400).json({ statuscode: 0, message: "Invalid email address" })
    }
})
router.post('/resetpassword', async (req, res) => {
    let { email, otp, password, confirmpassword } = req.body
    if(email.length == ""|| email.length == null || email.length == undefined){
        return res.status(400).json({ statuscode: 0, message: "Email Should not be blank" })
    } else if(password.length == ""|| password.length == null || password.length == undefined || password.length < 8){
        return res.status(400).json({ statuscode: 0, message: "Password Should be greater than 8 letters" })
    }else if(confirmpassword.length == ""|| confirmpassword.length == null || confirmpassword.length == undefined){
        return res.status(400).json({ statuscode: 0, message: "confirm Password Should not be blank" })
    }else if(otp.length == ""|| otp.length == null || otp.length == undefined){
        return res.status(400).json({ statuscode: 0, message: "otp Should not be blank" })
    }
    const userData1 = await getUsers(email)
    var userData = userData1[0]
    let saltedOTP = SALTKEY.concat(otp)
    let hashedOTP = sha1(saltedOTP)
    if (userData.otp === hashedOTP) {
        const pwdFilter = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){6,12}/
        if (!pwdFilter.test(password)) {
            return res.status(400).json({ statuscode: 0, message: "missing character" })
        }
        let concatPassword = PSALTKEY.concat(password)
        let hashedPassword = sha1(concatPassword)
        if (password === confirmpassword) {
            await updateUserPassword(email, hashedPassword)
            let info = {
                statuscode: 1,
                message: "password reset successfully",
            }
            res.json(info)
        } else {
            return res.status(400).json({ statuscode: 0, message: "Password doesn't match" })
        }
    }
    else {
        return res.status(400).json({ statuscode: 0, message: "Invalid Otp or Otp Expired" })
        }
})
router.get('/', requireAdminLogin, (req, res) => {
    res.json(req.user)
})
module.exports = router;