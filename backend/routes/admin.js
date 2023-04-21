const express = require('express');
//const fetch = require('node-fetch');
const moment = require('moment-timezone');
const sha1 = require('sha1');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: "./uploads/employee" });
const path = require('path');
const app = express();
const router = express.Router();
router.use(express.json())
const cors = require("cors");
router.use(cors());

const whetherAdminLogin = require('../middleware/whetherAdminLogin');

const AdminModel = require('../schema/adminUser.model');
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


//For Viewing All Admins' Data
router.get('/admin-list', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        const fetchAllAdmins = await AdminModel.fetchAllAdminData(emp_type);
        if (fetchAllAdmins.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: fetchAllAdmins.message, error: fetchAllAdmins.error })
        } else if (fetchAllAdmins.length === 0) {
            return res.status(404).json({ statuscode: 0, message: "Data not found" })
        } else {
            res.status(200).json({ statuscode: 1, message: "Profile found", data: fetchAllAdmins })
        }
    } catch (error) {
        console.log("Error in fetching admin data", error);
        return res.status(500).json({ statuscode: 0, message: "Error in fetching admin data", error: error.message });
    }

})

//For Viewing All Admins' Data in short form
router.get('/profiles', whetherAdminLogin, async (req, res) => {
    try {
        const fetchAllAdmins = await AdminModel.fetchAllAdminPreciseData();
        if (fetchAllAdmins.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: fetchAllAdmins.message, error: fetchAllAdmins.error })
        } else if (fetchAllAdmins.length === 0) {
            return res.status(404).json({ statuscode: 0, message: "Data not found" })
        } else {
            res.status(200).json({ statuscode: 1, message: "Profile found", data: fetchAllAdmins })
        }
    } catch (error) {
        console.log("Error in fetching profile data", error);
        return res.status(500).json({ statuscode: 0, message: "Error in fetching profile data", error: error.message });
    }
})


//For Viewing Admin's Own Profile (Join Employee + Employee Profile Info + Bank Info)
router.get('/adminprofileview', whetherAdminLogin, async (req, res) => {
    let { email } = req.admin;
    try {
        const fetchAdminData = await AdminModel.getAdminProfile(email);
        if (fetchAdminData.statuscode === 0) {
            console.log("Error in fetching Admin profile details")
            return res.status(500).json({ statuscode: 0, message: fetchAdminData.message, error: fetchAdminData.error })
        } else if (fetchAdminData.length === 0 || fetchAdminData[0] === undefined) {
            return res.status(404).json({ statuscode: 0, message: "Data not found" })
        } else {
            var userData = fetchAdminData[0]
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
            res.status(200).json({ statuscode: 1, message: "Profile found", data: output })
        };
    } catch (error) {
        console.log("Error in fetching profile data", error);
        return res.status(500).json({ statuscode: 0, message: "Error in fetching profile data", error: error.message });
    }
});



//Employe Profile Info (Join Employee + Employee Profile Info + Bank Info)
//For Viewing Employee's Profile Info
router.post('/employee/:empid', whetherAdminLogin, async (req, res) => {
    const id = req.params.empid;
    try {
        const fetchProfile = await EmployeeModel.fetchProfileData(id);        
        if (fetchProfile.statuscode === 0) {
            console.log("Error in fetching employee details")
            return res.status(500).json({ statuscode: 0, message: fetchProfile.message, error: fetchProfile.error })
        } else if (fetchProfile.length === 0 || fetchProfile[0] === undefined) {
            return res.status(404).json({ statuscode: 0, message: "All details of employee are not filled, hence nothing to show" })
        } else {
            var userData = fetchProfile[0]
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
            res.status(200).json(output)
        }
    } catch (error) {
        console.log("Error in fetching profile data", error);
        return res.status(500).json({ statuscode: 0, message: "Error in fetching profile data", error: error.message });
    }
});



//For viewing list of all employees
router.get('/employeelist/:pagenumber', whetherAdminLogin, async (req, res) => {
    const dataPerPage = 3;
    const pageNo = parseInt(req.params.pagenumber) || 1; //Later change it to req.query.pagenumber
    const start = (pageNo - 1) * dataPerPage;
    const end = start + dataPerPage;
    try {
        const fetchAllEmployee = await EmployeeModel.fetchAllEmployee();
        var responseData = fetchAllEmployee;
        //const totalPages = (parseInt(responseData.length + 1 )/pageSize);  
        const totalData = (responseData.length);
        const paginatedData = responseData.slice(start, end);
        res.status(200).json({ statuscode: 1, message: "All Employee Details Found", totalData: totalData, data: paginatedData })
    } catch (error) {
        console.log("Error in fetching employee data", error);
        return res.status(500).json({ statuscode: 0, message: "Error in fetching employee data", error: error.message });
    }
})


