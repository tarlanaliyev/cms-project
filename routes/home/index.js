const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {   /// admin/index -de olan kodu bura da yazdim. Cunki tekce admin/index-de olanda
                                                                                             /// her defesinde /admin eledikde url-de layout-u admin olaraq deyisirdi
    req.app.locals.layout = 'home';                                                          /// biz yeniden home page qayitmaq istesek alinmirdi. Care olaraq eyni kodu bura
    next();                                                                                  /// da atmali oldum.

})


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