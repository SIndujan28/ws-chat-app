const webSocket=require('ws')
const wss=new webSocket.Server({port:8080})

wss.on('open',(ws) => {
    ws.send('Welcome to the hell\'s doom')
})
wss.on('close',() => {
    console.log('Client disconected')
})