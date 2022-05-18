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
router.get('/catalog/attachments/:id_company', catalogController.catalogAttachments)
router.get('/catalog/codes/:id_company', catalogController.catalogCodes)
router.post('/catalog/uploadImages/:fileName/:id_company', catalogController.uploadImages)

router.post('/catalog/uploadAttachedsFichas/:fileName/:id_company', catalogController.uploadAttachedsFichas)
router.post('/catalog/uploadAttachedsImages/:fileName/:id_company/:sequence', catalogController.uploadAttachedsImages)
router.post('/catalog/relateImageArray', catalogController.relateItemToImagesArray)

router.post('/catalog/uploadImgCode', catalogController.uploadImagesCode)
router.get('/catalog/removeImages/:code/:id_company', catalogController.removeImgbyCode)

// Endpoint de prueba
router.get('/catalog/getItems/substring/:code/:id_company', catalogController.selectItemsByCodeSubstring)




module.exports = router;