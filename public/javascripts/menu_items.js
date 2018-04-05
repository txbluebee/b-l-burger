// const delMenuItem = document.querySelector('.delMenuItem');

// delMenuItem.addEventListener('click', function(e){
//   e.preventDefault();
//   const { id, name } = this.dataset;
//   const url = `/dashboard//menu_items/delete/${id}`;
//   if (confirm(`Are you sure you want to delete ${name}?`)){
//     fetch(url)
//       .then(data => console.log(data))
//   }
// })  

$(document).ready(function(){
  $('.delMenuItem').on('click', function(e){
    e.preventDefault();
    const { id, name } = this.dataset;
    if (confirm(`Are you sure you want to delete ${name}?`)){
      $.ajax({
        url: `/dashboard//menu_items/delete/${id}`,
        method: 'POST'
      }).done(response =>{
        window.location = '/dashboard/menu_items/new';
      })
    }
  })
})