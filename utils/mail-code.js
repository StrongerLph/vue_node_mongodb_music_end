"use strict";
const nodemailer = require("nodemailer");

// 创建发送邮件的对象
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",//发送方邮箱 qq 通过lib/well-know/service.json
  port: 465, //端口号
  secure: true, // true for 465, false for other ports
  auth: {
    user: '752325363@qq.com', // 发送方的邮箱地址
    pass: 'tobckjvshkkebfae' //  smtp 验证码
  }
});

function sendEmailCode(email, code) {
  // 邮件信息
  let mailOption = {
    from: '"青灯不归客。" <752325363@qq.com>', // sender address
    to: email, // list of receivers
    subject: "音乐播放器邮箱验证码", // Subject line
    // text: ``, // plain text body
    html: `<h4>您的验证码为: <span> ${code} </span>(有效期5分钟。)</h4>` // html body
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOption, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    });
  })

}
module.exports = sendEmailCode