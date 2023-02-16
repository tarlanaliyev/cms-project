const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comments = require('../../models/Comments');
const {userAuthenticated} = require("../../helpers/authentication");


router.all('/*', (req, res, next) => {   ///onsuzda admin oldugu ucun bunu silib test elemek olar

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {
    res.render('admin/comments');
})

router.post('/', (req, res) => {

    Post.findOne({_id: req.body.id}).then(post => {

        const newComment = new Comments();
        newComment.user = req.user.id;
        newComment.body = req.body.body;

        post.comments.push(newComment);
        post.save().then(savedPost => {

            newComment.save().then(savedComment => {
                res.redirect(`/post/${post.id}`);
            })

        })



    })

})





module.exports = router;