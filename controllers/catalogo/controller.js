const controller = {};
const service = require('./service.js');
const config = require('../../config.js');
const fs = require('fs');
var path = require('path');
const multer  = require('multer');
const now = Date.now();

let id_current_company = 1; 

let storeImages = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, config.urlBase+'/public/imagenes_catalogo/'+ id_current_company);
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
  id_current_company = req.params.id_company;
  let fileName = req.params.fileName;

  let codeMatches = await codeExists(fileName); 

  if (codeMatches.result.length) {
    uploadImages(req, res, async (err) => {
      if (err) {
        return res.send({success: false, codeMatches: true});
      } else {
        let code = fileName;
        let imgUrl = 'http://api.pedbox.co:7777/imagenes_catalogo/' + id_current_company + '/' + req.file.filename; 
        
        await service.addImgProduct(code, imgUrl) 

        return res.send({success: true, codeMatches: true});
      };
    })
  } else {
    return res.send({success: false, codeMatches: false});
  }
}

controller.uploadAttachedsFichas = async(req, res, next) => {
  id_current_company = req.params.id_company;
  let fileName = req.params.fileName;
  let id_company = req.params.id_company;

  let relatedProducts = await service.getProductsByCodeSubstring(fileName, id_company); 

  console.log(relatedProducts)

  if (relatedProducts.result.length == 0) {
    return res.send({success: false, message: "El codigo no existe en ningún producto"});
  }

  uploadImages(req, res, async (err) => {
    if (err) {
      return res.send({success: false, message: "No fue posible subir la imágen"});
    } else {

      for (let i = 0; i < relatedProducts.result.length; i++) {
        let data = {
          id_company: Number(id_company),
          id_item: relatedProducts.result[i].id,
          type: req.file.mimetype, 
          url: 'http://api.pedbox.co:7777/imagenes_catalogo/' + id_current_company + '/' + req.file.filename ,
          name_file: req.file.filename,
          description: "",
          in_quotation: 0,
          sequence: 0
        }
        await service.addAttachments(data); 
      }
      return res.send({success: false, message: "Productos Relacionados"});      
    };
  })
}

controller.uploadAttachedsImages = async(req, res, next) => {
  id_current_company = req.params.id_company;
  let sub_code = req.params.fileName;
  let id_company = req.params.id_company;
  let sequence = Number(req.params.sequence);

  uploadImages(req, res, async (err) => {
    if (err) {
      return res.send({success: false, message: "No fue posible subir la imágen"});
    } else {

      let data = {
        id_company: Number(id_company),
        id_item: sub_code,
        type: req.file.mimetype, 
        url: 'http://api.pedbox.co:7777/imagenes_catalogo/' + id_current_company + '/' + req.file.filename,
        name_file: req.file.filename,
        description: "",
        in_quotation: 0,
        sequence: sequence
      }
      let response = await service.addAttachments(data); 
      return res.send({success: true, message: "Imágen subida con éxito", id_image: response.result[1][0]["LAST_INSERT_ID()"]});      
    };
  })
}

controller.relateItemToImagesArray = async(req, res, next) => {
  let id_product = req.body.id_product;
  let image_array = req.body.image_array; 

  itemHasImage = await service.getImageByIdItem(id_product); 

  if (itemHasImage.result[0].image == "") { // Append first image array in case it has no image
    attachmentLink = await service.getAttachmentsById(image_array[0]); 

    console.log(attachmentLink)

    await service.addImgProduct(id_product, attachmentLink.result[0].url); 
  }

  let response = await service.relateImagesArrayToItem(id_product, JSON.stringify(image_array)); 
  res.send(response)  
}

controller.selectItemsByCodeSubstring = async(req, res, next) => {
  let code = req.params.code;
  let id_company = req.params.id_company;

  let response = await service.getProductsByCodeSubstring(code, id_company); 
  res.send(response)
}

controller.uploadImagesCode = async(req, res, next) => {
  let code = req.body.code;
  let imgUrl = req.body.imgUrl

  let response = await service.addImgProduct(code, imgUrl); 
  res.send(response)
}

controller.removeImgbyCode = async(req, res, next) => {
  let code = req.params.code;
  let id_company = req.params.id_company

  let response = await service.removeImgProduct(code, id_company); 
  res.send(response)
}

controller.catalogColors = async(req, res, next) => {
  let id_company = req.params.id_company;
  let birthdays = await service.getCatalogColors(id_company); 
  res.send(birthdays)
}

controller.catalogGyW = async(req, res, next) => { 
  let id_company = 20; // Grulla y Wellco 
  let catalog = await service.getCatalogGyW(id_company); 
  res.send(catalog)
}

controller.catalogDetailGyW = async(req, res, next) => { 
  let id_company = req.params.id_company;
  let productCode = req.params.code_product;

  let catalog = await service.getCatalogDetailGyW(id_company, productCode); 
  res.send(catalog)
}

controller.catalogCodes = async(req, res, next) => { 
  let id_company = req.params.id_company;
  let codesArray = [];

  let codes = await service.getCodesCatalog(id_company); 

  for (let i = 0; i < codes.result.length; i++) {
    codesArray.push(codes.result[i].code)
  }

  res.send(codesArray)
}

controller.catalogImages = async(req, res, next) => { 
  let id_company = req.params.id_company;

  let images = await service.getImagesCatalog(id_company); 
  res.send(images)
}

controller.catalogAttachments = async(req, res, next) => { 
  let id_company = req.params.id_company;

  let images = await service.getAttachmentsCatalog(id_company); 
  res.send(images)
}


module.exports = controller