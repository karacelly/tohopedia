// eslint-disable-next-line import/no-anonymous-default-export
export default function (req, res) {
  require("dotenv").config();

  let nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "testingbysy@gmail.com",
      pass: process.env.password,
    },
    secure: true,
  });

  const mailData = {
    from: "testingbysy@gmail.com",
    to: req.body.email,
    subject: `[Tohopedia by SY] ${req.body.subject}`,
    text: `${req.body.message}`,
    html: `${req.body.message}`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });

  console.log(req.body);
  res.send("success");
}