//Creating new employee. Grade Id and Dept ID are available in drop down and APIs are made for it.
router.post('/newemployee', whetherAdminLogin, async (req, res) => {
    //let employeeId = Math.floor(Math.random() * 206000) + 10000000;
    var { empName, email, password, mobile, deptId, designation, gradeId, joinDate, empType, idIssued, idIssueDate } = req.body
    if (!empName || !email || !password || !mobile || !deptId || !designation || !joinDate || !empType || !idIssued || !idIssueDate || !gradeId) {
        return res.status(422).json({ statuscode: 0, message: "Please fill all inputs" });
    } else {
        let concatPassword = PSALTKEY.concat(password)
        let hashedPassword = sha1(concatPassword)
        try {
            const insertData = await EmployeeModel.insertNewEmployee(empName, email, hashedPassword, mobile, deptId, designation, gradeId, joinDate, empType, idIssued, idIssueDate)
            if (insertData.statuscode === 0) {
                console.log("Error in inserting new Employee")
                return res.status(500).json({ statuscode: 0, message: insertData.message })
            } else if (insertData.statuscode === 2) {
                console.log("Duplicate Data");
                return res.status(500).json({ statuscode: 0, message: insertData.message })
            } else {
                var output = {
                    statuscode: 1,
                    message: "New Employee Inserted"
                }
                res.status(200).json(output)
            }
        } catch (error) {
            console.log("Error in fetching employee data", error);
            return res.status(500).json({ statuscode: 0, message: "Error in fetching employee data", error: error.message });
        }
    }
})


//For adding pre-joinee as an employee after approval
router.post('/addprejoineeasemployee/:id', whetherAdminLogin, async (req, res) => {
    var { mobile, deptId, designation, gradeId, joinDate, empType, idIssued, idIssueDate } = req.body
    var preJoinerId = req.params.id;
    if (!mobile || !deptId || !designation || !gradeId || !joinDate || !empType || idIssued || idIssueDate) {
        return res.status(422).json({ statuscode: 0, message: "Please fill the required fields" });
    } else {
        try {
            const getPrejoneeData = await PreJoineeModel.fetchPrejoineeById(preJoinerId)
            if (getPrejoneeData.length !== 0) {
                var preJoineeId = getPrejoneeData[0].id
                var preJoineeName = getPrejoneeData[0].user_name
                var preJoineePassword = getPrejoneeData[0].password
                var prejoineeEmail = getPrejoneeData[0].email
                const insertPrejoineeData = await EmployeeModel.insertPreJoineeInEmployee(preJoineeId, preJoineeName, preJoineePassword, prejoineeEmail, mobile, deptId, designation, gradeId, joinDate, empType, idIssued, idIssueDate)
                if (insertPrejoineeData.statuscode === 0) {
                    console.log("Error in inserting new PreJoinee")
                    return res.status(500).json({ statuscode: 0, message: insertPrejoineeData.message })
                } else if (insertPrejoineeData.statuscode === 2) {
                    console.log("Duplicate Data");
                    return res.status(500).json({ statuscode: 0, message: insertPrejoineeData.message })
                } else if (insertPrejoineeData.insertId) {
                    var output = {
                        statuscode: 1,
                        message: "New prejoinee added as an employee"
                    }
                    res.status(200).json(output)
                } else {
                    return res.status(403).json({ statuscode: 0, message: "Cannot create prejoinee as employee" })
                }
            } else {
                console.log("Found No Data");
                return res.status(403).json({ statuscode: 0, message: "No data found" })
            }
        } catch (error) {
            console.log("Error in adding prejoinee", error);
            return res.status(500).json({ statuscode: 0, message: "Error in adding prejoinee", error: error.message });
        }
    }
})

//For adding new pre-joinee before approval
router.post('/addprejoinee', whetherAdminLogin, async (req, res) => {
    var { userName, password, email, status } = req.body
    if (!userName || !password || !email) {
        return res.status(422).json({ statuscode: 0, message: "Please the required fields" });
    } else {
        let concatPassword = PSALTKEY.concat(password);
        let hashedPassword = sha1(concatPassword);
        try {
            const insertPrejoinee = await PreJoineeModel.addNewPrejoinee(userName, hashedPassword, email, status);
            if (insertPrejoinee.statuscode === 0) {
                console.log("Error in inserting new Prejoinee")
                return res.status(500).json({ statuscode: 0, message: insertPrejoinee.message })
            } else if (insertPrejoinee.statuscode === 2) {
                console.log("Duplicate Data");
                return res.status(500).json({ statuscode: 0, message: insertPrejoinee.message })
            } else {
                var output = {
                    statuscode: 1,
                    message: "New Prejoinee Added"
                }
                res.status(200).json(output)
            }
        } catch (error) {
            console.log("Error in adding prejoinee", error);
            return res.status(500).json({ statuscode: 0, message: "Error in adding prejoinee", error: error.message });
        }
    }
})



