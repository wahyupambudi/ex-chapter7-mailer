// "use strict";
// require("dotenv").config();
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: process.env.MAIL_SMTP,
//     pass: process.env.PASS_SMTP,
//   },
// });

// console.log(process.env.MAIL_SMTP)
// console.log(process.env.PASS_SMTP)

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: process.env.MAIL_SMTP, // sender address
//     to: "wahyupambudi823@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log(info)

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   //
//   // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
//   //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
//   //       <https://github.com/forwardemail/preview-email>
//   //
// }

// main().catch(console.error);


require("dotenv").config();

const express = require("express");
const app = express();
const router = require("./routes/route");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.get("/", (req, res) => {
  res.send("This My Service REST API todolist!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
