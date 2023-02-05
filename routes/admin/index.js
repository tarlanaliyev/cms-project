const express = require('express');
const router = express.Router();
const faker = require("faker");
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {
    res.render("admin/index");  //burda yazdigimiz butun url-lerin evvleine view engine /admin-i avtomatik elave edir
})

router.get('/dashboard', (req,res) => {
    res.render("admin/dashboard");
})

router.post('/generate-fake-post' , (req,res) => {

    let amount = req.body.amount;

    for (let i = 0; i < amount; i++){
        let post = new Post();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.datatype.boolean();
        post.body = faker.lorem.sentence();

        post.save().then(savedPost => {

        });

    }

    res.redirect('/admin/posts');

})


module.exports = router;