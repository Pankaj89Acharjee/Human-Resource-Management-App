const express = require('express');
//const fetch = require('node-fetch');
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
const Appraisalmodel = require('../schema/appraisal.model');



router.get('/profile', requireAdminLogin, async (req, res) => {
    let email  = req.admin.email
    const userData1 =  await Usermodel.getUser(email);
    var userData = userData1[0]
    var info = {
        id          : userData.id,
        name        : userData.name,
        email       : userData.email,
        emptype     : userData.emptype,
        status      : userData.status,
        empid       : userData.empid,
    }
    res.json({statuscode:1, message:"Profile found", data:info})
})

router.get('/loan', requireAdminLogin, async (req, res) => {
    let empid = req.admin.empid;
    const userData = await LoanModel.getEmpLoan(empid);
    if(!userData[0]){
        return res.json({statuscode:0, message:`No Loan details available`, data: null})
    }

    let output = [];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            id          : userData[i].id,
            resourceId  : userData[i].resource_id,
            amount      : userData[i].amount,
            status      : userData[i].status,
            reason      : userData[i].reason,
            terms       : userData[i].terms,
            appliedDate : userData[i].applied_date

        }
        output.push(info)
        if(userData.length === i+1){
            let infodata = {
                statuscode:1,
                message:"Loan details found",
                count : output.length,
                data : output
            }
            res.json(infodata)
        }
    }

})

router.get('/appraisal',requireAdminLogin, async (req, res) => {
    let empid = req.admin.empid;
    const userData = await Appraisalmodel.getAppraisal(empid);
        if(!userData[0]){
        return res.json({statuscode:0, message:`No appraisal details available`,data :null})
    }
    let output =[];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            id                      :userData[i].id,
            amount                  :userData[i].amount,
            resource_id             :userData[i].resource_id,
            tenture_year            :userData[i].tenture_year,
            tenture_month           :userData[i].tenture_month,
            man_id                  :userData[i].man_id,
            reviewDate              :userData[i].review_date,
            status                  :userData[i].status,
        }
        output.push(info)
        // var x = userData.length === i+1;
        // console.log(x);
        if(userData.length === i+1){
            let infodata = {
                statuscode:1,
                message:"appraisal details found",
                count : output.length,
                data : output
            }
            res.json(infodata)
        }
    }
})
router.post('/applyloan',requireAdminLogin,async(req,res)=>{
    let empid = req.admin.empid;
    let{loanamount, reason} = req.body;
    if(!loanamount || !reason){
        return res.status(400).json({ statuscode: 0, message: "Please provide all details" });
    }
    else if(loanamount.length == "" || loanamount.length == null || loanamount.length ==undefined){
        return res.status(400).json({ statuscode: 0, message: "Loan amount Should  be valid amount" });
    }else if(reason.length == "" || reason.length == null || reason.length == undefined){
        return res.status(400).json({ statuscode: 0, message: "Please provide a valid reason for apply loan" });
    }
    if(loanamount || reason ){
        await LoanModel.InsertLoan(empid, loanamount, reason )
        let info = {
            statuscode: 1,
            message : "loan amount with reason updated successfully",
        }
        res.json(info);
    }else{
        return res.status(400).json({statuscode: 0, message: "error in updated with loan amount and reason to apply"})
    }
})

//nominee//
router.get('/nominee',requireAdminLogin, async (req, res) => {
    const userData = await Usermodel.getNominee();
    if(!userData[0]){
        return res.status(400).json({statuscode:0, message:`No Nominee details available`,data :null})
    }
    let output=[];
    for (let i = 0; i < userData.length; i++) {
        let info = {
            id                      :userData[i].id,
            nomineeId               :userData[i].nominee_id,
            nominiatedBy            :userData[i].lnominiated_by,
            remark                  :userData[i].remark,
            status                  :userData[i].status,
            hrNote                  :userData[i].hr_note,
            
        }
        output.push(info);
        if(userData.length === i+1){
            let infodata ={
                statuscode:1,
                message:"Nominee details found",
                count : output.length,
                data : output
            }
            res.json(infodata)
        }
        
    }

})


router.get('/reimbursement',requireAdminLogin, async (req, res) => {
    let empid = req.admin.empid;
    let emailid = req.admin.email;
    const userData1 = await Usermodel.getReimbursement(empid);
    var userData = userData1[0];
    console.log(userData)
    if(!userData){
        return res.status(400).json({statuscode:2, message:`No reimbursement details available for this emailId :${emailid}`})
    }
    var info = {
        id                      :userData.id,
        resource_id             :userData.resource_id,
        emp_note                :userData.emp_note,
        emp_reim_doc            :userData.emp_reim_doc,
        submit_date             :userData.submit_date,
        hr_status               :userData.hr_status,
        hr_note                 :userData.hr_note,
        md_status               :userData.md_status,
        md_note                 :userData.md_note,
        acct_note               :userData.acct_note,
        acct_status             :userData.acct_status,
    }
    res.json({statuscode:1, message:"reimbursement details found", data:info})

})

router.get('/', requireAdminLogin, (req, res) => {
    res.json({error:"Invalid API"})
})


module.exports = router;