const express = require("express");
const passport = require("passport");

const AuthService = require('../services/auth.service');
const validatorHandler = require('../middlewares/validator.handler');
const { userSchema } = require('../schemas/user.schema');

const router = express();
const service = new AuthService();

router.post('/login',
  validatorHandler(userSchema, 'body'),
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const usuario = req.user;
      res.status(200).json(service.signToken(usuario));
    } catch (error) {
      next(error)
    }
  });

router.post('/refresh',
  async (req, res, next) => {
    try {
      let token = req.headers.authorization || "";
      token = token.split(" ")[1];
      const signature = service.refreshToken(token);
      res.status(200).json(signature);
    } catch (error) {
      next(error)
    }
  }
);

module.exports = router;
