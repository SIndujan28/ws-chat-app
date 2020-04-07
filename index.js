const webSocket=require('ws')
const winston=require('winston')
const logger=winston.createLogger({
    transports:[
        new (winston.transports.File)({filename:'loger.log'})
    ]
})
const wss=new webSocket.Server({port:8080})

wss.on('connection',(ws,req) => {
    logger.info(req.connection.remoteAddress)
    var id;
    ws.send('connection established')
    ws.on('message',msg => {
        console.log(`recieved message => ${msg}`)
        let message=JSON.parse(msg) //msg must be in ['event',dataObject] format
        if(!!message[0] && typeof(message[0])=="string") {
            switch(message[0]) {
                case 'memoryUsage' : id=setInterval(() => { ws.send(JSON.stringify(process.memoryUsage()));logger.info('memory usage sent')},100);break;
                case 'sendAll' : wss.clients.forEach(client => {if(client.readyState === webSocket.OPEN) { client.send(JSON.stringify(message[1]));logger.info(`recieved msg ${message[1]} sent to all`)}});break;
                case 'broadcast' :wss.clients.forEach(client => { if(client !== ws && client.readyState === webSocket.OPEN) {client.send(JSON.stringify(message[1]));logger.info(`recieved msg ${message[1]} sent to all excluding client`)}});break;
                default : ws.send(JSON.stringify('Specify proper message format'))
                }
        }  else {
                ws.send(JSON.stringify("invalid msg type"))
           }
    })
    ws.on('close',() => {
        logger.info(`client connection closed`)
        clearInterval(id)
    })
    ws.on('error',(e) => { 
        logger.error(`error occured ${e}`)
    })
})
