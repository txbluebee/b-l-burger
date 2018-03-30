var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var csrf = require('csurf')
// setup route middlewares
var csrfProtection = csrf({ cookie: true })
var firebaseAdminDB = require('./../services/firebase_admin');


/* GET home page. */
router.get('/', csrfProtection, function (req, res, next) {
  res.render('index', { csrfToken: req.csrfToken() });
});

// GET menu page

router.get('/menu', (req, res)=>{
  firebaseAdminDB.ref('menuItems').once('value').then(snapshot=>{
    const menuItems = snapshot.val();
    res.render('menu', {
      menuItems
    });
  })
})

// send mail when submit reservation form 
router.post('/sendEmail', csrfProtection , (req, res) => {
  const { name, email, phone, guest_number, diet } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
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
  const reserveRef = firebaseAdminDB.ref('reservations').push();
  reserveRef.set({ name, email, phone, guest_number, diet }).then(()=>{
    firebaseAdminDB.ref('reservations').once('value', (snapshot)=>{
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
