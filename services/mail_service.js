var nunjucks=require('nunjucks');
var config=require('../config');
let mailTransporter = require('nodemailer').createTransport(config.email);
const skipMail=false;//if true mail body will be consoled

var sendEmail=exports.sendEmail=(to,subject,html,from=config.email.auth.user)=>{
    if(skipMail) return html;
    return mailTransporter.sendMail({
        from: from,
        to: to, 
        subject: subject,
        html: html
    })
}
exports.sendEmailConfirm=(to,url)=>{
    return new Promise((resolve,reject)=>{
        nunjucks.render('email/confirm.html',{url:url},(err,str)=>{
            if(err) reject(err);
            else resolve(sendEmail(to,'Account Verification',str))
        })
    })
}
exports.sendEmailForgot=(to,url)=>{
    return new Promise((resolve,reject)=>{
        nunjucks.render('email/forgot.html',{url:url},(err,str)=>{
            if(err) reject(err);
            else resolve(sendEmail(to,'Reset Password',str))
        })
    })
}