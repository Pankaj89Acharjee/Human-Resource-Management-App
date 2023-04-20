const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');

const whetherAdmin = require('../middleware/whetherAdminLogin');
const requireAdminLogin = require('../middleware/requireAdminLogin');
const whetherPrejoineeLogin = require('../middleware/whetherPrejoineeLogin');

const AdminUserModel = require('../schema/adminUser.model');
const PrejoineeModel = require('../schema/prejoinee.model');

const otpVerificationEmail = require('../mailing/otpVerifyMail');
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


//Login 
router.post('/admin-login', async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ statuscode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    const userLogin = await AdminUserModel.getAdminUserLogin(email, hashedPassword)
    var userData = userLogin[0]
   
    if (userData?.emp_type === "ADMIN" || userData?.emp_type === "HR") {
        let otp = 121212;
        // let otp = Math.floor(Math.random() * 900000) + 100000;
        if (userData) {
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)
            let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');
            await AdminUserModel.updateAdminUserOtp(hashedOTP, timestamp, email)
            let info = {
                statuscode: 1,
                message: "OTP send successfully",
            }
            res.json(info);

            //Sending OTP to mail
            var originalName = email.split("@")[0];
            var receiverEmail = email;
            var emailSubject = "OTP For Login To HRMS Portal"
            var emailContent = { OTP: otp, UserEmail: email }
            await otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)

            //OTP valid for 5 min
            setTimeout(async () => {
                await AdminUserModel.deleteOTPFromDB(email)
            }, 300000)
        } else {
            return res.status(400).json({ statuscode: 0, message: "Invalid username or password" })
        }
    } else {
        return res.status(400).json({ statuscode: 0, message: "You are not ADMIN / HR" })
    }
})


router.post('/admin-verifyemailotp', async (req, res) => {
    let { email, password, otp } = req.body
    if (!email || !password || !otp) {
        return res.status(400).json({ statuscode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)

    const fetchUserData = await AdminUserModel.getAdminUserLogin(email, hashedPassword)
    let userData = fetchUserData[0]
    if (!userData) {
        return res.status(400).json({ statuscode: 0, message: "Invalid UserName or Password" })
    } else {
        if (userData.status !== "Active") {
            return res.json({ statuscode: 0, message: "This user is not active" })
        }
        let saltedOTP = SALTKEY.concat(otp)
        let hashedOTP = sha1(saltedOTP)        
        if (userData.otp === hashedOTP) {
            var emailid = userData.email
            var datetime = moment().format('DD MMM YYYY, hh:mm:ss A');
            const token = jwt.sign({ email: emailid }, JWT_KEYS)
            let info = {
                statuscode: 1,
                message: "Login successfull",
                token: token,
                data: {
                    name: userData.name,
                    email: userData.email,
                    emptype: userData.emp_type,
                }
            }
            console.log('Login successfull', userData.name, datetime)
            res.json(info)
        } else {
            return res.status(400).json({ statuscode: 0, message: "Otp Expired or Invalid Otp" })
        }
    }

})

// ------------- RESET PASSWORD--------------------------

router.post('/admin-sendotp', async (req, res) => {
    let { email } = req.body
    const fetchUserData = await AdminUserModel.getAdmin(email)
    var userData = fetchUserData[0]
    let otp = 111111;
    // let otp = Math.floor(Math.random() * 900000) + 100000;

    if (userData) {
        let saltedOTP = SALTKEY.concat(otp);
        let hashedOTP = sha1(saltedOTP);
        let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');

        await AdminUserModel.updateAdminUserOtp(hashedOTP, timestamp, email);
        let info = {
            statuscode: 1,
            message: "otp send successfully",
        }
        res.json(info)

        //****Sending OTP to mail***
        var originalName = email.split("@")[0];
        var receiverEmail = email;
        var emailSubject = "OTP For Login To HRMS Portal"
        var emailContent = { OTP: otp, UserEmail: email }
        await otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)

        //****OTP valid for 2 min***
        setTimeout(async () => {
            await AdminUserModel.deleteOTPFromDB(email)
        }, 120000)
    } else {
        return res.status(400).json({ statuscode: 0, message: "Invalid email address" })
    }
})


router.post('/admin-resetpassword', async (req, res) => {
    let { email, otp, password, confirmpassword } = req.body;

    if (email.length == "" || email.length == null || email.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Email Should not be blank" })
    } else if (password.length == "" || password.length == null || password.length == undefined || password.length < 8) {
        return res.status(400).json({ statuscode: 0, message: "Password Should be greater than 8 letters" })
    } else if (confirmpassword.length == "" || confirmpassword.length == null || confirmpassword.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "confirm Password Should not be blank" })
    } else if (otp.length == "" || otp.length == null || otp.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "otp Should not be blank" })
    }

    const fetchUserData = await AdminUserModel.getAdmin(email)
    var userData = fetchUserData[0]
    let saltedOTP = SALTKEY.concat(otp)
    let hashedOTP = sha1(saltedOTP)

    if (userData.otp === hashedOTP) {

        const filterPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){6,12}/

        if (!filterPassword.test(password)) {
            return res.status(400).json({ statuscode: 0, message: "missing character" })
        }

        let concatPassword = PSALTKEY.concat(password)
        let hashedPassword = sha1(concatPassword)

        if (password === confirmpassword) {
            const updatePassword = await AdminUserModel.updatePassword(email, hashedPassword)
            if (updatePassword.statuscode === 1) {
                console.log(updatePassword.message);
                let info = {
                    statuscode: 1,
                    message: updatePassword.message
                }
                res.json(info)
            }

        } else {
            return res.status(400).json({ statuscode: 0, message: "Password doesn't match" })
        }
    }
    else {
        return res.status(400).json({ statuscode: 0, message: "Invalid Otp or Otp Expired" })
    }

})


