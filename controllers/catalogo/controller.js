const controller = {};
const service = require('./service.js');
const config = require('../../config.js');
const fs = require('fs');
var path = require('path');
const multer  = require('multer');
const now = Date.now();

let storeImages = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, config.urlBase+'/public/imagenes_catalogo');
  },
  filename: function (req, file, callback) {
    var name = file.originalname
    callback(null, name);
  }
});

let uploadImages = multer({ storage: storeImages }).single('file');

let codeExists = async(code) => {
  return await service.getProductsByCode(code); 
}

let addImgUrlByCode = async(code, imgUrl) => {
  return await service.addPImgProduct(code, imgUrl); 
}

controller.uploadImages = async(req, res, next) => {
  let fileName = req.params.fileName;

  let codeMatches = await codeExists(fileName); 

  if (codeMatches.result.length) {
    uploadImages(req, res, (err) => {
      if (err) {
        return res.send({success: false, codeMatches: true});
      } else {
        let code = fileName;
        let imgUrl = 'http://api.pedbox.co:7777/imagenes_catalogo/' + req.file.filename; // TODO cada empresa debe tener su propia carpeta 
        service.addImgProduct(code, imgUrl)
        return res.send({success: true, codeMatches: true});
      };
    })
  } else {
    return res.send({success: false, codeMatches: false});
  }
}

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

controller.catalogCodes = async(req, res, next) => { 
  let id_company = 20; //TODO quitar id_company quemado
  let codesArray = [];

  let codes = await service.getCodesCatalog(id_company); 

  for (let i = 0; i < codes.result.length; i++) {
    codesArray.push(codes.result[i].code)
  }

  res.send(codesArray)
}

controller.catalogImages = async(req, res, next) => { 
  let id_company = 20; //TODO quitar id_company quemado

  let images = await service.getImagesCatalog(id_company); 
  res.send(images)
}


module.exports = controller