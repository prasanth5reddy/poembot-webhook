const FACEBOOK_ACCESS_TOKEN = 'EAAKNnYZBef5QBAGwQLEQKdD3RJTPfwtorUDmyQC7Q6GqugQtmQRNE5ZAKXCoxEtNSZCXsEtGXQrXBGjuWzFzFwbhAEpclZAG8lfMXvb06HyiYGMNR6QnD6PsgVUh1EVZBkZBJ3KigfDOe7HZBqUELmc7eX1Ste3A9P08wPl53g6TQZDZD';

const dialogflow = require('dialogflow');
const axios = require('axios');
const uuid = require('uuid');

// A unique identifier for the given session
const sessionId = uuid.v4();

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath('poembot', sessionId);


async function getPoem() {
  const response = await axios.get('https://poembot.wl.r.appspot.com/poem');
  return response.data;
}

async function getDialogFlowResponse(senderId, request) {
  // Send request and log result
  let responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent.displayName == 'poem') {
    console.log(`  Intent: ${result.intent.displayName}`);
    // poem = await getPoem();
    getPoem().then(poem => {
      sendTextMessage(senderId, `${poem.text}`);
    })
    .catch(error => console.error());
  } else {
    console.log(`  Poem intent not matched. Sending fulfillmentText`);
    sendTextMessage(senderId, result.fulfillmentText);
  }
}

const sendTextMessage = (senderId, text) => {
  const body = {
    recipient: {
      id: senderId
    },
    message: { text }
  }
  axios.post(`https://graph.facebook.com/v8.0/me/messages?access_token=` + FACEBOOK_ACCESS_TOKEN, body)
  .then(function (response) {
    console.log(response.status);
  })
  .catch(function (error) {
    console.log(error);
  });
};

module.exports = (event) => {
  const senderId = event.sender.id;
  const message = event.message.text;
  // The text query request to be sent to dialogflow.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };
  getDialogFlowResponse(senderId, request)
};
