const db = require('../utils/db');
require('dotenv').config();
const BASE_URL = process.env.BASE_URL;

//For getting user Login
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
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

//Fetching basic data from prejoiner table
const fetchPrejoineeById = async (id) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * from prejoining_emp where id = ? AND status = ?', [id, "1"]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in fetching prejoinee", error);
        return { connection: false, statusCode: 0, message: "Error in fetching prejoinee", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

//For inserting new Pre-Joinee
const addNewPrejoinee = async (userName, password, email, status) => {
    var conn = null;
    try {
        conn = await db.connection();
        var checkDB = `SELECT * FROM prejoining_emp WHERE email = ?`
        const executeQuery = await conn.execute(checkDB, [email])
        let executionResult = executeQuery[0]
        if (email == executionResult[0]?.email) {
            conn.release();
            console.log("User already exists");
            return ({ statusCode: 2, message: "User already exists" })
        } else {
            //Status 1 for Approved, Status 0 for Awaiting, Status 2 for Active
            if (status == 1) {
                const resp = await conn.query('INSERT INTO prejoining_emp (user_name, password, email, status) VALUES (?, ?, ?, ?)',
                    [userName, password, email, status]);
                conn.release();
                return resp[0];
            } else {
                const resp = await conn.query('INSERT INTO prejoining_emp (user_name, password, email, status) VALUES (?, ?, ?, ?)',
                    [userName, password, email, "0"]);
                conn.release();
                return resp[0];
            }
        }
    } catch (error) {
        console.log("Error in inserting new prejoinee", error);
        return { connection: false, statusCode: 0, message: "Error in inserting new prejoinee", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


//For fetching all pre-joinee 
const getAllPrejoinee = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * from prejoining_emp where id is not null');
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in fetching all prejoinees", error);
        return { connection: false, statusCode: 0, message: "Error in fetching all prejoinees", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


//For getting prejoinee Data
const getPreJoineeData = async (email) => {
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
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

//For inserting data by Prejoinee himself
const insertPreJoineeData = async (prejoineeId, ref_name1, designation1, company1, phone1, email1, ref_name2, designation2, company2, phone2, email2) => {
    var conn = null
    try {
        conn = await db.connection();
        var checkDB = `SELECT * FROM prejoining_emp_profile_info WHERE prejoining_emp_id = ?`
        const executeQuery = await conn.execute(checkDB, [prejoineeId])
        let executionResult = executeQuery[0]
        if (prejoineeId == executionResult[0]?.prejoining_emp_id) {
            conn.release();
            console.log("User already exists");
            return ({ statusCode: 2, message: "User Already exists" })
        } else {
            const resp = await conn.query('INSERT INTO prejoining_emp_profile_info (prejoining_emp_id, ref_name1, designation1, company1, phone1, email1, ref_name2, designation2, company2, phone2, email2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [prejoineeId, ref_name1, designation1, company1, phone1, email1, ref_name2, designation2, company2, phone2, email2]);
            conn.release();
            return resp[0]
        }
    }
    catch (error) {
        console.log('Error in inserting data', error)
        return { connection: false, statusCode: 0, message: "Error in inserting data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


//For uploading AADHAAR BACK
const uploadAahdaarBack = async (adhaarback, prejoineeId) => {   
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET aadhar_back_doc = ? WHERE prejoining_emp_id = ?', [adhaarback, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statusCode: 0, message: "Error in updating", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadAahdaarfront = async (adhaarfront, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET aadhar_front_doc = ? WHERE prejoining_emp_id = ?', [adhaarfront, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

const uploadPanCard = async (pancard, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET pan_doc = ? WHERE prejoining_emp_id = ?', [pancard, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

const uploadVoterCard = async (votercard, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET voter_doc = ? WHERE prejoining_emp_id = ?', [votercard, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

const uploadResume = async (votercard, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET resume_doc = ? WHERE prejoining_emp_id = ?', [votercard, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

const uploadBoardDoc = async (boarddoc, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET board_doc = ? WHERE prejoining_emp_id = ?', [boarddoc, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadIntermediateDoc = async (intermediatedoc, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET intermediate_doc = ? WHERE prejoining_emp_id = ?', [intermediatedoc, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

const uploadDegreeDoc = async (degreedoc, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET degree_doc = ? WHERE prejoining_emp_id = ?', [degreedoc, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadPGDegreeDoc = async (pgdegreedoc, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET pg_degree_doc = ? WHERE prejoining_emp_id = ?', [pgdegreedoc, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadCertificateDoc = async (certificatedoc, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET certificate_doc = ? WHERE prejoining_emp_id = ?', [certificatedoc, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadPassportPhoto = async (passportphoto, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET passport_photo = ? WHERE prejoining_emp_id = ?', [passportphoto, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadPayslip = async (payslip1, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET payslip1 = ? WHERE prejoining_emp_id = ?', [payslip1, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadPayslip2 = async (payslip2, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET payslip2 = ? WHERE prejoining_emp_id = ?', [payslip2, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

const uploadPayslip3 = async (payslip3, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET payslip3 = ? WHERE prejoining_emp_id = ?', [payslip3, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadBankStatement = async (bankdoc, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET bank_statement = ? WHERE prejoining_emp_id = ?', [bankdoc, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


const uploadReleaseLetter = async (releasedoc, prejoineeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE prejoining_emp_profile_info SET release_letter = ? WHERE prejoining_emp_id = ?', [releasedoc, prejoineeId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


//For getting Prejoiner's own Profile Data by token
const getPreJoineeProfile = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query(`SELECT t1.*, t2.*, CONCAT ("${BASE_URL}uploads/employee/", t2.aadhar_back_doc) aadhar_back_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.aadhar_front_doc) aadhar_front_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.board_doc) board_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.certificate_doc) certificate_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.degree_doc) degree_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.intermediate_doc) intermediate_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.pan_doc) pan_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.passport_photo) passport_photo, CONCAT ("${BASE_URL}uploads/employee/", t2.pg_degree_doc) pg_degree_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.profile_img) profile_img, CONCAT ("${BASE_URL}uploads/employee/", t2.resume_doc) resume_doc, CONCAT ("${BASE_URL}uploads/employee/", t2.voter_doc) voter_doc, t3.* FROM employee t1 JOIN emp_profile_info t2 ON t1.prejoining_emp_id = t2.emp_id JOIN bank_info t3 ON t1.prejoining_emp_id = t3.emp_id WHERE t1.email = ?`, [email]);
       
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
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
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}

//For fetching pre-joinee by Id
const getPrejoineeById = async (id) => {
    var conn = null;
    try {
        conn = await db.connection();

        const resp = await conn.query(`SELECT t1.*, t2.* FROM prejoining_emp t1 JOIN prejoining_emp_profile_info t2 ON t1.id = t2.prejoining_emp_id WHERE t1.id = ${id}`);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in fetching all data of prejoinee", error);
        return { connection: false, statusCode: 0, message: "Error in fetching all data of prejoinee", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


//Check status of a prejoinee for approval
const checkPreJoineeStatusById = async (id) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM prejoining_emp WHERE id = ?', [id]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in finding status of the prejoinee", error);
        return { connection: false, statusCode: 0, message: "Error in finding status of the prejoinee", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


//For updating status of prejoinee for approval. Status = 1 for approval
const updatePrejoineeStatus = async (id) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE prejoining_emp SET status = 1 WHERE id = ?', [id]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error to update status of the prejoinee", error);
        return { connection: false, statusCode: 0, message: "Error to update status of the prejoinee", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}


//For updating status of prejoinee for approval. Status = 1 for approval
const rejectPrejoineeStatus = async (id) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE prejoining_emp SET status = 2 WHERE id = ?', [id]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error to update status of the prejoinee", error);
        return { connection: false, statusCode: 0, message: "Error to update status of the prejoinee", error: error.message }
    } finally {
        try {
            if (conn !== null) {
                conn.destroy();
            }
        } catch (err) {
            console.log("Error in closing DB Connection", err);
        }
    }
}













module.exports = { getPreJoineeProfile, rejectPrejoineeStatus, updatePrejoineeStatus, checkPreJoineeStatusById, getPrejoineeById, getAllPrejoinee, addNewPrejoinee, fetchPrejoineeById, getPreJoineeData, insertPreJoineeData, uploadResume, uploadIntermediateDoc, uploadBoardDoc, uploadDegreeDoc, uploadCertificateDoc, uploadAahdaarBack, uploadAahdaarfront, uploadPanCard, uploadVoterCard, uploadReleaseLetter, uploadBankStatement, uploadPayslip2, uploadPayslip3, uploadPayslip, uploadPassportPhoto, uploadPGDegreeDoc, getAdminUserLogin, updateAdminUserOtp }