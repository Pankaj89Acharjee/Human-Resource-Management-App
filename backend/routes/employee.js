const express = require('express');
//const fetch = require('node-fetch');
const moment = require('moment-timezone');
const sha1 = require('sha1');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
router.use(express.json())
const cors = require("cors");
router.use(cors());
router.use(express.static('uploads/employee'))

const whetherEmployeeLogin = require('../middleware/whetherEmployeeLogin');

const PreJoineeModel = require('../schema/prejoinee.model');
const EmployeeModel = require('../schema/employee.model');
const DeptModel = require('../schema/departments.model');
const AssetsModel = require('../schema/assets.model');
const AssetStockModel = require('../schema/assetStock.model');
const GradeModel = require('../schema/grade.model');
const LoanModel = require('../schema/loan.model');

require('dotenv').config();
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

const JWT_KEYS = process.env.JWT_KEYS
const SALTKEY = process.env.SALTKEY
const PSALTKEY = process.env.PSALTKEY

//---Storge defining for using multer
const documentStorage = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, "./uploads/employee")
    },
    filename: async (req, file, callback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            let finalFileName = `${file.fieldname}_${req.employee.id}_${Date.now()}.${file.mimetype.split("/")[1]}`
            console.log("Final file name", finalFileName)
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


//For Viewing Employee's Own Profile (Join Employee + Employee Profile Info + Bank Info)
router.get('/employeeProfileView', whetherEmployeeLogin, async (req, res) => {
    let { email } = req.employee;
    try {
        const fetchEmployeeData = await EmployeeModel.getEmployeeProfile(email);
        if (fetchEmployeeData.statusCode === 0) {
            console.log("Error in fetching employee profile details")
            return res.status(500).json({ statusCode: 0, message: fetchEmployeeData.message, error: fetchEmployeeData.error })
        } else if (fetchEmployeeData.length === 0 || fetchEmployeeData[0] === undefined) {
            return res.status(404).json({ statusCode: 0, message: "Data not found" })
        } else {
            var userData = fetchEmployeeData[0]
            var output = {
                profile: {
                    empid: userData.emp_id,
                    employeeid: userData.employeeid,
                    name: userData.employee_name,
                    email: userData.email,
                    mobile: userData.mobile,
                    department_id: userData.department_id,
                    designation: userData.designation,
                    grade_id: userData.grade_id,
                    grade_level: userData.grade,
                    status: userData.status,
                    doj: userData.doj,
                    emp_type: userData.emp_type,
                    id_issued: userData.id_issued,
                    id_issued_date: userData.id_issued_date,
                },

                personal: {
                    profileid: userData.profile_id,
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
                    bankid: userData.bank_id,
                    emp_id: userData.emp_id,
                    account_number: userData.account_number,
                    ifsc_code: userData.ifsc_code,
                    address: userData.address
                },
            };
            res.status(200).json({ statusCode: 1, message: "Profile found", data: output })
        };
    } catch (error) {
        console.log("Error in fetching profile data", error);
        return res.status(500).json({ statusCode: 0, message: "Error in fetching profile data", error: error.message });
    }
});

//For updating profile info (emp_profile_info table)
router.post('/updateProfileInfo', whetherEmployeeLogin, async (req, res) => {
    let { email, id } = req.employee;
    let { father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion } = req.body

    try {
        const fetchEmployeeData = await EmployeeModel.checkEmpProfile(email);
        if (fetchEmployeeData.statusCode === 0) {
            console.log("Error in fetching employee details")
            return res.status(500).json({ statusCode: 0, message: fetchEmployeeData.message, error: fetchEmployeeData.error })
        } else if (fetchEmployeeData.length === 0 || fetchEmployeeData[0] === undefined) {
            return res.status(404).json({ statusCode: 0, message: "Data not found" })
        } else {
            const checkEmpInfo = await EmployeeModel.checkEmpProfileInfo(id)
            if (checkEmpInfo.length !== 0 || checkEmpInfo !== undefined) {
                const updateInfo = await EmployeeModel.updateProfileInfo(id, father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion)
                if (checkEmpInfo.statusCode === 0) {
                    return res.status(500).json({ statusCode: 0, message: checkEmpInfo.error })
                } else if (updateInfo.affectedRows) {
                    var output = {
                        statusCode: 1,
                        message: "Profile updated successfully",
                    }
                    res.status(200).json(output);
                } else {
                    return res.status(500).json({ statusCode: 0, message: "Error in updating profile info data" });
                }
            } else {
                return res.status(404).json({ statusCode: 0, message: "Data not found" });
            }
        }
    } catch (error) {
        console.log("Error in upadting profile data", error);
        return res.status(500).json({ statusCode: 0, message: "Error in upadting profile data", error: error.message });
    }
})


//For inserting new data in profile info
router.post('/insertProfileInfo', whetherEmployeeLogin, async (req, res) => {
    let { email, id } = req.employee;
    let { father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion } = req.body

    try {
        //checking in employee whether employee exists.
        const fetchEmployeeData = await EmployeeModel.checkEmpProfile(email);
        if (fetchEmployeeData.statusCode === 0) {
            console.log("Error in fetching employee details")
            return res.status(500).json({ statusCode: 0, message: fetchEmployeeData.message, error: fetchEmployeeData.error })
        } else if (fetchEmployeeData.length === 0 || !fetchEmployeeData || fetchEmployeeData === undefined) {
            return res.status(404).json({ statusCode: 0, message: "Data not found of the employee" })
        } else {
            //If in the above exists, then check whether employee is in emp_profile_info table.
            const checkEmpInfo = await EmployeeModel.checkEmpProfileInfo(id)
            if (checkEmpInfo.length === 0 || checkEmpInfo[0] === undefined || !checkEmpInfo) {
                const insertInfo = await EmployeeModel.insertProfileInfo(id, father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion)
                if (insertInfo.statusCode === 0) {
                    return res.status(500).json({ statusCode: 0, message: insertInfo.error })
                } else if (insertInfo.insertId) {
                    var output = {
                        statusCode: 1,
                        message: "Profile inserted successfully",
                    }
                    res.status(200).json(output);
                } else {
                    return res.status(500).json({ statusCode: 0, message: "Error in inserting profile info data" });
                }
            } else {
                return res.status(404).json({ statusCode: 0, message: "Data already exists, please update your profile for any update" });
            }
        }
    } catch (error) {
        console.log("Error in inserting profile data", error);
        return res.status(500).json({ statusCode: 0, message: "Error in inserting profile data", error: error.message });
    }
})


router.post('/uploadAadhaarBack', whetherEmployeeLogin, upload.single("aadhaarback"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadAahdaarBack(selectedFile, id);
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
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading aadhaar back in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading aadhaar back in db" });
    }
})


