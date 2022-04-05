const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar/controller.js');
const documentosController = require('../controllers/documentos/controller.js');


// Agenda
router.get('/birthdays/:id_company', calendarController.birthdays);

// Documentos
router.get('/documentos/masters', documentosController.getMasters)
router.get('/documentos/:id_company', documentosController.getDocuments)
router.post('/documentos/upload', documentosController.uploadDocuments)
router.post('/documentos/saveRegister', documentosController.saveDocumentRegister)
router.post('/documentos/deleteRegister', documentosController.deleteDocumentRegister)

module.exports = router;