const db = require('../utils/db');


//****************************** OTP UPDATE*****************
const deleteUserOtp = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE users SET otp = NULL WHERE email = ?', [email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}


//************PASSWORD RESET*******

const updateUserPassword = async (email, password) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE users SET password = ? WHERE email = ?', [password, email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}














const uploadLoanDocuments = async (empid, doc) =>{
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT into loans (emp_id, evidence_doc) VALUES (?, ?)',[empid, doc]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const getUserLogin = async (email, password) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id,  name, email, designation, mobile, grade_id, status, emp_type as emptype, otp, otp_timestamp FROM employee WHERE email = ? AND password = ?', [email, password]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_user table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}
const getUser = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id,  name, email, status, emp_type as emptype, resource_id as empid FROM employee WHERE email = ?', [email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_user table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const getNominee = async (limit, offset) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM nominee limit ? offset ? ',[limit, offset]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_user table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const getAppraisal = async (id, limit, offset) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM apprisal_master WHERE resource_id = ?  limit ? offset ? ', [id, limit, offset]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_user table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const getReimbursement = async (id, limit, offset) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM reaimbrsment WHERE resource_id = ?  limit ? offset ? ', [id, limit, offset]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_user table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const getEmployeReferal = async (id, limit, offset) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM employee_referal WHERE resource_id = ? limit ? offset ? ', [id, limit, offset]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_user table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const InsertEmprefrral = async (empid, name , email, phone) =>{
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT into employee_referal (resource_id, refer_name, email, mobile) VALUES (?, ?, ?, ?)',[empid, name , email, phone]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select employee_referal table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const InsertEmpnote = async (empid, empnote) =>{
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT into reaimbrsment (resource_id, emp_note) VALUES (?, ?)',[empid, empnote]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
// const insertamountandreason = async (empid, loanamount, reason) => {
//     var conn = null
//     try {
//         conn = await db.connection();
//         const resp = await conn.query('INSERT into loan_master SET  amount = ?, reason = ? , WHERE resource_id = ?', [ loanamount , reason, empid]);
//         conn.release();
//         return resp[0]
//     }
//     catch (error) {
//         console.log('Error in select users table', error)
//         return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
//     } finally {
//         conn.destroy();
//     }
// }
const updateUserOtp = async (otp, otp_time, email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('update employee SET otp = ?, otp_timestamp = ? WHERE email = ?', [otp, otp_time, email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_users table', error)
        return { connection: false, statuscode: 0, message: "Error in mast_users table", error: error.message }
    } finally {
        conn.destroy();
    }
}
// const updateUserPassword = async (email, password) => {
//     var conn = null
//     try {
//         conn = await db.connection();
//         const resp = await conn.query('UPDATE mast_users SET password = ? WHERE email = ?', [password, email]);
//         conn.release();
//         return resp[0]
//     }
//     catch (error) {
//         console.log('Error in select mast_users table', error)
//         return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
//     } finally {
//         conn.destroy();
//     }
// }
module.exports = { getUser, getUserLogin, updateUserOtp, updateUserPassword, getNominee, getReimbursement, getAppraisal, InsertEmpnote, getEmployeReferal ,InsertEmprefrral, uploadLoanDocuments}



//LOAN SECTION
const db = require('../utils/db');
const getEmpLoan = async (id) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM loan_master WHERE resource_id = ? ORDER BY id DESC', [id]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const getAdminLoan = async () => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM loan_master WHERE ORDER BY id DESC');
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const InsertLoan = async (empid, amount, reason) =>{
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT into loan_master (resource_id, amount, reason) VALUES (?, ?, ?)',[empid, amount, reason]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
const InsertUploadFile = async (empid, evidencedoc, loandoc, loanpolicydoc) =>{
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT into loan_master (resource_id, evedance_doc, loan_doc, loan_policy_doc) VALUES (?, ?, ?)',[empid, evidencedoc, loandoc, loanpolicydoc]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
module.exports = { getEmpLoan, getAdminLoan, InsertLoan, InsertUploadFile }