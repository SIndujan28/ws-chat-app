const webSocket=require('ws')
const wss=new webSocket.Server({port:8080})

// wss.on('connection',(ws,req) => {
//     ws.on('message',message => {
//         console.log(`recieved message => ${message}`)
//         console.log(typeof(JSON.parse(message)))
//         let mes=JSON.parse(message)
//         if(mes.event=="stat") {
//             const id=setInterval(()=>{
//                 ws.send(JSON.stringify(process.memoryUsage()))
//                 console.log(process.memoryUsage())
//             },100)
//         }
//     })
//     ws.send('ho!')
// })
// wss.on('close',() => {
//     console.log('Disconnected')
//     clearInterval(id)
// })

wss.on('open',(ws) => {
    ws.send('Welcome to the hell\'s doom')
})
wss.on('connection',(ws,req) => {
    var id;
    ws.send('connection established')
    ws.on('message',msg => {
        console.log(`recieved message => ${msg}`)
        let message=JSON.parse(msg) //msg must be in ['event',dataObject] format
        if(!!message[0] && typeof(message[0])=="string") {
            switch(message[0]) {
                case 'memoryUsage' : id=setInterval(() => { ws.send(JSON.stringify(process.memoryUsage()));console.log("$$")},100);break;
                case 'sendAll' : wss.clients.forEach(client => {if(client.readyState === webSocket.OPEN) { client.send(JSON.stringify(message[1]));console.log(message[1])}});break;
                case 'broadcast' :wss.clients.forEach(client => { if(client !== ws && client.readyState === webSocket.OPEN) {client.send(message[1])}});break;
                default : ws.send(JSON.stringify('Specify proper message format'))
                }
        }  else {
                ws.send(JSON.stringify("invalid msg type"))
           }
    })
})
wss.on('error',(e) => { console.log("$$$$$$$$$$"+e)})
wss.on('close',() => {
    console.log('Client disconected')
    clearInterval(id)
})