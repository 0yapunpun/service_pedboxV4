const controller = {};
const service = require('./service.js');
const config = require('../../config.js');

controller.getNotifications = async(req, res, next) => {
  let response = await service.getNotifications(req.params.id_user); 
  res.send(response)
}

controller.createNotification = async(req, res, next) => {
  let response = await service.createNotification(req.body); 
  res.send(response)
}

controller.removeNotificationByKind = async(req, res, next) => {
  let response = await service.removeNotificationByKind(req.params.id_user, req.params.kind); 
  res.send(response)
}


module.exports = controller