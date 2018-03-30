const express = require('express');
const router = express.Router();
const firebaseClient = require('./../services/firebase_client');

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
    req.session.uid = user.uid;
    res.redirect('/');
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
    res.redirect('/');
  })
  .catch(error=>{
    let errorMessage = error.message;
    req.flash('error', errorMessage);
    res.redirect('/auth/signin')
  })
})



module.exports = router;
