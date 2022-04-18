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

controller.getNotificationsCalendar = async(req, res, next) => { 
  let currentDate = new Date().toISOString().slice(0, 10);
  let response = await service.getNotificationsCalendar(req.params.id_user, currentDate); 
  res.send(response.result)
}


module.exports = controller