//For uploading  aadhaar front
router.post('/uploadAadhaarFront', whetherEmployeeLogin, upload.single("aadhaarfront"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadAahdaarFront(selectedFile, id);
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
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading aadhaar front in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading aadhaar front in db" });
    }
})


//Uploading PAN
router.post('/uploadPanCard', whetherEmployeeLogin, upload.single("pan"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadPanDoc(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "PAN updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading PAN in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading PAN in db" });
    }
})



//Uploading Voter
router.post('/uploadVoterCard', whetherEmployeeLogin, upload.single("voter"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadVoterDoc(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "Voter card updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading Voter card in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Voter card in db" });
    }
})

//Uploading Resume
router.post('/uploadResume', whetherEmployeeLogin, upload.single("resume"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadResume(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "Resume updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading Resume in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading Resume in db" });
    }
})


//Uploading Board
router.post('/uploadBoardDoc', whetherEmployeeLogin, upload.single("board"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadBoardDoc(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "board doc updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading board doc in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading board doc in db" });
    }
})


//Intermediate Doc
router.post('/uploadIntermediate', whetherEmployeeLogin, upload.single("intermediate"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadIntermediate(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "intermediate doc updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading intermediate doc in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading intermediate doc in db" });
    }
})



//Degree Doc
router.post('/uploadDegreeDoc', whetherEmployeeLogin, upload.single("degree"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadDegree(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "Degree doc updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading Degree doc in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading degree doc in db" });
    }
})


//Degree Doc
router.post('/uploadPGDegreeDoc', whetherEmployeeLogin, upload.single("pgdegree"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadPGDegree(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "PGdegree doc updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading pgdegree doc in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading pgdegree doc in db" });
    }
})


//Certificate
router.post('/uploadCertificate', whetherEmployeeLogin, upload.single("certificate"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadCertificate(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "certificate updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in uploading certificate in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading certificate in db" });
    }
})



//Passport photo
router.post('/uploadPhoto', whetherEmployeeLogin, upload.single("photo"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadPhoto(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "photo updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in photo certificate in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading photo in db" });
    }
})

//Profile image
router.post('/uploadProfileImage', whetherEmployeeLogin, upload.single("profileimg"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await EmployeeModel.checkEmpProfileInfo(id)
        if (checkEmployee.length !== 0) {
            const uploadInDB = await EmployeeModel.uploadProfilePhoto(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "profileimg updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in profileimg in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading profileimg in db" });
    }
})



//------------------------------LOAN SECTION---------------------------------------------
//**************************************************************************************/
//---------------------------------------------------------------------------------------


