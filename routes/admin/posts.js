const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {   ///onsuzda admin oldugu ucun bunu silib test elemek olar

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {

    Post.find({}).then(posts => {

        //console.log(posts);

        res.render('admin/posts', {posts: posts});

    })
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
        Post.findOne({_id: post.id}).then(post => {
            res.render('admin/posts/currentPost', {sentPost: post});
        })
    }).catch(err => {
        res.send("Post not saved");
        console.log(err);
    });

    //res.render("admin/posts/create");
    //console.log(req.body);
})

router.get('/edit/:id', (req,res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        res.render('admin/posts/edit', {post: post});
    })
})

router.put('/edit/:id', (req,res) => {

    Post.findOne({_id: req.params.id}).then(post => {

        let allowComments = (req.body.allowComments) ? true : false;

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;

        post.save().then(savedPost => {
            res.render('admin/posts/currentPost', {sentPost: savedPost});
        }).catch(err => {
            res.send("Post not saved!");
            console.log(err);
        })

    })

})


module.exports = router;