const express = require('express');
const router = express.Router();
const indexController = require('../controller/index.js');
const calendarController = require('../controller/calendar.js');

router.get('/', indexController.index);

// Agenda
router.get('/birthdays/:id_company', calendarController.birthdays);

module.exports = router;