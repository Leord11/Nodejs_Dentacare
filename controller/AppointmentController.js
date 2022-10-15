const Appointment = require('../model/appointment');
const User = require('../model/user');

const date = new Date();
date.setHours(0,0,0,0);
let isLogin = false;
let withMessage = false;
let withAction = false;


const user_index = (req, res) => {    
    res.render('user/home', { message : 'Successfully Booked', withMessage : withMessage});
    withMessage = false;
};

const login_get = (req, res) => {
    res.render('./admin/login');
};

const login_post = async (req, res) => {
    
    const admin = await User.find().exec();

    isLogin = true;    
    res.redirect('/admin');
    
    
};

const logout = (req, res) => {
    isLogin = false;
    res.redirect('/login');
};

const index = async (req, res) => {
    if(!isLogin) {
        res.redirect('/login');
    } else {
        
        const pending = await Appointment.find({status: 'pending'}).exec();
        const confirmed = await Appointment.find({status: 'confirmed'}).exec();
        const today = await Appointment.find({status: 'confirmed'}).where('date').equals(date).exec();

        res.render('./admin/index', { 
            pending : pending.length,
            confirmed : confirmed.length,
            today : today.length 
        });
    };
};

const today = (req, res) => {
    withAction = false;
    withMessage = false;

    if(!isLogin) {
        res.redirect('/login');
    } else {
        Appointment.find({status: 'confirmed'}).where('date').equals(date)
        .then(result => {
            res.render('./admin/appointments', { appointments: result, tableTitle: "Today's Appointment", withAction, withMessage });
        }).catch(err => console.log(err));
    }    
};

const pending = (req, res) => {

    withAction = true;

    if(!isLogin) {
        res.redirect('/login');
    } else {
        Appointment.find({status: 'pending'}).then(result => {
            res.render('./admin/appointments', { appointments: result, tableTitle: "All Pending Appointments", withAction, withMessage, message : 'Appointment Successfully Confirmed' });
            withMessage = false;
        }).catch(err => console.log(err));
    }
};

const all_appointments = (req, res) => {
    withAction = false;
    withMessage = false;
    if(!isLogin) {
        res.redirect('/login');
    } else {
        Appointment.find({status: 'confirmed'}).then(result => {
            res.render('./admin/appointments', { appointments: result, tableTitle: "All Confirmed Appointments", withAction, withMessage });
        }).catch(err => console.log(err));
    }    
};

const appointment_store = (req, res) => {
    
    const name = req.body.name;
    const email = req.body.email;
    const service = req.body.service;
    const time = req.body.time;
    const date = req.body.date;
    const message = req.body.message;

    const appointment = new Appointment({
        name: name,
        email: email,
        service: service,
        time: time,
        date: date,
        message: message,
        status: 'pending'     
    });

    appointment.save().then(result => {
        console.log('save successfully');
        withMessage = true;
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
};

const check = (req, res) => {    
    const id = req.params.id;

    Appointment.findById(id).then(data => {        
        Appointment.find({status: 'confirmed'})
        .where('date').equals(data.date)
        .then(result => {
            const date = new Date(data.date) ;
            const year = date.getFullYear() ;
            const month = date.getMonth() + 1 ;
            const day = date.getDate();
            const finalDate = `${day}/${month}/${year}`;
            res.render('./admin/check', { appointments : result, data,finalDate });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    
};

const confirm = (req, res) => {
    const id = req.body.id;
    withMessage = true;
    Appointment.findByIdAndUpdate(id, {
        status : 'confirmed'
    },(err, result) => {
        
       if(err) console.log(err);
       else {
        res.redirect('/pending')
        }; 
    });
};

const search = async (req, res) => {
    const search = req.body.search;
    const name_search = await Appointment.find({name: search}).exec();

    res.render('admin/search',{ appointments : name_search});
};



module.exports = {
    login_get,
    login_post,
    logout,
    index,
    today,
    pending,
    all_appointments,
    appointment_store,
    check,
    confirm,
    user_index,
    search
};