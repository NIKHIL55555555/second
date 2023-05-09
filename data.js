/**
* @swagger
* components:
*   schema:
*     SensorData:
*       type: object
*       properties:
*         ultradata:
*           type: string
*         motiondata:
*           type: string
*         date:
*           type: string
* 
* @swagger
* /sensor-data/SensorData:
*  get:
*      title:
*      summary:
*      description:
*      responses:
*          200:
*              description:
*              content:
*                  application/json:
*                      schema:
*                          type: array
*                          items:
*                              $ref: '#/components/schema/SensorData'
*/

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://nkverma1314:ASDFGhjkl@cluster0.odqpocw.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const Mqttdata = require('./models/device');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = 5003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Active Sense",
      version: "0.1.0",
    },
    servers: [
      {
        url: "https://sdata.onrender.com",
      },
    ],
  },
  apis: ["./*.js"],
};

const specs = swaggerjsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

const brokerUrl = 'mqtt://localhost:1883';
const topic = 'sensordata'
const topic1 = 'sensordata1'
const topic2 = 'heartrate'
const topic3 = 'bpm'
const topic4 = 'dateandtime'

const client = mqtt.connect(brokerUrl);

// app.get('/sensor-data/SensorData', (req, res) => {
//   Mqttdata.find()
//     .then((data1) => {
//       res.send(data1);
//     })
// });

app.get('/sensor-data/SensorData', async (req, res) => {
  try {
    const data1 = await Mqttdata.find();
    res.send(data1);
  } catch (error) {
    // Handle any errors that occur during the data retrieval
    res.status(500).send('An error occurred while retrieving the sensor data.');
  }
});


client.on('connect', function () {
  console.log('Connected to MQTT broker');

  client.subscribe(topic, function (err) {
    if (err) {
      console.error('Failed to subscribe to topic', err);
    } else {
      console.log('Subscribed to topic', topic);
    }
  });

  client.subscribe(topic1, function (err) {
    if (err) {
      console.error('Failed to subscribe to topic', err);
    } else {
      console.log('Subscribed to topic2', topic1);
    }
  });

  client.subscribe(topic2, function (err) {
    if (err) {
      console.error('Failed to subscribe to topic', err);
    } else {
      console.log('Subscribed to topic3', topic2);
    }
  });

  client.subscribe(topic3, function (err) {
    if (err) {
      console.error('Failed to subscribe to topic', err);
    } else {
      console.log('Subscribed to topic4', topic3);
    }
  });

  client.subscribe(topic4, function (err) {
    if (err) {
      console.error('Failed to subscribe to topic', err);
    } else {
      console.log('Subscribed to topic5', topic4);
    }
  });
});

a = 0;
b = 0;
c = 0;
d = 0;
e = 0;

client.on('message', function (topic, message) {

  if (topic == "sensordata") {
    a = message;
  }
  else if (topic == "sensordata1") {
    b = message;
  }
  else if (topic == "heartrate") {
    c = message;
  }
  else if (topic == "bpm") {
    d = message;
  }
  else if (topic == "dateandtime") {
    e = message;
  }

  if (a && b && c && d && e) {
    const NewDevice = new Mqttdata({
      room_temp: a,
      body_temp: b,
      heartrate: c,
      bpm: d,
      dateandtime: e
    })
    NewDevice.save()
  }
}
);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});