const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/cms')
    .then(db => {
        console.log("MongoDB connected");
    }).catch(err => {
        console.log("Error happened");
});


app.use(express.static(path.join((__dirname, 'public'))));


//Set View Engine

const {select} = require('./helpers/handlebars-helper');

app.engine('handlebars', exphbs.engine({handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'home', helpers: {select: select}})); //// burda sadece exphbs olanda error verirdi, sonun .engine yazanda duzeldi ama.
app.set('view engine', 'handlebars');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Method Override
app.use(methodOverride('_method'));

//load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

//use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);


app.listen(4500, () => {
    console.log("listening on port 4500...");
})