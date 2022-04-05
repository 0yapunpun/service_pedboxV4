const controller = {};
const service = require('./service.js');
const config = require('../../config.js');
const fs = require('fs');
var path = require('path')
const multer  = require('multer');
const now = Date.now();


let storageDocumentos = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, config.urlBase+'/public/documentos_extranet');
  },
  filename: function (req, file, callback) {
    var name = now + path.extname(file.originalname);
    callback(null, name);
  }
});
let uploadDocumento = multer({ storage: storageDocumentos }).single('file');


controller.getDocuments = async(req, res, next) => {
  let response = await service.getDocuments(req.params.id_company); 
  res.send(response)
}

controller.getMasters = async(req, res, next) => {
  let response = await service.getMasters(); 
  res.send(response)
}

controller.deleteDocumentRegister = async(req, res, next) => {
  let fileName = await service.getDocumentNameById(req.body.id)
  let response = await service.deleteDocumentRegister(req.body.id); 

  if (!(fileName.success) || !(response.success)) {
    return res.send({success: false})
  }

  let path = config.urlBase+'/public/documentos_extranet/'+fileName.result[0].name_file

  fs.unlink(path, (err) => {
    if (err) {
      console.log("erro detelint image", err)
      return res.send({success: false})
    } else {
      return res.send({success: true})
    }
  })
}

controller.uploadDocuments = async(req, res, next) => {
  uploadDocumento(req, res, (err) => {
    if (err) {
      console.log('error uploading image', err);
      return res.send({success: false})
    } else {
      return res.send({success: true, file: now});
    };
  })
}

controller.saveDocumentRegister = async(req, res, next) => {
  let response = await service.createDocumentRegister(req.body); 
  res.send(response)
}

module.exports = controller