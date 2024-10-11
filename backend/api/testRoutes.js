const express = require("express");
const router = express.Router();
const { gettests } = require("../controllers/testController");

router.get("/", gettests);

module.exports = router;