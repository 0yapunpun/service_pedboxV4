const controller = {};
const service = require('./service.js');

controller.catalogColors = async(req, res, next) => {
  let id_company = 20; // TODO quitar id_company quemado
  let birthdays = await service.getCatalogColors(id_company); 
  res.send(birthdays)
}

controller.catalogGyW = async(req, res, next) => { // Catalogo Grulla & Wellco
  let id_company = 20; // TODO quitar id_company quemado
  let catalog = await service.getCatalogGyW(id_company); 
  res.send(catalog)
}

controller.catalogDetailGyW = async(req, res, next) => { 
  let id_company = 20; //TODO quitar id_company quemado
  let productCode = req.params.code_product;

  let catalog = await service.getCatalogDetailGyW(id_company, productCode); 
  res.send(catalog)
}


module.exports = controller