const db = require('../utils/db');
require('dotenv').config();
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';
const BASE_URL = process.env.BASE_URL;

//For fetching profile data of employee by id
const fetchProfileData = async (empid) => {
    console.log("Employee Id is", empid);
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query(`SELECT t1.id AS emp_id, t1.employeeid, t1.name AS employee_name, t1.designation, t1.email, t1.mobile, t1.department_id, t1.grade_id, t1.status, t1.doj, t1.emp_type, t1.id_issued, t1.id_issued_date, CONCAT ("${BASE_URL}uploads/employee/", t2.aadhar_back_doc) aadhar_back_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.aadhar_front_doc) aadhar_front_doc, t2.aadhar_no, t2.alt_mobile_no,t2.blood_group, CONCAT ("${BASE_URL}uploads/employee/", t2.board_doc) board_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.certificate_doc) certificate_doc, t2.current_address, t2.current_city, t2.current_country, t2.current_district, t2.current_pincode, t2.current_state, CONCAT ("${BASE_URL}uploads/employee/", t2.degree_doc) degree_doc, t2.dob, t2.emp_id, t2.esi_no, t2.father_name, t2.gender, t2.id AS profile_id, CONCAT ("${BASE_URL}uploads/employee/", t2.intermediate_doc) intermediate_doc, t2.mother_name, CONCAT ("${BASE_URL}uploads/employee/", t2.pan_doc) pan_doc, t2.pan_no, CONCAT ("${BASE_URL}uploads/employee/", t2.passport_photo) passport_photo, t2.permanent_address, t2.permanent_city, t2.permanent_country, t2.permanent_district, t2.permanent_pincode, t2.permanent_state, t2.pf_no, CONCAT ("${BASE_URL}uploads/employee/", t2.pg_degree_doc) pg_degree_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.profile_img) profile_img, t2.religion, CONCAT ("${BASE_URL}uploads/employee/", t2.resume_doc) resume_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.voter_doc) voter_doc, t2.spouse_name, t3.id AS bank_id, t3.account_number, t3.address, t3.doc AS bank_doc, t3.emp_id, t3.ifsc_code, t3.name AS employee_name, t4.id AS grade_id, t4.grade, t4.status FROM employee  t1 JOIN emp_profile_info t2 ON t1.id = t2.emp_id JOIN bank_info t3 ON t1.id = t3.emp_id JOIN grade_master t4 ON t1.grade_id = t4.id
        WHERE t1.id = ${empid}`);
        return resp[0];
    } catch (error) {
        console.log("Error in fetching profile data", error);
        return { connection: false, statusCode: 0, message: "Error in fetching profile data", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//For inserting data into employee table after approval of a prejoinee
const insertPreJoineeInEmployee = async (preJoineeId, preJoineeName, preJoineePassword, prejoineeEmail, mobile, deptId, designation, gradeId, joinDate, empType, idIssued, idIssueDate) => {
    var conn = null;
    var presentDate = moment().format('YYYY-MM-DD');
    var presentTime = moment().format('hh:mm:ss A');
    try {
        conn = await db.connection();
        var checkDB = `SELECT * FROM employee WHERE email = ?`
        const executeQuery = await conn.execute(checkDB, [prejoineeEmail])
        let executionResult = executeQuery[0]
        if (prejoineeEmail == executionResult[0]?.email) {
            conn.release();
            console.log("Prejoinee already exists");
            return ({ statusCode: 2, message: "Prejoinee Already exists" })
        } else {
            conn = await db.connection();
            const resp = await conn.query('INSERT INTO employee (name, email, password, mobile, department_id, designation, grade_id, status, doj, emp_type, id_issued, id_issued_date, date, time, prejoining_emp_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [preJoineeName, prejoineeEmail, preJoineePassword, mobile, deptId, designation, gradeId, "Active", joinDate, empType, idIssued, idIssueDate, presentDate, presentTime, preJoineeId]);
            conn.release();
            return resp[0];
        }
    } catch (error) {
        console.log("Error in inserting new Prejoinee details", error);
        return { connection: false, statusCode: 0, message: "Error in inserting new prejoinee details", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

// For Fetching all employee
const fetchAllEmployee = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('select * from employee where id is not null');
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in fetching all employee details");
        return { connection: false, statusCode: 0, message: "Error in fetching all employee details", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


//For inserting new Employee
const insertNewEmployee = async (empName, email, password, mobile, deptId, designation, gradeId, joinDate, empType, idIssued, idIssueDate) => {
    var conn = null;
    var presentDate = moment().format('YYYY-MM-DD');
    var presentTime = moment().format('hh:mm:ss A');
    try {
        conn = await db.connection();
        var checkDB = `SELECT * FROM employee WHERE email = ?`
        const executeQuery = await conn.execute(checkDB, [email])
        let executionResult = executeQuery[0]
        if (email == executionResult[0]?.email) {
            conn.release();
            console.log("User already exists");
            return ({ statusCode: 2, message: "User Already exists" })
        } else {
            const resp = await conn.query('INSERT INTO employee (name, email, password, mobile, department_id, designation, grade_id, status, doj, emp_type, id_issued, id_issued_date, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [empName, email, password, mobile, deptId, designation, gradeId, "Active", joinDate, empType, idIssued, idIssueDate, presentDate, presentTime]);
            conn.release();
            return resp[0];
        }
    } catch (error) {
        console.log("Error in inserting new employee details", error);
        return { connection: false, statusCode: 0, message: "Error in inserting new employee details", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//----------------------FOR ADMIN SECTION---------------------

//For Fetching all Admins' List
const fetchAllAdminData = async (empType) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM employee WHERE emp_type = ?', [empType]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching admin data', error)
        return { connection: false, statusCode: 0, message: "Error in fetching admin data", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//For Fetching all Admins' List
const fetchAllAdminPreciseData = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, employeeid, name, email, emp_type, mobile, status FROM employee WHERE emp_type = ?', ['ADMIN']);
        conn.release();
        return resp[0];
    }
    catch (error) {
        console.log('Error in fetching admin data', error)
        return { connection: false, statusCode: 0, message: "Error in fetching admin data", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


//For getting Admin's own Profile Data by token
const getAdminProfile = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT t1.id AS emp_id, t1.employeeid, t1.name AS employee_name, t1.designation, t1.email, t1.mobile, t1.department_id, t1.grade_id, t1.status, t1.doj, t1.emp_type, t1.id_issued, t1.id_issued_date, CONCAT ("http://localhost:7060/uploads/employee/", t2.aadhar_back_doc) aadhar_back_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.aadhar_front_doc) aadhar_front_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.aadhar_no) aadhar_no, t2.alt_mobile_no,t2.blood_group, CONCAT ("http://localhost:7060/uploads/employee/", t2.board_doc) board_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.certificate_doc) certificate_doc, t2.current_address, t2.current_city, t2.current_country, t2.current_district, t2.current_pincode, t2.current_state, CONCAT ("http://localhost:7060/uploads/employee/", t2.degree_doc) degree_doc, t2.dob, t2.emp_id, t2.esi_no, t2.father_name, t2.gender, t2.id AS profile_id, CONCAT ("http://localhost:7060/uploads/employee/", t2.intermediate_doc) intermediate_doc, t2.mother_name, CONCAT ("http://localhost:7060/uploads/employee/", t2.pan_doc) pan_doc, t2.pan_no, CONCAT ("http://localhost:7060/uploads/employee/", t2.passport_photo) passport_photo, t2.permanent_address, t2.permanent_city, t2.permanent_country, t2.permanent_district, t2.permanent_pincode, t2.permanent_state, t2.pf_no, CONCAT ("http://localhost:7060/uploads/employee/", t2.pg_degree_doc) pg_degree_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.profile_img) profile_img, t2.religion, CONCAT ("http://localhost:7060/uploads/employee/", t2.resume_doc) resume_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.voter_doc) voter_doc,t2.spouse_name, t3.id AS bank_id, t3.account_number, t3.address, t3.doc AS bank_doc, t3.emp_id, t3.ifsc_code, t3.name AS employee_name, t4.id AS grade_id, t4.grade, t4.status FROM employee  t1 JOIN emp_profile_info t2 ON t1.id = t2.emp_id JOIN bank_info t3 ON t1.id = t3.emp_id JOIN grade_master t4 ON t1.grade_id = t4.id WHERE t1.email = ?', [email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


//--------------------FOR AUTHENTICATION SECTION OF ADMIN + PREJOINEE -----------------------------

//For getting Admin Login
const getAdminUserLogin = async (email, password) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, name, email, status, emp_type, otp, otp_timestamp as otptimestamp FROM employee WHERE email = ? AND password = ?', [email, password]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log('Error in getting User details ', error)
        return { connection: false, statusCode: 0, message: "Error in getting Users", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


// For Updating table with new OTP
const updateAdminUserOtp = async (otp, otp_time, email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('update employee SET otp = ?, otp_timestamp = ? WHERE email = ?', [otp, otp_time, email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select employee table', error)
        return { connection: false, statusCode: 0, message: "Error in Employee table", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//For Deleting OTP from DB after 5 min
const deleteOTPFromDB = async (email) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE employee SET otp = NULL, otp_timestamp = NULL WHERE email = ?', [email]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in deleting OTP", error);
        return { connection: false, statusCode: 0, message: "Error in deleting OTP", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


//For getting Admin Data
const getAdmin = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM employee WHERE email = ?', [email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//For updating password with new one on resetting password
const updatePassword = async (email, newPassword) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE employee SET password = ? WHERE email = ?', [newPassword, email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating with new password', error)
        return { connection: false, statusCode: 0, message: "Cannot reset password", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//--------------------------For Employee Section------------------------------

//For getting User's own Profile Data by token
const getEmployeeProfile = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT t1.id AS emp_id, t1.employeeid, t1.name AS employee_name, t1.designation, t1.email, t1.mobile, t1.department_id, t1.grade_id, t1.status, t1.doj, t1.emp_type, t1.id_issued, t1.id_issued_date, CONCAT ("http://localhost:7060/uploads/employee/", t2.aadhar_back_doc) aadhar_back_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.aadhar_front_doc) aadhar_front_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.aadhar_no) aadhar_no, t2.alt_mobile_no,t2.blood_group, CONCAT ("http://localhost:7060/uploads/employee/", t2.board_doc) board_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.certificate_doc) certificate_doc, t2.current_address, t2.current_city, t2.current_country, t2.current_district, t2.current_pincode, t2.current_state, CONCAT ("http://localhost:7060/uploads/employee/", t2.degree_doc) degree_doc, t2.dob, t2.emp_id, t2.esi_no, t2.father_name, t2.gender, t2.id AS profile_id, CONCAT ("http://localhost:7060/uploads/employee/", t2.intermediate_doc) intermediate_doc, t2.mother_name, CONCAT ("http://localhost:7060/uploads/employee/", t2.pan_doc) pan_doc, t2.pan_no, CONCAT ("http://localhost:7060/uploads/employee/", t2.passport_photo) passport_photo, t2.permanent_address, t2.permanent_city, t2.permanent_country, t2.permanent_district, t2.permanent_pincode, t2.permanent_state, t2.pf_no, CONCAT ("http://localhost:7060/uploads/employee/", t2.pg_degree_doc) pg_degree_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.profile_img) profile_img, t2.religion, CONCAT ("http://localhost:7060/uploads/employee/", t2.resume_doc) resume_doc, CONCAT ("http://localhost:7060/uploads/employee/", t2.voter_doc) voter_doc,t2.spouse_name, t3.id AS bank_id, t3.account_number, t3.address, t3.doc AS bank_doc, t3.emp_id, t3.ifsc_code, t3.name AS employee_name, t4.id AS grade_id, t4.grade, t4.status FROM employee  t1 JOIN emp_profile_info t2 ON t1.id = t2.emp_id JOIN bank_info t3 ON t1.id = t3.emp_id JOIN grade_master t4 ON t1.grade_id = t4.id WHERE t1.email = ?', [email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const checkEmpProfile = async (emailId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, email FROM employee WHERE email = ?', [emailId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching employee", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}



const checkEmpProfileInfo = async (empId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT emp_id FROM emp_profile_info WHERE emp_id = ?', [empId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching employee profile data', error)
        return { connection: false, statusCode: 0, message: "Error in fetching employee profile data", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

const updateProfileInfo = async (empId, father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE emp_profile_info SET father_name = ?, mother_name = ?, gender = ?, dob = ?, spouse_name = ?, blood_group = ?, pf_no = ?, esi_no = ?, current_city = ?, current_address = ?, current_district = ?, current_pincode = ?, current_state = ?, current_country = ?, permanent_city = ?, permanent_address = ?, permanent_district = ?, permanent_pincode = ?, permanent_state = ?, permanent_country = ?, aadhar_no = ?, pan_no = ?, alt_mobile_no = ?, religion = ? WHERE emp_id = ?', [father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion, empId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating employee profile', error)
        return { connection: false, statusCode: 0, message: "Error in updating employee profile", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const insertProfileInfo = async (empId, father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO emp_profile_info (emp_id, father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [empId, father_name, mother_name, gender, dob, spouse_name, blood_group, pf_no, esi_no, current_city, current_address, current_district, current_pincode, current_state, current_country, permanent_city, permanent_address, permanent_district, permanent_pincode, permanent_state, permanent_country, aadhar_no, pan_no, alt_mobile_no, religion]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in inserting employee profile', error)
        return { connection: false, statusCode: 0, message: "Error in inserting employee profile", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


//For uploading AADHAAR BACK
const uploadAahdaarBack = async (adhaarback, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET aadhar_back_doc = ? WHERE emp_id = ?', [adhaarback, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadAahdaarFront = async (adhaarback, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET aadhar_front_doc = ? WHERE emp_id = ?', [adhaarback, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadPanDoc = async (panCard, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET pan_doc = ? WHERE emp_id = ?', [panCard, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadVoterDoc = async (voterCard, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET voter_doc = ? WHERE emp_id = ?', [voterCard, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadResume = async (resumeCard, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET resume_doc = ? WHERE emp_id = ?', [resumeCard, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadBoardDoc = async (boardDoc, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET board_doc = ? WHERE emp_id = ?', [boardDoc, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadIntermediate = async (interDoc, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET intermediate_doc = ? WHERE emp_id = ?', [interDoc, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadDegree = async (degreeDoc, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET degree_doc = ? WHERE emp_id = ?', [degreeDoc, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadPGDegree = async (pgdegreeDoc, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET pg_degree_doc = ? WHERE emp_id = ?', [pgdegreeDoc, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}


const uploadCertificate = async (certificate, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET certificate_doc = ? WHERE emp_id = ?', [certificate, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}



const uploadPhoto = async (passportPhoto, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET passport_photo = ? WHERE emp_id = ?', [passportPhoto, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}



const uploadProfilePhoto = async (profilePhoto, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE emp_profile_info SET profile_img = ? WHERE emp_id = ?', [profilePhoto, employeeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            } catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

module.exports = { fetchProfileData, uploadCertificate, uploadProfilePhoto, uploadPhoto, uploadPGDegree, uploadDegree, uploadIntermediate, uploadBoardDoc, uploadPanDoc, uploadResume, uploadVoterDoc, uploadAahdaarFront, uploadAahdaarBack, insertProfileInfo, checkEmpProfile, updateProfileInfo, checkEmpProfileInfo, getEmployeeProfile, getAdminUserLogin, updateAdminUserOtp, getAdmin, deleteOTPFromDB, updatePassword, fetchAllAdminData, getAdminProfile, fetchAllAdminPreciseData, fetchAllEmployee, insertNewEmployee, insertPreJoineeInEmployee }