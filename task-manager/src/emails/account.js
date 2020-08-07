const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail
  .send({
    to: 'rohanjn.courses@gmail.com',
    from: 'rohanjn.courses@gmail.com',
    subject: 'This is my first creation!',
    text: 'I hope this finds you!'
})
  .then(() => console.log('Mail sent successfully'))
  .catch(error => console.error(error.toString()));