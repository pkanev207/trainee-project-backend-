// import nodemailer from "nodemailer";
// import asyncHandler from "express-async-handler";

// export const mailHelper = asyncHandler(async (options) => {
//   const transporter = nodemailer.createTransport({
//     // service: "gmail",
//     host: "sandbox.smtp.mailtrap.io",
//     // host: process.env.SMTP_HOST,
//     // secure: false, // TLS requires secureConnection to be false
//     // secureConnection: false,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USER, // generate ethereal user
//       pass: process.env.SMTP_PASS, // generate ethereal password
//     },
//     // tls: {
//     //   // ciphers: "SSLv3",
//     //   rejectUnauthorized: false,
//     // },
//     logger: true,
//     debug: true,
//   });

//   const mailOptions = {
//     from: "petarkamenovkanev@gmail.com", // sender address
//     to: options.email, // list of receivers
//     subject: options.subject, // Subject line
//     text: options.message, // plain text body
//     // html: "<h2>Hello mailer!</h2>",
//   };

//   // send mail with defined transport object
//   await transporter.sendMail(mailOptions);
// });
