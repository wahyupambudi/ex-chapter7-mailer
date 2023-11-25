const express = require("express");
const router = express.Router();
const authRoute = require('../routes/auth.route')
const todoRoute = require("./todo.route");
const morgan = require("morgan");

router.use(morgan("dev"));

router.use('/api/v1/auth', authRoute)
router.use("/api/v1/todo", todoRoute);

module.exports = router;
