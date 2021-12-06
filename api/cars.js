var express = require('express');
var router = express.Router();
var db = require('./database')
var jwt = require('./node_modules/jsonwebtoken')
const bcrypt = require('./node_modules/bcrypt');
var faker = require('./node_modules/faker');

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

router.get('/cars', async (req, res) => {
  let cars = [];
  const response = await db.collection('cars').get();
  response.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    let car = {};
    car.id = doc.id;
    car.vehicle = doc.data().vehicle;
    car.status = doc.data().status;
    car.fuel = doc.data().fuel;
    car.color = doc.data().color;
    car.price = doc.data().price;
    car.returnDate = doc.data().returnDate;
    cars.push(car);
  });

  res.json(cars);

})

router.get('/cars/:id', async (req, res) => {
  const response = await db.collection("cars").doc(req.params.id).get();
  let car = {};
  car.id = req.params.id;
  car.vehicle = response.data().vehicle;
  car.status = response.data().status;
  car.fuel = response.data().fuel;
  car.color = response.data().color;
  car.price = response.data().price;
  if (response.data().returnDate !== undefined) {
    car.returnDate = response.data().returnDate;
  }
  res.json(car)
})

router.post('/cars', checkAuthorization, async (req, res) => {
  console.log('Vrei sa adaugi o masina.');
  let product = req.body;
  const insert = await db.collection('cars').add(product);
  res.json({ "id": insert.id });
})

router.put('/cars/:id', checkAuthorization, async (req, res) => {
  console.log('Vrei sa actualizezi masina cu id-ul: ' + req.params.id);

  const response = await db.collection("cars").doc(req.params.id).update(req.body);

  res.json({ 'message': 'Am modificat masina cu id-ul ' + req.body.id + ' de pe server!' });
})

router.put('/car/:id', async (req, res) => {
  console.log('Vrei sa actualizezi masina cu id-ul: ' + req.params.id);

  const response = await db.collection("cars").doc(req.params.id).update(req.body);

  res.json({ 'message': 'Am modificat masina cu id-ul ' + req.body.id + ' de pe server!' });
})

router.delete('/cars/:id', checkAuthorization, (req, res) => {
  console.log('Vrei sa stergi masina cu id-ul: ' + req.params.id);
  let id = req.params.id
  const product = db.collection('cars').doc(id).delete()
  res.json({ 'message': 'Am sters masina cu id ul' + req.params.id + ' de pe server!' });
})

router.post('/generateRandomCars', async (req, res) => {
  let cars = [];
  for (let i = 0; i < 10; i++) {
    let obj = {
      vehicle: faker.vehicle.vehicle(),
      fuel: faker.vehicle.fuel(),
      color: faker.vehicle.color(),
      status: true,
      price: ((faker.datatype.number()) / 100).toFixed(2)
    }
    const res = await db.collection('cars').add(obj);
    cars.push(obj);
    console.log('Added document with ID: ', res.id);
  }
  res.json(cars)

})

module.exports = router;