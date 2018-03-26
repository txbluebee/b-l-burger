var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var csrf = require('csurf')
// setup route middlewares
var csrfProtection = csrf({ cookie: true })
var admin = require("firebase-admin");
var serviceAccount = require("./../my-projects-d97f2-firebase-adminsdk-4ne37-0c4df79890.json");
//firebase config
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-projects-d97f2.firebaseio.com"
});

var fireData = admin.database();

require('dotenv').config()

/* GET home page. */
router.get('/', csrfProtection, function (req, res, next) {
  res.render('index', { csrfToken: req.csrfToken() });
});

// GET register page
router.get('/register', (req,res)=>{
  res.render('register');
})


// GET login page
router.get('/login', (req,res)=>{
  res.render('login');
})

// send mail when submit reservation form 
router.post('/sendEmail', csrfProtection , (req, res) => {
  const { name, email, phone, guest_number, diet } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.gmailUser,
      pass: process.env.gmailPass
    }
  })

  let mailOptions = {
    from: '"B&L Burger"<kuomu.fan@gmail.com>',
    to: `kuomu.fan@yahoo.com, ${email}`,
    subject: `Reservation Notice from ${email}`,
    text: `${name} is a ${diet} and he/she would like to reserve a take for ${guest_number} people`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.send('on no');
  })
  // add reservation data to firebase
  const reserveRef = fireData.ref('reservations').push();
  reserveRef.set({ name, email, phone, guest_number, diet }).then(()=>{
    fireData.ref('reservations').once('value', (snapshot)=>{
      res.send({
        "success": true,
        "firebase-data": snapshot.val(), 
        "data": req.body,
        "messages": "you dilivered the mail and saved data to firebase",
      })
    })
  })






})

module.exports = router;
