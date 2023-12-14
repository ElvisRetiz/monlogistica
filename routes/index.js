const express = require('express');
const passport = require('passport');

const authRouter = require('./auth.router');
const requestRouter = require('./request.router');

function routerApi(app) {
  const router = express.Router();
  app.use("/api", router);
  router.use('/auth', authRouter);
  router.use('/solicitudes', passport.authenticate('jwt', { session: false }), requestRouter);
}

module.exports = routerApi;
