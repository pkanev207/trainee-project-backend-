// import nodemailer from "nodemailer";
// import asyncHandler from "express-async-handler";

// export const mailHelper = asyncHandler(async (options) => {
//   console.log(
//     process.env.SMTP_HOST,
//     process.env.SMTP_PORT,
//     process.env.SMTP_USER,
//     process.env.SMTP_PASS
//   );
//   console.log(options);

//   const transporter = nodemailer.createTransport({
//     // service: "gmail",
//     host: "sandbox.smtp.mailtrap.io",
//     // host: "smtp.gmail.com",
//     // secure: false, // TLS requires secureConnection to be false
//     // secureConnection: false,
//     port: 2525,
//     auth: {
//       user: "62ec878cfe600d", // generate ethereal user
//       pass: "8319c5bbfaec2b", // generate ethereal password
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
