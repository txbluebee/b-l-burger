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

// GET TO NEW MENU ITEM 

router.get('/menu_items', (req, res)=>{
  let currentPage = req.query.page || 1;


  let categoryQuery = req.query.category || 'all';
  let categories = {};
  categoriesRef.once('value').then((snapshot)=>{
    categories = snapshot.val();
    return menuItemsRef.once('value');
  }).then((snapshot)=>{
    const menu_items = [];
    snapshot.forEach((snapshotChild)=>{
      if (categoryQuery === 'all'){
        menu_items.push(snapshotChild.val());
      } else if (categoryQuery === categories[snapshotChild.val().category].name){
        menu_items.push(snapshotChild.val());
      }
    })
    menu_items.reverse();
    // PAGINATION

    const totalItems = menu_items.length;
    const perpage = 6;
    const pageTotal = Math.ceil(totalItems/perpage);
    if (currentPage > pageTotal) currentPage = pageTotal;
    
    const minIndex = (currentPage*perpage)-perpage + 1;
    const maxIndex = currentPage*perpage;
    const data = [];
    menu_items.forEach((menu_item, index)=>{
      index++;
      if (minIndex <= index && index <= maxIndex){
        data.push(menu_item);
      }
    })
    const page = {
      pageTotal,
      currentPage,
      hasPre: currentPage > 1,
      hasNext: currentPage < pageTotal
    }
    // PAGINATION END
    res.render('dashboard/menu_items', {
      categories,
      menu_items: data,
      categoryQuery,
      page
    });
  })
})

// POST CREATE NEW MENU ITEM

router.post('/menu_items/new', (req, res)=>{
  const data = req.body;
  const menuItemRef = menuItemsRef.push();
  data.id = menuItemRef.key;
  menuItemRef.set(data).then(()=>{
    res.redirect('/dashboard/menu_items');
  })
})

// Delete Menu Item

router.post('/menu_items/delete/:id', (req, res)=>{
  const id = req.param('id');
  menuItemsRef.child(id).remove();
  req.flash('info', 'menu item deleted');
  res.end();
})


module.exports = router;