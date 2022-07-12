const controller = {};
const service = require('./service.js');
const config = require('../../config.js');
const fs = require('fs');
var path = require('path');
const multer  = require('multer');
const { JSON } = require('mysql/lib/protocol/constants/types');
const now = Date.now();

let id_current_company = 1; // Default folder to save files

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

controller.deleteAttachmentsByIdItem = async(req, res, next) => {
  let id_item = req.params.id_item;
  let id_company = req.params.id_company; 

  let response = await service.deleteAttachmentsByIdItem(id_item, id_company); 

  res.send(response)  
}

controller.relateItemToImagesArray = async(req, res, next) => {
  let id_product = req.body.id_product;
  let image_array = req.body.image_array; 

  // Append first array image to item
  let attachmentLink = await service.getAttachmentsById(image_array[0]); 
  await service.addImgProduct(id_product, attachmentLink.result[0].url); 

  let response = await service.relateImagesArrayToItem(id_product, image_array); 
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


controller.catalogGyWPrueba = async(req, res, next) => { 
  let response = await service.getCatalogGrulla(); 
  
  let items = [];
  let products = response.result;

  for (let i = 0; i < products.length; i++) {
    
    if (!items.filter(e => e.code == products[i].code.substring(0, 5)).length > 0) {
      let objItem = {              
        idItem: products[i].id,
        code: products[i].code.substring(0, 5),
        description: products[i].description,
        image: products[i].image,
        image_array: products[i].image_array,
        talla_array: [products[i].size], // Array de tallas
        color_array: [products[i].color], // Array de colores
      }

      if (products[i].atributos) {
        let att = products[i].atributos.split(",")
        let attDetail = products[i].detalle_atributos.split(",")

        for (let e = 0; e < att.length; e++) {
          objItem[att[e]] = attDetail[e]
        }
      }

      items.push(objItem)
    } else {
      let index = items.findIndex(object => {return object.code === products[i].code.substring(0, 5)});

      if (!items[index].talla_array.includes(products[i].size)) {
        items[index].talla_array.push(products[i].size)
      }

      if (!items[index].color_array.includes(products[i].color)) {
        items[index].color_array.push(products[i].color)
      }
    }
  }

  res.send(items)
}

controller.catalogDetailGyW = async(req, res, next) => { 
  let id_company = req.params.id_company;
  let productCode = req.params.code_product;

  let catalog = await service.getCatalogDetailGyW(id_company, productCode); 
  res.send(catalog)
}

controller.imageAttachment = async(req, res, next) => { 
  let imagesArray = req.params.images_array.split(",");
  let imagesResult = []; 

  try {
    for (let i = 0; i < imagesArray.length; i++) {
      let id_attachment = imagesArray[i]
      let image = await service.getAttachmentsById(id_attachment);
  
      if (image.result[0].url) {
        imagesResult.push(image.result[0].url)
      }
    }    
  } catch (error) {
    return res.send([])
  }

  res.send(imagesResult)
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

controller.catalogCodesSubstring = async(req, res, next) => { 
  let id_company = req.params.id_company;
  let codesArray = [];

  let codes = await service.getCodesSubstringCatalog(id_company); 

  for (let i = 0; i < codes.result.length; i++) {
    codesArray.push(codes.result[i].codep)
  }

  res.send(codesArray)
}

controller.catalogCodesSubstringDesc = async(req, res, next) => { 
  let id_company = req.params.id_company;
  let codesArray = [];

  let codes = await service.getCodesSubstringCatalog(id_company); 

  for (let i = 0; i < codes.result.length; i++) {
    let string =  codes.result[i].codep + ` (${codes.result[i].description})`
    codesArray.push(string)
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

controller.productBycodeColor = async(req, res, next) => { 
  let code = req.params.code;
  let code_color = req.params.code_color;

  let response = await service.getProductBycodeColor(code, code_color); 
  res.send(response)
}

controller.catalogAttributesAndDetail = async(req, res, next) => { 
  let id_company = req.params.id_company;

  let attributes = await service.getAttributesCatalog(id_company); 
  let attributesDetail = await service.getAttributesDestailCatalog(id_company); 

  res.send({attributes: attributes.result, attributesDetail: attributesDetail.result})
}

controller.catalogAttributesByIdItem = async(req, res, next) => {  
  let id_item = req.params.id_item;

  let attributes = await service.catalogAttributeByIdItem(id_item); 

  if (attributes.result.length) {
    let attrArray = [];

    for (let i = 0; i < attributes.result.length; i++) {
      if (!attributes.result[i]) {return res.send({success: false}) }

      let attrDetail = await service.catalogAttributeDetailDesc(attributes.result[i].id_detail_attribute); 

      if (!attrDetail.result[0]) {return res.send({success: false}) }

      let attrDetailParent = await service.catalogAttributeDesc(attrDetail.result[0].id_attribute); 
  
      if (!attrDetailParent.result[0] || !attrDetail.result[0]) {return res.send({success: false}) }

      let attrsObj = {};
          attrsObj[attrDetailParent.result[0].description] = attrDetail.result[0].description;

      attrArray.push(attrsObj)
    }


    return res.send({success: true, data: attrArray})
  }

  res.send({success: false})
}

controller.catalogCodesAssociateToAttribute = async(req, res, next) => { 
  let id_attribute = req.params.id_attribute;
  let codesArray = [];

  let response = await service.catalogAttributesByAttributeId(id_attribute); 

  for (let i = 0; i < response.result.length; i++) {
    let id_item = response.result[i].id_item;
    let item = await service.getProductsById(id_item); 

    if (!codesArray.includes(item.result[0].code.substring(0, 5))) {
      codesArray.push(item.result[0].code.substring(0, 5))
    }
  }

  res.send(codesArray)
}

controller.catalogRelateAttributesBySubstring = async(req, res, next) => { 
  let code = req.body.code_substring;
  let body = {
    id_company : req.body.id_company,
    id_attribute : req.body.id_detail_attribute,
    idUser : req.body.id_user,
    status : req.body.status
  };

  let items = await service.getProductsByCodeSubstring(code, body.id_company); 

  try {
    for (let i = 0; i < items.result.length; i++) {
      let id_item = items.result[i].id;
      await service.addAttributeItem(body, id_item); 
    }
    res.send({success: true})
  } catch (error) {
    res.send({success: false})
  }
}

controller.deleteAttributeById = async(req, res, next) => { 
  let id_attribute = req.params.id_attribute;
  let id_item = req.params.id_item;

  let response = await service.deleteAttributeById(id_item, id_attribute); 
  
  res.send(response)
}

controller.catalogDeleteAttributesByCode = async(req, res, next) => { 
  let id_attribute = req.params.id_attribute;
  let code = req.params.code;
  let id_company = req.params.id_company;

  let items = await service.getProductsByCodeSubstring(code, id_company); 

  for (let i = 0; i < items.result.length; i++) {
    let response = await service.deleteAttributeById(items.result[i].id, id_attribute); 
  }

  res.send({succes: true})
}

controller.deleteAttachmentDetailAttribute = async(req, res, next) => { 
  let id_image = req.params.id_image;
  let id_attribute = req.params.id_attribute;

  let response = await service.deleteAttachmentDetailAttribute(id_image, id_attribute); 

  res.send(response)
}




module.exports = controller