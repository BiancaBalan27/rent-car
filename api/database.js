const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

var serviceAccount = require("./Firebase_credentials/proiecttic-99f17-firebase-adminsdk-cgibv-e30f2e4508.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(); //this is the reference to the database

module.exports = db;