const nodemailer = require("nodemailer");
require('dotenv').config();

let sendSimpleEmail = async(dataSend) => {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
    });
    const info = await transporter.sendMail({
    from: '"Tat Thanh 👻" <tatthanhk50pt@gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
          html: getBodyHTMLEmail(dataSend), // html body
  });
}

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
}
let getBodyHTMLEmail = (dataSend) => {
  let result=''
  if (dataSend.language === 'vi') {
    result =
          `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <p>Nếu các thông tin là đúng sự thật vui lòng click đường link bên dưới để xác nhận hoàn tất thủ tục đặt lịch khám bệnh.</p>
            <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </div>
            <div>Xin chân thành cảm ơn!</div>
          `
  }
   if (dataSend.language === 'en') {
     result =
      `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>You received this email because you booked an online medical appointment on Booking Care</p>
            <p>Information for scheduling medical examination:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>

            <p>If the information is true, please click the link below to confirm completion of the medical examination appointment procedure.</p>
            <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </div>
            <div>Sincerely thank!</div>
          `
  }
  return result
}
let getBodyHTMLEmailRemedy = (dataSend) => {
   let result=''
  if (dataSend.language === 'vi') {
    result =
          `
            <h3>Xin chào ${dataSend.patientName} !</h3>
            <p>Kết quả khám bệnh</p>
            <div>Xin chân thành cảm ơn!</div>
          `
  }
   if (dataSend.language === 'en') {
     result =
      `
            <h3>Dear  ${dataSend.patientName}!</h3>
            <p>Result of medical examination appointment</p>
          
            <div>Sincerely thank!</div>
            
          `
  }
  return result
}
let sendAttachment = async(dataSend) => {
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
    });
      const info = await transporter.sendMail({
    from: '"Tat Thanh 👻" <tatthanhk50pt@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
         attachments: [
          {
            filename: `Remedy-${dataSend.patientId}=${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding:'base64' 
        }          
    ]// html body
  });
}
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment:sendAttachment
}

