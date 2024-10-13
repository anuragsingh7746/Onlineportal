const express = require("express");
const router = express.Router();
const {validate} = require('../controllers/logincontroller');
 
router.post('/', validate);

module.exports = router;