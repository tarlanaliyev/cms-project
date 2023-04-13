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

    Comments.find({}).populate('user')
        .then(comments => {
            res.render('admin/comments', {comments:comments});
        })
})

router.post('/', (req, res) => {

    Post.findOne({_id: req.body.id}).then(post => {

        const newComment = new Comments();
        newComment.user = req.user.id;
        newComment.body = req.body.body;

        post.comments.push(newComment);
        post.save().then(savedPost => {

            newComment.save().then(savedComment => {
                res.redirect(`/post/${post.slug}`);
            })

        })
    })

})

router.delete('/delete/:id', (req,res) => {

    Comments.deleteOne({_id: req.params.id}).then(() => {

        //res.redirect('/admin/comments');
        Post.findOneAndUpdate({comments: req.params.id}, {$pull : {comments: req.params.id}}).then(success => {
            res.redirect('/admin/comments');
        }).catch(err => {
            console.log("Error happened at deleting post");
        })

    })

})


router.post('/approve-comment', (req,res) => {
    console.log(req.body.id);

    Comments.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}).then(result => {
        res.send(result); // this result is used in ajax request
    })

})




module.exports = router;