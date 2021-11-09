const { Server } = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new Server({ port: 8000 })

const messageArr = []


const actions = {
    'user:connect': function ({ user }) {
        user.id = uuidv4()
        this.user = user
        // console.log(Array.from(wss.clients).map(ws => ws.user))
        this.send(JSON.stringify({
            action: 'user:list',
            data: {
                users: Array.from(wss.clients).map(ws => ws.user).filter(client => {

                    if (client) return client.id != user.id

                    return false
                }),
                
            }
        }))

        broadcast({
            action: 'user:connect',
            data: {
                user
            }
        })
    },

    'user:leave': function () {
        broadcast({
            action: 'user:leave',
            data: {
                user: this.user
            }
        })
    },
    'message:add': function ({ message }) {
        
        messageArr.push(message)
        

        broadcast({
            action: 'message:add',
            data: {
                message: {
                    text: message.text,
                    user: this.user
                },
                
            }
        })
    },
    'user:photo': function ({ imageSrc }) {
        console.log(imageSrc)
        broadcast({
            action: 'user:photo',
            data: {
                imageSrc,
                 user: this.user
            }
        })
    }
}



wss.on('connection', (ws) => {

    // console.log('connect')
    ws.on('message', (message) => {
        const { action, data } = JSON.parse(message)

        actions[action].call(ws, data)

    })

    ws.on('close', actions['user:leave'])



})

function broadcast(data) {
    wss.clients.forEach(ws => ws.send(JSON.stringify(data)))
}

