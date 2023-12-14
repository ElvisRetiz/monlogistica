const Joi = require('joi').extend(require('@joi/date'));

const cliente = Joi.number().integer().max(999);
const tipoTarifa = Joi.string().max(6);
const ruta = Joi.string().max(30);
const tipoUnidad = Joi.string().max(6);
const fechaServicio = Joi.date();
const horaServicio = Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/);
const comentarios = Joi.string();
const tipoServicio = Joi.number().integer().max(3);
const tipoDevolucion = Joi.number().integer().max(3);
const estatus = Joi.number().integer().max(3);
const servicio = Joi.number().integer().max(99999);

const insertServiceSchema = Joi.object({
  cliente: cliente.required(),
  tipoTarifa: tipoTarifa.required(),
  ruta: ruta.required(),
  tipoUnidad: tipoUnidad.required(),
  fechaServicio: fechaServicio.required(),
  horaServicio: horaServicio.required(),
  comentarios: comentarios.required(),
  tipoServicio: tipoServicio.required(),
  tipoDevolucion: tipoDevolucion.required()
});

const getServicesSchema = Joi.object({
  status: estatus.required(),
  initialDate: fechaServicio.required(),
  finalDate: fechaServicio.required()
});

const getServiceSchema = Joi.object({
  servicio: servicio.required()
});

const getRoutesSchema = Joi.object({
  customer: cliente.required()
});

module.exports = {
  insertServiceSchema,
  getServicesSchema,
  getRoutesSchema,
  getServiceSchema
};
