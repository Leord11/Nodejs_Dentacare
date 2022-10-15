const express = require('express');
const mongoose = require('mongoose');
const appointmentRoutes = require('./routes/appointmentRoutes');
const appointmentController = require('./controller/AppointmentController');

const app = express();

// IMPORTANT --- to have access for req.body for post request from a form in ejs templates
app.use(express.urlencoded({ extended: true }));

// register view engine
app.set('view engine', 'ejs');

// app.listen(3000);

app.use(express.static('public'));

const dbURI = 'mongodb+srv://leord11:password1107@cluster01.cfadayp.mongodb.net/dentacare?retryWrites=true&w=majority';
// const dbURI_local = 'mongodb://localhost:27017/dentacare';

mongoose.connect(dbURI)
.then((result) => {
    console.log('connected to database');
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


app.get('/', appointmentController.user_index);
app.get('/login', appointmentController.login_get);
app.post('/login', appointmentController.login_post );
app.post('/logout', appointmentController.logout);
app.use(appointmentRoutes);

//404 page not found 
app.use(((req, res) => {
    res.status(404).render('admin/404');
}));