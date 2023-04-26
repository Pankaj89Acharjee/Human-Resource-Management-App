const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');

const whetherAdmin = require('../middleware/whetherAdminLogin');
const requireAdminLogin = require('../middleware/requireAdminLogin');
const whetherPrejoineeLogin = require('../middleware/whetherPrejoineeLogin');
const whetherEmployee = require('../middleware/whetherEmployeeLogin');


const EmployeeModel = require('../schema/employee.model');
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
        return res.status(400).json({ statusCode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    try {
        const userLogin = await EmployeeModel.getAdminUserLogin(email, hashedPassword)
        if (userLogin.length === 0 || !userLogin || userLogin === undefined) {
            return res.status(404).json({ statusCode: 0, message: "Email or password invalid" })
        } else {
            var userData = userLogin[0]
            if (userData?.emp_type === "ADMIN" || userData?.emp_type === "HR") {
                let otp = 121212;
                // let otp = Math.floor(Math.random() * 900000) + 100000;                
                let saltedOTP = SALTKEY.concat(otp)
                let hashedOTP = sha1(saltedOTP)
                let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');
                const otpUpdate = await EmployeeModel.updateAdminUserOtp(hashedOTP, timestamp, email)
                if (otpUpdate.affectedRows) {
                    //Sending OTP to mail
                    var originalName = email.split("@")[0];
                    var receiverEmail = email;
                    var emailSubject = "OTP For Login To HRMS Portal"
                    var emailContent = { OTP: otp, UserEmail: email }
                    otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)

                    //OTP valid for 5 min
                    setTimeout(async () => {
                        await EmployeeModel.deleteOTPFromDB(email)
                    }, 300000)
                    let info = {
                        statusCode: 1,
                        message: "OTP send successfully",
                    }
                    res.json(info);
                } else {
                    return res.status(500).json({ statusCode: 0, message: "Error in updating db with otp" });
                }
            } else {
                return res.status(400).json({ statusCode: 0, message: "You are not ADMIN / HR" })
            }
        }

    } catch (error) {
        console.log("Error in logging into portal", error);
        return res.status(500).json({ statusCode: 0, message: "Error in logging into portal", error: error.message });
    }
})


