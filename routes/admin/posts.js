const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated, (req, res, next) => {   ///onsuzda admin oldugu ucun bunu silib test elemek olar

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {

    Post.find({}).populate('category')
        .then(posts => {

        //console.log(posts);

        res.render('admin/posts', {posts: posts});


    })
})

router.get('/create', (req,res) => {
    Category.find({}).then(category => {
        res.render("admin/posts/create", {category: category});
    })
})

router.post('/create', (req,res) => {

    let filename = "";

   if (req.files != null && req.files !== undefined) { ///burda .file-i silende error verir. --> todolist:3 -- if (!isEmpty(req.files.file))
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
    post.category = req.body.category;


    post.save().then(savedPost => {

        req.flash('success_message', `Post ${post.title} was succesfully saved!`);   //it works! res.render edende flash duzgun islemir. gerek res.redirect edesen
        res.redirect('/admin/posts');

        // Post.findOne({_id: post.id}).then(post => {
        //     //console.log(res.locals.success_message);
        //     req.flash('success_message', `Post ${post.title} was succesfully saved!`);
        //     res.render('admin/posts/currentPost', {sentPost: post});
        // })
    }).catch(err => {
        res.render('admin/posts/create', {error: err.errors})   ///burdaki errors optionu /register routunda if else yazsaq ishleyecek
        //res.send("Post not saved");
        //console.log(err.message);
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

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if (req.files != null && req.files !== undefined) { ///burda req.files.file-i silende de elave edende de error verir. --> todolist:3
            let file = req.files.file;
            filename = Date.now() + "-" + file.name;

            file.mv('./public/uploads/' + filename, err => {
                if(err) throw err;
            });
        }

        post.file = filename;

        post.save().then(savedPost => {

            req.flash('success_message', `Post ${post.title} was succesfully updated!`);   //it works! res.render edende flash duzgun islemir. gerek res.redirect edesen
            res.redirect('/admin/posts');

            //res.render('admin/posts/currentPost', {sentPost: savedPost});
        }).catch(err => {
            res.render('admin/posts/create', {error: err.errors})
            console.log(err);
        })

    })

})

router.delete('/delete/:id', (req,res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        console.log(post);
        fs.unlink(uploadDir + post.file, err=> {
            post.remove().then(removedPost => {
                req.flash('success_message', `Post ${post.title} was succesfully DELETED!`);
                res.redirect('/admin/posts/');
            })

        })
        //res.redirect('/admin/posts/');
    })
})


module.exports = router;