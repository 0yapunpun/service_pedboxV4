const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar/controller.js');
const documentosController = require('../controllers/documentos/controller.js');
const notificationsController = require('../controllers/notifications/controller.js');
const catalogController = require('../controllers/catalogo/controller.js');


// Agenda
router.get('/birthdays/:id_company', calendarController.birthdays);
router.get('/currentBirthdays/:id_company', calendarController.currentBirthdays);

// Documentos
router.get('/documentos/masters', documentosController.getMasters)
router.get('/documentos/:id_company', documentosController.getDocuments)
router.post('/documentos/upload', documentosController.uploadDocuments)
router.post('/documentos/saveRegister', documentosController.saveDocumentRegister)
router.post('/documentos/deleteRegister', documentosController.deleteDocumentRegister)

// Notificaciones
router.get('/notifications/:id_user', notificationsController.getNotifications)
router.post('/notifications/createNotification', notificationsController.createNotification)
router.get('/removeNotificationByKind/:id_user/:kind', notificationsController.removeNotificationByKind)
router.get('/getNotificationsCalendar/:id_user', notificationsController.getNotificationsCalendar)

// Catalogo
router.get('/catalog/colors/:id_company', catalogController.catalogColors)
router.get('/catalog/GyW', catalogController.catalogGyW)
router.get('/catalog/detail/:id_company/:code_product', catalogController.catalogDetailGyW)
router.get('/catalog/images/:id_company', catalogController.catalogImages)
router.get('/catalog/codes/:id_company', catalogController.catalogCodes)

router.post('/catalog/uploadImages/:fileName', catalogController.uploadImages)


module.exports = router;