const db = require('../utils/db');
require('dotenv').config();
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

//View all Grade List from Grade Master
const fetchGradeList = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, grade FROM grade_master WHERE id is not null');
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in finding all the assets", error);
        return { connection: false, statuscode: 0, message: "Error in finding all the assets", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            }
            catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//Create New Grade
const createNewGrade = async (grade, status) => {    
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO grade_master (grade, status) VALUES (?, ?)', [grade, status]);;
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in finding all the assets", error);
        return { connection: false, statuscode: 0, message: "Error in finding all the assets", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            }
            catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

//View all Grade List from Grade Master
const updateGrade = async (grade, status, gradeId) => {   
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE grade_master grade = ?, status = ? WHERE id = ?', [grade, status, gradeId]);;
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in finding all the assets", error);
        return { connection: false, statuscode: 0, message: "Error in finding all the assets", error: error.message }
    } finally {
        if (conn !== null) {
            try {
                conn.destroy();
            }
            catch (err) {
                console.log("Error in closing DB Connection", err);
            }
        }
    }
}

module.exports = { fetchGradeList, createNewGrade, updateGrade }