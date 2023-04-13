const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const {mongoDUrl} = require('./config/database');
const passport = require('passport');

mongoose.set('strictQuery', false);

mongoose.connect(mongoDUrl)
    .then(db => {
        console.log("MongoDB connected");
    }).catch(err => {
        console.log("Error happened");
});

app.use(session({
    secret: "tarlanaliyevss",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//PASSPORT

app.use(passport.initialize());
app.use(passport.session());

//Local Variables using Middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.static(path.join((__dirname, 'public'))));


//Set View Engine

const {select, generateDate, paginate} = require('./helpers/handlebars-helper');

app.engine('handlebars', exphbs.engine({handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'home', helpers: {select: select, generateDate: generateDate, paginate: paginate}})); //// burda sadece exphbs olanda error verirdi, sonun .engine yazanda duzeldi ama.
app.set('view engine', 'handlebars');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//upload
app.use(upload());

//Method Override
app.use(methodOverride('_method'));

//load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);


app.listen(4500, () => {
    console.log("listening on port 4500...");
})