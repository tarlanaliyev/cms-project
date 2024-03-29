const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated, (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {

    Post.find({}).populate('category')
        .then(posts => {

        res.render('admin/posts', {posts: posts});

    })
})

router.get('/my-posts', (req,res) => {

    Post.find({user: req.user.id}).populate('category')
        .then(posts => {

            res.render('admin/posts/my-posts', {posts: posts});

        })
})

router.get('/create', (req,res) => {
    Category.find({}).then(category => {
        res.render("admin/posts/create", {category: category});
    })
})

router.post('/create', (req,res) => {

    let filename = "";

   if (req.files != null && req.files !== undefined) {
       let file = req.files.file;
       filename = Date.now() + "-" + file.name;

       file.mv('./public/uploads/' + filename, err => {
           if(err) throw err;
       });
   }

    let alowComments = (req.body.allowComments) ? true : false;

    const post = new Post();
    post.user = req.user.id;
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = alowComments;
    post.body = req.body.body;
    post.file = filename;
    post.category = req.body.category;

    post.save().then(savedPost => {
        req.flash('success_message', `Post ${post.title} was succesfully saved!`);
        res.redirect('/admin/posts');
    }).catch(err => {
        res.render('admin/posts/create', {error: err.errors})
    });

})


router.get('/edit/:id', (req,res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        Category.find({}).then(category => {
            res.render("admin/posts/edit", {post: post, category: category});
        })
    })
})

router.put('/edit/:id', (req,res) => {

    Post.findOne({_id: req.params.id}).then(post => {

        let filename = "";
        let allowComments = (req.body.allowComments) ? true : false;

        post.user = req.user.id;
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if (req.files != null && req.files !== undefined) {
            let file = req.files.file;
            filename = Date.now() + "-" + file.name;

            file.mv('./public/uploads/' + filename, err => {
                if(err) throw err;
            });
        }

        post.file = filename;

        post.save().then(savedPost => {

            req.flash('success_message', `Post ${post.title} was succesfully updated!`);
            res.redirect('/admin/posts');

            //res.render('admin/posts/currentPost', {sentPost: savedPost});
        }).catch(err => {
            res.render('admin/posts/create', {error: err.errors})
            console.log(err);
        })

    })

})

router.delete('/delete/:id', (req,res) => {

    Post.findOne({_id: req.params.id}).populate('comments').then(post => {
        console.log(post);
        fs.unlink(uploadDir + post.file, err=> {

            if (!post.comments.length < 1) {
                post.comments.forEach(comment => {
                    comment.remove();
                })
            }

            post.remove().then(removedPost => {
                req.flash('success_message', `Post ${post.title} was succesfully DELETED!`);
                res.redirect('/admin/posts/');
            })

        })
    })
})


module.exports = router;