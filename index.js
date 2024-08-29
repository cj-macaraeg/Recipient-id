const express = require('express');
const bodyParser = require('body-parser');

const app = express().use(bodyParser.json()); // Middleware to parse JSON bodies

const PAGE_ACCESS_TOKEN = 'EAAMmOfxrqWsBOwOnipGeNd4Jk5C01fpAoGihyoSUvPHra3kLz4sdUaMOUqNCbB5V9nWistEEHUJmZCNksyibltQNLRZA2KmTkUMU7MmAFnJpd2WNoBTXouuu2l88Pi4LqkcdLoGqU6sI80Xui2wAZCAQm6xZBZAI194PgJu7fbiBUXZBLPzzBGZBSyCDYNDUOWFlwZDZD'; // Replace with your actual token

// Your webhook endpoint
app.post('/webhook', (req, res) => {
  const body = req.body;

  // Check if this is an event from a page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Get the webhook event. There may be multiple events, but we'll just use the first one
      const webhook_event = entry.messaging[0];
      
      // Get the PSID of the sender
      const sender_psid = webhook_event.sender.id;
      console.log('Sender PSID:', sender_psid);
      
      // Now you have the PSID, you can send a message or save it to your database
      // Here you can handle the message, e.g., sending a response or saving the PSID
    });

    // Return a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "EAAMmOfxrqWsBOwOnipGeNd4Jk5C01fpAoGihyoSUvPHra3kLz4sdUaMOUqNCbB5V9nWistEEHUJmZCNksyibltQNLRZA2KmTkUMU7MmAFnJpd2WNoBTXouuu2l88Pi4LqkcdLoGqU6sI80Xui2wAZCAQm6xZBZAI194PgJu7fbiBUXZBLPzzBGZBSyCDYNDUOWFlwZDZD"; // Replace with your verify token

  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Listen for requests
app.listen(3000, () => console.log('Webhook is listening on port 3000'));