router.post('/admin-verifyemailotp', async (req, res) => {
    let { email, password, otp } = req.body
    if (!email || !password || !otp) {
        return res.status(400).json({ statusCode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    try {
        const fetchUserData = await EmployeeModel.getAdminUserLogin(email, hashedPassword)
        let userData = fetchUserData[0]
        if (!userData || userData === undefined) {
            return res.status(403).json({ statusCode: 0, message: "Invalid UserName or Password" })
        } else if (userData.status === 0) {
            return res.status(403).json({ statusCode: 0, message: "This user is not active" })
        } else {
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)
            if (userData.otp === hashedOTP) {
                var emailid = userData.email
                var datetime = moment().format('DD MMM YYYY, hh:mm:ss A');
                const token = jwt.sign({ email: emailid }, JWT_KEYS)
                let info = {
                    statusCode: 1,
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
                return res.status(400).json({ statusCode: 0, message: "Otp Expired or Invalid Otp" })
            }
        }
    } catch (error) {
        console.log("Error in otp verification", error);
        return res.status(500).json({ statusCode: 0, message: "Error in otp verification", error: error.message });
    }
})

// ------------- RESET PASSWORD--------------------------

router.post('/admin-sendotp', async (req, res) => {
    let { email } = req.body
    try {
        const fetchUserData = await EmployeeModel.getAdmin(email)
        if (fetchUserData.length === 0 || !fetchUserData || fetchUserData === undefined) {
            return res.status(404).json({ statusCode: 0, message: "No user found with such email id" })
        } else {
            let otp = 111111;
            // let otp = Math.floor(Math.random() * 900000) + 100000;
            let saltedOTP = SALTKEY.concat(otp);
            let hashedOTP = sha1(saltedOTP);
            let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');

            //****Sending OTP to mail***
            var originalName = email.split("@")[0];
            var receiverEmail = email;
            var emailSubject = "OTP For Login To HRMS Portal"
            var emailContent = { OTP: otp, UserEmail: email }
            otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)
            //****OTP valid for 5 min***


            const updateOtp = await EmployeeModel.updateAdminUserOtp(hashedOTP, timestamp, email);
            if (updateOtp.affectedRows) {
                let info = {
                    statusCode: 1,
                    message: "otp send successfully",
                }
                setTimeout(async () => {
                    await EmployeeModel.deleteOTPFromDB(email)
                }, 300000);
                res.status(200).json(info)
            } else {
                return res.status(500).json({ statusCode: 0, message: "Error in updating db with otp" })
            }
        }

    } catch (error) {
        console.log("Error in sending otp", error);
        return res.status(500).json({ statusCode: 0, message: "Error in sending otp", error: error.message });
    }
})


router.post('/admin-resetpassword', async (req, res) => {
    let { email, otp, password, confirmpassword } = req.body;
    if (email.length == "" || email.length == null || email.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "Email Should not be blank" })
    } else if (password.length == "" || password.length == null || password.length == undefined || password.length < 8) {
        return res.status(400).json({ statusCode: 0, message: "Password Should be greater than 8 letters" })
    } else if (confirmpassword.length == "" || confirmpassword.length == null || confirmpassword.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "confirm Password Should not be blank" })
    } else if (otp.length == "" || otp.length == null || otp.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "otp Should not be blank" })
    }
    try {
        const fetchUserData = await EmployeeModel.getAdmin(email)
        if (fetchUserData.length === 0 || !fetchUserData || fetchUserData === undefined) {
            return res.status(404).json({ statusCode: 0, message: "No user found with such email id or password" })
        } else {
            var userData = fetchUserData[0]
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)

            if (userData.otp === hashedOTP) {

                const filterPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){6,12}/

                if (!filterPassword.test(password)) {
                    return res.status(400).json({ statusCode: 0, message: "Password should contain alphanumeric with special charecters" })
                }

                let concatPassword = PSALTKEY.concat(password)
                let hashedPassword = sha1(concatPassword)

                if (password === confirmpassword) {
                    const updatePassword = await EmployeeModel.updatePassword(email, hashedPassword)
                    if (updatePassword.affectedRows) {
                        let info = {
                            statusCode: 1,
                            message: "Resetting password was successfull, pls login again"
                        }
                        res.json(info)
                    } else {
                        console.log("Password is unable to update in database")
                        return res.status(500).json({ statusCode: 0, message: "Password is unable to update in database" })
                    }
                } else {
                    return res.status(400).json({ statusCode: 0, message: "Password doesn't match" })
                }
            }
            else {
                return res.status(400).json({ statusCode: 0, message: "Invalid Otp or Otp Expired" })
            }
        }
    } catch (error) {
        console.log("Error in resetting password", error);
        return res.status(500).json({ statusCode: 0, message: "Error in resetting password", error: error.message });
    }
})


//-------------------------For Prejoinee Login-------------------------------

//PreJoinee-Login 
router.post('/prejoinee-login', async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ statusCode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    try {
        const userLogin = await EmployeeModel.getAdminUserLogin(email, hashedPassword)
        if (userLogin.length === 0 || !userLogin || userLogin === undefined) {
            return res.status(404).json({ statusCode: 0, message: "Email or password invalid" })
        } else {
            var userData = userLogin[0]
            if (userData?.emp_type === "ACCOUNTS" || userData?.emp_type === "EMP" || userData?.emp_type === "HR") {
                let otp = 121212;
                // let otp = Math.floor(Math.random() * 900000) + 100000;                
                let saltedOTP = SALTKEY.concat(otp)
                let hashedOTP = sha1(saltedOTP)
                let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');
                const otpUpdate = await EmployeeModel.updateAdminUserOtp(hashedOTP, timestamp, email)
                if (otpUpdate.affectedRows) {
                    //Sending OTP to mail
                    var originalName = email.split("@")[0];
                    var receiverEmail = email;
                    var emailSubject = "OTP For Login To HRMS Portal"
                    var emailContent = { OTP: otp, UserEmail: email }
                    otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)

                    //OTP valid for 5 min
                    setTimeout(async () => {
                        await EmployeeModel.deleteOTPFromDB(email)
                    }, 300000)
                    let info = {
                        statusCode: 1,
                        message: "OTP send successfully",
                    }
                    res.json(info);
                } else {
                    return res.status(500).json({ statusCode: 0, message: "Error in updating db with otp" });
                }
            } else {
                return res.status(400).json({ statusCode: 0, message: "You are not ADMIN / HR" })
            }
        }

    } catch (error) {
        console.log("Error in logging into portal", error);
        return res.status(500).json({ statusCode: 0, message: "Error in logging into portal", error: error.message });
    }
})

