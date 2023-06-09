const db = require('../utils/db');
require('dotenv').config();
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';
const BASE_URL = process.env.BASE_URL;


//--------------------FOR LOAN SECTION BY ADMIN-----------------------------------

//Loan list view
const applyForLoan = async (empId, amount, reason) => {
    var conn = null
    var presentDate = moment().format('YYYY-MM-DD');
    var presentTime = moment().format('hh:mm:ss A');
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO loans (emp_id, amount, reason, apply_date, apply_time) VALUES (?, ?, ?, ?, ?)', [empId, amount, reason, presentDate, presentTime]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in inserting data in loan table', error)
        return { connection: false, statusCode: 0, message: "Error in applying for a loan", error: error.message }
    } finally {
        conn.destroy();
    }
}


const viewLoansApplied = async (loanId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query(`SELECT t1.id AS loan_id, t1.emp_id, t2.name AS empname, t2.mobile, t2.department_id, t2.emp_type, t3.name AS dept_name, t3.designation, t1.amount AS loan_amount, t1.reason, CONCAT ("${BASE_URL}uploads/loans/", t1.evidence_doc) evidence_doc, CONCAT ("${BASE_URL}uploads/loans/", t1.loan_policy_doc) loan_policy_doc, t1.repayment_date, CONCAT ("${BASE_URL}uploads/loans/", t1.repayment_doc) repayment_doc, t1.hr_status, t1.hr_note, t1.hr_actiondate, t1.ac_status, t1.ac_actiondate, t1.md_status, t1.md_actiondate, t1.apply_date, t1.apply_time FROM loans t1 JOIN employee t2 ON t1.emp_id = t2.id JOIN department t3 ON t2.department_id = t3.id WHERE t1.id = ?`, [loanId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}


const viewLoansAppliedById = async (empId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query(`SELECT t1.id AS loan_id, t1.emp_id, t2.name AS empname, t2.mobile, t2.department_id, t2.emp_type, t3.name AS dept_name, t3.designation, t1.amount AS loan_amount, t1.reason, CONCAT ("${BASE_URL}uploads/loans/", t1.evidence_doc) evidence_doc, CONCAT ("${BASE_URL}uploads/loans/", t1.loan_policy_doc) loan_policy_doc, t1.repayment_date, CONCAT ("${BASE_URL}uploads/loans/", t1.repayment_doc) repayment_doc, t1.hr_status, t1.hr_note, t1.hr_actiondate, t1.ac_status, t1.ac_actiondate, t1.md_status, t1.md_actiondate, t1.apply_date, t1.apply_time FROM loans t1 JOIN employee t2 ON t1.emp_id = t2.id JOIN department t3 ON t2.department_id = t3.id WHERE t1.emp_id = ?`, [empId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}


//Loan list view
const listAppliedLoans = async () => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT t1.id AS loan_id, t1.emp_id,  t2.name AS empname, t1.amount AS loan_amount, t1.reason, t1.hr_status FROM loans t1 JOIN employee t2 ON t1.emp_id = t2.id');
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}


//Loan Data
const AppliedLoans = async (loanId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT hr_status FROM loans WHERE id = ?', [loanId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select loan_master table', error)
        return { connection: false, statusCode: 0, message: "Error in fetching user data", error: error.message }
    } finally {
        conn.destroy();
    }
}
//Approve loan
const approveLoanData = async (loanId, empid, hrNote) => {
    var approvingDate = moment().format('YYYY-MM-DD');
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE loans SET hr_status = ?, hr_note = ?, hr_empid = ?, hr_actiondate = ? WHERE id = ?', [1, hrNote, empid, approvingDate, loanId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating loan table', error)
        return { connection: false, statusCode: 0, message: "Error in updating loan table", error: error.message }
    } finally {
        conn.destroy();
    }
}


//Reject loan
const rejectLoanData = async (loanId, empid, hrNote) => {
    var approvingDate = moment().format('YYYY-MM-DD');
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE loans SET hr_status = ?, hr_note = ?, hr_empid = ?, hr_actiondate = ? WHERE id = ?', [2, hrNote, empid, approvingDate, loanId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in updating loan table', error)
        return { connection: false, statusCode: 0, message: "Error in updating loan table", error: error.message }
    } finally {
        conn.destroy();
    }
}


const checkEmpLoan = async (empId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT emp_id FROM loans WHERE emp_id = ?', [empId]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching employee loan data', error)
        return { connection: false, statusCode: 0, message: "Error in fetching employee loan data", error: error.message }
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


const uploadLoanEvidence = async (loanDoc, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE loans SET evidence_doc = ? WHERE emp_id = ?', [loanDoc, employeeId]);
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


const uploadLoanPolicy = async (policyDoc, employeeId) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE loans SET loan_policy_doc = ? WHERE emp_id = ?', [policyDoc, employeeId]);
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


const editLoanApplication = async (id, amount, reason) => {
    var conn = null
    try {
        conn = await db.connection(); //Change into UPDATE QUERY
        const resp = await conn.query('UPDATE loans SET amount = ?, reason = ?  WHERE emp_id = ?', [id, amount, reason]);
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

module.exports = { listAppliedLoans, editLoanApplication, uploadLoanPolicy, uploadLoanEvidence, checkEmpLoan, applyForLoan, viewLoansAppliedById, rejectLoanData, AppliedLoans, approveLoanData, viewLoansApplied }