//For viewing all pre-joinee with Pagination
router.post('/prejoineelist/:pagenumber', whetherAdminLogin, async (req, res) => {
    const { dataPerPage } = req.body;
    const pageNo = parseInt(req.params.pagenumber) || 1; //Later change it to req.query.pagenumber
    const start = (pageNo - 1) * dataPerPage;
    const end = start + dataPerPage;
    try {
        const fetchPrejoinee = await PreJoineeModel.getAllPrejoinee();
        if (fetchPrejoinee.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: fetchPrejoinee.error })
        } else {
            var responseData = fetchPrejoinee;
            const totalData = (responseData.length);
            //const totalPages = (parseInt(responseData.length + 1 )/pageSize); 
            const paginatedData = responseData.slice(start, end);
            var output = {
                statuscode: 1,
                message: "Prejoinee data found",
                totalData: totalData,
                data: paginatedData
            }
            res.status(200).json(output);
        }
    } catch (error) {
        console.log("Error fetching prejoinee", error);
        return res.status(500).json({ statuscode: 0, message: "Error fetching prejoinee", error: error.message });
    }

})


//For viewing pre-joinee by id
router.get('/prejoineelist/:id', whetherAdminLogin, async (req, res) => {
    const id = req.params.id
    try {
        const fetchPrejoinee = await prejoineeEmail.getPrejoineeById(id);
        if (fetchPrejoinee.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: fetchPrejoinee.message })
        } else if (fetchPrejoinee.length === 0) {
            return res.status(404).json({ statuscode: 0, message: "No Data found" })
        } else {
            var output = {
                statuscode: 1,
                message: "Prejoinee data found",
                data: fetchPrejoinee
            }
            res.status(200).json(output);
        }
    } catch (error) {
        console.log("Error fetching prejoinee", error);
        return res.status(500).json({ statuscode: 0, message: "Error fetching prejoinee", error: error.message });
    }
})


//Approving Pre-joine for making him eligible in registering as an employee
router.get('/approveprejoinee/:id', whetherAdminLogin, async (req, res) => {
    const preJoinerId = req.params.id;
    try {
        const prejoineeStatus = await PreJoineeModel.checkPreJoineeStatusById(preJoinerId);
        const responseStatus = prejoineeStatus;
        if (responseStatus[0].status === 0) {
            const updateStatus = await PreJoineeModel.updatePrejoineeStatus(preJoinerId)
            if (updateStatus.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: updateStatus.message })
            } else {
                var output = {
                    statuscode: 1,
                    message: "Status Updated!"
                }
                res.status(200).json(output);
            }
        } else {
            console.log("Status code is not 0, hence cannot approve")
            return res.status(422).json({ statuscode: 0, message: "Cannot approve the status of this prejoinee" });
        } approving
    } catch (error) {
        console.log("Error approving prejoinee", error);
        return res.status(500).json({ statuscode: 0, message: "Error approving prejoinee", error: error.message });
    }
})

//Reject Pre-joine 
router.get('/rejectprejoinee/:id', whetherAdminLogin, async (req, res) => {
    const preJoinerId = req.params.id;
    try {
        const prejoineeStatus = await PreJoineeModel.checkPreJoineeStatusById(preJoinerId);
        const responseStatus = prejoineeStatus;
        if (responseStatus[0].status === 0) {
            const updateStatus = await PreJoineeModel.rejectPrejoineeStatus(preJoinerId)
            if (updateStatus.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: updateStatus.message })
            } else {
                var output = {
                    statuscode: 1,
                    message: "Status Updated!"
                }
                res.status(200).json(output);
            }
        } else {
            console.log("Status code is not 0, hence cannot change")
            return res.status(422).json({ statuscode: 0, message: "Cannot change status of this prejoinee" });
        }
    } catch (error) {
        console.log("Error in rejecting prejoinee", error);
        return res.status(500).json({ statuscode: 0, message: "Error in rejecting prejoinee", error: error.message });
    }
})

//---------------GRADE-LIST-------------------------------

//This API is to make drop-down in the UI to show all grades
router.get('/gradeList', whetherAdminLogin, async (req, res) => {
    try {
        const fetchGrades = await GradeModel.fetchGradeList();
        if (fetchGrades.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: fetchGrades.message })
        } else {
            var output = {
                statuscode: 1,
                message: "Grade List fetched successfully",
                data: fetchGrades
            }
            res.status(200).json(output)
        }
    } catch (error) {
        console.log("Error fetching gradelist", error);
        return res.status(500).json({ statuscode: 0, message: "Error fetching gradelist", error: error.message });
    }
})


//Create new grade
router.post('/createGrade', whetherAdminLogin, async (req, res) => {
    var { grade, status } = req.body;
    try {
        const fetchGrades = await GradeModel.createNewGrade(grade, status);
        if (fetchGrades.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: fetchGrades.message })
        } else {
            var output = {
                statuscode: 1,
                message: "New grade created successfully",
            }
            res.status(200).json(output)
        }
    } catch (error) {
        console.log("Error in creating gradelist", error);
        return res.status(500).json({ statuscode: 0, message: "Error in creating gradelist", error: error.message });
    }

})


