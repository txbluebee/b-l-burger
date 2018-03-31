const express = require('express');
const router = express.Router();
const firebaseAdminDB = require('./../services/firebase_admin');
const categoriesRef = firebaseAdminDB.ref('food-categories');

// GET Dashboard index
router.get('/', (req, res)=>{
  res.render('dashboard/index');
})

// GET Dashboard Archives
router.get('/archives', (req, res)=>{
  res.render('dashboard/archives');
})

////////////////
///CATEGORIES///
////////////////


// GET categories Archives
router.get('/categories', (req, res)=>{
  categoriesRef.once('value').then(snapshot=>{
    const categories = snapshot.val();
    res.render('dashboard/categories',{
      categories
    });
  })
})

// POST CREATE CATEGORIES
router.post('/categories/create', (req, res)=>{
  const {name, path} = req.body;
  const categoryRef = categoriesRef.push();
  const id = categoryRef.key;
  categoryRef.set({id, name, path}).then(()=>{
    res.redirect('/dashboard/categories');
  })
})
// POST DELETE CATEGORIES
router.post('/categories/delete/:id', (req, res)=>{
  const id = req.param('id');
  console.log(id);
  categoriesRef.child(id).remove().then(()=>{
    res.redirect('/dashboard/categories');
  })
})

module.exports = router;