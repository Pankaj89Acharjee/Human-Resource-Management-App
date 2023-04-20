const express = require('express');
//const fetch = require('node-fetch');
const moment = require('moment-timezone');
const sha1 = require('sha1');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();
router.use(express.json())
const cors = require("cors");
router.use(cors());
router.use(express.static('uploads/')); //Making static for image usage

const whetherPrejoineeLogin = require('../middleware/whetherPrejoineeLogin');
const PrejoineeModel = require('../schema/prejoinee.model');

require('dotenv').config();
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

const JWT_KEYS = process.env.JWT_KEYS
const SALTKEY = process.env.SALTKEY
const PSALTKEY = process.env.PSALTKEY

//---Storge defining for using multer
const documentStorage = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, "./uploads/prejoinee")
    },
    filename: async (req, file, callback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            let finalFileName = `${file.fieldname}_${req.prejoinee.id}_${Date.now()}.${file.mimetype.split("/")[1]}`
            callback(null, finalFileName)
        } else {
            callback(null, "wrongType")
        }
    },
});


const upload = multer({
    storage: documentStorage,
    //limits: { fileSize: 20000000 }, //20MB        
})


//For Viewing Prejoiner's Own Profile (Join Employee + Employee Profile Info + Bank Info)
router.get('/prejoineeprofileview', whetherPrejoineeLogin, async (req, res) => {
    let email = req.prejoinee.email;
    console.log("Prejoinee email is", email);
    const fetchPrejoineeData = await PrejoineeModel.getPreJoineeProfile(email);
    if (fetchPrejoineeData.statusCode === 0) {
        console.log("Error in fetching Prejoiner profile details")
        return res.status(500).json({ statusCode: 0, message: fetchPrejoineeData.message, error: fetchPrejoineeData.error })
    } else if (fetchPrejoineeData.length === 0) {
        return res.status(404).json({ statusCode: 0, message: "Data not found" })
    } else {
        var userData = fetchPrejoineeData[0]
        console.log("user data", userData);
        var output = {
            profile: {
                id: userData.id,
                employeeid: userData.employeeid,
                name: userData.name,
                email: userData.email,
                mobile: userData.mobile,
                department_id: userData.department_id,
                designation: userData.designation,
                grade_id: userData.grade_id,
                status: userData.status,
                doj: userData.doj,
                date: userData.data,
                time: userData.time,
                emp_type: userData.emp_type,
                id_issued: userData.id_issued,
                id_issued_date: userData.id_issued_date,
            },

            personal: {
                id: userData.id,
                emp_id: userData.emp_id,
                father_name: userData.father_name,
                mother_name: userData.mother_name,
                gender: userData.gender,
                dob: userData.dob,
                alt_mobile_no: userData.alt_mobile_no,
                religion: userData.religion,
                spouse_name: userData.spouse_name,
                blood_group: userData.blood_group,
                pf_no: userData.pf_no,
                esi_no: userData.esi_no,
                current_city: userData.current_city,
                current_address: userData.current_address,
                current_district: userData.current_district,
                current_pincode: userData.current_pincode,
                current_state: userData.current_state,
                current_country: userData.current_country,
                permanent_address: userData.permanent_address,
                permanent_city: userData.permanent_city,
                permanent_address: userData.permanent_address,
                permanent_district: userData.permanent_district,
                permanent_pincode: userData.permanent_pincode,
                permanent_state: userData.permanent_state,
                permanent_country: userData.permanent_country,
                aadhar_no: userData.aadhar_no,
                pan_no: userData.pan_no,
            },

            document: {
                aadhar_back_doc: userData.aadhar_back_doc,
                aadhar_front_doc: userData.aadhar_front_doc,
                pan_doc: userData.pan_doc,
                voter_doc: userData.voter_doc,
                resume_doc: userData.resume_doc,
                board_doc: userData.board_doc,
                intermediate_doc: userData.intermediate_doc,
                degree_doc: userData.degree_doc,
                pg_degree_doc: userData.pg_degree_doc,
                certificate_doc: userData.certificate_doc,
                passport_photo: userData.passport_photo,
                profile_img: userData.profile_img,
            },

            bankinfo: {
                id: userData.id,
                emp_id: userData.emp_id,
                account_number: userData.account_number,
                ifsc_code: userData.ifsc_code,
                address: userData.address
            },
        };
        res.json({ statusCode: 1, message: "Profile found", data: output })
    };
});



//For Filling up prejoining_emp_profile_info by Prejoinee
router.post('/uploadAadhaarBack', whetherPrejoineeLogin, upload.single("aadhaarback"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadAahdaarBack(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Adhaar backside updated in database")
                    res.status(200).json({ statusCode: 1, message: "Adhaar backside updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading aadhaar back in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading aadhaar back in db" });
    }
})

//For uploading  aadhaar front
router.post('/uploadAadhaarFront', whetherPrejoineeLogin, upload.single("aadhaarfront"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadAahdaarfront(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Adhaar frontside updated in database")
                    res.status(200).json({ statusCode: 1, message: "Adhaar frontside updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading aadhaar front in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading aadhaar front in db" });
    }
})



//For uploading  pan card
router.post('/uploadpan', whetherPrejoineeLogin, upload.single("pancard"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadPanCard(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("PAN card updated in database")
                    res.status(200).json({ statusCode: 1, message: "PAN card updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading PAN card in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading PAN card in db" });
    }
})



