const express = require('express');
const appointmentController = require('../controller/AppointmentController');
const router = express.Router();


router.get('/admin', appointmentController.index);
router.get('/today', appointmentController.today);
router.get('/pending', appointmentController.pending);
router.get('/appointments', appointmentController.all_appointments);
router.post('/appointments', appointmentController.appointment_store);
router.get('/appointments/:id', appointmentController.check);
router.post('/confirm', appointmentController.confirm);
router.post('/search', appointmentController.search);

module.exports = router;