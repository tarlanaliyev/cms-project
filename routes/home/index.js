const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require("../../models/Category");

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

router.get('/register', (req,res) => {
    res.render("home/register");
})

router.get('/post/:id', (req,res) => {
    Post.findOne({_id: req.params.id}).then(post => {
        res.render("home/post", {post: post});
    })

})

module.exports = router;