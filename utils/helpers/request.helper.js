function getServiceName(service) {
    let tipoServicio = "";
    service = parseInt(service, 10);
    switch (service) {
        case 0:
            tipoServicio = "Flete";
            break;
        case 1:
            tipoServicio = "Custodia";
            break;
        default:
            tipoServicio = "Flete y custodia";
            break;
    }
    return tipoServicio
}

function getReturnName(service) {
    let tipoDevolucion = "";
    service = parseInt(service, 10);
    switch (service) {
        case 0:
            tipoDevolucion = "No aplica";
            break;
        case 1:
            tipoDevolucion = "Flete";
            break;
        case 2:
            tipoDevolucion = "Custodia";
            break;
        default:
            tipoDevolucion = "Flete y custodia";
            break;
    }
    return tipoDevolucion
}

module.exports = { getServiceName, getReturnName }