//Update or Deactivate Grades
router.get('/updateGrade', whetherAdminLogin, async (req, res) => {
    var { grade, status, gradeId } = req.body;
    try {
        const fetchGrades = await GradeModel.updateGrade(grade, status, gradeId);
        if (fetchGrades.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: fetchGrades.message })
        } else {
            var output = {
                statuscode: 1,
                message: "Grade updated successfully",
            }
            res.status(200).json(output)
        }
    } catch (error) {
        console.log("Error in upgrading gradelist", error);
        return res.status(500).json({ statuscode: 0, message: "Error in upgrading gradelist", error: error.message });
    }

})


//-----------------DEPARTMENTS----------------------------
//--------------------------------------------------------

//--Adding a new Department
router.post('/createnewdepartment', whetherAdminLogin, async (req, res) => {
    var { departmentName, designation, createdBy } = req.body
    if (!departmentName || !designation || !createdBy) {
        return res.status(422).json({ statuscode: 0, message: "Fill all the required fields" });
    }
    try {
        const getAllDept = await DeptModel.createNewDepartment(departmentName, designation, createdBy);
        if (getAllDept.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: getAllDept.message })
        } else {
            console.log("New department created successfully");
            var output = {
                statuscode: 1,
                message: "New department created successfully"
            }
            res.status(200).json(output)
        }
    } catch (error) {
        console.log("Error in creating new department", error);
        return res.status(500).json({ statuscode: 0, message: "Error in creating new department", error: error.message });
    }
})

//--Get Department List for drop-down
router.get('/listDepartmentsById', whetherAdminLogin, async (req, res) => {
    try {
        const getAllDept = await DeptModel.listAllDepartments();
        if (getAllDept.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: getAllDept.message })
        } else {
            console.log("All departments fetched successfully");
            var output = {
                statuscode: 1,
                message: "All departments fetched successfully",
                data: getAllDept
            }
            res.status(200).json(output)
        }
    } catch (error) {
        console.log("Error in listing department", error);
        return res.status(500).json({ statuscode: 0, message: "Error in listing department", error: error.message });
    }
})

//--Fetching All Department
router.get('/getAllDepartments', whetherAdminLogin, async (req, res) => {
    try {
        const getAllDept = await DeptModel.getAllDepartments();
        if (getAllDept.statuscode === 0) {
            return res.status(500).json({ statuscode: 0, message: getAllDept.message })
        } else {
            console.log("All departments fetched successfully");
            var output = {
                statuscode: 1,
                message: "All departments fetched successfully",
                data: getAllDept
            }
            res.status(200).json(output)
        }
    } catch (error) {
        console.log("Error in fetching department", error);
        return res.status(500).json({ statuscode: 0, message: "Error in fetching department", error: error.message });
    }
})


//--Updating a Department status to inactive (status: 0)
router.get('/updateDepartment/:id', whetherAdminLogin, async (req, res) => {
    const deptId = req.params.id;
    try {
        const deptStatus = await DeptModel.checkDepartmentStatusById(deptId);
        const responseStatus = deptStatus;
        console.log("Status of dept is", responseStatus[0].status)
        if (responseStatus[0].status == 0) {
            const updateStatus = await DeptModel.updateDepartmentStatus(deptId)
            if (updateStatus.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: updateStatus.message })
            } else {
                var output = {
                    statuscode: 1,
                    message: "Department Deactivated!"
                }
                res.status(200).json(output);
            }
        } else {
            console.log("Status code is not 0, hence cannot change")
            return res.status(422).json({ statuscode: 0, message: "Cannot change status of this department" });
        }
    } catch (error) {
        console.log("Error in updating existing department", error);
        return res.status(500).json({ statuscode: 0, message: "Error in updating existing department", error: error.message });
    }
})



//-------------------Assets-----------------------------

//Create New Asset by ADMIN only
router.post('/createNewAsset', whetherAdminLogin, async (req, res) => {
    var { name, specification, categoryid } = req.body;
    let { emp_type, id } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const createAsset = await AssetsModel.createNewAsset(name, specification, categoryid, 0, 0, id);
            //console.log('createAsset', createAsset.insertId)
            if (createAsset.statuscode == 0) {
                return res.status(500).json({ statuscode: 0, message: createAsset.error })
                // INSERT createAsset.insertId
                // UPDATE createAsset.affectedRows
            } else if (createAsset.insertId) {
                var output = {
                    statuscode: 1,
                    message: "New asset created successfully"
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statuscode: 0, message: "Failed to create new asset" })
            }
        } else {
            return res.status(401).json({ statuscode: 0, message: "You are not authorized to create new asset" })
        }
    } catch (error) {
        console.log("Error in creating new asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in creating new asset", error: error.message });
    }
})

