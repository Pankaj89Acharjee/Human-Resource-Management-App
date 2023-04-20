const db = require('../utils/db');

const getUserLogin = async (email, password) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, user_name as name, email, status, special_role as emptype, otp, otptimestamp FROM mast_user WHERE email = ? AND password = ?', [email, password]);
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
        const resp = await conn.query('SELECT id, user_name as name, email, status, special_role as emptype, resource_id as empid FROM mast_user WHERE email = ?', [email]);
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

const getLoan = async (id) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM loan_master WHERE resource_id = ?', [id]);
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

const getNominee = async (id) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM nominee');
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

const getAppraisal = async (id) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM apprisal_master WHERE resource_id = ?', [id]);
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

const getReimbursement = async (id) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM reaimbrsment WHERE resource_id = ?', [id]);
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

const insertamountandreason = async (empid, loanamount, reason) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT into loan_master SET  amount = ?, reason = ? , WHERE resource_id = ?', [loanamount, reason, empid]);
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

const updateUserOtp = async (otp, otp_time, email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('update mast_user SET otp = ?, otptimestamp = ? WHERE email = ?', [otp, otp_time, email]);
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


const updateUserPassword = async (email, password) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE mast_users SET password = ? WHERE email = ?', [password, email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select mast_users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}

module.exports = { getUser, getUserLogin, updateUserOtp, updateUserPassword, getLoan, insertamountandreason, getNominee, getAppraisal, getReimbursement }