const Sequelize = require('sequelize');
const sequelize = require('../libs/sqlserver');
const dayjs = require('dayjs');

const { getServiceName, getReturnName } = require('../utils/helpers/request.helper');
const AuthService = require('./auth.service');
const authService = new AuthService();
const MailService = require('./mail.service');
const mailService = new MailService();

class RequestService {
  constructor() {
  }

  async getRequests(user, status, initDate, finalDate) {
    const requests = await sequelize.query('EXEC web_SolicitudesConsultar :user, :status, :initDate, :finalDate',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { user, status, initDate, finalDate }
      });
    return requests
  }

  async getRequest(service) {
    const request = await sequelize.query('EXEC web_SolicitudConsultar :service',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { service }
      }
    );
    return request[0]
  }

  async getCustomers(user) {
    const customers = await sequelize.query('EXEC web_ClientesConsultar :user',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { user }
      }
    );
    return customers
  }

  async getCustomer(customer) {
    const customers = await sequelize.query('EXEC web_ClienteConsultar :customer',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { customer }
      }
    );
    return customers
  }

  async getUnits(user) {
    const units = await sequelize.query('EXEC web_UnidadesConsultar :user',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { user }
      }
    );
    return units
  }

  async getUnit(unitCode) {
    const unit = await sequelize.query('EXEC web_UnidadConsultar :unitCode',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { unitCode }
      }
    );
    return unit
  }

  async getRoutes(customer) {
    const routes = await sequelize.query('EXEC web_RutasConsultar :customer',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { customer }
      }
    );
    return routes
  }

  async getRoute(routeCode) {
    const route = await sequelize.query('EXEC web_RutaConsultar :routeCode',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { routeCode }
      }
    );
    return route
  }

  async getRates(customer) {
    const routes = await sequelize.query('EXEC web_TarifasClienteConsultar :customer',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { customer }
      }
    );
    return routes
  }

  async getOptions(user) {
    let options = {
      clientes: [],
      tarifas: [],
      rutas: [],
      unidades: []
    }
    options.clientes = await this.getCustomers(user);
    options.tarifas = await sequelize.query('EXEC web_TarifasConsultar :user',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { user }
      }
    );
    options.unidades = await this.getUnits(user)
    return options
  }

  async insertRequest({ cliente, tipoTarifa, ruta, tipoUnidad, fechaServicio, horaServicio, comentarios, tipoServicio, tipoDevolucion }, usuario) {
    let requestInserted = sequelize.query('DECLARE @resultado varchar(100) EXEC web_SolicitudesInsertar 0, :cliente, :tipoTarifa, :ruta, :tipoUnidad, :fechaServicio, :horaServicio, :comentarios, :tipoServicio, :tipoDevolucion, :usuario, @resultado OUTPUT SELECT @resultado as servicio',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { cliente, tipoTarifa, ruta, tipoUnidad, fechaServicio, horaServicio, comentarios, tipoServicio, tipoDevolucion, usuario }
      }
    );
    return requestInserted
  }

  async getEmails(user, customer) {
    let emails = await sequelize.query('EXEC web_CorreosConsultar :user, :customer',
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { user, customer }
      }
    );
    return emails
  }

  async formatRequest(request, services, user) {
    let emails = await this.getEmails(user, request.cliente);
    let ruta = await this.getRoute(request.ruta);
    let tipoUnidad = await this.getUnit(request.tipoUnidad);
    let userName = await authService.getUser(user);
    let customer = await this.getCustomer(request.cliente);
    let requestToSend = {
      ...request,
      servicio: services.servicio,
      emails: Object.values(emails[0]),
      ruta: ruta[0].descripcion,
      tipoUnidad: tipoUnidad[0].descripcion,
      tipoServicio: getServiceName(request.tipoServicio),
      tipoDevolucion: getReturnName(request.tipoDevolucion),
      user: userName[0].nombre,
      cliente: customer[0].nombreCorto,
      fechaServicio: dayjs(request.fechaServicio).format('DD/MM/YYYY')
    }
    return requestToSend
  }

  async handleMail(service) {
    let infoMail = mailService.formatInfo(service);
    let response = await mailService.sendMail(infoMail);
    return response
  }
}

module.exports = RequestService;
