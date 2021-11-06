const ws = new WebSocket('ws://localhost:8000')
const container = document.querySelector('#messageContainer')
const button = document.querySelector('#sendMsg')
const authButton = document.querySelector('#sendMsg')

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
    'user:connect': function({ user }) {
        const template = `
            <div class="message message_bot" data-id="${user.id}">
                Connect user: ${user.name}
            </div>
         `

         container.innerHTML += template
    },
    'user:leave': function({ user }) {
        const template = `
        <div class="message message_bot" data-id="${user.id}">
            Disconnect user: ${user.name}
        </div>
     `

     container.innerHTML += template
    },
    'message:add': function({ message }) {
        
        const template = `
        <div class="message" data-id="${message.user.id}">
            user: ${message.user.name}<br>
            text: ${message.text}
        </div>
     `

     container.innerHTML += template
    }
}

ws.addEventListener('open', () => {
    console.log('open ws connection')
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

ws.addEventListener('message', (message) => {
   const { action, data} = JSON.parse(message.data)

   actions[action](data)
})