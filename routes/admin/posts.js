const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {   ///onsuzda admin oldugu ucun bunu silib test elemek olar

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {
    res.render('admin/posts/index');
})

router.get('/create', (req,res) => {
    res.render("admin/posts/create");
})

router.post('/create', (req,res) => {

    let alowComments = (req.body.allowComments) ? true : false;

    const post = new Post();
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = alowComments;
    post.body = req.body.body;

    post.save().then(savedPost => {
        res.redirect("/admin/posts/index");
    }).catch(err => {
        res.send("Post not saved");
        console.log(err);
    });

    //res.render("admin/posts/create");
    //console.log(req.body);
})


module.exports = router;