const express = require('express');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const app = express();
const router = express.Router();
router.use(express.json())
const cors = require("cors");
router.use(cors());
require('dotenv').config();
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';
const requireAdminLogin = require('../middleware/requireAdminLogin')
const Usermodel = require('../schema/user.model');
const LoanModel = require('../schema/loan.model');
// Storage using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
var upload = multer({ storage: storage, limits: {fileSize: 1024 * 1024} });
app.post('/upload-Loandocs', requireAdminLogin, upload.single('dataFile'), async(req, res, next) => {
    let empid = req.admin.empid;
    const file = req.file;
    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }
    var filenameList = req.files;
    var fileName1 = filenameList[0].filename;
    await LoanModel.uploadLoanDocuments(empid, fileName1);
    let info = {
        statuscode: 1,
        message: "loan Document  inserted successfully",
    }
    res.json(info);
    const dirPath = __basedir + "../public/uploads";
    fs.unlink(dirPath+fileName1, (err) => {
        if (err) throw err;
        console.log(categorypath+'old files was deleted');
    });
});
// POST
router.get('/profile', requireAdminLogin, async (req, res) => {
    let email = req.admin.email
    const userData1 = await Usermodel.getUser(email);
    var userData = userData1[0]
    var info = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emptype: userData.emptype,
        status: userData.status,
        empid: userData.empid,
    }
    res.json({ statuscode: 1, message: "Profile found", data: info })
})
router.get('/loan', requireAdminLogin, async (req, res) => {
    let empid = req.admin.empid;
    const userData = await LoanModel.getEmpLoan(empid);
    if (!userData[0]) {
        return res.json({ statuscode: 0, message: `No Loan details available`, data: null })
    }
    let output = [];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            id: userData[i].id,
            resourceId: userData[i].resource_id,
            amount: userData[i].amount,
            status: userData[i].status,
            reason: userData[i].reason,
            terms: userData[i].terms,
            appliedDate: userData[i].applied_date
        }
        output.push(info)
        if (userData.length === i + 1) {
            let infodata = {
                statuscode: 1,
                message: "Loan details found",
                count: output.length,
                data: output
            }
            res.json(infodata)
        }
    }
})
router.get('/appraisal', requireAdminLogin, async (req, res) => {
    let page = parseInt(req.query.page, 10) || 1
    const limit = 10;
    const offset = (page - 1) * limit;
    let empid = req.admin.empid;
    const userData = await Usermodel.getAppraisal(empid, limit, offset);
    if (!userData[0]) {
        return res.json({ statuscode: 0, message: `No appraisal details available`, data: null })
    }
    let output = [];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            slno: offset + i + 1,
            id: userData[i].id,
            amount: userData[i].amount,
            resource_id: userData[i].resource_id,
            tenture_year: userData[i].tenture_year,
            tenture_month: userData[i].tenture_month,
            man_id: userData[i].man_id,
            reviewDate: userData[i].review_date,
            status: userData[i].status,
        }
        output.push(info)
        // var x = userData.length === i+1;
        // console.log(x);
        if (userData.length === i + 1) {
            let infodata = {
                statuscode: 1,
                message: "appraisal details found",
                count: output.length,
                data: output
            }
            res.json(infodata)
        }
    }
})
router.post('/applyloan', requireAdminLogin, async (req, res) => {
    let empid = req.admin.empid;
    let { loanamount, reason } = req.body;
    if (!loanamount || !reason) {
        return res.status(400).json({ statuscode: 0, message: "Please provide all details" });
    }
    else if (loanamount.length == "" || loanamount.length == null || loanamount.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Loan amount Should  be valid amount" });
    } else if (reason.length == "" || reason.length == null || reason.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Please provide a valid reason for apply loan" });
    }
    if (loanamount || reason) {
        await LoanModel.InsertLoan(empid, loanamount, reason)
        let info = {
            statuscode: 1,
            message: "loan amount with reason updated successfully",
        }
        res.json(info);
    } else {
        return res.status(400).json({ statuscode: 0, message: "error in updated with loan amount and reason to apply" })
    }
})
router.post('/applyempnote', requireAdminLogin, async (req, res) => {
    let empid = req.admin.empid;
    let { empnote } = req.body;
    if (!empnote) {
        return res.status(400).json({ statuscode: 0, message: "Please input employee note" });
    }
    else if (empnote.length == "" || empnote.length == null || empnote.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Employee Note Should  be valid " });
    }
    if (empnote) {
        await Usermodel.InsertEmpnote(empid, empnote)
        let info = {
            statuscode: 1,
            message: "Employee note updated successfully",
        }
        res.json(info);
    } else {
        return res.status(400).json({ statuscode: 0, message: "error in updated with loan amount and reason to apply" })
    }
})
//nominee//
router.get('/nominee', requireAdminLogin, async (req, res) => {
    let page = parseInt(req.query.page, 10) || 1
    const limit = 10;
    const offset = (page - 1) * limit;
    const userData = await Usermodel.getNominee(limit, offset);
    if (!userData[0]) {
        return res.status(400).json({ statuscode: 0, message: `No Nominee details available`, data: null })
    }
    let output = [];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            id: userData[i].id,
            nomineeId: userData[i].nominee_id,
            nominiatedBy: userData[i].lnominiated_by,
            remark: userData[i].remark,
            status: userData[i].status,
            hrNote: userData[i].hr_note,
        }
        output.push(info);
        if (userData.length === i + 1) {
            let infodata = {
                statuscode: 1,
                message: "Nominee details found",
                count: output.length,
                data: output
            }
            res.json(infodata)
        }
    }
})
router.get('/reimbursement', requireAdminLogin, async (req, res) => {
    let page = parseInt(req.query.page, 10) || 1
    const limit = 10;
    const offset = (page - 1) * limit;
    let empid = req.admin.empid;
    const userData = await Usermodel.getReimbursement(empid, limit, offset);
    if (!userData[0]) {
        return res.json({ statuscode: 0, message: `No reimbursement details available`, data: null })
    }
    let output = [];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            id: userData[i].id,
            empNote: userData[i].emp_note,
            resource_id: userData[i].resource_id,
            submitDate: userData[i].submit_date,
            hr_status: userData[i].hr_status,
            acct_status: userData[i].acct_status,
        }
        output.push(info)
        // var x = userData.length === i+1;
        // console.log(x);
        if (userData.length === i + 1) {
            let infodata = {
                statuscode: 1,
                message: "reimbursement details found",
                count: output.length,
                data: output
            }
            res.json(infodata)
        }
    }
})
router.get('/getemployeeReferral', requireAdminLogin, async (req, res) => {
    let page = parseInt(req.query.page, 10) || 1
    const limit = 10;
    const offset = (page - 1) * limit;
    let empid = req.admin.empid;
    const userData = await Usermodel.getEmployeReferal(empid, limit, offset);
    if (!userData[0]) {
        return res.json({ statuscode: 0, message: `No employee refral details available`, data: null })
    }
    let output = [];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            id: userData[i].id,
            resource_id: userData[i].resource_id,
            refered_by: userData[i].refered_by,
            refered_by_date: userData[i].refered_by_date,
            email: userData[i].email,
            resume: userData[i].resume,
            refer_name: userData[i].refer_name,
        }
        output.push(info)
        // var x = userData.length === i+1;
        // console.log(x);
        if (userData.length === i + 1) {
            let infodata = {
                statuscode: 1,
                message: "employee referral details found",
                count: output.length,
                data: output
            }
            res.json(infodata)
        }
    }
})
router.post('/insertEmprefrral', requireAdminLogin, async (req, res) => {
    let empid = req.admin.empid;
    let { email } = req.body;
    let { name } = req.body;
    let { phone } = req.body;
    if (!name || !phone || !email) {
        return res.status(400).json({ statuscode: 0, message: "Please fill all inputs" });
    }
    else if (name.length == "" || name.length == null || name.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Please type your name" });
    }
    else if (email.length == "" || email.length == null || email.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Employee Note Should  be valid " });
    }
    else if (phone.length == "" || phone.length == null || phone.length == undefined) {
        return res.status(400).json({ statuscode: 0, message: "Please type the phone number" });
    }
    if (name, email, phone) {
        await Usermodel.InsertEmprefrral(empid, name, email, phone)
        let info = {
            statuscode: 1,
            message: "Employee Referral updated successfully",
        }
        res.json(info);
    } else {
        return res.status(400).json({ statuscode: 0, message: "error in updated with employee Referral details " })
    }
})
router.get('/', requireAdminLogin, (req, res) => {
    res.json({ error: "Invalid API" })
})
module.exports = router;