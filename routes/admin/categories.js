const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

})

router.get('/', (req,res) => {
    Category.find({}).then(categories => {
        res.render("admin/categories/index", {categories: categories});
    })
})

router.post('/create', (req,res) => {
    const category = new Category();
    category.name = req.body.name;
    category.save().then(category => {
        res.redirect('/admin/categories/'); //error ola biler / <-bu
    })
})

router.get('/edit/:id', (req,res) => {
    Category.findOne({_id: req.params.id}).then(category => {
        res.render("admin/categories/edit", {category: category});
    })
})

router.put('/edit/:id', (req,res) => {
    Category.findOne({_id: req.params.id}).then(category => {
        category.name = req.body.name;
        category.save().then(category => {
            req.flash("success_message", "Updated successfuly");
            res.redirect("/admin/categories");
        });
    }).catch(err => {
        console.log(err);
    })
})

router.delete('/delete/:id', (req,res) => {
    Category.deleteOne({_id: req.params.id}).then(category => {
        req.flash("success_message", `Category was deleted successfully`);
        res.redirect('/admin/categories');
    }).catch(err => {
        console.log("Somethin went wrong on deleting process!");
    })
})


module.exports = router;