//View All Assets from Asset Table
router.get('/viewAllAssets', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const viewAllAssets = await AssetsModel.viewAllAssets();
            if (viewAllAssets.statuscode == 0) {
                return res.status(500).json({ statuscode: 0, message: viewAllAssets.error })
            } else {
                var output = {
                    statuscode: 1,
                    message: "Assets fetched successfully",
                    data: viewAllAssets
                }
                res.status(200).json(output);
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view assets" })
        }
    } catch (error) {
        console.log("Error in viewing new asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing new asset", error: error.message });
    }
})

//Update existing assets in Asset Table
router.post('/updateAsset/:id', whetherAdminLogin, async (req, res) => {
    var assetId = req.params.id;
    var { name, specification, total, instock } = req.body;
    let { emp_type, id } = req.admin;
    try {
        if (emp_type == 'ADMIN') {
            const createAsset = await AssetsModel.updateAsset(name, specification, total, instock, assetId, id);
            if (createAsset.statuscode == 0) {
                return res.status(500).json({ statuscode: 0, message: createAsset.message })
            } else if (createAsset.insertId) {
                var output = {
                    statuscode: 1,
                    message: "Asset updated successfully"
                }
                res.status(200).json(output);
            } else {
                return res.status(422).json({ statuscode: 0, message: "Unable to process your request" })
            }
        } else {
            return res.status(401).json({ statuscode: 0, message: "You are not authorized to create new asset" })
        }
    } catch (error) {
        console.log("Error in updating asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in updating asset", error: error.message });
    }
})



//Create new asset category
router.post('/createNewAssetCategory', whetherAdminLogin, async (req, res) => {
    var { assetName } = req.body;
    let { emp_type } = req.admin;
    try {
        if (emp_type == 'ADMIN') {
            const createNewCategoty = await AssetsModel.createNewAssetCat(assetName);
            if (createNewCategoty.statuscode == 0) {
                return res.status(500).json({ statuscode: 0, message: createNewCategoty.message })
            } else if (createNewCategoty.insertId) {
                var output = {
                    statuscode: 1,
                    message: "New asset category created successfully"
                }
                res.status(200).json(output);
            } else {
                return res.status(404).json({ statuscode: 0, message: "Unable to create asset category" })
            }
        } else {
            return res.status(401).json({ statuscode: 0, message: "You are not authorized to create new asset" })
        }
    } catch (error) {
        console.log("Error in creating new asset category", error);
        return res.status(500).json({ statuscode: 0, message: "Error in creating new asset category", error: error.message });
    }
})


//View all assets in asset category
router.get('/viewAssetCategory', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const viewAllCategory = await AssetsModel.viewAllAssetCat();
            if (viewAllCategory.statuscode == 0) {
                return res.status(500).json({ statuscode: 0, message: viewAllCategory.message })
            } else {
                var output = {
                    statuscode: 1,
                    message: "Assets fetched successfully",
                    data: viewAllCategory
                }
                res.status(200).json(output);
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view assets" })
        }
    } catch (error) {
        console.log("Error in viewing asset category", error);
        return res.status(500).json({ statuscode: 0, message: "Error in creating new asset category", error: error.message });
    }
})

//View only active assets in asset category. This is done as ADMIN can select all active Category_ID for creating new asset
router.get('/viewActiveAssetId', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const viewAllActiveAssets = await AssetsModel.viewAllAssetCat();
            if (viewAllActiveAssets.statuscode == 0) {
                return res.status(500).json({ statuscode: 0, message: viewAllActiveAssets.message })
            } else {
                var output = {
                    statuscode: 1,
                    message: "Assets fetched successfully",
                    data: viewAllActiveAssets
                }
                res.status(200).json(output);
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view assets" })
        }
    } catch (error) {
        console.log("Error in viewing active asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing active asset", error: error.message });
    }
})



//Update status of asset category (i.e., make inactive)
router.post('/updateAssetCategory/:id', whetherAdminLogin, async (req, res) => {
    let assetId = req.params.id;
    var { productName, status } = req.body
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const updateCategory = await AssetsModel.updateAssetCat(productName, status, assetId);
            if (updateCategory.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: updateCategory.error })
            } else if (updateCategory.affectedRows) {
                var output = {
                    statuscode: 1,
                    message: "Asset updated successfully"
                }
                res.status(200).json(output);
            } else {
                return res.status(404).json({ statuscode: 0, message: "No asset category found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
        }
    } catch (error) {
        console.log("Error in updating asset category", error);
        return res.status(500).json({ statuscode: 0, message: "Error in updating asset category", error: error.message });
    }
})


//Employee Asset List
router.get('/listEmployeeAssetRequest', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchAssetReq = await AssetsModel.empAssetReqList();
            if (fetchAssetReq.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: updateCategory.error })
            } else if (fetchAssetReq.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "Employee asset list fetched successfully",
                    data: fetchAssetReq
                }
                res.status(200).json(output);
            } else {
                return res.status(404).json({ statuscode: 0, message: "No asset list found" })
            }

        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view" })
        }
    } catch (error) {
        console.log("Error in listing employee asset request", error);
        return res.status(500).json({ statuscode: 0, message: "Error in listing employee asset request", error: error.message });
    }
})


