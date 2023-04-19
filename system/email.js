var mailTransporter = require('nodemailer').createTransport(global.config.email.url);
const skipMail=global.config.email.skip;//if true mail body will be consoled

mailTransporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Mail server is ready to take our messages");
    }
});

exports.sendEmail=(to,subject,html,attachments)=>{
    if(skipMail) return html;
    return mailTransporter.sendMail({
        from: `${global.config.email.from_name} <${global.config.email.auth.user}>`,
        to: to, 
        subject: subject,
        html: html,
        attachments: (attachments && attachments.length) ? attachments : []
    })
}
