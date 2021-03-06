const express = require('express'),
      app = express(),
      redirectToHTTPS = require('express-http-to-https').redirectToHTTPS,
      SerialPort = require('serialport'),
      port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200,
}, err => {
    if(err != null) {
        console.log(err)
        return
    }
})

app.use(express.static(__dirname))
app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
var stream
app.get('/data', (req,res) => {
    port.setMaxListeners(9000)
    port.on('data', data => {
        data = JSON.stringify(data)
        data = JSON.parse(data)
        stream = String.fromCharCode.apply(String, data.data).replace(/\0\r\n/g,'');
        stream = stream.split("?")
        console.log(data)
        if (stream.length > 3){
        stream = {
            "adc" : parseInt(stream[0]),
            "voltage" : parseFloat(stream[1]),
            "temp" : parseFloat(stream[2])
        }}
    })
    res.json(stream)
})

app.get('/', (req,res) => res.sendFile(__dirname + '/public/index.html'))

app.listen(3000, () => console.log("Listening to port 3000"))
