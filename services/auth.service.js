const boom = require('@hapi/boom');
const Sequelize = require('sequelize');
const sequelize = require('../libs/sqlserver');
const sha256 = require('js-sha256');
const jwt = require("jsonwebtoken");

const { config } = require('../config/config');

class AuthService {

  constructor() {
  }

  async validateUser(username, password) {
    const user = await sequelize.query('web_ValidaUsuario :username',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { username }
      });
    if (user.length === 0) {
      throw boom.unauthorized();
    }
    const hashedPassword = sha256.sha256.hmac(config.shaKey, password);
    if (user[0].password !== hashedPassword) {
      throw boom.unauthorized();
    }
    return {
      usuario: user[0].usuario,
      grupo: user[0].grupo,
      nombre: user[0].nombre
    }
  }

  async getUser(username) {
    const user = await sequelize.query('EXEC web_UsuarioConsultar :username',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { username }
      }
    );
    return user
  }

  signToken(user) {
    const payload = {
      sub: user.usuario,
      scope: user.grupo
    }
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '24h' });
    return {
      user,
      token,
      refreshToken
    }
  }

  refreshToken(token) {
    let payload = jwt.verify(token, config.jwtRefreshSecret, (err, decoded) => {
      if (err) {
        throw boom.unauthorized()
      }
      return decoded
    })
    let signature = this.signToken({ usuario: payload.sub, grupo: payload.scope });
    return signature
  }

}

module.exports = AuthService;
