const db = require('../utils/db');
require('dotenv').config();
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

//Fetch Asset Stock
const fetchAllAssetStock = async () => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query(`SELECT t1.id, t1.asset_id, t2.category_id, t1.qty, t1.price, t1.total_value, t1.created_by AS emp_id, t2.name AS product_name, t2.total AS total_qty, t2.instock AS stock_available, (SELECT name FROM employee WHERE id = t1.created_by) as empname, (SELECT name FROM asset_category WHERE id = t2.category_id) as category_name
        FROM asset_stock t1 
        JOIN asset t2 ON t1.asset_id = t2.id`);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching data from Employee', error)
        return { connection: false, statuscode: 0, message: "Error in fetching user data", error: error.message }
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


//Create Asset Stock
const insertAssetStockById = async (assetId, empId, totalValue, qty, price) => {
    var updationDate = moment().format('YYYY-MM-DD');
    var updationTime = moment().format('hh:mm:ss A');
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO asset_stock (asset_id, qty, price, total_value, date, time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)', [assetId, qty, price, totalValue, updationDate, updationTime, empId]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in insertion", error);
        return { connection: false, statuscode: 0, message: "Error in insertion", error: error.message }
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


//Update existing asset
const updateAssetStock = async (assetId, totalQty, instock, empId) => {
    var updationDate = moment().format('YYYY-MM-DD');
    var updationTime = moment().format('hh:mm:ss A');
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE asset SET total = ?, instock = ?, created_by = ?, date = ?, time = ? WHERE id = ?', [totalQty, instock, empId, updationDate, updationTime, assetId]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in insertion", error);
        return { connection: false, statuscode: 0, message: "Error in insertion", error: error.message }
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



module.exports = {fetchAllAssetStock, insertAssetStockById, updateAssetStock}