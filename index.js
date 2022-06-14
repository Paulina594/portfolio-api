const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 8080;
app.use(express.json());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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



app.post('/send-mail', (req, res) => {
  const payload = req.body;
  const transport = createTransport();

  if (!payload.surname) {
    const message = createMessage(payload);
    transport.sendMail(message);
  }

  res.send({ success: true });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
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
    host: "localhost",
    port: 1025,
    secure: false, // upgrade later with STARTTLS
  });
  verifyEmailConnection(transport);
  return transport;
}

function verifyEmailConnection(transport) {
  // verify connection configuration
  transport.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
}