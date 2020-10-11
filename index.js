const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const verification = require('./controllers/verification')
const messageWebhook = require('./controllers/messageWebhook')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Sunhacks 2020')
})

app.get('/webhook', verification)
app.post('/webhook', messageWebhook)

app.listen(8080, () => console.log('Webhook server is listening, port 8080'));
