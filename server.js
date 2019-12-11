const express = require('express'),
      app = express(),
      SerialPort = require('serialport'),
      port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600,
}, err => {
    if(err != null) {
        console.log(err)
        return
    }
})

app.use(express.static(__dirname))
var stream
app.get('/data', (req,res) => {
    port.on('data', data => {
        data = JSON.stringify(data)
        data = JSON.parse(data)
        stream = String.fromCharCode.apply(String, data.data).replace(/\0/g,'');
        stream = stream.split("?")
        // console.log(stream)
        stream = {
            "adc" : parseInt(stream[0]),
            "voltage" : parseFloat(stream[1]),
            "temp" : parseFloat(stream[2])
        }
    })
    res.json(stream)
})

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'))

app.listen(3000, () => console.log("Listening to port 3000"))
