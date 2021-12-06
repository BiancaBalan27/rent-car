const express = require('express');
const serverStatic = require('serve-static')
const history = require('connect-history-api-fallback')
const enforce = require('express-sslify')

const app = express()

app.listen(process.env.PORT || 5000)