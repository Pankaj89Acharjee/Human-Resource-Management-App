const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');

const requireAdminLogin = require('../middleware/requireAdminLogin');
const Usermodel = require('../schema/user.model');

require('dotenv').config();
router.use(express.json())
const cors = require("cors");
router.use(cors());

const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

router.post('/validate', async(req,res)=>{

})


router.get('/', requireAdminLogin, (req, res) => {
    res.json(req.user)
})

module.exports = router;