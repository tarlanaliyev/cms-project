const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require("../../models/Category");
const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*', (req, res, next) => {   /// admin/index -de olan kodu bura da yazdim. Cunki tekce admin/index-de olanda
                                                                                             /// her defesinde /admin eledikde url-de layout-u admin olaraq deyisirdi
    req.app.locals.layout = 'home';                                                          /// biz yeniden home page qayitmaq istesek alinmirdi. Care olaraq eyni kodu bura
    next();                                                                                  /// da atmali oldum.

})


router.get('/', (req,res) => {

    Post.find({}).then(posts => {
        Category.find({}).then(categories => {
            res.render("home/index", {posts: posts, categories: categories});  /// views folderinin altinda /home/index.handlebars file-in axtarir
        })
    }).catch(err => {
        res.send("Error happened");
        console.log(err);
    })

})

router.get('/about', (req,res) => {
    res.render("home/about");
})

router.get('/login', (req,res) => {
    res.render("home/login");
})



//App login

passport.use(new LocalStrategy({usernameField: 'email'}, (email,password,done) => {
    console.log(email);
    console.log(password);

    User.findOne({email: email}).then(user => {

        if(!user) return done(null, false, { message: 'Incorrect username or password.' }); // flash messages

        bcrypt.compare(password, user.password, (err, match) => {
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
        });


    })

}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



router.post('/login', (req,res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);

    // res.render("home/login");
})

router.get('/logout', (req,res) => {

        // // Destroy the session and redirect to the home page
        // req.session.destroy((err) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         res.redirect('/login');
        //     }
        // });

    req.logout(err => {
        if(err) console.log(err);
        res.redirect('/login');
    });
})


router.get('/register', (req,res) => {
    res.render("home/register");
})

router.post('/register', (req,res) => {

    let error = [];

    if(!req.body.firstName) {
        error.push({message: "Please enter a First Name!"});
    }

    if(!req.body.lastName) {
        error.push({message: "Please enter a Last Name!"});
    }

    if(!req.body.email) {
        error.push({message: "Please enter a Email!"});
    }

    if(!req.body.password) {
        error.push({message: "Please enter a Password!"});
    }

    if(!req.body.passwordConfirm) {
        error.push({message: "Please enter a Password Confirmation!"});
    }

    if(req.body.password !== req.body.passwordConfirm) {
        error.push({message: "Passwords don't match!"});
    }

    if (error.length > 0) {
        return res.render('home/register', {  ////error burda imis
            errors: error
        });

    }

    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            req.flash("error_message", "User already exists!");
            res.redirect('/login');
        } else {

            const newUser = new User();
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.email = req.body.email;
            newUser.password = req.body.password;

            bcrypt.genSalt(10,(err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hashedPwd) => {
                    newUser.password = hashedPwd;
                    newUser.save().then(savedUser => {
                        req.flash("success_message", "You are now registered user. Please log in!");
                        res.redirect('/login');
                    })
                })
            })

        }

    })

})

router.get('/post/:slug', (req,res) => {
    Post.findOne({slug: req.params.slug}).populate('user')
        .populate({path: 'comments', populate: {path: 'user', model: 'users'}})
        .then(post => {

        Category.find({}).then(categories => {
            res.render("home/post", {post: post, categories: categories});
        })

    })

})

module.exports = router;