//PreJoinee verify otp
router.post('/prejoinee-verifyemailotp', async (req, res) => {
    let { email, password, otp } = req.body
    if (!email || !password || !otp) {
        return res.status(400).json({ statusCode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    try {
        const fetchUserData = await EmployeeModel.getAdminUserLogin(email, hashedPassword)
        let userData = fetchUserData[0]
        if (!userData || userData === undefined) {
            return res.status(403).json({ statusCode: 0, message: "Invalid UserName or Password" })
        } else if (userData.status === 0) {
            return res.status(403).json({ statusCode: 0, message: "This user is not active" })
        } else {
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)
            if (userData.otp === hashedOTP) {
                var emailid = userData.email
                var datetime = moment().format('DD MMM YYYY, hh:mm:ss A');
                const token = jwt.sign({ email: emailid }, JWT_KEYS)
                let info = {
                    statusCode: 1,
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
                return res.status(400).json({ statusCode: 0, message: "Otp Expired or Invalid Otp" })
            }
        }
    } catch (error) {
        console.log("Error in otp verification", error);
        return res.status(500).json({ statusCode: 0, message: "Error in otp verification", error: error.message });
    }
})

// ------------- RESET PASSWORD--------------------------

router.post('/prejoinee-sendotp', async (req, res) => {
    let { email } = req.body
    try {
        const fetchUserData = await EmployeeModel.getAdmin(email)
        if (fetchUserData.length === 0 || !fetchUserData || fetchUserData === undefined) {
            return res.status(404).json({ statusCode: 0, message: "No user found with such email id" })
        } else {
            let otp = 111111;
            // let otp = Math.floor(Math.random() * 900000) + 100000;
            let saltedOTP = SALTKEY.concat(otp);
            let hashedOTP = sha1(saltedOTP);
            let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');

            //****Sending OTP to mail***
            var originalName = email.split("@")[0];
            var receiverEmail = email;
            var emailSubject = "OTP For Login To HRMS Portal"
            var emailContent = { OTP: otp, UserEmail: email }
            otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)
            //****OTP valid for 5 min***


            const updateOtp = await EmployeeModel.updateAdminUserOtp(hashedOTP, timestamp, email);
            if (updateOtp.affectedRows) {
                let info = {
                    statusCode: 1,
                    message: "otp send successfully",
                }
                setTimeout(async () => {
                    await EmployeeModel.deleteOTPFromDB(email)
                }, 300000);
                res.status(200).json(info)
            } else {
                return res.status(500).json({ statusCode: 0, message: "Error in updating db with otp" })
            }
        }

    } catch (error) {
        console.log("Error in sending otp", error);
        return res.status(500).json({ statusCode: 0, message: "Error in sending otp", error: error.message });
    }
})


//----Resetting Prejoinee password
router.post('/prejoinee-resetpassword', async (req, res) => {
    let { email, otp, password, confirmpassword } = req.body;
    if (email.length == "" || email.length == null || email.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "Email Should not be blank" })
    } else if (password.length == "" || password.length == null || password.length == undefined || password.length < 8) {
        return res.status(400).json({ statusCode: 0, message: "Password Should be greater than 8 letters" })
    } else if (confirmpassword.length == "" || confirmpassword.length == null || confirmpassword.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "confirm Password Should not be blank" })
    } else if (otp.length == "" || otp.length == null || otp.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "otp Should not be blank" })
    }
    try {
        const fetchUserData = await EmployeeModel.getAdmin(email)
        if (fetchUserData.length === 0 || !fetchUserData || fetchUserData === undefined) {
            return res.status(404).json({ statusCode: 0, message: "No user found with such email id or password" })
        } else {
            var userData = fetchUserData[0]
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)

            if (userData.otp === hashedOTP) {

                const filterPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){6,12}/

                if (!filterPassword.test(password)) {
                    return res.status(400).json({ statusCode: 0, message: "Password should contain alphanumeric with special charecters" })
                }

                let concatPassword = PSALTKEY.concat(password)
                let hashedPassword = sha1(concatPassword)

                if (password === confirmpassword) {
                    const updatePassword = await EmployeeModel.updatePassword(email, hashedPassword)
                    if (updatePassword.affectedRows) {
                        let info = {
                            statusCode: 1,
                            message: "Resetting password was successfull, pls login again"
                        }
                        res.json(info)
                    } else {
                        console.log("Password is unable to update in database")
                        return res.status(500).json({ statusCode: 0, message: "Password is unable to update in database" })
                    }
                } else {
                    return res.status(400).json({ statusCode: 0, message: "Password doesn't match" })
                }
            }
            else {
                return res.status(400).json({ statusCode: 0, message: "Invalid Otp or Otp Expired" })
            }
        }
    } catch (error) {
        console.log("Error in resetting password", error);
        return res.status(500).json({ statusCode: 0, message: "Error in resetting password", error: error.message });
    }
})


