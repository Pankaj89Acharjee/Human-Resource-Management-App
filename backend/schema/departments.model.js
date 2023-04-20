const db = require('../utils/db');
require('dotenv').config();
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

//For creating a new department
const createNewDepartment = async (departmentName, designation, createdBy) => {
    var presentDate = moment().format('YYYY-MM-DD');
    var presentTime = moment().format('hh:mm:ss A');
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO department (name, designation, status, created_by, date, time) VALUES (?, ?, ?, ?, ?, ?)', [departmentName, designation, '0', createdBy, presentDate, presentTime]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in creation of new department", error);
        return { connection: false, statuscode: 0, message: "Error in creation of new department", error: error.message }
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

//For viewing all departments
const getAllDepartments = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM department WHERE id is not null');
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in fetching all departments", error);
        return { connection: false, statuscode: 0, message: "Error in fetching all departments", error: error.message }
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


// Listing for drop-down
const listAllDepartments = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, name, designation FROM department WHERE id is not null');
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in fetching all departments", error);
        return { connection: false, statuscode: 0, message: "Error in fetching all departments", error: error.message }
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
const checkDepartmentStatusById = async (id) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM department WHERE id = ?', [id]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in finding status of the department", error);
        return { connection: false, statuscode: 0, message: "Error in finding status of the department", error: error.message }
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


//For updating status of department to inactive
const updateDepartmentStatus = async (id) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE department SET status = 1 WHERE id = ?', [id]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error to update status of the department", error);
        return { connection: false, statuscode: 0, message: "Error to update status of the department", error: error.message }
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


module.exports = {createNewDepartment, listAllDepartments, getAllDepartments, checkDepartmentStatusById, updateDepartmentStatus}