//Employee Asset View
router.get('/viewEmployeeAssetRequest/:id', whetherAdminLogin, async (req, res) => {
    const empid = req.params.id //EmployeeId is required here and it is available in the Asset List Table
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchAssetReq = await AssetsModel.empAssetReqView(empid);
            if (fetchAssetReq.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: fetchAssetReq.error })
            } else if (fetchAssetReq.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "Employee asset view fetched successfully",
                    data: fetchAssetReq
                }
                res.status(200).json(output);
            } else {
                return res.status(404).json({ statuscode: 0, message: "No asset requests found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view" })
        }
    } catch (error) {
        console.log("Error in employee asset request", error);
        return res.status(500).json({ statuscode: 0, message: "Error in employee asset request", error: error.message });
    }
})


//Employee Asset Request List by DROP-DOWN
router.get('/assetRequestList', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchAssetReq = await AssetsModel.empAssetReqDropDown();
            if (fetchAssetReq.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: fetchAssetReq.error })
            } else if (fetchAssetReq.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "Asset List fetched successfully",
                    data: fetchAssetReq
                }
                res.status(200).json(output);
            } else {
                return res.status(404).json({ statuscode: 0, message: "No asset requests found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view" })
        }
    } catch (error) {
        console.log("Error in listing asset request", error);
        return res.status(500).json({ statuscode: 0, message: "Error in listing asset request", error: error.message });
    }
})


//Asset Acceptance
router.post('/acceptAssetRequest', whetherAdminLogin, upload.single("docs"), async (req, res) => {
    var { request_id, asset_id } = req.body  //requestId is available from the Asset View table
    console.log("Request Id and Asset Id are", request_id, asset_id);
    var selectedFile = req.file
    if (!selectedFile) {
        console.log("File not selected!")
        res.status(500).json({ statuscode: 0, message: "Pls select a file" })
    } else {
        let { emp_type, status, id } = req.admin;
        try {
            if (emp_type === 'ADMIN') {
                let fileExtension = selectedFile.mimetype.split("/")[1];
                let newFileName = 'assetaccept';
                let dateNow = Date.now();
                let finalFileName = (newFileName + '_' + id + '_' + dateNow + '.' + fileExtension);
                console.log("Final File Name is", finalFileName);
                fs.rename(`./uploads/employee/${selectedFile.filename}`, `./uploads/employee/${finalFileName}`, function () {
                    if (selectedFile.length === 0) {
                        console.log("File is missing")
                        res.status(404).json({ statuscode: 0, message: "File is missing" })
                    }
                })
                const fetchStocks = await AssetsModel.fetchAssetsQuantity(asset_id);
                if (fetchStocks.length !== 0) {
                    const acceptAsset = await AssetsModel.acceptAssetRequest(finalFileName, request_id, status);
                    if (acceptAsset.statuscode === 0) {
                        return res.status(500).json({ statuscode: 0, message: acceptAsset.error })
                    } else if (acceptAsset.affectedRows) {
                        const inStock = fetchStocks[0].instock;
                        if (inStock > 0) {
                            const newInstock = (inStock - 1);
                            const updateInstock = await AssetsModel.updateInstock(asset_id, newInstock, id)
                            if (updateInstock.statuscode === 0) {
                                return res.status(500).json({ statuscode: 0, message: updateInstock.error })
                            } else if (updateInstock.affectedRows) {
                                var output = {
                                    statuscode: 1,
                                    message: "Employee asset request has been accepted",
                                }
                                res.status(200).json(output);
                            } else {
                                res.status(500).json({ statuscode: 0, message: "Error in status updation" });
                            }
                        } else {
                            res.status(422).json({ statuscode: 0, message: "Stock is not available, hence cannot accept asset request" });
                        }
                    }
                } else {
                    return res.status(404).json({ statuscode: 0, message: "Data not found" })
                }
            } else {
                return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
            }
        } catch (error) {
            console.log("Error in accepting asset request", error);
            return res.status(500).json({ statuscode: 0, message: "Error in accepting asset request", error: error.message });
        }
    }
})




//Asset Rejection
router.post('/rejectAssetRequest', whetherAdminLogin, async (req, res) => {
    const { requestId } = req.body  //requestId is available from the Asset View table   
    let { emp_type, status } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const rejectAsset = await AssetsModel.rejectAssetRequest(requestId, status);
            if (rejectAsset.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: rejectAsset.error })
            } else if (rejectAsset.affectedRows) {
                var output = {
                    statuscode: 1,
                    message: "Employee asset request has been rejected",
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statuscode: 0, message: "Could not update status in database" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
        }
    } catch (error) {
        console.log("Error in rejecting asset request", error);
        return res.status(500).json({ statuscode: 0, message: "Error in rejecting asset request", error: error.message });
    }
})

