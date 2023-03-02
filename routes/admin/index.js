const express = require('express');
const router = express.Router();
const faker = require("faker");
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {
    Post.count().then(posts => {
        Category.count().then(categories => {
            User.count().then(users => {
                res.render("admin/index", {posts: posts, categories: categories, users: users});  //burda yazdigimiz butun url-lerin evvleine view engine /admin-i avtomatik elave edir
            })
        })
    })
})

router.get('/dashboard', (req,res) => {
    Post.count().then(posts => {
        Category.count().then(categories => {
            User.count().then(users => {
                res.render("admin/dashboard", {posts: posts, categories: categories, users: users});  //burda yazdigimiz butun url-lerin evvleine view engine /admin-i avtomatik elave edir
            })
        })
    })
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