//-------------------------For Prejoinee Login-------------------------------

//PreJoinee-Login 
router.post('/prejoinee-login', async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ statuscode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    const userLogin = await AdminUserModel.getAdminUserLogin(email, hashedPassword)
    var userData = userLogin[0]
   
    if (userData?.emp_type === "EMP" || userData?.emp_type === "HR" || userData?.emp_type === "ACCOUNTS") {
        let otp = 121212;
        // let otp = Math.floor(Math.random() * 900000) + 100000;
        if (userData) {
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)
            let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');
            await AdminUserModel.updateAdminUserOtp(hashedOTP, timestamp, email)
            let info = {
                statuscode: 1,
                message: "OTP send successfully",
            }
            res.json(info);

            //Sending OTP to mail
            var originalName = email.split("@")[0];
            var receiverEmail = email;
            var emailSubject = "OTP For Login To HRMS Portal"
            var emailContent = { OTP: otp, UserEmail: email }
            await otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)

            //OTP valid for 5 min
            setTimeout(async () => {
                await AdminUserModel.deleteOTPFromDB(email)
            }, 300000)
        } else {
            return res.status(400).json({ statuscode: 0, message: "Invalid username or password" })
        }
    } else {
        return res.status(400).json({ statuscode: 0, message: "You are not authorized to login" })
    }
})

//PreJoinee verify otp
router.post('/prejoinee-verifyemailotp', async (req, res) => {
    let { email, password, otp } = req.body
    if (!email || !password || !otp) {
        return res.status(400).json({ statuscode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)

    const fetchUserData = await AdminUserModel.getAdminUserLogin(email, hashedPassword)
    let userData = fetchUserData[0]
    if (!userData) {
        return res.status(400).json({ statuscode: 0, message: "Invalid UserName or Password" })
    } else {
        if (userData.status !== "Active") {
            return res.json({ statuscode: 0, message: "This user is not active" })
        }
        let saltedOTP = SALTKEY.concat(otp)
        let hashedOTP = sha1(saltedOTP)        
        if (userData.otp === hashedOTP) {
            var emailid = userData.email
            var datetime = moment().format('DD MMM YYYY, hh:mm:ss A');
            const token = jwt.sign({ email: emailid }, JWT_KEYS)
            let info = {
                statuscode: 1,
                message: "Login successfull",
                token: token,
                data: {
                    name: userData.name,
                    email: userData.email,
                    emptype: userData.emp_type,
                }
            }
            console.log('Login successfull', userData.name, datetime)
            res.json(info)
        } else {
            return res.status(400).json({ statuscode: 0, message: "Otp Expired or Invalid Otp" })
        }
    }
})

// ------------- RESET PASSWORD--------------------------

router.post('/prejoinee-sendotp', async (req, res) => {
    let { email } = req.body
    const fetchUserData = await AdminUserModel.getAdmin(email)
    var userData = fetchUserData[0]
    let otp = 111111;
    // let otp = Math.floor(Math.random() * 900000) + 100000;

    if (userData) {
        let saltedOTP = SALTKEY.concat(otp);
        let hashedOTP = sha1(saltedOTP);
        let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');

        await AdminUserModel.updateAdminUserOtp(hashedOTP, timestamp, email);
        let info = {
            statuscode: 1,
            message: "otp send successfully",
        }
        res.json(info)

        //****Sending OTP to mail***
        var originalName = email.split("@")[0];
        var receiverEmail = email;
        var emailSubject = "OTP For Login To HRMS Portal"
        var emailContent = { OTP: otp, UserEmail: email }
        await otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)

        //****OTP valid for 2 min***
        setTimeout(async () => {
            await AdminUserModel.deleteOTPFromDB(email)
        }, 120000)
    } else {
        return res.status(400).json({ statuscode: 0, message: "Invalid email address" })
    }
})

//----Resetting Prejoinee password
router.post('/prejoinee-resetpassword', async (req, res) => {
    let { email, otp, password, confirmpassword } = req.body;

    if (email.length == "" || email.length == null || email.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Email Should not be blank" })
    } else if (password.length == "" || password.length == null || password.length == undefined || password.length < 8) {
        return res.status(400).json({ statuscode: 0, message: "Password Should be greater than 8 letters" })
    } else if (confirmpassword.length == "" || confirmpassword.length == null || confirmpassword.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "confirm Password Should not be blank" })
    } else if (otp.length == "" || otp.length == null || otp.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "otp Should not be blank" })
    }

    const fetchUserData = await AdminUserModel.getAdmin(email)
    var userData = fetchUserData[0]
    let saltedOTP = SALTKEY.concat(otp)
    let hashedOTP = sha1(saltedOTP)

    if (userData.otp === hashedOTP) {

        const filterPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){6,12}/

        if (!filterPassword.test(password)) {
            return res.status(400).json({ statuscode: 0, message: "missing character" })
        }

        let concatPassword = PSALTKEY.concat(password)
        let hashedPassword = sha1(concatPassword)

        if (password === confirmpassword) {
            const updatePassword = await AdminUserModel.updatePassword(email, hashedPassword)
            if (updatePassword.statuscode === 1) {
                console.log(updatePassword.message);
                let info = {
                    statuscode: 1,
                    message: updatePassword.message
                }
                res.json(info)
            }

        } else {
            return res.status(400).json({ statuscode: 0, message: "Password doesn't match" })
        }
    }
    else {
        return res.status(400).json({ statuscode: 0, message: "Invalid Otp or Otp Expired" })
    }

})










router.get('/', requireAdminLogin, whetherAdmin, whetherPrejoineeLogin, (req, res) => {
    res.json(req.user)
})

module.exports = router;