//For uploading  voter card
router.post('/uploadvotercard', whetherPrejoineeLogin, upload.single("votercard"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadVoterCard(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Voter card updated in database")
                    res.status(200).json({ statusCode: 1, message: "Voter card updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Voter card in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Voter card in db" });
    }
})




//For uploading  resume
router.post('/uploadresume', whetherPrejoineeLogin, upload.single("resume"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadResume(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Resume updated in database")
                    res.status(200).json({ statusCode: 1, message: "Resume updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Resume in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Resume in db" });
    }
})



//For uploading  release letter
router.post('/uploadreleaseletter', whetherPrejoineeLogin, upload.single("releaseletter"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadReleaseLetter(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Release letter updated in database")
                    res.status(200).json({ statusCode: 1, message: "Release letter updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Release letter in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Release letter in db" });
    }
})




//For uploading  aadhaar front
router.post('/uploadbankdoc', whetherPrejoineeLogin, upload.single("bank"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadBankStatement(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Bank statement updated in database")
                    res.status(200).json({ statusCode: 1, message: "Bank statement updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Bank statement in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Bank statement in db" });
    }
})




router.post('/uploadintermediate', whetherPrejoineeLogin, upload.single("intermediate"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadIntermediateDoc(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Intermediate document updated in database")
                    res.status(200).json({ statusCode: 1, message: "Intermediate document updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Intermediate document in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Intermediate document in db" });
    }
})




router.post('/uploadboarddoc', whetherPrejoineeLogin, upload.single("boarddoc"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadBoardDoc(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Board document updated in database")
                    res.status(200).json({ statusCode: 1, message: "Board document updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Board document in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Board document in db" });
    }
})





router.post('/uploaddegree', whetherPrejoineeLogin, upload.single("degree"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadDegreeDoc(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Degree document updated in database")
                    res.status(200).json({ statusCode: 1, message: "Degree document updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Degree document in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Degree document in db" });
    }
})


router.post('/uploadpgdegree', whetherPrejoineeLogin, upload.single("pgdegree"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadPGDegreeDoc(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("PGDegree document updated in database")
                    res.status(200).json({ statusCode: 1, message: "PGDegree document updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading PGDegree document in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading PGDegree document in db" });
    }
})


//For uploading  aadhaar front
router.post('/uploadcertificate', whetherPrejoineeLogin, upload.single("certificate"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadCertificateDoc(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Certificate updated in database")
                    res.status(200).json({ statusCode: 1, message: "Certificate updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Certificate in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Certificate in db" });
    }
})


//For uploading  aadhaar front
router.post('/uploadpayslip', whetherPrejoineeLogin, upload.single("payslip"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadPayslip(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Payslip updated in database")
                    res.status(200).json({ statusCode: 1, message: "Payslip updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Payslip in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Payslip in db" });
    }
})




//For uploading  passport photo
router.post('/uploadphoto', whetherPrejoineeLogin, upload.single("passport"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadPassportPhoto(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Passport photo updated in database")
                    res.status(200).json({ statusCode: 1, message: "Passport photo updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Passport photo in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Passport photo in db" });
    }
})



router.post('/uploadpayslip3', whetherPrejoineeLogin, upload.single("payslip3"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'File size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadPayslip3(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Payslip updated in database")
                    res.status(200).json({ statusCode: 1, message: "Payslip updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Payslip in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Payslip in db" });
    }
})




router.post('/uploadpayslip2', whetherPrejoineeLogin, upload.single("payslip2"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { email } = req.prejoinee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statuscode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statuscode: 0, message: 'File size is too large, allowed 20MB' });
        }
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(email)
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const uploadInDB = await PrejoineeModel.uploadPayslip2(selectedFile, prejoineeId);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    console.log("Payslip updated in database")
                    res.status(200).json({ statusCode: 1, message: "Payslip updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Prejoinee data not found")
            return res.status(404).json({ statusCode: 0, message: "Prejoinee data not found" })
        }
    } catch (error) {
        console.log("Error in uploading Payslip in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Payslip in db" });
    }
})


router.post('/insertbasicdetails', whetherPrejoineeLogin, async (req, res) => {
    var { ref_name1, designation1, company1, phone1, email1, ref_name2, designation2, company2, phone2, email2 } = req.body
    const preJoineeMail = req.prejoinee.email;
    try {
        const checkPrejoinee = await PrejoineeModel.getPreJoineeData(preJoineeMail);
        if (checkPrejoinee.length !== 0) {
            var prejoineeId = checkPrejoinee[0].prejoining_emp_id;
            const insertData = await PrejoineeModel.insertPreJoineeData(prejoineeId, ref_name1, designation1, company1, phone1, email1, ref_name2, designation2, company2, phone2, email2);
            if (insertData.statusCode === 2) {
                console.log("Prejoinee already exist")
                return res.status(404).json({ statusCode: 0, message: insertData.message })
            } else if (insertData.statusCode === 0) {
                console.log("Error in inserting")
                return res.status(404).json({ statusCode: 0, message: insertData.message })
            } else {
                if (insertData.insertId) {
                    console.log("Inserted!")
                    return res.status(200).json({ statusCode: 1, message: "Inserted!" })
                } else {
                    console.log("Insertion error!")
                    return res.status(500).json({ statusCode: 0, message: "Insertion error!" })
                }
            }
        } else {
            console.log("Prejoinee Not Found")
            return res.status(404).json({ statusCode: 0, message: "Data not found" })
        }
    } catch (error) {
        console.log("Error in inserting basic details in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in inserting basic details in db" });
    }

})

module.exports = router