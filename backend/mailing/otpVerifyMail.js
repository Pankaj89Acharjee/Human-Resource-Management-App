require('dotenv').config();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';
const otpVerificationEmail = (receiverEmail, emailSubject, emailContent, originalName) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        host:process.env.MAIL_HOST,
        secureConnection: false,
        tls: {
            rejectUnauthorized: false
        },
        port: 587,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    }));
    const mailContent = {
        from: `HR ${process.env.MAIL_FROM}`, 
        to: receiverEmail,
        subject: emailSubject,
        text: "OTP for login to HR Portal",
        html: '<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"> <div style="margin:50px auto;width:70%;padding:20px 0"> <div style="border-bottom:1px solid #eee"> <a href="" style="font-size:1.4em;color: #00466A;text-decoration:none;font-weight:600">HashCash Consultants Private Limited</a> </div><p style="font-size:1.1em text-transform:uppercase">Hi, '+originalName+' </p><p>OTP for Logging into HRMS Portal is valid for 5 minutes</p><h2 style="background: #05c4bc;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">'+ emailContent.OTP +'</h2> <hr style="border:none;border-top:1px solid #eee"/> <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"> <p>HashCash Consultants</p><p>2100 Geng Road, Palo Alto</p><p>California</p></div></div></div>',
    };
    transporter.sendMail(mailContent, function(error, info){
        if (error) {
            console.log('Error in sending verification mail ::', error);
            return error
        } else {
            //console.log('Verification Email sent: ' + JSON.stringify(info, null, 2));
            console.log('Verification Email sent: ', (info.accepted));
            return info
        }
    });
}
module.exports = otpVerificationEmail