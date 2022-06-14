const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const CORS = process.env.CORS || 'http://localhost:3000';
const PORT = process.env.PORT || 8080;
const MAIL_HOST = process.env.MAIL_HOST || 'localhost';
const MAIL_PORT = process.env.MAIL_PORT || 1025;
const MAIL_SECURE = process.env.MAIL_SECURE ?? false;
app.use(express.json());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', CORS);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.get('/verify-mail', (req, res) => {
  const transport = createTransport();
  verifyTransport(transport)
    .then((message) => res.send(message))
    .catch((error) => res.send(error));
});

app.post('/send-mail', (req, res) => {
  const payload = req.body;
  const transport = createTransport();

  if (!payload.surname) {
    const message = createMessage(payload);
    transport.sendMail(message);
  }

  res.send({ success: true });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

function createMessage(payload) {
  return {
    from: `${payload.email}`,
    to: "paulina.drozdz.me@gmail.com",
    subject: `Message from ${payload.fullName}`,
    html: (
      `Message send from www.paulinadrozdz.me via contact form:
      <p>${payload.body}</p>`)
  };
}

function createTransport() {
  const transport = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE, // upgrade later with STARTTLS
  });
  return transport;
}

function verifyEmailConnection(transport) {
  return new Promise((resolve, reject) => {
    // verify connection configuration
    transport.verify((error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve('Server is ready to take our messages');
      }
    });
  });
}
