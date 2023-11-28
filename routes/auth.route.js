const express = require("express");
const router = express.Router();
const { Register, Verify, Login, Update, whoami, logout } = require("../controller/auth.controller");
const { Authenticate, checkTokenBlacklist } = require("../middleware/restrict");

router.post("/register", Register);

router.post("/login", Login);

router.get("/whoami", Authenticate, checkTokenBlacklist, whoami);

router.post("/logout", Authenticate, logout);

router.get("/verify/:email",  Verify);

router.put("/:id", Update);

module.exports = router;
