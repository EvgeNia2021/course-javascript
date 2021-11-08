import './index.html';
import './main.css';
import './client';






const authFormDisplay = document.querySelector('#auth');
const authForm = document.forms.authForm;
const authButton = authForm.authBtn;
const chatField = document.querySelector('#chatField');
const closeBtn = document.querySelector('#closeBtn')

function start() {
  showField(authFormDisplay);
}

authButton.addEventListener('click', event => {
  const nicknameInput = authForm.nickName;

  event.preventDefault();


  if (nicknameInput.value.length === 0) {

    alert("Поле ввода пустое");



  } else {
    authButton.setAttribute('disabled', 'disabled');
    //self = new User(authForm.nickName.value);
    //users.push(self);
    //workServer(); 
    showField(chatField);
    hideField(authFormDisplay);
    //usersAvatars.push(user);
  }
});

function showField(field) {
  if (field.classList.contains('hidden')) {
    field.classList.remove('hidden');
    if (!field.classList.contains('show')) {
      field.classList.add('show');
    }
  }
}

function hideField(field) {
  if (!field.classList.contains('hidden')) {
    field.classList.add('hidden');
    if (field.classList.contains('show')) {
      field.classList.remove('show');
    }
  }
}

const uploadAvatarBtn = document.querySelector('#uploadAvatar');
const uploadAvatarField = document.querySelector('#uploadAvatarField');
const newAvatarFile = "";
const newAvatarSubmitBtn = document.querySelector('.new-avatar__form-submit');
const messageTime = 



uploadAvatarBtn.addEventListener('click', (e) => {
  const avatarBlock = document.querySelector(".avatar-block");
  e.preventDefault();

  if (avatarBlock.classList.contains("hidden")) {
    showField(uploadAvatarField);
  } else {
    hideField(uploadAvatarField);
  }



});


closeBtn.addEventListener('click', (e) => {
  const avatarBlock = document.querySelector(".avatar-block");
  e.preventDefault();

  if (avatarBlock.classList.contains("hidden")) {
    showField(uploadAvatarField);
  } else {
    hideField(uploadAvatarField);
  }



});