//---------------------EMPLOYEE LOGIN--------------------------------------------
//-------------------------------------------------------------------------------
//******************************************************************************/

router.post('/employee-login', async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ statusCode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    try {
        const userLogin = await EmployeeModel.getAdminUserLogin(email, hashedPassword)
        if (userLogin.length === 0 || !userLogin || userLogin === undefined) {
            return res.status(404).json({ statusCode: 0, message: "Email or password invalid" })
        } else {
            var userData = userLogin[0]
            if (userData?.emp_type === "EMP") {
                let otp = 121212;
                // let otp = Math.floor(Math.random() * 900000) + 100000;                
                let saltedOTP = SALTKEY.concat(otp)
                let hashedOTP = sha1(saltedOTP)
                let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');
                const otpUpdate = await EmployeeModel.updateAdminUserOtp(hashedOTP, timestamp, email)
                if (otpUpdate.affectedRows) {
                    //Sending OTP to mail
                    var originalName = email.split("@")[0];
                    var receiverEmail = email;
                    var emailSubject = "OTP For Login To HRMS Portal"
                    var emailContent = { OTP: otp, UserEmail: email }
                    otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)

                    //OTP valid for 5 min
                    setTimeout(async () => {
                        await EmployeeModel.deleteOTPFromDB(email)
                    }, 300000)
                    let info = {
                        statusCode: 1,
                        message: "OTP send successfully",
                    }
                    res.json(info);
                } else {
                    return res.status(500).json({ statusCode: 0, message: "Error in updating db with otp" });
                }
            } else {
                return res.status(400).json({ statusCode: 0, message: "You are not authorized to login" })
            }
        }
    } catch (error) {
        console.log("Error in logging into portal", error);
        return res.status(500).json({ statusCode: 0, message: "Error in logging into portal", error: error.message });
    }
})


router.post('/employee-verifyemailotp', async (req, res) => {
    let { email, password, otp } = req.body
    if (!email || !password || !otp) {
        return res.status(400).json({ statusCode: 0, message: "Please provide all details" })
    }
    let concatPassword = PSALTKEY.concat(password)
    let hashedPassword = sha1(concatPassword)
    try {
        const fetchUserData = await EmployeeModel.getAdminUserLogin(email, hashedPassword)
        let userData = fetchUserData[0]
        if (!userData || userData === undefined) {
            return res.status(403).json({ statusCode: 0, message: "Invalid UserName or Password" })
        } else if (userData.status === 0) {
            return res.status(403).json({ statusCode: 0, message: "This user is not active" })
        } else {
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)
            if (userData.otp === hashedOTP) {
                var emailid = userData.email
                var datetime = moment().format('DD MMM YYYY, hh:mm:ss A');
                const token = jwt.sign({ email: emailid }, JWT_KEYS)
                let info = {
                    statusCode: 1,
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
                return res.status(400).json({ statusCode: 0, message: "Otp Expired or Invalid Otp" })
            }
        }
    } catch (error) {
        console.log("Error in otp verification", error);
        return res.status(500).json({ statusCode: 0, message: "Error in otp verification", error: error.message });
    }
})

// ------------- RESET PASSWORD--------------------------

