const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
    res.render("home/index");  /// views folderinin altinda /home/index.handlebars file-in axtarir
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

module.exports = router;