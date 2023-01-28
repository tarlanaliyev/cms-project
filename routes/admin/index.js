const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
    res.render("admin/index");  //burda yazdigimiz butun url-lerin evvleine view engine /admin-i avtomatik elave edir
})


module.exports = router;