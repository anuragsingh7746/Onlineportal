const express = require("express");
const router = express.Router();

const {logs} = require("../controllers/Logcontroller");

router.post('/:testId/logs', logs);

module.exports = router;