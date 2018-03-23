// dom

const userName = document.getElementById('name');
const userPhone = document.getElementById('phone');
const userEmail = document.getElementById('email');
const guestNumber = document.getElementById('guest_number')
const dietOption = document.querySelector('input[name="diet"]:checked');
const send = document.getElementById('send');
const reserveDone = document.querySelector('.reserve-complete');

function clearField(input) {
  input.value = "";
};


send.addEventListener('click',(e)=>{
  const name = userName.value;
  const phone = userPhone.value;
  const email = userEmail.value;
  const guest_number = guestNumber.value;
  const diet = dietOption.value;
  const reservation = {name, phone, email, guest_number, diet};
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/sendEmail');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(reservation));
  xhr.onload = () =>{
    const originData = JSON.parse(xhr.responseText);
    let str = '';
    str += `
      <h5 class="text-center  text-primary">Reserved Successfully!</h5>
        <hr>
      <ul class="reserve-info">
        <li>Your Name: <span>${name}</span></li>
        <li>Your phone: <span>${phone}</span></li>
        <li>Your Email: <span>${email}</span></li>
        <li>Member of Guest: <span>${guest_number}</span></li>
        <li>Diet Option: <span>${diet}</span></li>
        <button type="button" class="btn btn-primary">Back</button>
      </ul>`
      reserveDone.innerHTML = str;
      clearField(userName);
      clearField(userPhone);
      clearField(userEmail);
      clearField(guestNumber);
      clearField(dietOption);
  }

})