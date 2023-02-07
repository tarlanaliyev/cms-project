const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');

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

    let filename = "";

   if (!isEmpty(req.files.file)) { ///burda .file-i silende error verir. --> todolist:3
       let file = req.files.file;
       filename = Date.now() + "-" + file.name;

       file.mv('./public/uploads/' + filename, err => {
           if(err) throw err;
       });
   }

    let alowComments = (req.body.allowComments) ? true : false;

    const post = new Post();
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = alowComments;
    post.body = req.body.body;
    post.file = filename;

    //console.log(filename);

    post.save().then(savedPost => {

        req.flash('success_message', `Post ${post.title} was succesfully saved!`);   //it works! res.render edende flash duzgun islemir. gerek res.redirect edesen
        res.redirect('/admin/posts');

        // Post.findOne({_id: post.id}).then(post => {
        //     //console.log(res.locals.success_message);
        //     req.flash('success_message', `Post ${post.title} was succesfully saved!`);
        //     res.render('admin/posts/currentPost', {sentPost: post});
        // })
    }).catch(err => {
        res.render('admin/posts/create', {error: err.errors})
        //res.send("Post not saved");
        //console.log(err.message);
    });

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

router.delete('/delete/:id', (req,res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        console.log(post);
        fs.unlink(uploadDir + post.file, err=> {
            post.remove().then(removedPost => {
                res.redirect('/admin/posts/');
            })

        })
        //res.redirect('/admin/posts/');
    })
})


module.exports = router;