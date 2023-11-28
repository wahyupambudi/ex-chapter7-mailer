const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { ComparePassword, HashPassword } = require("../helper/passwd.helper");
const { getUserFromToken } = require("../helper/jwt.helper");
const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const listTokens = [];

async function Register(req, res, next) {
    const {
        id,
        email,
        password,
        name,
        umur,
        dob,
        profile_picture,
        is_verified,
    } = req.body;

    const hashPass = await HashPassword(password);

    // const payload = {
    //     name,
    //     email,
    //     password: hashPass,
    // };

    try {
        const checkUser = await prisma.users.findUnique({
            where: {
                email,
            },
        });

        if (checkUser) {
            let respons = ResponseTemplate(
                null,
                "email already used",
                null,
                400,
            );
            res.status(400).json(respons);
            return;
        }

        await prisma.users.create({
            data: {
                email,
                password: hashPass,
                name,
                umur,
                dob,
                profile_picture,
                is_verified,
            },
        });

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.MAIL_SMTP,
                pass: process.env.PASS_SMTP,
            },
        });

        const path = "/api/v1/auth/verify";
        const fullUrl = `${req.protocol}://${req.get(
            "host",
        )}${path}/${email}?is_verified=true`;
        // console.log(fullUrl)

        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: process.env.MAIL_SMTP, // sender address
                to: `${email}`, // list of receivers
                subject: "User Created | Please Verify ✔", // Subject line
                html: `<b>Please Verify with link bellow!</b> <p><a href='${fullUrl}'>Click Here For Verify!</a></p>`, // html body
            });
        }
        main().catch(console.error);

        let respons = ResponseTemplate(null, "created success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        next(error);
    }
}

async function Login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            let respons = ResponseTemplate(
                null,
                "bad request",
                "invalid email or password",
                400,
            );
            res.status(400).json(respons);
            return;
        }

        let checkPassword = await ComparePassword(password, user.password);

        if (!checkPassword) {
            let respons = ResponseTemplate(
                null,
                "bad request",
                "invalid email or password",
                400,
            );
            res.status(400).json(respons);
            return;
        }

        let token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.SECRET_KEY,
        );
        // console.log(user)

        let respons = ResponseTemplate({ token }, "success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        next(error);
    }
}

async function Verify(req, res) {
    const { is_verified } = req.query;
    const { email } = req.params;

    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        let respons = ResponseTemplate(
            null,
            "bad request",
            "user not found",
            400,
        );
        res.status(400).json(respons);
        return;
    } else if (user.is_verified) {
        let respons = ResponseTemplate(
            user.is_verified,
            "The user has been verified",
            "null",
            200,
        );
        res.status(200).json(respons);
        return;
    }

    const payload = {};

    if (!is_verified) {
        let resp = ResponseTemplate(null, "bad request", null, 400);
        res.json(resp);
        return;
    }

    if (is_verified) {
        payload.is_verified = Boolean(is_verified);
    }

    try {
        const users = await prisma.users.update({
            where: {
                email: String(email),
            },
            data: payload,
        });

        let resp = ResponseTemplate(users.is_verified, "success verified user", null, 200);
        res.json(resp);
        return;
    } catch (error) {
        console.log(error);
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.json(resp);
        return;
    }
}

async function Update(req, res) {
    const { profile_picture } = req.body;
    const updatedAt = new Date();
    const { id } = req.params;

    const payload = {};

    if (!profile_picture) {
        let resp = ResponseTemplate(null, "bad request", null, 400);
        res.json(resp);
        return;
    }

    if (profile_picture) {
        payload.profile_picture = profile_picture;
    }

    if (updatedAt) {
        payload.updatedAt = updatedAt;
    }

    try {
        const users = await prisma.users.update({
            where: {
                id: Number(id),
            },
            data: payload,
        });

        let resp = ResponseTemplate(users, "success", null, 200);
        res.json(resp);
        return;
    } catch (error) {
        console.log(error);
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.json(resp);
        return;
    }
}

async function admin(req, res) {}

function whoami(req, res) {
    // console.log(`listTokens dari whoami ${listTokens}`)
    let respons = ResponseTemplate({ user: req.user }, "success", null, 200);
    res.status(200).json(respons);
    return;
}

function logout(req, res) {
    const token = req.headers.authorization;
    if (token) {
        listTokens.push(token);
        res.status(200).json({ message: "Logout successful" });
    } else {
        res.status(400).json({ message: "Token not provided" });
    }
    // console.log(listTokens)

    return;
}

module.exports = {
    Register,
    Verify,
    Login,
    Update,
    whoami,
    logout,
    listTokens,
};
