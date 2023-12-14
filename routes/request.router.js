const express = require("express");

const RequestService = require('../services/request.service');
const validatorHandler = require('../middlewares/validator.handler');
const { getServicesSchema, getRoutesSchema, getServiceSchema, insertServiceSchema } = require('../schemas/service.schema');
const { cleanText } = require('../utils/helpers/blacklist.helper');

const router = express();
const service = new RequestService();

router.get('/',
  validatorHandler(getServicesSchema, 'query'),
  async (req, res, next) => {
    try {
      const { status, initialDate, finalDate } = req.query;
      const user = req.user;
      let requests = await service.getRequests(user.sub, status, initialDate, finalDate);
      res.status(200).json({ data: requests });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/opciones',
  async (req, res, next) => {
    try {
      const user = req.user;
      let options = await service.getOptions(user.sub);
      res.status(200).json(options);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/opciones/clientes',
  async (req, res, next) => {
    try {
      const user = req.user;
      let customers = await service.getCustomers(user.sub);
      res.status(200).json({ data: customers });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/opciones/unidades',
  async (req, res, next) => {
    try {
      const user = req.user;
      let customers = await service.getUnits(user.sub);
      res.status(200).json({ data: customers });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/opciones/rutas',
  validatorHandler(getRoutesSchema, 'query'),
  async (req, res, next) => {
    try {
      const { customer } = req.query;
      let routes = await service.getRoutes(customer);
      res.status(200).json({ data: routes });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/opciones/tarifas',
  validatorHandler(getRoutesSchema, 'query'),
  async (req, res, next) => {
    try {
      const { customer } = req.query;
      let rates = await service.getRates(customer);
      res.status(200).json({ data: rates });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:servicio',
  validatorHandler(getServiceSchema, 'params'),
  async (req, res, next) => {
    try {
      const { servicio } = req.params;
      let request = await service.getRequest(servicio);
      res.status(200).json({ data: request });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(insertServiceSchema, 'body'),
  async (req, res, next) => {
    try {
      let response = {};
      let body = req.body;
      const { sub } = req.user;
      body.comentarios = cleanText(body.comentarios);
      let requestsInserted = await service.insertRequest(body, sub);
      response.pushMessage = "solicitud registrada";
      let requestToSend = await service.formatRequest(body, requestsInserted[0], sub);
      let rta = await service.handleMail(requestToSend);
      response.sendMessage = rta.message;
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }
);

module.exports = router;
