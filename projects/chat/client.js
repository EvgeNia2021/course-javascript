// import { WebSocketServer } from "ws"

const ws = new WebSocket('ws://localhost:8000')
const container = document.querySelector('#messageContainer')
const button = document.querySelector('#sendMsg')
const authButton = document.querySelector('#authBtn')
const numberOfMembers = document.querySelector('#numberOfMembers')
const userList = document.querySelector('#user-list')
const userPhotoInput = document.querySelector('#photoInput');
const theImage = document.querySelector(".upload-avatar-image");
const messageInput = document.querySelector('#messageInput');





const proxyUsers = new Proxy({ users: [] }, {
    set(target, prop, value) {
        target[prop] = value;
        numberOfMembers.textContent = target.users.length
        userList.innerHTML = target.users.reduce((prev, user) => {
            return prev + `<div class="chat-list-container" data-id="${user.id}"><div class="user-photo-container"> <img src="" class="user-photo-chat" id="theImage" data-role="user-photo" data-id="${user.id}"></div><div> ${user.name} </div></div>`
        }, "")
        return true
    }
});


// const date = new Date();
// const hours = String(date.getHours()).padStart(2, 0);
// const minutes = String(date.getMinutes()).padStart(2, 0);
// const time = `${hours}:${minutes}`;

var today = new Date();
var time = today.getHours() + ":" + today.getMinutes();



userPhotoInput.addEventListener('change', (e) => {
   
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
  
    if (file) {
        if (file.size > 500 * 1024) {
            alert('Слишком большой файл');
        }
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
  
            alert('Можно загружать только JPEG и PNG-файлы');
        }
        else {
            reader.readAsDataURL(file);
            reader.onload = () => {
                theImage.src = reader.result;
                console.log(reader.result)
            }
        }
    }
    const imageSrc = reader.result;

    
    ws.send(JSON.stringify({
        action: 'user:photo',
        data: {
            user: {
                imageSrc

            }
        }
    }))
  });
  



authButton.addEventListener('click', () => {
    const InputName = document.querySelector("#input__name");
    const name = InputName.value;




    ws.send(JSON.stringify({
        action: 'user:connect',
        data: {
            user: {
                name

            }
        }
    }))
})


button.addEventListener('click', () => {
    const InputMessage = document.querySelector("#messageInput");
    const message = InputMessage.value;
    InputMessage.value = "";




    ws.send(JSON.stringify({
        action: 'message:add',
        data: {
            message: {
                text: message
            }
        }
    }))
})

messageInput.addEventListener('keydown', event => {
    const InputMessage = document.querySelector("#messageInput");
    const message = InputMessage.value;
    
    if (event.keyCode === 13) {
        event.preventDefault();
        
           InputMessage.value = ""; 
            ws.send(JSON.stringify({
                action: 'message:add',
                data: {
                    message: {
                        text: message
                    }
                }
            }))
    
        
     
}

});


const actions = {
    'user:connect': function ({ user }) {
        const template = `
            <div class="message message_bot" data-id="${user.id}">
                Пользователь вошёл в чат: ${user.name}
            </div>
         `


        container.innerHTML += template

        proxyUsers.users = [...proxyUsers.users, user]
    },
    'user:leave': function ({ user }) {
        const template = `
        <div class="message message_bot" data-id="${user.id}">
            Пользователь покинул чат: ${user.name}
        </div>
     `

        const deleteUser = document.querySelector(`[data-id="${user.id}"]`)
        if (deleteUser) {
            userList.removeChild(deleteUser)
        }
        container.innerHTML += template

        proxyUsers.users = proxyUsers.users.filter(client => client.id != user.id)

    },
    'message:add': function ({ message }) {
        

        const template = `
        <div class="chat-message-container"><div class="user-photo-container"><img src="" class="user-photo-chat" id="theImage" data-role="user-photo" data-id="${message.user.id}"></div><div class="message" data-id="${message.user.id}">
        <b>${message.user.name}</b> ${message.text}     ${time}
        </div></div>
     `

        container.innerHTML += template
    },

    'user:list': function ({ users, userId, messageArr }) {
        proxyUsers.users = [...users]
       //container.forEach((n, i) => n.textContent = messageArr[i])
    //    messageArr.slice(0, 100).map((i) => {
      
    //   });


    },
    'user:photo': function ({ imageSrc }) {
        
        const allAvatars = document.querySelectorAll('[data-role=user-photo][data-id="${user.id}"]')
        allAvatars.src = imageSrc
        

    },

}



ws.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data)

    actions[action](data)
})




