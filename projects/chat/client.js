// import { WebSocketServer } from "ws"

const ws = new WebSocket('ws://localhost:8000')
const container = document.querySelector('#messageContainer')
const button = document.querySelector('#sendMsg')
const authButton = document.querySelector('#authBtn')
const numberOfMembers = document.querySelector('#numberOfMembers')
const userList = document.querySelector('#user-list');


const proxyUsers = new Proxy({ users: [] }, {
    set(target, prop, value) {
        target[prop] = value;
        numberOfMembers.textContent = target.users.length
        userList.innerHTML = target.users.reduce((prev, user) => {
            return prev + `<div data-id="${user.id}"> ${user.name} </div>`
        }, "")
        return true
    }
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
        <div class="message" data-id="${message.user.id}">
        <b>${message.user.name}:</b> ${message.text}
        </div>
     `

        container.innerHTML += template
    },

    'user:list': function ({ users, userId }) {
        proxyUsers.users = [...users]


    },

}

// ws.addEventListener('open', () => {
//     console.log('open ws connection')
// const InputName = document.querySelector("#input__name");
//     const name = InputName.value;

//     ws.send(JSON.stringify({
//         action: 'user:connect',
//         data: {
//             user: {
//                 name
//             }
//         }
//     }))
// })

ws.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data)

    actions[action](data)
})


// function emitUpdate(eventData, options = {}) {
//     if (options.excludeSocket) {
//       return socketServer.clients.forEach(socket => {
//         if (socket !== options.excludeSocket) socket.send(JSON.stringify(eventData));
//       });
//     }
//     if (options.targetSocket) {
//       return options.targetSocket.send(JSON.stringify(eventData));
//     }

//     return socketServer.clients.forEach(socket => socket.send(JSON.stringify(eventData)));
//   }
ws.onmessage = function (event) {

    var msg = JSON.parse(event.data);


    switch (msg.type) {

        case "userlist":
            var ul = "";
            for (i = 0; i < msg.users.length; i++) {
                ul += msg.users[i] + "<br>";
            }
            document.getElementById("user-list").innerHTML = ul;
            break;
    }

};