////View Asset and AssetID. This will act as drop-down in UI. From here assetId is gained.
router.get('/viewAssetsById', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchAsset = await AssetsModel.fetchAllAssets();
            if (fetchAsset.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: fetchAsset.error })
            } else if (fetchAsset.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "Assets have been fetched",
                    data: fetchAsset
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statuscode: 0, message: "No data found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
        }
    } catch (error) {
        console.log("Error in viewing asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing asset", error: error.message });
    }
})

//API for viewing Assets which are issued. This will be required to return Assets and update the instock.
router.get('/viewIssuedAssets', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchIssuedAsset = await AssetsModel.fetchAllIssuedAssets();
            if (fetchIssuedAsset.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: fetchIssuedAsset.error })
            } else if (fetchIssuedAsset.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "All issued assets have been fetched",
                    data: fetchIssuedAsset
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statuscode: 0, message: "No data found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
        }
    } catch (error) {
        console.log("Error in viewing asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing asset", error: error.message });
    }
})


//For returning an already issued asset and updating the stock. 
router.post('/returnAsset', whetherAdminLogin, async (req, res) => {
    var { request_id, asset_id } = req.body  //assetId is available from the viewIssuedAssets API      
    let { emp_type, status, id } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchStocks = await AssetsModel.fetchAssetsQuantity(asset_id);
            if (fetchStocks.length !== 0) {
                const updateAsset = await AssetsModel.updateAssetStatus(request_id, status);
                if (updateAsset.statuscode === 0) {
                    return res.status(500).json({ statuscode: 0, message: updateAsset.error })
                } else if (updateAsset.affectedRows) {
                    const inStock = fetchStocks[0].instock;
                    const totalStocks = fetchStocks[0].total;
                    if (inStock >= 0 && inStock <= totalStocks) {
                        const newInstock = (inStock + 1);
                        const updateInstock = await AssetsModel.updateInstock(asset_id, newInstock, id)
                        if (updateInstock.statuscode === 0) {
                            return res.status(500).json({ statuscode: 0, message: updateInstock.error })
                        } else if (updateInstock.affectedRows) {
                            var output = {
                                statuscode: 1,
                                message: "Asset has been returned successfully",
                            }
                            res.status(200).json(output);
                        } else {
                            res.status(500).json({ statuscode: 0, message: "Error in status updation" });
                        }
                    } else {
                        res.status(422).json({ statuscode: 0, message: "Asset is not issued to anyone, hence cannot return" });
                    }
                }
            } else {
                return res.status(404).json({ statuscode: 0, message: "Data not found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
        }
    } catch (error) {
        console.log("Error in returning asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing asset", error: error.message });
    }
})







//---------------------------ASSET-STOCK------------------------------------------
//Asset Stock Creation
router.post('/insertStockAsset', whetherAdminLogin, async (req, res) => {
    const { qty, price, assetId } = req.body; //AssetId is selected from drop-down
    const totalValue = (price * qty);
    let { emp_type, id } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchStocks = await AssetsModel.fetchAssetsQuantity(assetId);
            if (fetchStocks.length !== 0) {
                const insertAsset = await AssetStockModel.insertAssetStockById(assetId, id, totalValue, qty, price);
                if (insertAsset.statuscode === 0) {
                    return res.status(500).json({ statuscode: 0, message: insertAsset.error })
                } else if (insertAsset.insertId) {
                    const totalQty = (parseInt(qty) + fetchStocks[0].total)
                    const instock = (fetchStocks[0].instock + parseInt(qty))
                    const updateAssetQty = await AssetStockModel.updateAssetStock(assetId, totalQty, instock, id);
                    if (updateAssetQty.statuscode === 0) {
                        return res.status(500).json({ statuscode: 0, message: insertAsset.error })
                    } else if (updateAssetQty.affectedRows) {
                        var output = {
                            statuscode: 1,
                            message: "Asset stock has been updated",
                        }
                        res.status(200).json(output);
                    }
                } else {
                    return res.status(500).json({ statuscode: 0, message: "Error in updating" })
                }
            } else {
                return res.status(404).json({ statuscode: 0, message: "No data found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
        }
    } catch (error) {
        console.log("Error in inserting stock asset", error);
        return res.status(500).json({ statuscode: 0, message: "Error in inserting stock asset", error: error.message });
    }
})



//All Stock Asset View
router.get('/assetsStockList', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN') {
            const fetchAsset = await AssetStockModel.fetchAllAssetStock();
            if (fetchAsset.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: fetchAsset.error })
            } else if (fetchAsset.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "Asset stock has been fetched",
                    data: fetchAsset
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statuscode: 0, message: "No data found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to update status" })
        }
    } catch (error) {
        console.log("Error in viewing asset stocl list", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing asset stocl list", error: error.message });
    }
})


//-----------------------------LOAN SECTION--------------------------------------

//View All applied loans in details
router.post('/viewLoanDetails', whetherAdminLogin, async (req, res) => {
    var { loanId } = req.body;
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN' || emp_type === 'ACCOUNTS') {
            const fetchLoanData = await LoanModel.viewLoansApplied(loanId);
            if (fetchLoanData.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: fetchLoanData.error })
            } else if (fetchLoanData.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "Loan data fetched successfully",
                    data: fetchLoanData[0]
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statuscode: 0, message: "No data found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view" })
        }
    } catch (error) {
        console.log("Error in viewing loan details", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing loan details", error: error.message });
    }
})

