var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
require('dotenv').config()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/sendEmail', (req,res)=>{
  const { name, email, phone, guest_number, diet } = req.body;
  console.log("hello");
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.gmailUser,
      pass: process.env.gmailPass
    }
  })

  let mailOptions = {
    from: '"B&L Burger"<kuomu.fan@gmail.com>',
    to: 'kuomu.fan@yahoo.com',
    subject: `Reservation Notice from ${email}`,
    text: `${name} is a ${diet} and he/she would like to reserve a take for ${guest_number} people`
  }

  transporter.sendMail(mailOptions, (error,info)=>{
    if (error){
      return console.log(error);
    }
    res.send('on no');
  })
  res.send({
    "success": true,
    "data": req.body, 
    "messages": "you dilivered the mail",
  })
})

module.exports = router;
