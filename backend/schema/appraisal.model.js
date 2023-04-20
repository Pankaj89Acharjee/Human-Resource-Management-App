const db = require('../utils/db');

const getAppraisal = async (id) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM apprisal_master WHERE resource_id = ? ORDER BY id DESC', [id]);
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

module.exports = {getAppraisal}