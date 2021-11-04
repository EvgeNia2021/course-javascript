let self = null; 
let usersList = []; 
//let usersAvatars = new Map();
let webSocket = null; 

let messageFromServer = {}; 
 


const authFormDisplay = document.querySelector('#auth'); 
const authForm = document.forms.authForm; 
const authButton = authForm.authBtn;
const chatField = document.querySelector('#chatField');


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

const uploadAvatarBtn =  document.querySelector('#uploadAvatar');
const uploadAvatarField = document.querySelector('#uploadAvatarField');
const newAvatarFile = "";
const newAvatarSubmitBtn = document.querySelector('.new-avatar__form-submit');

uploadAvatarBtn.addEventListener('click', function(e){

  e.preventDefault();
  showField(uploadAvatarField);

 
});




///web socket

const WebSocketServer = new require('ws');
 
var clients = {};
let currentId = 1;
 
const webSocketServer = new WebSocketServer.Server({port: 8080});
 
webSocketServer.on('connection', function(ws) {
    const id = currentId++;
    clients[id] = ws;
    console.log("новое соединение " + id);
 
    ws.on('message', function(message) {
        console.log('получено сообщение ' + message);
        for(const key in clients) {
            clients[key].send(message.toString());
        }
    });
 
    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });
});
console.log("Сервер запущен на порту 8080");