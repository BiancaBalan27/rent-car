const express = require('express');
var cors = require('cors')
var faker = require('faker')
var jwt = require('jsonwebtoken')
var morgan = require('morgan');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const port = 3000;

var db = require('./database')
const saltRounds = 12;

var carsRouter = require('./cars');
app.use('/', carsRouter);

function checkAuthorization(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, 'secret', (err, decoded) => {
      if (err) {
        if (err.expiredAt) {
          res.json({ "message": "Your token expired!" });
        } else {
          res.json({ "message": "Decoding error!" });
        }
      } else {
        console.log(decoded.email);
        next();
      }
    })
  } else {
    res.json({ "message": "Missing token!" })
  }
}

app.get("/", (req, res) => {
  res.send("")
})

app.get('/users', async (req, res) => {
  let users = [];
  const response = await db.collection('users').get();
  response.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    let user = {};
    user.id = doc.id;
    user.email = doc.data().email;
    user.password = doc.data().password;
    user.lastName = doc.data().lastName;
    user.firstName = doc.data().firstName;
    user.isAdmin = doc.data().isAdmin;
    users.push(user);
  });
  res.json(users);
})

app.get('/users/:id', async (req, res) => {
  const response = await db.collection("users").doc(req.params.id).get();
  let user = {};
  user.id = req.params.id;
  user.email = response.data().email;
  user.lastName = response.data().lastName;
  user.firstName = response.data().firstName;
  res.json(user)
})

app.post('/user', async (req, res) => {
  let data = req.body;
  let emailExist = false;

  const userRef = db.collection('users');
  const snapshot = await userRef.where('email', '==', data.email).get();
  if (!snapshot.empty) {
    emailExist = true;
  };

  if (emailExist) {
    res.send('User already registered.')
  }
  else {
    bcrypt.hash(data.password, saltRounds).then(async function (hash) {
      data.password = hash;
      const user = await db.collection('users').add(data);
      console.log(`You've just register with id ${user.id}`);
      res.send('Succesfull registration');
    });
  }
});

app.post('/login', async (req, res) => {
  let data = req.body;

  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', data.email).get();

  if (snapshot.empty) {
    let response = {};
    response.message = "No such email address.";
    res.json(response);
  } else {
    snapshot.forEach(doc => {
      bcrypt.compare(data.password, doc.data().password).then(async function (result) {
        if (result) {
          let token = jwt.sign({
            email: doc.data().email
          }, 'secret', { expiresIn: 60 * 60 });

          let response = {};
          response.token = token;
          response.message = 'You have the right to access private resources'
          response.admin = doc.data().isAdmin;
          response.id = doc.id;
          res.json(response);
        }
        else {
          let response = {};
          response.message = "Password missmatch";
          res.json(response)
        }
      });
    });
  }

})

app.get('/adminCodes', async (req, res) => {
  const response = await db.collection("adminCodes").get();
  let code = {
    id: "",
    firstCode: "",
    secondCode: "",
    thirdCode: ""
  }
  response.forEach(doc => {
    code.id = doc.id;
    code.firstCode = doc.data().firstCode;
    code.secondCode = doc.data().secondCode;
    code.thirdCode = doc.data().thirdCode;
  })
  res.json(code)
})

app.put('/adminCodes/:id', checkAuthorization,  async (req, res) => {
  const response = await db.collection("adminCodes").doc(req.params.id).update(req.body);
  res.json({ 'message': 'Am modificat codul de pe server!' })
})

app.post('/reservations', async (req, res) => {
  let rez = req.body;
  const reservations = await db.collection('reservations').add(rez);
  res.send("Succesful")
})

app.get('/reservations', async (req, res) => {
  let reservations = [];
  const response = await db.collection('reservations').get();
  response.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    let reservation = {};
    reservation.id = doc.id;
    reservation.carId = doc.data().carId;
    reservation.vehicle = doc.data().vehicle;
    reservation.color = doc.data().color;
    reservation.fuel = doc.data().fuel;
    reservation.price = doc.data().price;
    reservation.dateFrom = doc.data().dateFrom;
    reservation.days = doc.data().days;
    reservation.returnDate = doc.data().returnDate;
    reservation.userId = doc.data().userId;
    reservation.email = doc.data().email;
    reservation.lastName = doc.data().lastName;
    reservation.firstName = doc.data().firstName;
    reservations.push(reservation);
  });
  res.json(reservations);
})

app.put('/reservations/:id', checkAuthorization, async (req, res) => {
  const response = await db.collection("reservations").doc(req.params.id).update(req.body);

  res.json({ 'message': 'Am modificat reservarea cu id-ul ' + req.body.id + ' de pe server!' });
})

app.delete('/reservations/:id', checkAuthorization, async (req, res) => {
  console.log('Vrei sa stergi rezervarea cu id-ul: ' + req.params.id);
  let id = req.params.id
  const product = db.collection('reservations').doc(id).delete()
  res.json({ 'message': 'Am sters rezervarea cu id ul' + req.params.id + ' de pe server!' });
})

app.listen(port, () => {
  console.log("Running app on port", port);
})

module.exports = app;
module.exports = db;