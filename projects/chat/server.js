const { Server } = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new Server({ port: 8000 })

const actions = {
    'user:connect': function({ user }) {
        user.id = uuidv4()
        this.user = user

      broadcast({
           action: 'user:connect',
           data: {
                user
           }
       })
    },
    'user:leave': function() {
        broadcast({
            action: 'user:leave',
            data: {
                user: this.user
            }
        })
    },
    'message:add': function({ message }) {
        broadcast({
            action: 'message:add',
            data: {
               message: {
                   text: message.text,
                   user: this.user
               }
            }
        })
    }
}

wss.on('connection', (ws) => {
    console.log('connect')
    ws.on('message', (message) => {
        const { action, data} = JSON.parse(message)
        
       actions[action].call(ws, data)
    })

    ws.on('close', actions['user:leave'])
})

function broadcast(data) {
    wss.clients.forEach(ws => ws.send(JSON.stringify(data)))
}