import nodemailer from 'nodemailer';


const Sendmail=({receipient_email,admin_id,password})=>{

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL,
    pass: process.env.NODEMAILER_PASS, // NOT your Gmail password
  },
});

const mailOptions={
  from: process.env.EMAIL,
  to: receipient_email,
  subject: 'Thank You For Registration ',
  text: `Your Hospital ID is ${admin_id} .Use the To Login to your account. Login URL http://localhost:3000/auth/login`,
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

export default Sendmail
