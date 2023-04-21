const db = require('../utils/db');
require('dotenv').config();
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';
const BASE_URL = process.env.BASE_URL;

//Creating new Asset by ADMIN
const createNewAsset = async (productName, specification, categoryId, total, instock, empId) => {
    var presentDate = moment().format('YYYY-MM-DD');
    var presentTime = moment().format('hh:mm:ss A');
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO asset (name, specification, category_id, total, instock, created_by, date, time) VALUES (?, ?, ?, ?,?, ?, ?, ?)', [productName, specification, categoryId, total, instock, empId, presentDate, presentTime]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in insertion", error);
        return { connection: false, statuscode: 0, message: "Error in insertion", error: error.message }
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


//View all assets in asset from Asset Table
const viewAllAssets = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM asset WHERE id is not null');
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

//Update existing asset
const updateAsset = async (name, specification, total, instock, assetId, empId) => {
    var updationDate = moment().format('YYYY-MM-DD');
    var updationTime = moment().format('hh:mm:ss A');
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE asset SET name = ?, specification = ?, total = ?, instock = ?, created_by = ?, date = ?, time = ? WHERE id = ?', [name, specification, total, instock, empId, updationDate, updationTime, assetId]);
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

//Create new asset-category
const createNewAssetCat = async (assetName) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO asset_category (name, status) VALUES (?, ?)', [assetName, '1']);
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

//View all assets in asset-category
const viewAllAssetCat = async () => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, name FROM asset_category WHERE status = ?', [1]);
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


//For updating status of asset category by ADMIN
const updateAssetCat = async (productName, status, assetId) => {
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE asset_category SET name = ?, status = ? WHERE id = ?', [productName, status, assetId,]);
        conn.release();
        return resp[0];
    } catch (error) {
        console.log("Error in updating status", error);
        return { connection: false, statuscode: 0, message: "Error in updating status", error: error.message }
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


//Employee Asset Request List
const empAssetReqList = async () => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT t1.id, t1.emp_id, t2.name AS emp_name, t3.id AS asset_id, t3.name AS asset_name, t3.category_id, t4.name category_name, t1.issue_status, t3.specification FROM asset_request t1 JOIN employee t2 ON t1.emp_id = t2.id JOIN asset t3 ON t1.asset_id = t3.id JOIN asset_category t4 ON t4.id = t3.category_id');

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

//Employee Asset Request View
const empAssetReqView = async (empId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT t1.id, t1.emp_id, t1.asset_id, t5.name AS asset_name, t1.reason, t1.request_date, t1.request_time, t2.name AS emp_name, t2.designation, t3.name AS department_name, t1.issue_status, t1.issue_date, t4.grade FROM asset_request t1 JOIN employee t2 ON t1.emp_id = t2.id JOIN department t3 ON t2.department_id = t3.id JOIN grade_master t4 ON t2.grade_id = t4.id JOIN asset t5 ON t1.asset_id = t5.id WHERE t2.id = ?', [empId]);
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

//Employee Asset Request for DROP-DOWN
const empAssetReqDropDown = async (empId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT t1.id AS request_id, t1.asset_id, t1.issue_status AS accept_status, t2.name AS asset_name FROM asset_request t1 JOIN asset t2 ON t1.asset_id = t2.id');
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



//Accept Asset Request
const acceptAssetRequest = async (finalFileName, requestId, hrStatus) => {
    var issuingDate = moment().format('YYYY-MM-DD');
    var conn = null
    try {
        conn = await db.connection();
        var checkDB = `SELECT * FROM asset_request WHERE id = ?`
        const executeQuery = await conn.execute(checkDB, [requestId]);
        if (executeQuery[0][0].issue_status == 0 || executeQuery[0][0].issue_status == 2) {
            const resp = await conn.query('UPDATE asset_request SET hr_status = ?, request_form = ?, issue_status = ?, issue_date = ?  WHERE asset_request.id = ?', [hrStatus, finalFileName, 1, issuingDate, requestId]);
            conn.release();
            return resp[0]
        } else if (executeQuery[0[0].issue_status == null]) {
            return { connection: false, statuscode: 0, error: "Cannot issue asset with NULL value" }
        } else {
            return { connection: false, statuscode: 0, error: "Asset is already approved" }
        }
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statuscode: 0, message: "Error in updating", error: error.message }
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

//Asset Reject
const rejectAssetRequest = async (requestId, hrStatus) => {

    var issuingDate = moment().format('YYYY-MM-DD');
    var conn = null
    try {
        conn = await db.connection();
        var checkDB = `SELECT issue_status FROM asset_request WHERE id = ?`
        const executeQuery = await conn.execute(checkDB, [requestId])
        if (executeQuery[0][0].issue_status === 0) {
            const resp = await conn.query('UPDATE asset_request SET hr_status = ?, issue_status = ?, issue_date = ?  WHERE asset_request.id = ?', [hrStatus, 2, issuingDate, requestId]);
            conn.release();
            return resp[0]
        } else {
            return { connection: false, statuscode: 0, error: "Asset is in approve state, hence cann't reject" }
        }
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statuscode: 0, message: "Error in updating", error: error.message }
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



//Update InStock on Acceptance of asset. Instock = Instock - 1
const updateInstock = async (asset_id, newInstock, empId) => {
    var updationDate = moment().format('YYYY-MM-DD');
    var updationTime = moment().format('hh:mm:ss A');
    var conn = null;
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE asset SET instock = ?, created_by = ?, date = ?, time = ? WHERE id = ?', [newInstock, empId, updationDate, updationTime, asset_id]);
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

//Return Asset
const updateAssetStatus = async (requestId, hrStatus) => {
    var returningDate = moment().format('YYYY-MM-DD');
    var conn = null
    try {
        conn = await db.connection();
        var checkDB = `SELECT * FROM asset_request WHERE id = ?`
        const executeQuery = await conn.execute(checkDB, [requestId]);
        if (executeQuery[0][0].issue_status == 1) {
            const resp = await conn.query('UPDATE asset_request SET hr_status = ?, issue_status = ?, issue_date = ?  WHERE asset_request.id = ?', [hrStatus, 0, returningDate, requestId]);
            conn.release();
            return resp[0]
        } else {
            return { connection: false, statuscode: 0, error: "Cannot update returning status" }
        }
    }
    catch (error) {
        console.log('Error in updating', error)
        return { connection: false, statuscode: 0, message: "Error in updating", error: error.message }
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

//Fetching quantity and instock from Asset to be used as drop-down
const fetchAssetsQuantity = async (assetId) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT total, instock FROM asset WHERE id = ?', [assetId])
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching asset data ', error)
        return { connection: false, statuscode: 0, message: "Error in fetching asset data", error: error.message }
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

//Fetching IDs from Asset to be used as drop-down
const fetchAllAssets = async () => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT id, name FROM asset WHERE id is not null')
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching asset data ', error)
        return { connection: false, statuscode: 0, message: "Error in fetching asset data", error: error.message }
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

//Fetching IDs from Asset to be used as drop-down
const fetchAllIssuedAssets = async () => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query(`SELECT t1.id AS request_id, t1.asset_id, CONCAT("${BASE_URL}uploads/assets/", t1.request_form) request_form, t2.name AS asset_name, t2.specification FROM asset_request t1 JOIN asset t2 ON t1.asset_id = t2.id  WHERE t1.issue_status = ?`, [1])       
        return resp[0]
    }
    catch (error) {
        console.log('Error in fetching asset data ', error)
        return { connection: false, statuscode: 0, message: "Error in fetching asset data", error: error.message }
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


module.exports = { createNewAsset, fetchAllAssets, updateAssetStatus, fetchAllIssuedAssets, fetchAssetsQuantity, empAssetReqDropDown, acceptAssetRequest, rejectAssetRequest, updateInstock, empAssetReqView, empAssetReqList, viewAllAssets, updateAsset, createNewAssetCat, viewAllAssetCat, updateAssetCat }