import otpGenerator from "otp-generator"
import nodemailer from "nodemailer"

const POST = (req, res) => {
    let { user_name, user_email, user_message, user_password } = req.body

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fortesting700@gmail.com',
            pass: "helloworld1122"
        }
    });

    let mailOptions = {
        from: 'fortesting700@gmail.com',
        to: user_email,
        subject: `Axasiy books nomidan
        Bizning saytdan foydalanayotganingizdan va ishonganingizdan raxmat
        Siz bizdan ${user_message} kitobni so'ragan ekansiz
        Biz usgbu kitobni tez orada topishga va yaxshi sifatda saytga yuklashga xarakat qilamiz
        Xurmat bilan axasiy books jamoasi
        `,
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.end("Ok")
}
export default {
    POST
}