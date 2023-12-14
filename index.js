/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routerApi = require('./routes');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');

const app = express();
app.use(helmet());
const port = 8980;

app.use(express.json());

const whitelist = ['https://serviciosmonlog.ddns.net', 'http://localhost'];
const options = {
  origin: (origin, callback) => {
    console.log("ORIGIN: ", origin)
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido'));
    }
  }
}

app.use(cors(options));

require('./utils/auth');

routerApi(app);

//Middlewares -Se ejecutan en el orden que son llamados.
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Running on port ${port}`));
