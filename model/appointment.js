const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    time : {
        type: String
    },
    date: {
        type: Date   
    },
    message: {
        type: String,
        required: false
    },
    status: {
        type: String
    }
}, {timestamps:true});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;