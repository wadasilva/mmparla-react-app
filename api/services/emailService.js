const config = require('config');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: fs.readFileSync(process.env.app_smtp_user),
        pass: fs.readFileSync(process.env.app_smtp_password)
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: './views',
        defaultLayout: ''
    }, extName: '.hbs', viewPath: './views'
}));

module.exports.sendNewTestimonialNotification = async (email) => {

    const info = await transporter.sendMail({
        from: fs.readFileSync(process.env.app_smtp_user),
        to: fs.readFileSync(process.env.app_smtp_user),
        subject: 'Nuevo testimonial de un cliente!!!',
        template: 'new-testimonial-notification',
        context: {
            email: fs.readFileSync(process.env.app_smtp_user),
            endpoint: `${config.get('webAppUrl')}/testimonials`
        }
    });

    console.log('Message sent: %s', info.messageId);
};

module.exports.sendInvitationMessage = async (email, code) => {
    const info = await transporter.sendMail({
        from: fs.readFileSync(process.env.app_smtp_user),
        to: email,
        subject: 'Invitación para avalar el servicio prestado por MMParla',
        template: 'testimonial-invitation',
        context: {
            email: email,
            endpoint: `${config.get('webAppUrl')}/testimonial/${code}`
        }
    });

    console.log('Message sent: %s', info.messageId);
};


