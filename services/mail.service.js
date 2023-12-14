const nodemailer = require('nodemailer');

const { config } = require('../config/config');
const { createHtml } = require('../utils/helpers/mail.helper');

class MailService {
  constructor() {
  }

  formatInfo(service) {
    console.log("HORA SERVICIO: ", service.horaServicio)
    let html = createHtml(service);
    return {
      from: '"Sistema de logistica Monlog" <servicios@monlog.com.mx>',
      to: service.emails,
      subject: "Registro de servicio",
      text: "",
      html
    }
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: config.mail.host,
      secure: true,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.pwd
      }
    });
    await transporter.sendMail(infoMail);
    return { message: 'correos enviados' };
  }
}

module.exports = MailService;