//View applied loan in details
router.get('/viewLoanDetails', whetherEmployeeLogin, async (req, res) => {
    let { emp_type, id } = req.employee;
    try {
        if (emp_type === 'EMP') {
            const fetchLoanData = await LoanModel.viewLoansAppliedById(id);
            if (fetchLoanData.statusCode === 0) {
                return res.status(500).json({ statusCode: 0, message: fetchLoanData.error })
            } else if (fetchLoanData.length !== 0 || fetchLoanData[0] !== undefined) {
                var output = {
                    statusCode: 1,
                    message: "Loan data fetched successfully",
                    data: fetchLoanData[0]
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statusCode: 0, message: "No data found" })
            }
        } else {
            return res.status(422).json({ statusCode: 0, message: "You are not authorized to view" })
        }
    } catch (error) {
        console.log("Error in viewing loan details", error);
        return res.status(500).json({ statusCode: 0, message: "Error in viewing loan details", error: error.message });
    }
})


//Apply for loan
router.post('/applyLoan', whetherEmployeeLogin, async (req, res) => {
    let { emp_type, id } = req.employee;
    var { amount, reason } = req.body;
    try {
        if (emp_type === 'EMP') {
            const applyNewLoan = await LoanModel.applyForLoan(id, amount, reason);
            if (applyNewLoan.statusCode === 0) {
                return res.status(500).json({ statusCode: 0, message: applyNewLoan.error })
            } else if (applyNewLoan.insertId) {
                var output = {
                    statusCode: 1,
                    message: "Loan application submitted successfully",
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statusCode: 0, message: "Error in applying for a loan" })
            }
        } else {
            return res.status(422).json({ statusCode: 0, message: "You are not authorized to apply for a loan" })
        }
    } catch (error) {
        console.log("Error in applying loan", error);
        return res.status(500).json({ statusCode: 0, message: "Error in applying loan", error: error.message });
    }
})

//Uploan Loan evidence doc
router.post('/uploadLoanEvidence', whetherEmployeeLogin, upload.single("loanevidence"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await LoanModel.checkEmpLoan(id)
        if (checkEmployee.length !== 0 || checkEmployee[0] !== undefined) {
            const uploadInDB = await LoanModel.uploadLoanEvidence(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "Loan evidence updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in loan evidence in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading loan evidence in db" });
    }
})


//Upload Loan Policy Doc
router.post('/uploadLoanPolicy', whetherEmployeeLogin, upload.single("loanpolicy"), async (req, res) => {
    let selectedFile = !req.file ? "" : req.file.filename;
    let { id } = req.employee;
    try {
        if (selectedFile === "wrongType") {
            return res.status(422).json({ statusCode: 0, message: 'Please select jpg, png, jpeg or pdf format only' });
        } else if (req.file?.size > 20000000) {
            return res.status(422).json({ statusCode: 0, message: 'file size is too large, allowed 20MB' });
        }
        const checkEmployee = await LoanModel.checkEmpLoan(id)
        if (checkEmployee.length !== 0 || checkEmployee[0] !== undefined) {
            const uploadInDB = await LoanModel.uploadLoanEvidence(selectedFile, id);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "Loan policy updated in database" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not upload in database" })
                }
            }
        } else {
            console.log("Employee profile info is blank, please fill data to upload your document")
            return res.status(404).json({ statusCode: 0, message: "Employee profile info is blank, please fill data to upload your document" })
        }
    } catch (error) {
        console.log("Error in loan policy in db", error);
        return res.status(500).json({ statusCode: 0, message: "Error in uploading loan policy in db" });
    }
})


//Edit Loan Data
//Upload Loan Policy Doc
router.post('/editLoanData', whetherEmployeeLogin, async (req, res) => {
    let { id } = req.employee;
    var { amount, reason } = req.body;
    try {
        const checkEmployee = await LoanModel.checkEmpLoan(id)
        if (checkEmployee.length !== 0 || checkEmployee[0] !== undefined) {
            const uploadInDB = await LoanModel.editLoanApplication(id, amount, reason);
            if (uploadInDB.statusCode === 0) {
                return res.status(404).json({ statusCode: 0, message: uploadInDB.error })
            } else {
                if (uploadInDB.affectedRows) {
                    res.status(200).json({ statusCode: 1, message: "Loan data updated successfully" });
                } else {
                    return res.status(422).json({ statusCode: 0, message: "Could not update database" })
                }
            }
        } else {
            console.log("Data not found")
            return res.status(404).json({ statusCode: 0, message: "Data not found" })
        }
    } catch (error) {
        console.log("Error in editing loan data", error);
        return res.status(500).json({ statusCode: 0, message: "Error in editing loan data" });
    }
})

module.exports = router