router.post('/employee-sendotp', async (req, res) => {
    let { email } = req.body
    try {
        const fetchUserData = await EmployeeModel.getAdmin(email)
        if (fetchUserData.length === 0 || !fetchUserData || fetchUserData === undefined) {
            return res.status(404).json({ statusCode: 0, message: "No user found with such email id" })
        } else if (fetchUserData[0]?.emp_type === 'ADMIN' || fetchUserData[0]?.emp_type === 'HR' || fetchUserData[0]?.emp_type === 'ACCOUNTS') {
            return res.status(404).json({ statusCode: 0, message: "Please enter correct credentials" })
        } else {
            let otp = 111111;
            // let otp = Math.floor(Math.random() * 900000) + 100000;
            let saltedOTP = SALTKEY.concat(otp);
            let hashedOTP = sha1(saltedOTP);
            let timestamp = moment().format('DD MMM YYYY, hh:mm:ss A');

            //****Sending OTP to mail***
            var originalName = email.split("@")[0];
            var receiverEmail = email;
            var emailSubject = "OTP for logging into HRMS portal"
            var emailContent = { OTP: otp, UserEmail: email }
            otpVerificationEmail(receiverEmail, emailSubject, emailContent, originalName)
            //****OTP valid for 5 min***


            const updateOtp = await EmployeeModel.updateAdminUserOtp(hashedOTP, timestamp, email);
            if (updateOtp.affectedRows) {
                let info = {
                    statusCode: 1,
                    message: "otp send successfully",
                }
                setTimeout(async () => {
                    await EmployeeModel.deleteOTPFromDB(email)
                }, 300000);
                res.status(200).json(info)
            } else {
                return res.status(500).json({ statusCode: 0, message: "Error in updating db with otp" })
            }
        }

    } catch (error) {
        console.log("Error in sending otp", error);
        return res.status(500).json({ statusCode: 0, message: "Error in sending otp", error: error.message });
    }
})


router.post('/employee-resetpassword', async (req, res) => {
    let { email, otp, password, confirmpassword } = req.body;
    if (email.length == "" || email.length == null || email.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "Email Should not be blank" })
    } else if (password.length == "" || password.length == null || password.length == undefined || password.length < 8) {
        return res.status(400).json({ statusCode: 0, message: "Password Should be greater than 8 letters" })
    } else if (confirmpassword.length == "" || confirmpassword.length == null || confirmpassword.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "confirm Password Should not be blank" })
    } else if (otp.length == "" || otp.length == null || otp.length == undefined) {
        return res.status(400).json({ statusCode: 0, message: "otp Should not be blank" })
    }
    try {
        const fetchUserData = await EmployeeModel.getAdmin(email)
        if (fetchUserData.length === 0 || !fetchUserData || fetchUserData === undefined) {
            return res.status(404).json({ statusCode: 0, message: "No user found with such email id or password" })
        } else {
            var userData = fetchUserData[0]
            let saltedOTP = SALTKEY.concat(otp)
            let hashedOTP = sha1(saltedOTP)

            if (userData.otp === hashedOTP) {

                const filterPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){6,12}/

                if (!filterPassword.test(password)) {
                    return res.status(400).json({ statusCode: 0, message: "Password should contain alphanumeric with special charecters" })
                }

                let concatPassword = PSALTKEY.concat(password)
                let hashedPassword = sha1(concatPassword)

                if (password === confirmpassword) {
                    const updatePassword = await EmployeeModel.updatePassword(email, hashedPassword)
                    if (updatePassword.affectedRows) {
                        let info = {
                            statusCode: 1,
                            message: "Resetting password was successfull, pls login again"
                        }
                        res.json(info)
                    } else {
                        console.log("Password is unable to update in database")
                        return res.status(500).json({ statusCode: 0, message: "Password is unable to update in database" })
                    }
                } else {
                    return res.status(400).json({ statusCode: 0, message: "Password doesn't match" })
                }
            }
            else {
                return res.status(400).json({ statusCode: 0, message: "Invalid Otp or Otp Expired" })
            }
        }
    } catch (error) {
        console.log("Error in resetting password", error);
        return res.status(500).json({ statusCode: 0, message: "Error in resetting password", error: error.message });
    }
})



router.get('/', requireAdminLogin, whetherEmployee, whetherAdmin, whetherPrejoineeLogin, (req, res) => {
    res.json(req.user)
})

module.exports = router;