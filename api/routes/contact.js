const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');
const hbs = require('nodemailer-express-handlebars');

module.exports = function (app) {

    this.app = app;
    app.engine('.hbs', exphbs({ extname: '.hbs', layoutsDir: './views' }));
    app.set('view engine', '.hbs');

    router.get('/', async (req, res) => {
        console.log('entre en la ruta');
        return res.render('new-testimonial', { layout: false });
    });

    console.log('llegue aca');
    return router;
}