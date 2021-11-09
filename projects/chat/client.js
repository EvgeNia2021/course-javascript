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
const avatarBlockUsername = document.querySelector('#avatarBlockUsername');
const savePhotoBtn = document.querySelector('#saveBtn');

const dragArea = document.querySelector('#dragArea');



const proxyUsers = new Proxy({ users: [] }, {
    set(target, prop, value) {
        target[prop] = value;
        numberOfMembers.textContent = target.users.length
        userList.innerHTML = target.users.reduce((prev, user) => {
            return prev + `<div class="chat-list-container" data-id="${user.id}"><div class="user-photo-container"> <img src="${user.photo}" class="user-photo-chat" id="theImage" data-role="user-photo" data-id="${user.id}"></div><div> ${user.name} <span>${user.lastMessage?user.lastMessage:""}</span>  </div></div>`
        }, "")
        return true
    }
});


// const date = new Date();
// const hours = String(date.getHours()).padStart(2, 0);
// const minutes = String(date.getMinutes()).padStart(2, 0);
// const time = `${hours}:${minutes}`;


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
                const photo = reader.result;
                theImage.src = photo;


                ws.send(JSON.stringify({
                    action: 'user:photo',
                    data: {
                        photo
                    }
                }))
            }
        }
    }

});

// dragArea.addEventListener('dragover', (e) => {
//     if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
//         e.preventDefault();
//     }
// });

// dragArea.addEventListener('drop', (e) => {
//     const dragFile = e.dataTransfer.items[0].getAsFile();
//     const dragReader = new FileReader();
//     e.preventDefault();
//     if (dragFile) {
//         if (dragFile.size > 500 * 1024) {
//             alert('Слишком большой файл');
//         }
//         if (dragFile.type !== 'image/jpeg' && dragFile.type !== 'image/png') {

//             alert('Можно загружать только JPEG и PNG-файлы');
//         }
//         else {


//             dragReader.readAsDataURL(dragFile);
//             dragReader.onload = () => {
//                 theImage.src = dragReader.result;

//             }
//         }
//     }




// });
// savePhotoBtn.addEventListener('click', () => {

//     const imageSrc = theImage.src;
//     ws.send(JSON.stringify({
//         action: 'user:photo',
//         data: {
//             user: {
//                 text: imageSrc

//             }
//         }
//     }))
//     console.log(imageSrc);
// })





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
        avatarBlockUsername.textContent = `${user.name}`

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
        proxyUsers.users = proxyUsers.users.map(user => {
            if (user.id == message.user.id) {
                user.lastMessage = message.text
            }
            return user
        })

        const template = `
        <div class="chat-message-container"><div class="user-photo-container"><img src="${message.user.photo}" class="user-photo-chat" id="theImage" data-role="user-photo" data-id="${message.user.id}"></div><div class="message" data-id="${message.user.id}">
        <b>${message.user.name}</b> ${message.text}     ${message.time}
        </div></div>
     `

        container.innerHTML += template
        container.scrollTop = container.scrollHeight
    },

    'user:list': function ({ users, messages }) {
        proxyUsers.users = [...users]
        messages.forEach(message => actions['message:add']({message}))


    },
    'user:photo': function ({ photo, userId }) {
        proxyUsers.users.forEach(user => {
            if (user.id == userId) {
                user.photo = photo
            }
        })
        const allAvatars = document.querySelectorAll(`[data-role=user-photo][data-id="${userId}"]`)
        allAvatars.forEach(img => img.src = photo)

        console.log(photo, userId)

    }

}



ws.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data)

    actions[action](data)
})