//View all loans as drop-down/or in short form
router.get('/viewLoanList', whetherAdminLogin, async (req, res) => {
    let { emp_type } = req.admin;
    try {
        if (emp_type === 'ADMIN' || emp_type === 'ACCOUNTS') {
            const fetchLoanData = await LoanModel.listAppliedLoans();
            if (fetchLoanData.statuscode === 0) {
                return res.status(500).json({ statuscode: 0, message: fetchLoanData.error })
            } else if (fetchLoanData.length !== 0) {
                var output = {
                    statuscode: 1,
                    message: "Loan list fetched successfully",
                    data: fetchLoanData
                }
                res.status(200).json(output);
            } else {
                return res.status(500).json({ statuscode: 0, message: "No data found" })
            }
        } else {
            return res.status(422).json({ statuscode: 0, message: "You are not authorized to view" })
        }
    } catch (error) {
        console.log("Error in viewing loan details", error);
        return res.status(500).json({ statuscode: 0, message: "Error in viewing loan details", error: error.message });
    }
})



//Accept Loans
router.post('/acceptLoan', whetherAdminLogin, async (req, res) => {
    var { loanId, hrNote } = req.body;
    if (hrNote.length < 100) {
        return res.status(400).json({ statuscode: 0, message: "HR note should be of 100 characters" })
    }
    else if (loanId.length === 0 || !loanId) {
        return res.status(400).json({ statuscode: 0, message: "LoanId cannot be blank" })
    }
    else {
        let { emp_type, id } = req.admin;
        try {
            if (emp_type === 'ADMIN') {
                const fetchLoanData = await LoanModel.AppliedLoans(loanId);
                if (fetchLoanData.statuscode === 0) {
                    return res.status(500).json({ statuscode: 0, message: fetchLoanData.error })
                } else if (fetchLoanData.length !== 0) {
                    const hrStatus = fetchLoanData[0].hr_status;
                    if (hrStatus == 1) {
                        return res.status(422).json({ statuscode: 0, message: "Loan already approved" });
                    }
                    else if (hrStatus == 0) {
                        const approveLoan = await LoanModel.approveLoanData(loanId, id, hrNote);
                        if (approveLoan.affectedRows) {
                            var output = {
                                statuscode: 1,
                                message: "Loan approved successfully"
                            }
                            res.status(200).json(output)
                        }
                    } else {
                        return res.status(422).json({ statuscode: 0, message: "Loan cannot be approved" });
                    }
                } else {
                    return res.status(500).json({ statuscode: 0, message: "No data found" })
                }
            } else {
                return res.status(422).json({ statuscode: 0, message: "You are not authorized to accept loan" })
            }
        } catch (error) {
            console.log("Error in accepting loan", error);
            return res.status(500).json({ statuscode: 0, message: "Error in accepting loan", error: error.message });
        }
    }
})


//Reject loans
router.post('/rejectLoan', whetherAdminLogin, async (req, res) => {
    var { loanId, hrNote } = req.body;
    if (hrNote.length < 100) {
        return res.status(400).json({ statuscode: 0, message: "HR note should be of 100 characters" })
    }
    else if (loanId.length === 0 || !loanId) {
        return res.status(400).json({ statuscode: 0, message: "LoanId cannot be blank" })
    }
    else {
        let { emp_type, id } = req.admin;
        try {
            if (emp_type === 'ADMIN') {
                const fetchLoanData = await LoanModel.AppliedLoans(loanId);
                if (fetchLoanData.statuscode === 0) {
                    return res.status(500).json({ statuscode: 0, message: fetchLoanData.error })
                } else if (fetchLoanData.length !== 0) {
                    const hrStatus = fetchLoanData[0].hr_status;
                    if (hrStatus == 1) {
                        return res.status(422).json({ statuscode: 0, message: "Loan already approved, hence cannot reject" });
                    }
                    else if (hrStatus == 0) {
                        const rejectLoan = await LoanModel.rejectLoanData(loanId, id, hrNote);
                        if (rejectLoan.affectedRows) {
                            var output = {
                                statuscode: 1,
                                message: "Loan rejected successfully"
                            }
                            res.status(200).json(output)
                        }
                    } else {
                        return res.status(422).json({ statuscode: 0, message: "Loan cannot be rejected" });
                    }
                } else {
                    return res.status(500).json({ statuscode: 0, message: "No data found" })
                }
            } else {
                return res.status(422).json({ statuscode: 0, message: "You are not authorized to reject loan" })
            }
        } catch (error) {
            console.log("Error in rejecting loan", error);
            return res.status(500).json({ statuscode: 0, message: "Error in rejecting loan", error: error.message });
        }
    }
})


module.exports = router