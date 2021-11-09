const { Server } = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new Server({ port: 8000 })

const messageArr = []


function getTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    return time;
    }

    
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
                messages: messageArr.slice(0, 100)
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
        this.user.lastMessage = message
        const mess = {
            text: message.text,
            user: this.user,
            time: getTime()
        }
        messageArr.push(mess)


        broadcast({
            action: 'message:add',
            data: {
                message: mess
            }
        })
    },
    'user:photo': function ({ photo }) {
        this.user.photo = photo
        broadcast({
            action: 'user:photo',
            data: {
                photo,
                userId: this.user.id
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

