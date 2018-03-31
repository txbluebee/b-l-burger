const express = require('express');
const router = express.Router();
const firebaseClient = require('./../services/firebase_client');
require('dotenv').config;
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// GET signup page
router.get('/signup', (req,res)=>{
  res.render('signup', {
    errorMessage: req.flash('error')
  });
})

// GET signin page
router.get('/signin', (req,res)=>{
  res.render('signin', {
    errorMessage: req.flash('error')
  });
})

// user sign up
router.post('/signup', (req,res)=>{
  const { email, password } = req.body;
  firebaseClient.auth().createUserWithEmailAndPassword(email, password)
  .then(user=>{
    res.redirect('/auth/signin');
  })
  .catch(error=>{
    let errorMessage = error.message;
    req.flash('error', errorMessage);
    res.redirect('/auth/signup')
  })
})

// user sign in

router.post('/signin',(req,res)=>{
  const {email, password} = req.body;
  firebaseClient.auth().signInWithEmailAndPassword(email, password)
  .then(user=>{
    req.session.uid = user.uid;
    if (req.session.uid === process.env.ADMIN_UID){
      res.redirect('/dashboard')
    } else {
      res.redirect('/menu');
    }
  })
  .catch(error=>{
    let errorMessage = error.message;
    req.flash('error', errorMessage);
    res.redirect('/auth/signin')
  })
})



module.exports = router;
