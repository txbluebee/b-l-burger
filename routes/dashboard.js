const express = require('express');
const router = express.Router();
const firebaseAdminDB = require('./../services/firebase_admin');
const categoriesRef = firebaseAdminDB.ref('food-categories');

const menuItemsRef = firebaseAdminDB.ref('menuItems')

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
  const messages = req.flash('info');
  console.log(messages);
  categoriesRef.once('value').then(snapshot=>{
    const categories = snapshot.val();
    res.render('dashboard/categories',{
      categories,
      messages,
      hasInfo: messages.length>0
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
    req.flash('info', 'category deleted')
    res.redirect('/dashboard/categories');
  })
})

////////////////////
////Menu_itmes//////
///////////////////

// GET TO NEW MENU ITEM FORM

router.get('/menu_items/new', (req, res)=>{
  categoriesRef.once('value').then((snapshot)=>{
    const categories = snapshot.val();
    res.render('dashboard/menu', {
      categories
    });
  })
})

// POST CREATE NEW MENU ITEM

router.post('/menu/create', (req, res)=>{
  const data = req.body;
  const menuItemRef = menuItemsRef.push();
  data.id = menuItemRef.key;
  menuItemRef.set(data).then(()=>{
    res.redirect('/menu');
  })
})





module.exports = router;